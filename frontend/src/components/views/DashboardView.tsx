'use client';

import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  UploadCloud,
  RefreshCw,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency } from '../../lib/utils';
import { StatCard } from '../dashboard/StatCard';
import { CashFlowChart } from '../charts/CashFlowChart';
import { CategoryDonut } from '../charts/CategoryDonut';
import { SavingsGoalCard } from '../dashboard/SavingsGoalCard';
import { RecentTransactionsTable } from '../dashboard/RecentTransactionsTable';

export function DashboardView() {
  const {
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    netSavings,
    savingsRatePercentage,
    transactions,
    setIsImportModalOpen,
    loadDemoData,
    selectedProject,
    setSelectedProjectId,
    user,
  } = useFinFlow();

  const isEmpty = transactions.length === 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Active Folder Cockpit Banner */}
      {selectedProject && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 font-medium text-base">
              📁
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-800 border border-slate-200/80">
                  {selectedProject.code}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                  {selectedProject.name}
                </h3>
                <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-200/60">
                  {selectedProject.department}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dashboard & analysis are actively scoped to this folder • Allocated Budget: {formatCurrency(selectedProject.allocatedBudget, user.currency)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload CSV to Folder</span>
            </button>
            <button
              onClick={() => setSelectedProjectId('ALL')}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View All Entities
            </button>
          </div>
        </div>
      )}

      {/* Empty State Ingestion Hero Banner */}
      {isEmpty && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/80 flex items-center gap-1.5">
                  <UploadCloud className="h-3.5 w-3.5 text-slate-500" />
                  Awaiting Invoices & Ledger Ingestion
                </span>
                <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 border border-slate-200/50">
                  0 Records Ingested
                </span>
              </div>
              <h2 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                Upload Your Bank or ERP CSV to Activate Intelligence
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Your financial ledger is currently unpopulated. Upload a bank statement or ERP CSV export to generate live cash flow trajectories, department expense distributions, and automated SLA audits. Or load demo data to explore immediately.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs active:scale-[0.98]"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload CSV File</span>
              </button>
              <button
                onClick={loadDemoData}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors active:scale-[0.98]"
              >
                <RefreshCw className="h-4 w-4 text-slate-500" />
                <span>Load Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Col KPI Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Net Liquidity"
          amount={totalBalance}
          trendPercentage={isEmpty ? 0 : 12.5}
          trendLabel={isEmpty ? 'awaiting CSV upload' : 'vs last month'}
          icon={Wallet}
          iconColor="text-slate-700"
          iconBg="bg-slate-100"
          subtext={isEmpty ? 'No accounts linked yet' : `${transactions.length} verified ledger records`}
          showSparkline={false}
        />

        <StatCard
          title="Monthly Inflows"
          amount={monthlyIncome}
          trendPercentage={isEmpty ? 0 : 8.4}
          trendLabel={isEmpty ? '0 credits' : 'above projected'}
          isPositiveTrendGood={true}
          icon={TrendingUp}
          iconColor="text-slate-700"
          iconBg="bg-slate-100"
          subtext={isEmpty ? 'Ingest CSV to view revenue' : 'Ingested vendor & client settlements'}
          showSparkline={false}
        />

        <StatCard
          title="Monthly Outflows"
          amount={monthlyExpense}
          trendPercentage={isEmpty ? 0 : -3.2}
          trendLabel={isEmpty ? '0 debits' : 'spend reduction'}
          isPositiveTrendGood={false}
          icon={TrendingDown}
          iconColor="text-slate-700"
          iconBg="bg-slate-100"
          subtext={isEmpty ? 'No expenses recorded yet' : 'Accounts payable & disbursements'}
          showSparkline={false}
        />

        <StatCard
          title="Net Cash Retained"
          amount={netSavings}
          trendPercentage={savingsRatePercentage}
          trendLabel={isEmpty ? '0% rate' : 'savings rate'}
          isPositiveTrendGood={true}
          icon={PiggyBank}
          iconColor="text-slate-700"
          iconBg="bg-slate-100"
          subtext={isEmpty ? 'Surplus cash calculation' : 'Allocated to operational reserves'}
          showSparkline={false}
        />
      </div>

      {/* Main Analytics Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <div className="lg:col-span-1">
          <CategoryDonut />
        </div>
      </div>

      {/* Bottom Grid: Savings Goals & Transactions Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SavingsGoalCard />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactionsTable limit={6} />
        </div>
      </div>
    </div>
  );
}
