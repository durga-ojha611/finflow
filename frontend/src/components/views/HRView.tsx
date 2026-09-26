'use client';

import React, { useState } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Search,
  Check,
  UserCheck,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import confetti from 'canvas-confetti';

export function HRView() {
  const {
    claims,
    payrollRuns,
    approveClaim,
    rejectClaim,
    totalPendingClaimsAmount,
    pendingClaimsCount,
    monthlyPayrollTotal,
    user,
  } = useFinFlow();

  const [hrSubTab, setHrSubTab] = useState<'claims' | 'payroll' | 'contractors'>('claims');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [claimSearch, setClaimSearch] = useState('');

  const handleApprove = (id: string) => {
    approveClaim(id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#34D399', '#6EE7B7'],
    });
  };

  const filteredClaims = claims.filter((c) => {
    const matchesDept = departmentFilter === 'ALL' || c.department === departmentFilter;
    const matchesSearch =
      c.employeeName.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.claimType.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.employeeId.toLowerCase().includes(claimSearch.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HR Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                HR & People Operations Hub
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                142 Active Personnel
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
              Workforce Expenditures & Claim Verifications
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Dedicated portal for HR leadership, People Ops, and managers to audit employee reimbursement claims, oversee payroll disbursements, and monitor department headcount burn rate.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Claim Settlement SLA
            </span>
            <span className="rounded-xl bg-white/10 px-3 py-1 text-sm font-bold text-emerald-400 border border-emerald-400/20">
              Avg. 18.2 Hours
            </span>
          </div>
        </div>
      </div>

      {/* 4-Col HR Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Claims Action
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
              {pendingClaimsCount} Claims
            </h3>
            <p className="text-xs font-semibold text-amber-600 mt-1">
              {formatCurrency(totalPendingClaimsAmount, user.currency)} awaiting sign-off
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Monthly Payroll Run
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatCurrency(monthlyPayrollTotal, user.currency)}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1">
              Sep 30, 2026 Scheduled Run
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Verified Headcount
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
              142 Staff
            </h3>
            <p className="text-xs font-semibold text-indigo-600 mt-1">
              +4 Onboarded this month
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-subtle border border-slate-100 hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Reimbursement Compliance
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 tabular-nums">
              96.8%
            </h3>
            <p className="text-xs font-semibold text-teal-600 mt-1">
              Valid receipts & tax IDs
            </p>
          </div>
        </div>
      </div>

      {/* HR Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHrSubTab('claims')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              hrSubTab === 'claims'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Employee Reimbursement Claims ({claims.length})
          </button>
          <button
            onClick={() => setHrSubTab('payroll')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              hrSubTab === 'payroll'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Payroll Disbursement Cycles
          </button>
          <button
            onClick={() => setHrSubTab('contractors')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              hrSubTab === 'contractors'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Hourly Timesheets & Contractor Billing
          </button>
        </div>

        {/* Department Filter for Claims */}
        {hrSubTab === 'claims' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              Department:
            </span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="People & Culture">People & Culture</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        )}
      </div>

      {/* View 1: Employee Claims Table */}
      {hrSubTab === 'claims' && (
        <div className="rounded-2xl bg-white shadow-subtle border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Staff Claims Review & Approval Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit supporting receipts, policy adherence, and disburse reimbursements
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff, claim ID..."
                value={claimSearch}
                onChange={(e) => setClaimSearch(e.target.value)}
                className="rounded-xl bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 border border-slate-200 w-56 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Claim Category</th>
                  <th className="px-6 py-3.5">Submitted</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">HR Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Employee */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={claim.avatarUrl}
                          alt={claim.employeeName}
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{claim.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{claim.employeeId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {claim.department}
                    </td>

                    {/* Category & Note */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{claim.claimType}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                        {claim.notes}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {formatDate(claim.submittedDate)}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right font-bold text-slate-900 tabular-nums">
                      {formatCurrency(claim.amount, user.currency)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          claim.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : claim.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-50 text-amber-700'
                            : claim.status === 'DISBURSED'
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {claim.status === 'APPROVED' && <CheckCircle2 className="h-3 w-3" />}
                        {claim.status === 'PENDING_APPROVAL' && <Clock className="h-3 w-3" />}
                        {claim.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {claim.status === 'PENDING_APPROVAL' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(claim.id)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-subtle"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectClaim(claim.id)}
                            className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">
                          Verified by {claim.approver.split(' ')[0]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Payroll Runs */}
      {hrSubTab === 'payroll' && (
        <div className="rounded-2xl bg-white shadow-subtle border border-slate-100 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Corporate Compensation & Salary Disbursement Cycles
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated reconciliation with payroll processors and statutory deductions
            </p>
          </div>

          <div className="space-y-4">
            {payrollRuns.map((run) => (
              <div
                key={run.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{run.month}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        run.status === 'DISBURSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {run.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {run.totalEmployees} Active Beneficiaries • Disburses on{' '}
                    {formatDate(run.disbursementDate)}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-400">Gross Payroll</span>
                    <p className="font-bold text-slate-900 tabular-nums">
                      {formatCurrency(run.grossPayroll, user.currency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Taxes & PF Withheld</span>
                    <p className="font-bold text-slate-600 tabular-nums">
                      {formatCurrency(run.taxPfWithheld, user.currency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Net Disbursed</span>
                    <p className="font-bold text-emerald-600 tabular-nums">
                      {formatCurrency(run.netDisbursed, user.currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Hourly Contractors & Timesheets */}
      {hrSubTab === 'contractors' && (
        <div className="rounded-2xl bg-white shadow-subtle border border-slate-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Contractor Hours & Overtime Timesheets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hourly logged billable time across agile consulting resources
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              428 Total Hours This Cycle
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                contractor: 'Cloud Infra DevSecOps Lead',
                hours: '142.5 hrs',
                rate: '₹2,500/hr',
                total: '₹3,56,250',
                status: 'AUDITED',
              },
              {
                contractor: 'Senior QA Automation Specialist',
                hours: '160.0 hrs',
                rate: '₹1,800/hr',
                total: '₹2,88,000',
                status: 'AUDITED',
              },
              {
                contractor: 'Technical Documentation Consultant',
                hours: '125.5 hrs',
                rate: '₹1,200/hr',
                total: '₹1,50,600',
                status: 'PENDING_HR',
              },
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-900">{c.contractor}</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Logged Hours:</span>
                  <span className="font-bold text-slate-800">{c.hours}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Billing Rate:</span>
                  <span className="text-slate-600 font-medium">{c.rate}</span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Total Invoice:</span>
                  <span className="text-emerald-700">{c.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
