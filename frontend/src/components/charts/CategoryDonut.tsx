'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency } from '../../lib/utils';
import { Filter, X } from 'lucide-react';

export function CategoryDonut() {
  const {
    categorySpendBreakdown,
    monthlyExpense,
    user,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useFinFlow();

  const handleSliceClick = (entry: any) => {
    if (selectedCategoryFilter === entry.name) {
      setSelectedCategoryFilter(null);
    } else {
      setSelectedCategoryFilter(entry.name);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 transition-all hover:shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Spending by Category</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any segment to filter transaction records
          </p>
        </div>

        {selectedCategoryFilter && (
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <Filter className="h-3 w-3" />
            <span>{selectedCategoryFilter}</span>
            <X className="h-3 w-3 ml-0.5" />
          </button>
        )}
      </div>

      {/* Donut Canvas */}
      {categorySpendBreakdown.length === 0 ? (
        <div className="h-56 w-full flex flex-col items-center justify-center rounded-xl bg-slate-50/50 border border-dashed border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No Expense Categorization</p>
          <p className="text-xs text-slate-400 mt-1">Upload CSV to view spending distribution</p>
        </div>
      ) : (
        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: any, name: any) => [
                  formatCurrency(Number(value), user.currency),
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #F1F5F9',
                  boxShadow: '0 10px 25px -3px rgba(15, 23, 42, 0.1)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />
              <Pie
                data={categorySpendBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={92}
                paddingAngle={4}
                dataKey="value"
                onClick={handleSliceClick}
                cursor="pointer"
                strokeWidth={2}
                stroke="#FFFFFF"
              >
                {categorySpendBreakdown.map((entry, index) => {
                  const isSelected = selectedCategoryFilter === entry.name;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={selectedCategoryFilter ? (isSelected ? 1 : 0.35) : 1}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Total Display */}
          <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Spent
            </span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {formatCurrency(monthlyExpense, user.currency)}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {categorySpendBreakdown.length} Categories
            </span>
          </div>
        </div>
      )}

      {/* Legend Grid */}
      {categorySpendBreakdown.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {categorySpendBreakdown.slice(0, 6).map((item) => {
            const percentage =
              monthlyExpense > 0 ? Math.round((item.value / monthlyExpense) * 100) : 0;
            const isSelected = selectedCategoryFilter === item.name;

            return (
              <div
                key={item.name}
                onClick={() => handleSliceClick(item)}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="tabular-nums font-semibold text-slate-900 ml-1">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
