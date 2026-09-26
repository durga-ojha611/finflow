'use client';

import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Settings,
  X,
  Users,
  FolderKanban,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { ActiveTab } from '../../lib/types';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const {
    activeTab,
    setActiveTab,
    user,
    transactions,
    budgets,
    pendingClaimsCount,
    projects,
    selectedProjectId,
    setSelectedProjectId,
  } = useFinFlow();

  const overBudgetCount = budgets.filter((b) => b.spentAmount > b.allocatedAmount).length;

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Project Folders',
      icon: FolderKanban,
      badge: `${projects.length}`,
      badgeVariant: 'neutral' as const,
    },
    {
      id: 'transactions' as ActiveTab,
      label: 'Transactions',
      icon: ArrowLeftRight,
      badge: transactions.length.toString(),
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics',
      icon: PieChart,
      badge: null,
    },
    {
      id: 'budgets' as ActiveTab,
      label: 'Budgets',
      icon: Wallet,
      badge: overBudgetCount > 0 ? `${overBudgetCount} Alert` : null,
      badgeVariant: overBudgetCount > 0 ? 'warning' : 'neutral',
    },
    {
      id: 'hr' as ActiveTab,
      label: 'HR & Payroll',
      icon: Users,
      badge: pendingClaimsCount > 0 ? `${pendingClaimsCount} Claims` : 'HR',
      badgeVariant: pendingClaimsCount > 0 ? 'warning' : 'neutral',
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100/70 bg-white">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center text-left group focus:outline-none"
            title="Click logo to view Product Story & Problem Statement"
          >
            <img
              src="/logo-full-trans.png"
              alt="FinFlow - Smarter Finance. Faster Flow."
              width={185}
              height={52}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.03]"
            />
          </button>

          {/* Close for mobile */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Project Folder Active Scope Picker */}
        <div className="px-4 pt-4 pb-2 border-b border-slate-100/70 bg-slate-50/50">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Project Scope
            </span>
            <button
              onClick={() => handleNavClick('projects')}
              className="text-[10px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              All Folders →
            </button>
          </div>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full rounded-xl bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 shadow-2xs focus:outline-none focus:border-slate-400"
          >
            <option value="ALL">🌐 All Projects (Consolidated)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                📁 {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Overview & Management
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-slate-900'
                          : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-semibold border',
                        isActive
                          ? 'bg-white text-slate-800 border-slate-200/90 shadow-2xs'
                          : 'bg-slate-50 text-slate-500 border-slate-200/60'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Widget */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between rounded-xl p-2 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] font-medium text-slate-500 truncate max-w-[110px]">
                    {user.email}
                  </span>
                  <span className="rounded bg-emerald-50 px-1 py-0.2 text-[9px] font-bold text-emerald-700">
                    PRO
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('settings')}
              title="Account Settings"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
