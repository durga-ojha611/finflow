'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Check, Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { transactionSchema, TransactionFormData } from '../../lib/validators/transactionSchema';
import { TransactionCategory } from '../../lib/types';
import confetti from 'canvas-confetti';

const CATEGORIES: TransactionCategory[] = [
  'Housing',
  'Groceries',
  'Dining & Drinks',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Salary & Bonus',
  'Investments',
  'Freelance',
  'Other',
];

export function AddTransactionModal() {
  const { isAddModalOpen, setIsAddModalOpen, addTransaction, user } = useFinFlow();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      merchant: '',
      amount: undefined,
      type: 'EXPENSE',
      category: 'Groceries',
      date: new Date().toISOString().split('T')[0],
      note: '',
      account: 'HDFC Primary Checking',
      status: 'Completed',
    },
  });

  const selectedType = watch('type');

  if (!isAddModalOpen) return null;

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    // Simulate natural micro-delay for realistic feedback
    await new Promise((resolve) => setTimeout(resolve, 350));

    addTransaction({
      merchant: data.merchant,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      date: data.date,
      note: data.note,
      account: data.account || 'HDFC Primary Checking',
      status: data.status || 'Completed',
    });

    setIsSubmitting(false);
    setIsSuccess(true);

    if (data.type === 'INCOME') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#6EE7B7'],
      });
    }

    setTimeout(() => {
      setIsSuccess(false);
      reset();
      setIsAddModalOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAddModalOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Transaction</h2>
            <p className="text-xs text-slate-500">Log an income settlement or expenditure</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Segmented Control (Income vs Expense) */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setValue('type', 'EXPENSE')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                selectedType === 'EXPENSE'
                  ? 'bg-white text-slate-900 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="h-4 w-4 text-rose-500" />
              <span>Expense / Outflow</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'INCOME')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                selectedType === 'INCOME'
                  ? 'bg-white text-emerald-700 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span>Income / Inflow</span>
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Amount ({user.currency}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 pl-8 pr-4 py-2.5 text-base font-bold text-slate-900 tabular-nums border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-[11px] font-semibold text-rose-500">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Merchant / Payee */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Merchant / Counterparty *
            </label>
            <input
              type="text"
              placeholder="e.g. Blue Tokai Coffee, Google Cloud, Salary"
              {...register('merchant')}
              className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.merchant && (
              <p className="mt-1 text-[11px] font-semibold text-rose-500">
                {errors.merchant.message}
              </p>
            )}
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                {...register('date')}
                className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Notes / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add optional context or tags..."
              {...register('note')}
              className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-95 disabled:opacity-75 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Logging...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Recorded!</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Confirm Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
