'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { useFinFlow } from '../../context/FinFlowContext';

interface StatCardProps {
  title: string;
  amount: number;
  trendPercentage: number;
  trendLabel: string;
  isPositiveTrendGood?: boolean;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  subtext?: string;
  showSparkline?: boolean;
}

export function StatCard({
  title,
  amount,
  trendPercentage,
  trendLabel,
  isPositiveTrendGood = true,
  icon: Icon,
  subtext,
}: StatCardProps) {
  const { user } = useFinFlow();
  const isPositive = trendPercentage >= 0;
  const isGood = isPositive ? isPositiveTrendGood : !isPositiveTrendGood;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-2xs border border-slate-200/80 transition-colors">
      {/* Top Row: Title & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Metric Figure */}
      <div className="mt-3">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {formatCurrency(amount, user.currency)}
        </h3>
      </div>

      {/* Bottom Trend & Label */}
      <div className="mt-3 flex items-center gap-2">
        {amount === 0 ? (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 border border-slate-200/60">
            0%
          </span>
        ) : (
          <div
            className={`inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-semibold ${
              isGood
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            <span>{Math.abs(trendPercentage)}%</span>
          </div>
        )}
        <span className="text-xs text-slate-400 font-medium truncate">
          {trendLabel}
        </span>
      </div>

      {subtext && (
        <p className="mt-2 text-[11px] text-slate-400 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
}
