'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency } from '../../lib/utils';

export function BudgetBarChart() {
  const { budgets, user } = useFinFlow();

  const data = budgets.map((b) => {
    const pct = Math.round((b.spentAmount / b.allocatedAmount) * 100);
    return {
      category: b.category,
      Spent: b.spentAmount,
      Budget: b.allocatedAmount,
      percentage: pct,
      isOver: b.spentAmount > b.allocatedAmount,
    };
  });

  return (
    <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 transition-all hover:shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Budget vs. Actual Spend</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active guardrails across designated spending categories
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            Budget Target
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Actual Spend
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-600">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Over Budget
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <Tooltip
              formatter={(val: any) => formatCurrency(Number(val), user.currency)}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #F1F5F9',
                boxShadow: '0 10px 25px -3px rgba(15, 23, 42, 0.1)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            <Bar dataKey="Budget" fill="#E2E8F0" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Spent" radius={[6, 6, 0, 0]} maxBarSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isOver ? '#EF4444' : entry.percentage > 85 ? '#F59E0B' : '#10B981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
