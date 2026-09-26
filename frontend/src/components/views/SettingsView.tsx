'use client';

import React, { useState } from 'react';
import {
  User,
  RefreshCw,
  Check,
  CreditCard,
  Building,
  Trash2,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';

export function SettingsView() {
  const {
    user,
    setUser,
    loadDemoData,
    clearAllData,
    dataSourceType,
    csvFileName,
    transactions,
  } = useFinFlow();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currency, setCurrency] = useState(user.currency);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      currency,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Heading */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">System Preferences & Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage currency display, account credentials, and platform behavioral defaults
        </p>
      </div>

      {/* Profile & Currency Form */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">User Identity & Locale</h3>
            <p className="text-xs text-slate-500">Configured profile parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Financial Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Currency Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Base Reporting Currency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { code: 'INR' as const, symbol: '₹', label: 'Indian Rupee' },
              { code: 'USD' as const, symbol: '$', label: 'US Dollar' },
              { code: 'EUR' as const, symbol: '€', label: 'Euro' },
              { code: 'GBP' as const, symbol: '£', label: 'British Pound' },
            ].map((curr) => (
              <button
                type="button"
                key={curr.code}
                onClick={() => setCurrency(curr.code)}
                className={`flex items-center gap-2.5 rounded-xl p-3 border text-left transition-all ${
                  currency === curr.code
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-subtle text-xs font-black">
                  {curr.symbol}
                </span>
                <div>
                  <p className="text-xs font-bold leading-tight">{curr.code}</p>
                  <p className="text-[10px] text-slate-500">{curr.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-sm"
          >
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>

      {/* Linked Accounts Overview */}
      <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Synchronized Banking Entities</h3>
            <p className="text-xs text-slate-500">Live API connections to financial institutions</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { name: 'HDFC Corporate Salary Account', num: '•••• 4821', type: 'Checking', status: 'ACTIVE' },
            { name: 'ICICI Direct Wealth Portfolio', num: '•••• 9912', type: 'Dematerialized Asset', status: 'ACTIVE' },
            { name: 'Axis Bank Magnus Credit Card', num: '•••• 7721', type: 'Revolving Credit', status: 'ACTIVE' },
          ].map((acc, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{acc.name}</p>
                  <p className="text-[11px] text-slate-500">{acc.type} • {acc.num}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {acc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Controls / Reset Data */}
      <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Ledger Data Management</h3>
              {dataSourceType === 'demo' ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                  Demo Data Active ({transactions.length} items)
                </span>
              ) : dataSourceType === 'csv' ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  Real CSV: {csvFileName} ({transactions.length} items)
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  Empty Ledger (0 items)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Load enterprise sample records to demo features, or completely unset and wipe data to start from a clean state.
            </p>
            {feedbackMsg && (
              <p className="text-xs font-bold text-emerald-600 mt-2">
                ✓ {feedbackMsg}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                loadDemoData();
                setFeedbackMsg('Demo Dataset loaded successfully!');
                setTimeout(() => setFeedbackMsg(null), 2500);
              }}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
              <span>Load Demo Data</span>
            </button>

            <button
              type="button"
              onClick={() => {
                clearAllData();
                setFeedbackMsg('Ledger wiped clean. Ready for CSV upload.');
                setTimeout(() => setFeedbackMsg(null), 2500);
              }}
              className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-600" />
              <span>Unset / Reset to Empty</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
