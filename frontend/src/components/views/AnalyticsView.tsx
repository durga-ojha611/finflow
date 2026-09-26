'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { CashFlowChart } from '../charts/CashFlowChart';
import { BudgetBarChart } from '../charts/BudgetBarChart';
import { CategoryDonut } from '../charts/CategoryDonut';

export function AnalyticsView() {
  const { financialHealthScore, savingsRatePercentage, budgets } = useFinFlow();

  const overBudgetCount = budgets.filter((b) => b.spentAmount > b.allocatedAmount).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Health Score & Insights Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Health Score Gauge Card */}
        <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Financial Health Index
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                Top 5% Tier
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              {/* Circular Gauge Representation */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-500">
                <span className="text-3xl font-black text-slate-900 tabular-nums">
                  {financialHealthScore}
                </span>
                <span className="text-[10px] font-bold text-slate-400 absolute bottom-3">
                  /100
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Calm & Resilient</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                  Your liquidity runway exceeds 6 months with healthy cash accumulation.
                </p>
              </div>
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Savings Rate Discipline</span>
              <span className="font-bold text-emerald-600">{savingsRatePercentage}% (Target: 25%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Budget Guardrails</span>
              <span
                className={`font-bold ${
                  overBudgetCount === 0 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {overBudgetCount === 0 ? '100% Compliant' : `${overBudgetCount} Over Threshold`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Debt-to-Asset Ratio</span>
              <span className="font-bold text-slate-900">0.08 (Minimal)</span>
            </div>
          </div>
        </div>

        {/* AI Forensic Diagnostic Summary */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Autonomous Forensic Synthesis
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold tracking-tight text-white">
              Smart Cash Optimization Opportunities
            </h2>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed max-w-xl">
              Analysis of your September outflow patterns indicates a 37% surge in discretionary Shopping.
              By routing ₹35,000 into short-term treasury yields, your annual net interest yield increases by ₹42,000.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Primary Strength</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                High fixed-cost control: Housing and Utilities remain locked under 28% of net income.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Attention Required</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Dining & Drinks budget approaching 85% threshold with 6 days remaining in billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Cash Flow Chart */}
      <CashFlowChart />

      {/* 2-Col: Budget vs Actual Bar Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetBarChart />
        <CategoryDonut />
      </div>
    </div>
  );
}
