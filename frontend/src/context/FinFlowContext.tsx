'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Transaction,
  Budget,
  SavingsGoal,
  UserProfile,
  DateRangePreset,
  ActiveTab,
  PortalMode,
  EmployeeClaim,
  PayrollRun,
  ProjectFolder,
} from '../lib/types';
import {
  INITIAL_USER,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_CLAIMS,
  INITIAL_PAYROLL_RUNS,
} from '../lib/mockData';

interface FinFlowContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  transactions: Transaction[];
  allTransactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  dateRange: DateRangePreset;
  setDateRange: (range: DateRangePreset) => void;
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (category: string | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Project & Folder Workspaces
  projects: ProjectFolder[];
  selectedProjectId: string | 'ALL';
  setSelectedProjectId: (id: string | 'ALL') => void;
  selectedProject: ProjectFolder | null;
  createProject: (data: Omit<ProjectFolder, 'id' | 'createdAt'>) => ProjectFolder;
  deleteProject: (id: string) => void;

  // Data Source & Reset/Unset State
  dataSourceType: 'empty' | 'demo' | 'csv';
  csvFileName: string | null;
  loadDemoData: () => void;
  clearAllData: () => void;

  // Bulk Actions
  importTransactionsBatch: (
    newTransactions: (Omit<Transaction, 'id'> | Transaction)[],
    mode?: 'append' | 'replace',
    sourceName?: string,
    targetProjectId?: string
  ) => void;

  // HR Specific State & Actions
  claims: EmployeeClaim[];
  payrollRuns: PayrollRun[];
  approveClaim: (id: string) => void;
  rejectClaim: (id: string) => void;
  totalPendingClaimsAmount: number;
  pendingClaimsCount: number;
  monthlyPayrollTotal: number;

  // General Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spentAmount'>) => void;
  contributeToGoal: (id: string, amount: number) => void;
  resetDemoData: () => void;

  // Computed financial KPIs
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netSavings: number;
  savingsRatePercentage: number;
  financialHealthScore: number;
  categorySpendBreakdown: { name: string; value: number; color: string }[];
}

const FinFlowContext = createContext<FinFlowContextType | undefined>(undefined);

