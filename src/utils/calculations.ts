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
 * Calculates total amount for an employee:
 * TOTAL AMOUNT = BALANCE + BONUS + INCENTIVE - FINE
 */
export function getEmployeeTotalAmount(emp: Employee, rate: number): number {
  const balance = getEmployeeBalance(emp, rate);
  const bonus = parseNumber(emp.bonus);
  const incentive = parseNumber(emp.incentive);
  const fine = parseNumber(emp.fine);

  return balance + bonus + incentive - fine;
}

/**
 * Calculates section aggregate totals.
 */
export function calculateSectionTotals(employees: Employee[], rate: number): SectionTotals {
  return employees.reduce(
    (acc, emp) => {
      const conv = parseNumber(emp.convert);
      const balance = getEmployeeBalance(emp, rate);
      const target = parseNumber(emp.target);
      const bonus = parseNumber(emp.bonus);
      const incentive = parseNumber(emp.incentive);
      const fine = parseNumber(emp.fine);
      const totalAmount = getEmployeeTotalAmount(emp, rate);

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
