'use client';

import React from 'react';
import { Download, ArrowUpRight, ArrowDownLeft, Wallet, UploadCloud, AlertTriangle, Trash2 } from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { RecentTransactionsTable } from '../dashboard/RecentTransactionsTable';
import { formatCurrency } from '../../lib/utils';

export function TransactionsView() {
  const {
    transactions,
    user,
    setIsImportModalOpen,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    clearAllData,
  } = useFinFlow();

  // Detect broken parse: if >30% of merchant names are a single short word (≤10 chars, no space)
  // this means the old parser split on spaces — show a re-import warning
  const hasBrokenNames = React.useMemo(() => {
    if (transactions.length === 0) return false;
    const sample = transactions.slice(0, Math.min(20, transactions.length));
    const brokenCount = sample.filter(
      (t) => !t.merchant.includes(' ') && t.merchant.length <= 12 && !/record/i.test(t.merchant)
    ).length;
    return brokenCount / sample.length > 0.3;
  }, [transactions]);

  const handleClearAndReimport = () => {
    clearAllData();
    setIsImportModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Merchant,Category,Date,Type,Amount,Status,Note'];
    const rows = transactions.map(
      (t) =>
        `"${t.id}","${t.merchant}","${t.category}","${t.date}","${t.type}",${t.amount},"${t.status}","${t.note || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinFlow-Transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalInflow = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOutflow = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">

      {/* ── Broken Data Warning Banner ── */}
      {hasBrokenNames && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Merchant names look incomplete ("Corp", "Ltd", "Cement"...)</p>
              <p className="text-xs text-amber-700 mt-0.5">
                This data was imported with an older parser that split names on spaces.
                Clear this ledger and re-import your CSV — the new parser preserves full names like <strong>"Power Grid Corp"</strong>, <strong>"Microsoft India Pvt Ltd"</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClearAndReimport}
              className="flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800 transition-colors shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Ledger &amp; Re-import CSV</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-2xs border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-semibold text-slate-900">Financial Ledger</h2>
            {selectedProject && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-200/80">
                📁 Scoped to: {selectedProject.name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {selectedProject
              ? `Synchronized invoices & records for ${selectedProject.name} (${selectedProject.code})`
              : 'Complete synchronized transaction activity across all verified accounts'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {selectedProjectId !== 'ALL' && (
            <button
              onClick={() => setSelectedProjectId('ALL')}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Reset to All
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Import CSV Batch</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-2xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Logged Inflows</span>
            <p className="text-lg font-semibold text-slate-900 tabular-nums mt-0.5">
              +{formatCurrency(totalInflow, user.currency)}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-subtle border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Logged Outflows</span>
            <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">
              -{formatCurrency(totalOutflow, user.currency)}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <ArrowDownLeft className="h-4 w-4" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-subtle border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Recorded Volume</span>
            <p className="text-lg font-bold text-slate-800 tabular-nums mt-0.5">
              {transactions.length} Verified Entries
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Full Table */}
      <RecentTransactionsTable showFilters={true} />
    </div>
  );
}
