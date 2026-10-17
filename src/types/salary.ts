export interface Employee {
  id: string;
  name: string;
  convert: number | '';
  balance: number | '';
  isBalanceOverridden: boolean;
  target: number | '';
  bonus: number | '';
  incentive: number | '';
  fine: number | '';
}

export type EmployeeRole = 'leader' | 'trainer';

export interface SectionTotals {
  count: number;
  totalConvert: number;
  totalBalance: number;
  totalTarget: number;
  totalBonus: number;
  totalIncentive: number;
  totalFine: number;
  totalAmount: number;
}

export interface SalarySheetMetadata {
  companyName: string;
  documentTitle: string;
  periodMonth: string;
  adminName: string;
  adminRole: string;
  verificationStatus: string;
  customNotes?: string;
}

export interface RankingItem {
  id: string;
  name: string;
  emailOrPhone?: string;
  balance: number | '';
  convert: number;
  role: EmployeeRole;
  rank?: number;
}

export type RankingFrameRatio = '9:16' | '4:5' | 'a4';
