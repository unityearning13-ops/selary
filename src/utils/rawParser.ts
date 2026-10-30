import { Employee } from '../types/salary';

export interface ParsedRawEmployee {
  originalIndex?: number;
  name: string;
  email?: string;
  phone?: string;
  balance: number;
  convert: number;
  isZero: boolean;
}

export interface ParseResult {
  validCount: number;
  zeroCount: number;
  totalBalance: number;
  totalConvert: number;
  activeEmployees: Employee[];
  parsedItems: ParsedRawEmployee[];
}

/**
 * Robust parser for Unity Earning Portal copied table text.
 * Handles tab-delimited, space-delimited, and multi-line cell formats.
 * Divides balance by rate (60 for Team Leader, 50 for Team Trainer) to get converts.
 * Automatically excludes items where balance is 0.00 or 0.
 */
export function parseRawPortalData(
  rawText: string,
  role: 'leader' | 'trainer',
  rate: number = role === 'leader' ? 60 : 50
): ParseResult {
  if (!rawText || !rawText.trim()) {
    return {
      validCount: 0,
      zeroCount: 0,
      totalBalance: 0,
      totalConvert: 0,
      activeEmployees: [],
      parsedItems: [],
    };
  }

  // 1. Remove obvious footer and pagination lines
  const cleanedText = rawText
    .replace(/Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+entries/gi, '')
    .replace(/\bPrevious\b/gi, '')
    .replace(/\bNext\b/gi, '');

  const parsedItems: ParsedRawEmployee[] = [];

  // Check if text contains email addresses
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emailMatches: { email: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = emailRegex.exec(cleanedText)) !== null) {
    emailMatches.push({ email: m[1], index: m.index });
  }

  if (emailMatches.length > 0) {
    // Parser Strategy A: Segment based on email positions
    for (let i = 0; i < emailMatches.length; i++) {
      const current = emailMatches[i];
      const prevIndex = i === 0 ? 0 : emailMatches[i - 1].index + emailMatches[i - 1].email.length;
      const nextIndex =
        i < emailMatches.length - 1 ? emailMatches[i + 1].index : cleanedText.length;

      const beforeText = cleanedText.slice(prevIndex, current.index);
      const afterText = cleanedText.slice(current.index + current.email.length, nextIndex);

      // --- Extract Name from beforeText ---
      // Clean up words like Debit, Credit, Active, row numbers
      const beforeLines = beforeText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // The last line or last tab-column before email contains the employee name
      const candidateLine = beforeLines.length > 0 ? beforeLines[beforeLines.length - 1] : '';
      const tabParts = candidateLine.split('\t').map((p) => p.trim()).filter(Boolean);

      let rawName = tabParts.length > 0 ? tabParts[tabParts.length - 1] : candidateLine;

      // Strip leading row numbering like "2\t", "12 ", "3."
      rawName = rawName.replace(/^[\s\d#.-]+(?=[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\u0980-\u09FF\u2000-\u2FFF])/u, '').trim();
      // Also filter out noise words from previous row if stuck
      rawName = rawName.replace(/\b(Debit|Credit|Active|Inactive|Pending)\b/gi, '').trim();

      // --- Extract Phone and Balance from afterText ---
      // We look at the first few tokens right after the email
      // Example: "\t-01980217934\t0.00\tDebit\nCredit" or "\t01709455654\t1860.00"
      const afterLines = afterText.split('\n');
      const firstLineAfter = afterLines[0] || '';
      const afterTokens = firstLineAfter.split(/[\t]+/).map((t) => t.trim()).filter(Boolean);

      let phone = '';
      let balance = 0;

      // Find balance in tokens
      // Tokens could be [phone, balance, 'Debit', ...]
      const allTokensInSegment = afterText
        .split(/[\s\t\n]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      for (const token of allTokensInSegment) {
        // Is it phone? (e.g. starts with 01, -01, +880, 880, or 10+ digits)
        const cleanDigits = token.replace(/[^0-9]/g, '');
        if (!phone && cleanDigits.length >= 10 && (cleanDigits.startsWith('01') || cleanDigits.startsWith('8801'))) {
          phone = token;
          continue;
        }

        // Is it a number (balance)? (e.g. 1860.00, 1130.00, 0.00, 2820)
        // Skip status words
        if (/^(Debit|Credit|Active|Inactive|Pending)$/i.test(token)) continue;

        const numVal = parseFloat(token.replace(/,/g, ''));
        if (!isNaN(numVal) && !phone?.includes(token)) {
          balance = numVal;
          break; // First valid number after phone/email is the balance
        }
      }

      const isZero = balance <= 0;
      const rawConvert = balance / rate;
      const convert = balance % rate === 0 ? rawConvert : Number(rawConvert.toFixed(2));

      parsedItems.push({
        originalIndex: i + 1,
        name: rawName || `Staff ${i + 1}`,
        email: current.email,
        phone,
        balance,
        convert,
        isZero,
      });
    }
  } else {
    // Parser Strategy B: Line-by-line fallback (for "Name Balance" or "Name \t Balance" or "Name, Balance")
    const lines = cleanedText.split('\n');
    let idx = 1;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/^(No|Name|Email|Phone|Balance|Action|Convert|Total|Debit|Credit|Active)/i.test(trimmed)) {
        continue;
      }

      // Check for tab or comma separated
      const parts = trimmed.split(/[\t,]+/).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        // Last part or second-to-last might be balance
        let balanceVal = 0;
        let nameVal = '';

        for (let j = parts.length - 1; j >= 0; j--) {
          const num = parseFloat(parts[j].replace(/,/g, ''));
          if (!isNaN(num)) {
            balanceVal = num;
            nameVal = parts.slice(0, j).join(' ').replace(/^[\s\d#.-]+/, '').trim();
            break;
          }
        }

        if (nameVal) {
          const isZero = balanceVal <= 0;
          const rawConvert = balanceVal / rate;
          const convert = balanceVal % rate === 0 ? rawConvert : Number(rawConvert.toFixed(2));

          parsedItems.push({
            originalIndex: idx++,
            name: nameVal,
            balance: balanceVal,
            convert,
            isZero,
          });
        }
      } else {
        // Space separated: e.g. "Tasfiha Riya 1860.00"
        const spaceMatch = trimmed.match(/^(.*?)\s+([\d,]+(?:\.\d+)?)$/);
        if (spaceMatch) {
          const nameVal = spaceMatch[1].replace(/^[\s\d#.-]+/, '').trim();
          const balanceVal = parseFloat(spaceMatch[2].replace(/,/g, ''));
          if (nameVal && !isNaN(balanceVal)) {
            const isZero = balanceVal <= 0;
            const rawConvert = balanceVal / rate;
            const convert = balanceVal % rate === 0 ? rawConvert : Number(rawConvert.toFixed(2));

            parsedItems.push({
              originalIndex: idx++,
              name: nameVal,
              balance: balanceVal,
              convert,
              isZero,
            });
          }
        }
      }
    }
  }

  // Filter out all zero balances (as requested: "যাদের এই লিস্টে জিরো থাকবে তাদেরকে বসাবে না অটোমেটিকলি")
  const activeOnly = parsedItems.filter((item) => !item.isZero);

  const activeEmployees: Employee[] = activeOnly.map((item, i) => {
    const isOverridden = Math.abs(item.convert * rate - item.balance) > 0.01;
    const initialIncentive = item.convert > 0 ? Math.round(item.convert * 10) : '';
    return {
      id: `${role}-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      name: item.name.toUpperCase(),
      convert: item.convert,
      balance: item.balance,
      isBalanceOverridden: isOverridden,
      target: '',
      bonus: '',
      incentive: initialIncentive,
      isIncentiveOverridden: false,
      fine: '',
    };
  });

  const totalBalance = activeOnly.reduce((sum, item) => sum + item.balance, 0);
  const totalConvert = activeOnly.reduce((sum, item) => sum + item.convert, 0);

  return {
    validCount: activeOnly.length,
    zeroCount: parsedItems.length - activeOnly.length,
    totalBalance,
    totalConvert,
    activeEmployees,
    parsedItems,
  };
}
