'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  Lightbulb,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileQuestion,
  RefreshCw,
  Mail,
  FileSpreadsheet,
  ChevronRight,
  Check,
  TrendingDown,
  Percent,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';

export function LandingPageView() {
  const { setActiveTab, setIsImportModalOpen, user } = useFinFlow();
  const [remediationFeedback, setRemediationFeedback] = useState<string | null>(null);

  const handleActionClick = (actionName: string) => {
    setRemediationFeedback(`Action Triggered: ${actionName}`);
    setTimeout(() => setRemediationFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FBFDFB] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Clean Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/logo-full-trans.png"
              alt="FinFlow"
              width={160}
              height={44}
              className="h-9 w-auto object-contain"
            />
            <span className="hidden sm:inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
              Enterprise Solution
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#problem" className="hover:text-emerald-700 transition-colors">
              The Problem
            </a>
            <a href="#pain-points" className="hover:text-emerald-700 transition-colors">
              Pain Points
            </a>
            <a href="#real-cost" className="hover:text-emerald-700 transition-colors">
              The Real Cost
            </a>
            <a href="#solution" className="hover:text-emerald-700 transition-colors">
              FinFlow Solution
            </a>
            <a href="#cockpit-preview" className="hover:text-emerald-700 transition-colors">
              Solution Cockpit
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Launch Cockpit</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-100 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs font-bold text-emerald-800 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Invoice Intelligence for SAP & Modern ERPs</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              From data to decisions. <br />
              <span className="text-emerald-600">From delays to action.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Large enterprises process thousands of invoices through ERP systems like SAP, but invoice processing often suffers from hidden bottlenecks, approval delays, missing documents, mismatches, and inefficient manual follow-ups.
            </p>
            <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">
              Although ERP systems store invoice data and workflow statuses, finance teams struggle to understand the real issues behind the delays. <strong>FinFlow bridges this gap</strong> by turning static ERP logs into root-cause intelligence and 1-click remediation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-[0.98]"
              >
                <span>Open Finance Cockpit</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>Upload Invoice CSV</span>
              </button>

              <a
                href="#problem"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors ml-2 py-2"
              >
                <span>Read the Problem Statement</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Quick KPI Strip */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 pt-8">
              <div>
                <p className="text-2xl font-black text-slate-900 tabular-nums">1,248+</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Invoices Tracked Monthly</p>
              </div>
              <div>
                <p className="text-2xl font-black text-rose-600 tabular-nums">5.6 Days</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Avg. Approval Bottleneck</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600 tabular-nums">₹48.75L</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Financial Loss Prevented</p>
              </div>
              <div>
                <p className="text-2xl font-black text-indigo-600 tabular-nums">1-Click</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Automated Remediation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section (Exact Match to Slide 1) */}
      <section id="problem" className="py-20 sm:py-24 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          {/* Header */}
          <div className="max-w-3xl">
            <span className="inline-block rounded-md bg-emerald-100/80 px-2.5 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              The Problem
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Why Traditional ERPs Leave Finance Teams in the Dark
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Large enterprises process thousands of invoices through ERP systems like SAP, but invoice processing often suffers from hidden bottlenecks, approval delays, missing documents, mismatches, and inefficient manual follow-ups.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Although ERP systems store invoice data and workflow statuses, finance teams often struggle to quickly understand the real issues behind the delays.
            </p>
          </div>

          {/* Flow Diagram from Slide 1: Invoices -> ERP -> Finance Team */}
          <div className="mt-10 rounded-2xl bg-slate-50 p-6 sm:p-8 border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white border border-slate-200/80 shadow-subtle">
                <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-3">
                  <FileSpreadsheet className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Invoices</h3>
                <p className="text-xs text-slate-500 mt-0.5">Thousands per month from 100+ vendors</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white border border-slate-200/80 shadow-subtle relative">
                <div className="hidden md:block absolute -left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                  ➔
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-3 font-black text-sm">
                  SAP
                </div>
                <h3 className="text-sm font-bold text-slate-900">ERP System (e.g. SAP S/4HANA)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Stores raw invoice data & workflow status</p>
                <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                  ➔
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-rose-50/40 border border-rose-200/80 shadow-subtle">
                <div className="h-12 w-12 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 mb-3">
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Finance & AP Team</h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">Needs answers, not just passive data</p>
              </div>
            </div>
          </div>

          {/* 3-Column Comparison from Slide 1: SAP S/4HANA vs Pain Points vs What Teams Need */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Col 1: SAP S/4HANA Screen Mockup (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#1C2D42] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-xs">SAP</span>
                  <span className="font-semibold text-xs text-slate-200">S/4HANA • Invoice Processing</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">ERP-PROD-01</span>
              </div>

              <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs">
                <div className="rounded-lg bg-white px-3 py-1.5 border border-slate-200 text-slate-400 text-xs flex items-center justify-between">
                  <span>Search invoice number, vendor...</span>
                  <span className="text-[10px] text-slate-400">Ctrl+F</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Invoice #</th>
                      <th className="px-3.5 py-2.5">Vendor</th>
                      <th className="px-3.5 py-2.5 text-right">Amount</th>
                      <th className="px-3.5 py-2.5">Status</th>
                      <th className="px-3.5 py-2.5 text-center">Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr className="bg-rose-50/30">
                      <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">INV-9021</td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-700">ABC Pvt Ltd</td>
                      <td className="px-3.5 py-2.5 text-right font-bold text-slate-900">₹10,00,000</td>
                      <td className="px-3.5 py-2.5">
                        <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Blocked
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-center text-rose-600 font-bold">5</td>
                    </tr>
                    <tr className="bg-amber-50/30">
                      <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">INV-8845</td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-700">Global Supplies</td>
                      <td className="px-3.5 py-2.5 text-right font-bold text-slate-900">₹5,20,000</td>
                      <td className="px-3.5 py-2.5">
                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Pending
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-center text-amber-600 font-bold">3</td>
                    </tr>
                    <tr className="bg-amber-50/30">
                      <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">INV-7720</td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-700">Tata Motors</td>
                      <td className="px-3.5 py-2.5 text-right font-bold text-slate-900">₹18,75,000</td>
                      <td className="px-3.5 py-2.5">
                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Pending
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-center text-rose-600 font-bold">6</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">INV-6603</td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-700">Reliance Ltd</td>
                      <td className="px-3.5 py-2.5 text-right font-bold text-slate-900">₹7,40,000</td>
                      <td className="px-3.5 py-2.5">
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          In Review
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-center text-slate-600 font-bold">2</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">INV-5518</td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-700">Mahindra & Co</td>
                      <td className="px-3.5 py-2.5 text-right font-bold text-slate-900">₹12,30,000</td>
                      <td className="px-3.5 py-2.5">
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Approved
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-center text-slate-600 font-bold">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-100/50 border-t border-slate-200 text-[11px] text-slate-500">
                <p>
                  <strong>The Limitation:</strong> ERP shows <em>what</em> status an invoice has, but gives no explanation of <em>why</em> it is blocked or who must act.
                </p>
              </div>
            </div>

            {/* Col 2: The Pain Points (4 cols) */}
            <div id="pain-points" className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-rose-500 font-bold text-lg">⚠️</span>
                <h3 className="text-base font-bold text-slate-900">The Pain Points</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Hidden Bottlenecks</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      Invoices get stuck at different stages without clear end-to-end visibility.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Approval Delays</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      Managers are overloaded or unavailable, causing multi-day queue wait times.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileQuestion className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Missing Documents</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      GST certificates, e-way bills, or compliance forms are missing from submission.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Mismatches</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      PO, GRN and invoice details don't match (e.g. tax rates, amounts, line quantities).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Manual Follow-ups</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      Finance teams spend hours chasing vendors and internal approvers via email and calls.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3: What Finance Teams Need (3 cols) */}
            <div className="lg:col-span-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                <h3 className="text-base font-bold text-emerald-950">What Teams Need</h3>
              </div>

              <div className="space-y-2.5">
                {[
                  'Where is the invoice stuck?',
                  'Why is it stuck?',
                  'Who is causing the delay?',
                  'How much financial loss will delay cause?',
                  'Which invoices to prioritize?',
                  'What exact action will resolve it?',
                ].map((question, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-emerald-100 shadow-subtle text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{question}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The Real Cost Banner (Slide 1 Bottom) */}
          <div id="real-cost" className="mt-8 rounded-2xl bg-slate-900 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
                The Real Cost
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
              As a result, companies lose early-payment discounts, incur delay-related costs, waste employee time on manual follow-ups, and experience disruptions in their payment and procurement processes.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Missed Discounts</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Lose 2% early payment incentives, worth tens of lakhs per quarter.
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Delay Costs</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Interest fees, supplier penalty charges, and MSME statutory interest.
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Wasted Time</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Hundreds of hours wasted on phone calls, chasing signatures and spreadsheets.
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <h4 className="text-sm font-bold text-white">Operational Halts</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Supply chain halts, held goods at warehouse, and damaged vendor relations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Gap & The FinFlow Solution Section (Slide 1 Gap + Slide 2 Architecture) */}
      <section id="solution" className="py-20 sm:py-24 border-b border-slate-200/80 bg-[#F8FAF9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                The Gap & Solution
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                From Data to Action — The FinFlow Solution
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Existing ERP dashboards primarily show data and status, but finance teams need actionable intelligence — a system that can analyze the data, identify root causes, quantify the financial impact, and help initiate corrective actions.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 shadow-sm self-start lg:self-auto"
            >
              <span>Explore Interactive Cockpit</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* 4 Steps: From Data to Action */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                  SAP
                </div>
                <span className="text-xs font-bold text-slate-400">Step 01</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Connects to SAP</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Fetches invoice, PO, GRN and approval hierarchy data automatically via enterprise APIs or batch statement uploads.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600">Step 02 • AI</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Analysis (Gemini)</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Detects root causes behind every hold, flags discrepancies, and calculates exact financial loss per delayed day.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-400">Step 03</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Actionable Insights</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Shows clear, plain-English explanations with priority tags instead of confusing cryptic ERP error codes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl bg-white p-6 border border-emerald-300 bg-emerald-50/30 shadow-sm relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-emerald-700">Step 04 • Action</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">1-Click Remediation</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Ping managers, auto-reroute overdue approvals, or request documents directly from the dashboard without writing manual emails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Solution Cockpit Preview (Faithfully Recreating Image 2) */}
      <section id="cockpit-preview" className="py-20 sm:py-24 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block rounded-md bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Interactive Solution Mockup
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              The FinFlow Intelligent Invoice Cockpit
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Here is how FinFlow solves the problem in real-time. Try clicking the 1-Click Remediation buttons below:
            </p>

            {remediationFeedback && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md animate-bounce">
                <Check className="h-4 w-4" />
                <span>{remediationFeedback} (Dispatched via ERP Webhook)</span>
              </div>
            )}
          </div>

          {/* Solution Cockpit Canvas (Recreating Slide 2) */}
          <div className="rounded-3xl border border-slate-200/90 bg-[#F8FAF9] p-4 sm:p-8 shadow-card">
            {/* Top Bar inside Cockpit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Good morning, {user.name.split(' ')[0]} 👋
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Here's what's happening with your invoices today across ERP connections.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 shadow-subtle">
                  📅 Last 30 days
                </span>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
                >
                  + Ingest Invoices
                </button>
              </div>
            </div>

            {/* 4 Key Metric Cards from Slide 2 */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Total Invoices</span>
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 tabular-nums">1,248</span>
                  <span className="text-xs font-bold text-emerald-600">↑ 12% vs last 30d</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Delayed Invoices</span>
                  <Clock className="h-4 w-4 text-rose-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-rose-600 tabular-nums">312</span>
                  <span className="text-xs font-bold text-rose-600">↑ 8% vs last 30d</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Potential Financial Loss</span>
                  <TrendingDown className="h-4 w-4 text-teal-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 tabular-nums">₹ 48,75,000</span>
                  <span className="text-xs font-bold text-emerald-600">↓ 32% vs last 30d</span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>On-Time Payment Rate</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600 tabular-nums">68%</span>
                  <span className="text-xs font-bold text-emerald-600">↑ 18% vs last 30d</span>
                </div>
              </div>
            </div>

            {/* Middle Grid: Funnel & AI Analysis (From Slide 2) */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Funnel: Invoice Flow & Bottlenecks (7 cols) */}
              <div className="lg:col-span-7 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Invoice Flow & Bottlenecks</h4>
                    <p className="text-xs text-slate-500">End-to-end lifecycle throughput</p>
                  </div>
                  <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                    Primary Bottleneck Detected
                  </span>
                </div>

                {/* Funnel Pipeline Steps */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs pb-4 border-b border-slate-100">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <p className="text-[11px] text-slate-400">Received</p>
                    <p className="font-bold text-slate-800">1,248</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <p className="text-[11px] text-slate-400">Verification</p>
                    <p className="font-bold text-slate-800">982</p>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                    <p className="text-[11px] text-rose-700 font-bold">Manager Appr.</p>
                    <p className="font-bold text-rose-700">638 (Stuck)</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50">
                    <p className="text-[11px] text-emerald-700">Payment</p>
                    <p className="font-bold text-emerald-800">421</p>
                  </div>
                </div>

                {/* Bottleneck Callout Box from Slide 2 */}
                <div className="mt-4 rounded-xl bg-rose-50/60 p-4 border border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      <span>Primary Bottleneck: Manager Approval (5.6 days avg.)</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Invoices are delayed due to high manager workload and missing vendor GST tax certificates.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-50 shadow-subtle"
                  >
                    View Details →
                  </button>
                </div>
              </div>

              {/* AI Insights & Root Cause Analysis (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-emerald-200 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-slate-900">AI Root Cause Analysis</h4>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Gemini AI Engine
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs mb-3">
                    <span className="font-bold text-slate-800">Top Issue: Missing GST / Tax Documents (65%)</span>
                    <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">
                      Vendors are not providing required GST certificates and e-way bills, causing invoice holds across AP queues.
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-rose-600">
                      Financial Impact: ₹ 32,40,000 potential loss from delayed payments & missed discounts.
                    </p>
                  </div>

                  {/* 1-Click Remediation Actions */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Recommended 1-Click Actions:
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-200 text-xs">
                      <span className="text-slate-700 font-medium">1. Request docs from 48 vendors</span>
                      <button
                        onClick={() => handleActionClick('Automated Document Request sent to 48 vendors')}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 shadow-sm"
                      >
                        Request Docs
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-200 text-xs">
                      <span className="text-slate-700 font-medium">2. Auto-reroute 112 overdue approvals</span>
                      <button
                        onClick={() => handleActionClick('112 approvals re-routed to secondary leads')}
                        className="rounded-lg bg-teal-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-500 shadow-sm"
                      >
                        Auto-Reroute
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-200 text-xs">
                      <span className="text-slate-700 font-medium">3. Ping Manager A (87 pending)</span>
                      <button
                        onClick={() => handleActionClick('Slack & Email reminder pinged to Manager A')}
                        className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-500 shadow-sm"
                      >
                        Ping Manager
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid: Critical Invoices Table & Financial Impact Breakdown (From Slide 2) */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Critical Invoices Table (7 cols) */}
              <div className="lg:col-span-7 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Critical Invoices — Action Required</h4>
                    <span className="rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-[10px] font-bold">
                      24 Urgent
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Invoice #</th>
                        <th className="py-2.5 px-3">Vendor</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-center">Days</th>
                        <th className="py-2.5 px-3">Issue Reason</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">INV-9021</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">ABC Pvt Ltd</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹10,00,000</td>
                        <td className="py-2.5 px-3 text-center text-rose-600 font-bold">5</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Tax Mismatch (12% vs 18%)
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setActiveTab('dashboard')}
                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">INV-8845</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">Global Supplies</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹5,20,000</td>
                        <td className="py-2.5 px-3 text-center text-amber-600 font-bold">4</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Missing GST Document
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setActiveTab('dashboard')}
                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">INV-7720</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">Tata Motors</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹18,75,000</td>
                        <td className="py-2.5 px-3 text-center text-rose-600 font-bold">6</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Manager Bottleneck
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setActiveTab('dashboard')}
                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">INV-6603</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">Reliance Ltd</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹7,40,000</td>
                        <td className="py-2.5 px-3 text-center text-slate-600 font-bold">3</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                            PO-Invoice Mismatch
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setActiveTab('dashboard')}
                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">INV-5518</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">Mahindra & Co</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹12,30,000</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">2</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Early Payment Discount Expiring
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setActiveTab('dashboard')}
                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                          >
                            Claim
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Impact Breakdown (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Financial Impact Breakdown</h4>
                  <p className="text-xs text-slate-500 mb-4">Total quantified loss exposure: ₹ 48.75 Lakhs</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Missed Early Payment Discounts (41%)</span>
                        <span className="font-bold text-rose-600">₹ 19.98L</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-rose-500 w-[41%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Late Fees & Statutory Penalties (26%)</span>
                        <span className="font-bold text-amber-600">₹ 12.67L</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500 w-[26%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Operational Reconciliation Waste (18%)</span>
                        <span className="font-bold text-indigo-600">₹ 8.77L</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500 w-[18%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Supply Chain Disruptions (15%)</span>
                        <span className="font-bold text-teal-600">₹ 7.33L</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500 w-[15%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Live Cockpit Telemetry</span>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Launch Live Interactive Cockpit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to eliminate invoice bottlenecks?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ingest your current company statement or connect your SAP ERP to detect hold reasons, calculate exact rupee exposure, and remediate in one click.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md active:scale-[0.98]"
            >
              <span>Open FinFlow Cockpit</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-700 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Import Ledger CSV</span>
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo-icon-trans.png"
                alt="FinFlow"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="font-semibold text-slate-400">FinFlow AI • Smarter Finance. Faster Flow.</span>
            </div>
            <p>© 2026 FinFlow Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
