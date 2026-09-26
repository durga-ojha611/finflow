'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Settings,
  UploadCloud,
  X,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { ActiveTab } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    setIsImportModalOpen,
    transactions,
    user,
  } = useFinFlow();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredTransactions = query.trim()
    ? transactions
        .filter(
          (t) =>
            t.merchant.toLowerCase().includes(query.toLowerCase()) ||
            t.category.toLowerCase().includes(query.toLowerCase()) ||
            (t.note && t.note.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const navActions: { label: string; tab: ActiveTab; icon: React.ElementType }[] = [
    { label: 'Go to Dashboard', tab: 'dashboard', icon: LayoutDashboard },
    { label: 'View Transactions Ledger', tab: 'transactions', icon: ArrowLeftRight },
    { label: 'Financial Analytics & Health', tab: 'analytics', icon: PieChart },
    { label: 'Manage Category Budgets', tab: 'budgets', icon: Wallet },
    { label: 'Preferences & Settings', tab: 'settings', icon: Settings },
  ];

  const filteredNav = navActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsCommandPaletteOpen(false);
  };

  const handleImportCSV = () => {
    setIsCommandPaletteOpen(false);
    setIsImportModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsCommandPaletteOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 transition-all">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search transactions..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsCommandPaletteOpen(false);
            }}
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {/* Quick Action */}
          <div className="mb-2 px-2 pt-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Actions
          </div>
          <button
            onClick={handleImportCSV}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <UploadCloud className="h-4 w-4" />
            </div>
            <span>Import Invoices & Transactions CSV</span>
            <span className="ml-auto text-[10px] text-emerald-600 font-mono">Press 'I'</span>
          </button>

          {/* Navigation Items */}
          <div className="mt-3 mb-2 px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          {filteredNav.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.tab}
                onClick={() => handleSelectNav(action.tab)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Icon className="h-4 w-4 text-slate-400" />
                <span>{action.label}</span>
              </button>
            );
          })}

          {/* Matching Transactions */}
          {filteredTransactions.length > 0 && (
            <div className="mt-3">
              <div className="mb-2 px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Transactions ({filteredTransactions.length})
              </div>
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    setActiveTab('transactions');
                    setIsCommandPaletteOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        tx.type === 'INCOME'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tx.type === 'INCOME' ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{tx.merchant}</p>
                      <p className="text-[10px] text-slate-400">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(tx.amount, user.currency)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {query.trim() && filteredNav.length === 0 && filteredTransactions.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-400">
          <span>Navigate with mouse or arrow keys</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
}
