'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { DateRangePreset } from '../../lib/types';

export function TimeRangeSection() {
  const { dateRange, setDateRange } = useFinFlow();

  const presets: { id: DateRangePreset; label: string }[] = [
    { id: 'Today', label: 'Today' },
    { id: 'This Week', label: 'This Week' },
    { id: 'This Month', label: 'This Month' },
    { id: 'Last 30 Days', label: 'Last 30 Days' },
    { id: 'This Year', label: 'This Year' },
  ];

  return (
    <div className="rounded-xl bg-white px-4 py-2 shadow-2xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left: Active Window Indicator */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0">
          <Calendar className="h-3.5 w-3.5" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-800">Time Horizon:</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-900 border border-slate-200/60">
            {dateRange}
          </span>
          <span className="hidden md:inline-block text-[11px] text-slate-400">
            • Real-time financial telemetry & SLA audit
          </span>
        </div>
      </div>

      {/* Right: Compact Segmented Range Control */}
      <div className="flex items-center gap-1 rounded-lg bg-slate-100/90 p-0.5 border border-slate-200/70 overflow-x-auto">
        {presets.map((preset) => {
          const isActive = dateRange === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setDateRange(preset.id)}
              className={`whitespace-nowrap rounded-md px-3 py-1 text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