export function FinFlowProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<ProjectFolder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('finflow_custom_user_projects');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (err) {
        console.error('Failed to load projects from localStorage:', err);
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('finflow_custom_user_projects', JSON.stringify(projects));
    }
  }, [projects]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'ALL'>('ALL');
  const [dataSourceType, setDataSourceType] = useState<'empty' | 'demo' | 'csv'>('empty');
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);
  const [claims, setClaims] = useState<EmployeeClaim[]>(INITIAL_CLAIMS);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(INITIAL_PAYROLL_RUNS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [dateRange, setDateRange] = useState<DateRangePreset>('Last 30 Days');
  const [portalMode, setPortalMode] = useState<PortalMode>('FINANCE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Selected project object
  const selectedProject = useMemo(() => {
    if (selectedProjectId === 'ALL') return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Project-scoped transactions
  const scopedTransactions = useMemo(() => {
    if (selectedProjectId === 'ALL') return transactions;
    return transactions.filter((t) => t.projectId === selectedProjectId);
  }, [transactions, selectedProjectId]);

  // Keyboard shortcut listener: Cmd+K for command palette, 'I' for Import CSV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['input', 'textarea', 'select'].includes(
        (e.target as HTMLElement).tagName.toLowerCase()
      );
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (!isInput && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsImportModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync category expenses into budgets dynamically
  const updatedBudgets = useMemo(() => {
    const categorySpentMap: Record<string, number> = {};
    scopedTransactions
      .filter((t) => t.type === 'EXPENSE')
      .forEach((t) => {
        categorySpentMap[t.category] = (categorySpentMap[t.category] || 0) + t.amount;
      });

    return budgets.map((b) => ({
      ...b,
      spentAmount: categorySpentMap[b.category] || 0,
    }));
  }, [scopedTransactions, budgets]);

  // Derived metrics
  const { totalBalance, monthlyIncome, monthlyExpense, netSavings, savingsRatePercentage } =
    useMemo(() => {
      if (scopedTransactions.length === 0) {
        return {
          totalBalance: 0,
          monthlyIncome: 0,
          monthlyExpense: 0,
          netSavings: 0,
          savingsRatePercentage: 0,
        };
      }

      let income = 0;
      let expense = 0;

      scopedTransactions.forEach((tx) => {
        if (tx.type === 'INCOME') {
          income += tx.amount;
        } else {
          expense += tx.amount;
        }
      });

      const net = income - expense;
      const rate = income > 0 ? Math.max(0, Math.round((net / income) * 100)) : 0;
      const balance = Math.max(0, net > 0 ? net : income);

      return {
        totalBalance: balance,
        monthlyIncome: income,
        monthlyExpense: expense,
        netSavings: net,
        savingsRatePercentage: rate,
      };
    }, [scopedTransactions]);

  // HR Derived Metrics
  const { totalPendingClaimsAmount, pendingClaimsCount, monthlyPayrollTotal } = useMemo(() => {
    const pending = claims.filter((c) => c.status === 'PENDING_APPROVAL');
    const totalPending = pending.reduce((acc, curr) => acc + curr.amount, 0);
    const latestPayroll = payrollRuns[0]?.netDisbursed || 4720000;

    return {
      totalPendingClaimsAmount: totalPending,
      pendingClaimsCount: pending.length,
      monthlyPayrollTotal: latestPayroll,
    };
  }, [claims, payrollRuns]);

  // Financial Health Score algorithm (0-100)
  const financialHealthScore = useMemo(() => {
    if (scopedTransactions.length === 0) return 0;
    const savingsScore = Math.min(40, savingsRatePercentage);
    const overBudgetCount = updatedBudgets.filter((b) => b.spentAmount > b.allocatedAmount).length;
    const budgetScore = Math.max(10, 40 - overBudgetCount * 12);
    const goalRatio =
      savingsGoals.reduce((acc, g) => acc + g.currentAmount / g.targetAmount, 0) /
      savingsGoals.length;
    const goalScore = Math.round(goalRatio * 20);

    return Math.min(98, Math.max(45, savingsScore + budgetScore + goalScore));
  }, [scopedTransactions.length, savingsRatePercentage, updatedBudgets, savingsGoals]);

  // Category Spend Breakdown
  const categorySpendBreakdown = useMemo(() => {
    const spendMap: Record<string, number> = {};
    const categoryColors: Record<string, string> = {
      Housing: '#6366F1',
      Groceries: '#10B981',
      'Dining & Drinks': '#F59E0B',
      Transportation: '#0284C7',
      Utilities: '#3B82F6',
      Entertainment: '#8B5CF6',
      Healthcare: '#F43F5E',
      Shopping: '#EC4899',
      Other: '#64748B',
    };

    scopedTransactions
      .filter((t) => t.type === 'EXPENSE')
      .forEach((t) => {
        spendMap[t.category] = (spendMap[t.category] || 0) + t.amount;
      });

    return Object.entries(spendMap).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || '#10B981',
    }));
  }, [scopedTransactions]);

  // HR Claim Handlers
  const approveClaim = (id: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'APPROVED' as const } : c))
    );
  };

  const rejectClaim = (id: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'REJECTED' as const } : c))
    );
  };

  // Handlers
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const importTransactionsBatch = (
    newTxs: (Omit<Transaction, 'id'> | Transaction)[],
    mode: 'append' | 'replace' = 'replace',
    sourceName?: string,
    targetProjectId?: string
  ) => {
    const effectiveProjectId =
      targetProjectId || (selectedProjectId !== 'ALL' ? selectedProjectId : undefined);

    const prepared: Transaction[] = newTxs.map((t, idx) => ({
      ...t,
      id: 'id' in t && t.id ? t.id : `tx-imp-${Date.now()}-${idx}`,
      projectId: t.projectId || effectiveProjectId,
    }));

    if (mode === 'replace') {
      if (effectiveProjectId) {
        setTransactions((prev) => [
          ...prepared,
          ...prev.filter((t) => t.projectId !== effectiveProjectId),
        ]);
      } else {
        setTransactions(prepared);
      }
    } else {
      setTransactions((prev) => [...prepared, ...prev]);
    }
    setDataSourceType('csv');
    setCsvFileName(sourceName || 'Uploaded Statement CSV');
  };

  const createProject = (data: Omit<ProjectFolder, 'id' | 'createdAt'>) => {
    const newProj: ProjectFolder = {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTransactions((prev) => prev.filter((t) => t.projectId !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId('ALL');
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const duplicateTransaction = (id: string) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;
    const duplicated: Transaction = {
      ...existing,
      id: `tx-${Date.now()}`,
      merchant: `${existing.merchant} (Copy)`,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions((prev) => [duplicated, ...prev]);
  };

  const addBudget = (budgetData: Omit<Budget, 'id' | 'spentAmount'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: `b-${Date.now()}`,
      spentAmount: 0,
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const contributeToGoal = (id: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newTotal = Math.min(g.targetAmount, g.currentAmount + amount);
        return {
          ...g,
          currentAmount: newTotal,
          isCompleted: newTotal >= g.targetAmount,
        };
      })
    );
  };

  const loadDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setClaims(INITIAL_CLAIMS);
    setPayrollRuns(INITIAL_PAYROLL_RUNS);
    setUser(INITIAL_USER);
    setDataSourceType('demo');
    setCsvFileName(null);
  };

  const clearAllData = () => {
    setTransactions([]);
    setDataSourceType('empty');
    setCsvFileName(null);
  };

  const resetDemoData = () => {
    loadDemoData();
  };

  return (
    <FinFlowContext.Provider
      value={{
        user,
        setUser,
        transactions: scopedTransactions,
        allTransactions: transactions,
        projects,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        createProject,
        deleteProject,
        budgets: updatedBudgets,
        savingsGoals,
        activeTab,
        setActiveTab,
        dateRange,
        setDateRange,
        portalMode,
        setPortalMode,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        isAddModalOpen,
        setIsAddModalOpen,
        isImportModalOpen,
        setIsImportModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        dataSourceType,
        csvFileName,
        loadDemoData,
        clearAllData,
        claims,
        payrollRuns,
        approveClaim,
        rejectClaim,
        totalPendingClaimsAmount,
        pendingClaimsCount,
        monthlyPayrollTotal,
        addTransaction,
        importTransactionsBatch,
        deleteTransaction,
        duplicateTransaction,
        addBudget,
        contributeToGoal,
        resetDemoData,
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        netSavings,
        savingsRatePercentage,
        financialHealthScore,
        categorySpendBreakdown,
      }}
    >
      {children}
    </FinFlowContext.Provider>
  );
}

export function useFinFlow() {
  const context = useContext(FinFlowContext);
  if (!context) {
    throw new Error('useFinFlow must be used within a FinFlowProvider');
  }
  return context;
}
