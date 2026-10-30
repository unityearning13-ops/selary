import { Employee, SalarySheetMetadata } from '../types/salary';

export const INITIAL_TEAM_LEADERS: Employee[] = [
  { id: 'tl-1', name: 'SHAYLA SETU', convert: 54, balance: 3240, isBalanceOverridden: false, target: '', bonus: 400, incentive: 1000, fine: 0 },
  { id: 'tl-2', name: 'LAMIA BITHI', convert: 44, balance: 2640, isBalanceOverridden: false, target: '', bonus: 300, incentive: 440, fine: 0 },
  { id: 'tl-3', name: 'TABASSUM SUCHI', convert: 34, balance: 2040, isBalanceOverridden: false, target: '', bonus: 200, incentive: 340, fine: 0 },
  { id: 'tl-4', name: 'SANJIDA ALAM', convert: 31, balance: 1860, isBalanceOverridden: false, target: '', bonus: 0, incentive: 310, fine: 0 },
  { id: 'tl-5', name: 'LAMIYA ISLAM', convert: 29, balance: 1740, isBalanceOverridden: false, target: '', bonus: 0, incentive: 290, fine: 0 },
  { id: 'tl-6', name: 'AYSHA ALO', convert: 21, balance: 1260, isBalanceOverridden: false, target: '', bonus: 0, incentive: 210, fine: 0 },
  { id: 'tl-7', name: 'ROCKY HASAN', convert: 21, balance: 1260, isBalanceOverridden: false, target: '', bonus: 0, incentive: 210, fine: 0 },
  { id: 'tl-8', name: 'JANNAT JAHAN', convert: 14, balance: 840, isBalanceOverridden: false, target: '', bonus: 0, incentive: 140, fine: 0 },
  { id: 'tl-9', name: 'NURJAHAN ISLAM', convert: 13, balance: 780, isBalanceOverridden: false, target: '', bonus: 0, incentive: 130, fine: 0 },
  { id: 'tl-10', name: 'RAFI AHMED', convert: 9, balance: 540, isBalanceOverridden: false, target: '', bonus: 0, incentive: 90, fine: 0 },
];

export const INITIAL_TEAM_TRAINERS: Employee[] = [
  { id: 'tt-1', name: 'TASNIA NOOR', convert: 31, balance: 1550, isBalanceOverridden: false, target: '', bonus: 300, incentive: 500, fine: 0 },
  { id: 'tt-2', name: 'SHIMU AKTER', convert: 30, balance: 1500, isBalanceOverridden: false, target: '', bonus: 250, incentive: 500, fine: 0 },
  { id: 'tt-3', name: 'MUKTA AKTER', convert: 23, balance: 1150, isBalanceOverridden: false, target: '', bonus: 200, incentive: 500, fine: 0 },
  { id: 'tt-4', name: 'DOLNA SHIL', convert: 20, balance: 1000, isBalanceOverridden: false, target: '', bonus: 0, incentive: 500, fine: 0 },
  { id: 'tt-5', name: 'SHOMIKUL AMIN', convert: 20, balance: 1000, isBalanceOverridden: false, target: '', bonus: 0, incentive: 500, fine: 0 },
  { id: 'tt-6', name: 'ISRAT JAHAN', convert: 19, balance: 950, isBalanceOverridden: false, target: '', bonus: 0, incentive: 190, fine: 0 },
  { id: 'tt-7', name: 'TAHSIN AKTER', convert: 13, balance: 650, isBalanceOverridden: false, target: '', bonus: 0, incentive: 130, fine: 0 },
  { id: 'tt-8', name: 'SANJIDA ISLAM', convert: 12, balance: 600, isBalanceOverridden: false, target: '', bonus: 0, incentive: 120, fine: 0 },
  { id: 'tt-9', name: 'TASFIHA RIYA', convert: 11, balance: 550, isBalanceOverridden: false, target: '', bonus: 0, incentive: 110, fine: 0 },
  { id: 'tt-10', name: 'DINA AKTER', convert: 9, balance: 450, isBalanceOverridden: false, target: '', bonus: 0, incentive: 90, fine: 0 },
  { id: 'tt-11', name: 'RIYA MONI', convert: 9, balance: 450, isBalanceOverridden: false, target: '', bonus: 0, incentive: 90, fine: 0 },
  { id: 'tt-12', name: 'SAIYARA ELMA', convert: 8, balance: 400, isBalanceOverridden: false, target: '', bonus: 0, incentive: 80, fine: 0 },
  { id: 'tt-13', name: 'ROSNA AKTER', convert: 8, balance: 400, isBalanceOverridden: false, target: '', bonus: 0, incentive: 80, fine: 0 },
  { id: 'tt-14', name: 'SHILA AKTER', convert: 7, balance: 350, isBalanceOverridden: false, target: '', bonus: 0, incentive: 70, fine: 0 },
  { id: 'tt-15', name: 'IBRAHIM', convert: 7, balance: 350, isBalanceOverridden: false, target: '', bonus: 0, incentive: 70, fine: 0 },
  { id: 'tt-16', name: 'MD RIZVI', convert: 7, balance: 350, isBalanceOverridden: false, target: '', bonus: 0, incentive: 70, fine: 0 },
  { id: 'tt-17', name: 'MUNNI MONI', convert: 5, balance: 250, isBalanceOverridden: false, target: '', bonus: 0, incentive: 50, fine: 0 },
  { id: 'tt-18', name: 'ARAFAT', convert: 4, balance: 200, isBalanceOverridden: false, target: '', bonus: 0, incentive: 40, fine: 0 },
  { id: 'tt-19', name: 'KHADIJA AKTER', convert: 3, balance: 150, isBalanceOverridden: false, target: '', bonus: 0, incentive: 30, fine: 0 },
];

export const INITIAL_METADATA: SalarySheetMetadata = {
  companyName: 'UNITY EARNING E-LEARNING PLATFORM',
  documentTitle: 'SALARY SHEET',
  periodMonth: 'September 2026',
  adminName: 'JIHADUL ISLAM',
  adminRole: 'ADMIN',
  verificationStatus: 'VERIFIED',
  customNotes: 'Automated Official Payroll Disbursement Record',
};
