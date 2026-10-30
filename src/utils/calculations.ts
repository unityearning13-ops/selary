import { Employee, SectionTotals } from '../types/salary';

export const RATE_TEAM_LEADER = 60; // 1 Convert = 60 BDT
export const RATE_TEAM_TRAINER = 50; // 1 Convert = 50 BDT

/**
 * Parses numeric input safely, returning 0 if empty or invalid.
 */
export function parseNumber(val: number | string | undefined | null): number {
  if (val === '' || val === undefined || val === null) return 0;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
  return isNaN(num) ? 0 : num;
}

/**
 * Calculates balance based on convert and role rate, or returns manual override.
 */
export function getEmployeeBalance(emp: Employee, rate: number): number {
  if (emp.isBalanceOverridden && emp.balance !== '') {
    return parseNumber(emp.balance);
  }
  const conv = parseNumber(emp.convert);
  return conv * rate;
}

/**
 * Calculates incentive based on role, convert, and target rules:
 * - If Target is set (> 0):
 *   - Convert >= Target:
 *     - Team Leader: 1000 BDT
 *     - Team Trainer: 500 BDT
 *   - Convert < Target:
 *     - Convert * 10 BDT
 * - If Target is not set (empty or 0):
 *   - Convert * 10 BDT
 * - If Convert <= 0:
 *   - '' (empty)
 */
export function calculateAutoIncentive(
  convert: number | string | undefined | null,
  target: number | string | undefined | null,
  role: 'leader' | 'trainer'
): number | '' {
  const conv = parseNumber(convert);
  if (conv <= 0) return '';
  const tgt = parseNumber(target);

  if (tgt > 0) {
    if (conv >= tgt) {
      return role === 'leader' ? 1000 : 500;
    } else {
      return Math.round(conv * 10);
    }
  }

  // If target is not set or 0: 10 BDT per convert
  return Math.round(conv * 10);
}

/**
 * Returns effective employee incentive, considering manual override or auto-calculation.
 */
export function getEmployeeIncentive(
  emp: Employee,
  role: 'leader' | 'trainer'
): number {
  if (emp.isIncentiveOverridden && emp.incentive !== '') {
    return parseNumber(emp.incentive);
  }
  if (emp.incentive !== '' && emp.incentive !== undefined && emp.incentive !== null) {
    return parseNumber(emp.incentive);
  }
  const auto = calculateAutoIncentive(emp.convert, emp.target, role);
  return auto === '' ? 0 : auto;
}

/**
 * Calculates total amount for an employee:
 * TOTAL AMOUNT = BALANCE + BONUS + INCENTIVE - FINE
 */
export function getEmployeeTotalAmount(
  emp: Employee,
  rate: number,
  role?: 'leader' | 'trainer'
): number {
  const effectiveRole = role || (rate === RATE_TEAM_LEADER ? 'leader' : 'trainer');
  const balance = getEmployeeBalance(emp, rate);
  const bonus = parseNumber(emp.bonus);
  const incentive = getEmployeeIncentive(emp, effectiveRole);
  const fine = parseNumber(emp.fine);

  return balance + bonus + incentive - fine;
}

/**
 * Calculates section aggregate totals.
 */
export function calculateSectionTotals(
  employees: Employee[],
  rate: number,
  role?: 'leader' | 'trainer'
): SectionTotals {
  const effectiveRole = role || (rate === RATE_TEAM_LEADER ? 'leader' : 'trainer');
  return employees.reduce(
    (acc, emp) => {
      const conv = parseNumber(emp.convert);
      const balance = getEmployeeBalance(emp, rate);
      const target = parseNumber(emp.target);
      const bonus = parseNumber(emp.bonus);
      const incentive = getEmployeeIncentive(emp, effectiveRole);
      const fine = parseNumber(emp.fine);
      const totalAmount = getEmployeeTotalAmount(emp, rate, effectiveRole);

      return {
        count: acc.count + 1,
        totalConvert: acc.totalConvert + conv,
        totalBalance: acc.totalBalance + balance,
        totalTarget: acc.totalTarget + target,
        totalBonus: acc.totalBonus + bonus,
        totalIncentive: acc.totalIncentive + incentive,
        totalFine: acc.totalFine + fine,
        totalAmount: acc.totalAmount + totalAmount,
      };
    },
    {
      count: 0,
      totalConvert: 0,
      totalBalance: 0,
      totalTarget: 0,
      totalBonus: 0,
      totalIncentive: 0,
      totalFine: 0,
      totalAmount: 0,
    }
  );
}

/**
 * Format numbers with comma grouping for BDT currency
 */
export function formatBDT(amount: number | string | undefined, includeSymbol: boolean = false): string {
  const num = parseNumber(amount);
  const formatted = num.toLocaleString('en-IN');
  return includeSymbol ? `৳${formatted}` : formatted;
}
