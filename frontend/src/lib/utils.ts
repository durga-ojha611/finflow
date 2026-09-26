import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: 'INR' | 'USD' | 'EUR' | 'GBP' = 'INR'): string {
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = currencySymbols[currency] || '₹';
  const formatted = Math.abs(amount).toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getCategoryColor(category: string): { bg: string; text: string; dot: string } {
  // Cohesive, professional enterprise palette (clean slate with subtle distinction)
  switch (category) {
    case 'Salary & Bonus':
    case 'Investments':
      return { bg: 'bg-emerald-50/70', text: 'text-emerald-800', dot: 'bg-emerald-600' };
    case 'Housing':
    case 'Utilities':
      return { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500' };
    case 'Healthcare':
      return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };
  }
}
