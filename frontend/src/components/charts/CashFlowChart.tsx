'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency } from '../../lib/utils';
import { LineChart as LineChartIcon } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency?: 'INR' | 'USD' | 'EUR' | 'GBP';
}

function CustomTooltip({ active, payload, label, currency = 'INR' }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const income = payload.find((p) => p.dataKey === 'income')?.value || 0;
    const expense = payload.find((p) => p.dataKey === 'expense')?.value || 0;
    const net = income - expense;

    return (
      <div className="rounded-xl bg-white p-3.5 shadow-modal border border-slate-100 min-w-[180px]">
        <p className="text-xs font-bold text-slate-900 mb-2">{label} 2026</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Income:
            </span>
            <span className="font-semibold text-emerald-600 tabular-nums">
              {formatCurrency(income, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Expenses:
            </span>
            <span className="font-semibold text-slate-800 tabular-nums">
              {formatCurrency(expense, currency)}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold">
            <span className="text-slate-600">Net Flow:</span>
            <span
              className={`tabular-nums ${net >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}
            >
              {net >= 0 ? '+' : ''}
              {formatCurrency(net, currency)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function CashFlowChart() {
  const { user, transactions, monthlyIncome, monthlyExpense } = useFinFlow();
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Quarterly'>('Monthly');

  const netMargin =
    monthlyIncome > 0
      ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 1000) / 10
      : 0;

  const dynamicSeries = useMemo(() => {
    if (transactions.length === 0) return [];

    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const monthData: Record<string, { income: number; expense: number }> = {};
    months.forEach((m) => (monthData[m] = { income: 0, expense: 0 }));

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const mName = d.toLocaleString('en-US', { month: 'short' });
      const targetMonth = monthData[mName] ? mName : 'Sep';
      if (tx.type === 'INCOME') {
        monthData[targetMonth].income += tx.amount;
      } else {
        monthData[targetMonth].expense += tx.amount;
      }
    });

    return months.map((month) => ({
      month,
      label: month,
      income: monthData[month].income,
      expense: monthData[month].expense,
    }));
  }, [transactions]);

  const isEmpty = transactions.length === 0;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-2xs border border-slate-200/80 transition-colors">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">Cash Flow Intelligence</h2>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                isEmpty
                  ? 'bg-slate-100 text-slate-500 border-slate-200/60'
                  : 'bg-emerald-50/80 text-emerald-800 border-emerald-200/60'
              }`}
            >
              {isEmpty ? 'Awaiting Data' : `${netMargin >= 0 ? '+' : ''}${netMargin}% Net Margin`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEmpty
              ? 'Upload transaction CSV to visualize inflow vs outflow trends'
              : 'Real-time trajectory of inflows vs disciplined expenditures'}
          </p>
        </div>

        {/* Legend & Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span>Inflow</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>Outflow</span>
            </div>
          </div>

          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/70 text-xs font-medium">
            <button
              onClick={() => setTimeframe('Monthly')}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                timeframe === 'Monthly'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('Quarterly')}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                timeframe === 'Quarterly'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>
      </div>

      {/* Main Area Chart Canvas */}
      {isEmpty ? (
        <div className="h-72 w-full flex flex-col items-center justify-center rounded-xl bg-slate-50/50 border border-dashed border-slate-200">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
            <LineChartIcon className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No Cash Flow Telemetry</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest your ledger CSV to render dynamic inflows & outflows curve
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dynamicSeries}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {/* Soft Emerald Gradient for Income */}
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>

                {/* Slate Gradient for Expense */}
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(v) => `₹${v / 1000}k`}
                dx={-5}
              />

              <Tooltip
                content={<CustomTooltip currency={user.currency} />}
                cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGradient)"
                name="Inflow"
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#64748B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expenseGradient)"
                name="Outflow"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
