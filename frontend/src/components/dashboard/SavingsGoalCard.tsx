'use client';

import React from 'react';
import { Target, Plus, CheckCircle2 } from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';

export function SavingsGoalCard() {
  const { savingsGoals, contributeToGoal, user } = useFinFlow();

  const handleContribute = (id: string) => {
    contributeToGoal(id, 25000);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#10B981', '#34D399', '#6EE7B7'],
    });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 transition-all hover:shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Savings Goals</h2>
            <p className="text-xs text-slate-500">Autonomous growth milestones</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          {savingsGoals.filter((g) => g.isCompleted).length}/{savingsGoals.length} Completed
        </span>
      </div>

      <div className="space-y-4">
        {savingsGoals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isDone = goal.isCompleted || percentage >= 100;

          return (
            <div
              key={goal.id}
              className={`rounded-xl p-3.5 border transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{goal.title}</span>
                  {isDone && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Funded
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Amount & Quick contribute */}
              <div className="mt-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  <strong className="text-slate-800 font-semibold tabular-nums">
                    {formatCurrency(goal.currentAmount, user.currency)}
                  </strong>{' '}
                  of {formatCurrency(goal.targetAmount, user.currency)}
                </span>

                {!isDone && (
                  <button
                    onClick={() => handleContribute(goal.id)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-subtle"
                  >
                    <Plus className="h-3 w-3 stroke-[2.5]" />
                    <span>+₹25k</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
