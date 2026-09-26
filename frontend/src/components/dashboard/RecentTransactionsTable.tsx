'use client';

import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Copy,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency, formatDate, getCategoryColor } from '../../lib/utils';

interface RecentTransactionsTableProps {
  limit?: number;
  showFilters?: boolean;
}

export function RecentTransactionsTable({
  limit,
  showFilters = true,
}: RecentTransactionsTableProps) {
  const {
    transactions,
    deleteTransaction,
    duplicateTransaction,
    user,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    setIsImportModalOpen,
    loadDemoData,
  } = useFinFlow();

  const [localSearch, setLocalSearch] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  // Filter logic
  let filtered = transactions.filter((t) => {
    // Search filter
    const matchesSearch =
      t.merchant.toLowerCase().includes(localSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(localSearch.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(localSearch.toLowerCase()));

    // Category filter from context or local
    const matchesCategory = selectedCategoryFilter
      ? t.category === selectedCategoryFilter
      : true;

    // Type filter
    const matchesType = typeFilter === 'ALL' ? true : t.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return (
    <div className="rounded-2xl bg-white shadow-subtle border border-slate-100 transition-all hover:shadow-card">
      {/* Table Header Bar */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              {filtered.length} Recorded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified financial ledger entries and settlement records
          </p>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="rounded-xl bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-44 sm:w-56"
              />
            </div>

            {/* Type Filter Pills */}
            <div className="flex items-center rounded-xl bg-slate-50 p-1 border border-slate-100 text-xs">
              {(['ALL', 'INCOME', 'EXPENSE'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    typeFilter === type
                      ? 'bg-white text-emerald-700 shadow-subtle font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {type === 'ALL' ? 'All' : type === 'INCOME' ? 'Inflows' : 'Outflows'}
                </button>
              ))}
            </div>

            {selectedCategoryFilter && (
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              >
                <span>Category: {selectedCategoryFilter}</span>
                <span className="text-[10px] ml-1">✕</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-3.5">Merchant / Counterparty</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Amount</th>
              <th className="px-6 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 mb-3 shadow-2xs">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <p className="text-base font-semibold text-slate-900">Ledger is Empty</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                      No invoices or transactions have been uploaded yet. Upload your company bank statement or ERP CSV to populate real-time entries.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors active:scale-[0.98]"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        <span>Upload CSV File</span>
                      </button>
                      <button
                        onClick={loadDemoData}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors active:scale-[0.98]"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                        <span>Load Demo Data</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                      <Search className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No matching transactions</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or search query</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const colors = getCategoryColor(tx.category);
                const isIncome = tx.type === 'INCOME';

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-default"
                  >
                    {/* Merchant */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{tx.merchant}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                            {tx.note || tx.account || 'Direct Settlement'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium border border-slate-200/70 ${colors.bg} ${colors.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {tx.status === 'Completed' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {tx.status}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-sm font-bold tabular-nums ${
                          isIncome ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount, user.currency)}
                      </span>
                    </td>

                    {/* Row Menu Actions */}
                    <td className="px-6 py-4 text-center relative">
                      <div className="inline-block text-left">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === tx.id ? null : tx.id)
                          }
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === tx.id && (
                          <div className="absolute right-6 top-10 z-20 w-36 rounded-xl bg-white p-1.5 shadow-modal border border-slate-100 text-left">
                            <button
                              onClick={() => {
                                duplicateTransaction(tx.id);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                            >
                              <Copy className="h-3.5 w-3.5 text-slate-400" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={() => {
                                deleteTransaction(tx.id);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
