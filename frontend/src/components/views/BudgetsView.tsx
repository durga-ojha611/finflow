'use client';

import React, { useState } from 'react';
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency, getCategoryColor } from '../../lib/utils';
import { TransactionCategory } from '../../lib/types';

export function BudgetsView() {
  const {
    budgets,
    addBudget,
    user,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
  } = useFinFlow();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<TransactionCategory>('Entertainment');
  const [newAmount, setNewAmount] = useState<number>(20000);

  const totalAllocated = budgets.reduce((acc, curr) => acc + curr.allocatedAmount, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spentAmount, 0);
  const totalPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addBudget({
      category: newCategory,
      allocatedAmount: Number(newAmount),
      period: 'Monthly',
      color: '#10B981',
    });
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-2xs border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-semibold text-slate-900">Spending Guardrails & Budgets</h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200/60">
              {budgets.length} Active Budgets
            </span>
            {selectedProject && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-200/80">
                📁 Scoped to: {selectedProject.name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {selectedProject
              ? `Real-time spend against guardrails for folder "${selectedProject.name}" (Allocated: ${formatCurrency(selectedProject.allocatedBudget, user.currency)})`
              : 'Dynamic threshold tracking with proactive overage warnings across all projects'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedProjectId !== 'ALL' && (
            <button
              onClick={() => setSelectedProjectId('ALL')}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset to All Entities
            </button>
          )}

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Aggregate Budget Utilization Meter */}
      <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Monthly Allocation
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                {formatCurrency(totalSpent, user.currency)}
              </span>
              <span className="text-xs text-slate-400">
                of {formatCurrency(totalAllocated, user.currency)} allocated
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600 tabular-nums">
              {totalPercentage}%
            </span>
            <p className="text-[11px] text-slate-400">Overall Utilization</p>
          </div>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${Math.min(100, totalPercentage)}%` }}
          />
        </div>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const pct = Math.round((b.spentAmount / b.allocatedAmount) * 100);
          const isOver = b.spentAmount > b.allocatedAmount;
          const isNear = pct >= 80 && !isOver;
          const remaining = b.allocatedAmount - b.spentAmount;
          const colors = getCategoryColor(b.category);

          return (
            <div
              key={b.id}
              className={`rounded-2xl bg-white p-6 shadow-subtle border transition-all duration-200 hover:shadow-card ${
                isOver ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100'
              }`}
            >
              {/* Category & Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                  {b.category}
                </span>

                {isOver ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    <AlertTriangle className="h-3 w-3" /> Over Budget
                  </span>
                ) : isNear ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    80% Threshold
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> On Track
                  </span>
                )}
              </div>

              {/* Spend Figures */}
              <div>
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {formatCurrency(b.spentAmount, user.currency)}
                </span>
                <span className="text-xs text-slate-400 ml-1">
                  / {formatCurrency(b.allocatedAmount, user.currency)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver
                      ? 'bg-rose-500'
                      : isNear
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>

              {/* Footer Remaining Info */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span>
                  {isOver ? 'Exceeded by:' : 'Remaining capacity:'}
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    isOver ? 'text-rose-600' : 'text-slate-800'
                  }`}
                >
                  {formatCurrency(Math.abs(remaining), user.currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Budget Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCreateOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Define Budget Guardrail</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 border border-slate-200"
                >
                  {[
                    'Housing',
                    'Groceries',
                    'Dining & Drinks',
                    'Transportation',
                    'Utilities',
                    'Entertainment',
                    'Healthcare',
                    'Shopping',
                    'Other',
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Limit ({user.currency})
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  placeholder="e.g. 25000"
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900 border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
                >
                  Save Guardrail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
