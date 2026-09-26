export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionCategory =
  | 'Housing'
  | 'Groceries'
  | 'Dining & Drinks'
  | 'Transportation'
  | 'Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Shopping'
  | 'Salary & Bonus'
  | 'Investments'
  | 'Freelance'
  | 'Other';

export type TransactionStatus = 'Completed' | 'Pending';

export interface Transaction {
  id: string;
  merchant: string;
  category: TransactionCategory;
  date: string; // ISO string YYYY-MM-DD
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  note?: string;
  account?: string;
  projectId?: string;
}

export interface ProjectFolder {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  allocatedBudget: number;
  color: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  allocatedAmount: number;
  spentAmount: number;
  period: 'Monthly' | 'Annual';
  color: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  targetDate: string;
  category: string;
  isCompleted?: boolean;
}

export interface CashFlowPoint {
  date: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  locale: string;
}

export type DateRangePreset =
  | '24 Hrs'
  | '48 Hrs'
  | 'Today'
  | 'This Week'
  | 'This Month'
  | 'Last 30 Days'
  | 'This Year'
  | 'Custom';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'projects'
  | 'transactions'
  | 'analytics'
  | 'budgets'
  | 'hr'
  | 'settings';

export type PortalMode = 'FINANCE' | 'HR_PORTAL';

export interface EmployeeClaim {
  id: string;
  employeeName: string;
  employeeId: string;
  avatarUrl?: string;
  department: 'Engineering' | 'Product' | 'People & Culture' | 'Sales & Marketing' | 'Operations';
  claimType:
    | 'Travel & Client Transit'
    | 'Client Entertainment'
    | 'Medical & Wellness'
    | 'WFH Tech Setup'
    | 'Learning & Certification';
  amount: number;
  submittedDate: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  approver: string;
  notes?: string;
}

export interface PayrollRun {
  id: string;
  month: string;
  totalEmployees: number;
  grossPayroll: number;
  netDisbursed: number;
  taxPfWithheld: number;
  status: 'SCHEDULED' | 'PROCESSING' | 'DISBURSED';
  disbursementDate: string;
}
