'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Command,
  Users,
  Building,
  UploadCloud,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { getTimeOfDayGreeting } from '../../lib/utils';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const {
    user,
    setIsImportModalOpen,
    setIsCommandPaletteOpen,
    activeTab,
    setActiveTab,
    portalMode,
    setPortalMode,
    pendingClaimsCount,
    dataSourceType,
    clearAllData,
    transactions,
    selectedProject,
    setSelectedProjectId,
  } = useFinFlow();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 'n-1',
      title: 'Salary Credited',
      desc: '₹2,85,000 received from Razorpay Technologies',
      time: '2 hours ago',
      type: 'income',
    },
    {
      id: 'n-2',
      title: 'New HR Reimbursement Claim',
      desc: 'Raghav Sharma submitted ₹14,500 WFH tech expense',
      time: '3 hours ago',
      type: 'warning',
    },
    {
      id: 'n-3',
      title: 'Savings Milestone Achieved',
      desc: 'MacBook Pro M4 Max Studio goal 100% funded!',
      time: '2 days ago',
      type: 'success',
    },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'landing':
        return 'Product Story & Problem Statement';
      case 'projects':
        return 'Project & Invoice Workspace Folders';
      case 'transactions':
        return 'Transaction Ledger';
      case 'analytics':
        return 'Financial Health & Flow';
      case 'budgets':
        return 'Budgets & Expense Guardrails';
      case 'hr':
        return 'HR Operations & Employee Claims';
      case 'settings':
        return 'System & Profile Preferences';
      default:
        return 'Executive Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile trigger & Page Identity */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              {getPageTitle()}
            </h1>

            {selectedProject && (
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="truncate max-w-[140px]">Folder: {selectedProject.name}</span>
                <button
                  onClick={() => setSelectedProjectId('ALL')}
                  className="ml-1 text-emerald-600 hover:text-emerald-900 text-[10px]"
                  title="Clear folder filter and view all entities"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
            {getTimeOfDayGreeting()}, {user.name.split(' ')[0]} 👋 &bull; Corporate Treasury Operations
          </p>
        </div>
      </div>

      {/* Center: Portal Mode Switcher (Finance vs HR) */}
      <div className="hidden xl:inline-flex items-center rounded-xl bg-slate-100/90 p-1 border border-slate-200/70 shrink-0">
        <button
          onClick={() => {
            setPortalMode('FINANCE');
            if (activeTab === 'hr') setActiveTab('dashboard');
          }}
          className={`whitespace-nowrap flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
            portalMode === 'FINANCE' && activeTab !== 'hr'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="h-3.5 w-3.5 text-slate-500" />
          <span>Finance & AP</span>
        </button>

        <button
          onClick={() => {
            setPortalMode('HR_PORTAL');
            setActiveTab('hr');
          }}
          className={`whitespace-nowrap flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
            portalMode === 'HR_PORTAL' || activeTab === 'hr'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>HR & Claims</span>
          {pendingClaimsCount > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                portalMode === 'HR_PORTAL' || activeTab === 'hr'
                  ? 'bg-slate-800 text-white'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {pendingClaimsCount}
            </span>
          )}
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 sm:px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all border border-slate-200/80 cursor-pointer"
          title="Search transactions, budgets, or press ⌘K"
        >
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[9px] font-mono text-slate-500 border border-slate-200">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-slate-900 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-modal border border-slate-100 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  3 Unread
                </span>
              </div>

              <div className="mt-2 divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {n.type === 'income' && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        )}
                        {n.type === 'warning' && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                        )}
                        {n.type === 'success' && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="mt-3 w-full rounded-xl bg-slate-50 py-2 text-center text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Compact Live Data Status Indicator (Only if active, compact & clean) */}
        {dataSourceType === 'csv' && (
          <div className="hidden 2xl:flex items-center gap-1.5 rounded-xl bg-emerald-50/80 px-2.5 py-1.5 border border-emerald-200/80 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span className="font-semibold text-emerald-800">
              CSV Active ({transactions.length})
            </span>
            <button
              onClick={clearAllData}
              className="ml-1 text-[10px] font-bold text-emerald-700 hover:text-rose-700 transition-colors"
              title="Clear imported CSV"
            >
              ✕
            </button>
          </div>
        )}

        {dataSourceType === 'demo' && (
          <div className="hidden 2xl:flex items-center gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1.5 border border-amber-200 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold text-amber-800">Demo Active</span>
            <button
              onClick={clearAllData}
              className="ml-1 text-[10px] font-bold text-amber-900 hover:text-rose-700 transition-colors"
              title="Unset demo data"
            >
              ✕
            </button>
          </div>
        )}

        {/* Primary Enterprise CTA: Import CSV Button */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="group inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer shrink-0"
          title="Upload bulk transaction ledger CSV (Shortcut: I)"
        >
          <UploadCloud className="h-3.5 w-3.5 stroke-[2.2]" />
          <span>Import CSV</span>
          <kbd className="hidden sm:inline-block rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono text-slate-300 border border-slate-700">
            I
          </kbd>
        </button>

        {/* User Profile Avatar / Chip */}
        <div className="flex items-center gap-2 pl-1.5 border-l border-slate-200 shrink-0">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-bold shadow-2xs cursor-pointer select-none"
            title={`${user.name} (${user.email})`}
          >
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
}
