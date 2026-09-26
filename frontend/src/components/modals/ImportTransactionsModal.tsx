'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  Download,
  Database,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  Sparkles,
  Layers,
  Folder,
  FolderPlus,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { Transaction, TransactionCategory } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';

export function ImportTransactionsModal() {
  const {
    isImportModalOpen,
    setIsImportModalOpen,
    importTransactionsBatch,
    user,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    createProject,
  } = useFinFlow();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Omit<Transaction, 'id'>[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('replace');
  const [targetFolderId, setTargetFolderId] = useState<string>(() => {
    return selectedProjectId !== 'ALL' ? selectedProjectId : (projects[0]?.id || 'ALL');
  });

  // State for creating a new project inline from inside the import modal
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectDept, setNewProjectDept] = useState('Operations');
  const [newProjectBudget, setNewProjectBudget] = useState('1000000');

  const handleCreateProjectInline = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = newProjectName.trim();
    if (!trimmedName) return;

    const generatedCode =
      newProjectCode.trim() ||
      `PRJ-${trimmedName.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const created = createProject({
      name: trimmedName,
      code: generatedCode,
      description: `Operational folder for ${trimmedName}`,
      department: newProjectDept,
      allocatedBudget: Number(newProjectBudget) || 1000000,
      color: '#0284C7',
    });

    setTargetFolderId(created.id);
    setIsCreatingProject(false);
    setNewProjectName('');
    setNewProjectCode('');
  };

  React.useEffect(() => {
    if (isImportModalOpen) {
      setTargetFolderId(selectedProjectId !== 'ALL' ? selectedProjectId : (projects[0]?.id || 'ALL'));
    }
  }, [isImportModalOpen, selectedProjectId, projects]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isImportModalOpen) return null;

  // Handle Drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Parse CSV text into Transaction objects
  const parseCSVContent = (text: string) => {
    try {
      setParseError(null);
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        setParseError('The uploaded CSV file is empty or does not contain header and data rows.');
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
      
      const dateIdx = headers.findIndex((h) => h.includes('date'));
      const merchantIdx = headers.findIndex((h) => h.includes('merchant') || h.includes('vendor') || h.includes('payee') || h.includes('description') || h.includes('name'));
      const categoryIdx = headers.findIndex((h) => h.includes('category') || h.includes('department'));
      const typeIdx = headers.findIndex((h) => h.includes('type') || h.includes('direction') || h.includes('credit/debit'));
      const amountIdx = headers.findIndex((h) => h.includes('amount') || h.includes('total') || h.includes('inr') || h.includes('value'));
      const noteIdx = headers.findIndex((h) => h.includes('note') || h.includes('po') || h.includes('reference') || h.includes('memo'));

      if (amountIdx === -1) {
        setParseError('Could not find an "Amount" or "Total" column in CSV headers.');
        return;
      }

      const transactions: Omit<Transaction, 'id'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Robust CSV row splitter that accounts for quotes
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        if (!row || row.length === 0) continue;

        const cleanVal = (val?: string) => (val ? val.replace(/^["']|["']$/g, '').trim() : '');

        const rawAmount = cleanVal(row[amountIdx]).replace(/[₹$,\s]/g, '');
        const numAmount = Math.abs(parseFloat(rawAmount) || 0);
        if (isNaN(numAmount) || numAmount === 0) continue;

        let inferredType: 'INCOME' | 'EXPENSE' = 'EXPENSE';
        if (typeIdx !== -1) {
          const rawType = cleanVal(row[typeIdx]).toUpperCase();
          if (rawType.includes('INC') || rawType.includes('CREDIT') || rawType.includes('INFLOW')) {
            inferredType = 'INCOME';
          }
        } else if (cleanVal(row[amountIdx]).startsWith('+')) {
          inferredType = 'INCOME';
        }

        const rawDate = dateIdx !== -1 ? cleanVal(row[dateIdx]) : new Date().toISOString().slice(0, 10);
        const rawMerchant = merchantIdx !== -1 ? cleanVal(row[merchantIdx]) : `Vendor Record #${i}`;
        const rawCat = (categoryIdx !== -1 ? cleanVal(row[categoryIdx]) : 'Other') as TransactionCategory;
        const rawNote = noteIdx !== -1 ? cleanVal(row[noteIdx]) : undefined;

        transactions.push({
          merchant: rawMerchant || 'Enterprise Payable',
          category: rawCat || 'Other',
          amount: numAmount,
          type: inferredType,
          date: rawDate || new Date().toISOString().slice(0, 10),
          status: 'Completed',
          account: 'HDFC Corporate Treasury',
          note: rawNote,
        });
      }

      if (transactions.length === 0) {
        setParseError('No valid transaction records could be parsed from this file.');
        return;
      }

      setParsedRows(transactions);
    } catch (err: any) {
      setParseError(`Failed to parse CSV file: ${err.message}`);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCSVContent(content);
    };
    reader.readAsText(file);
  };

  // Generate and download sample template
  const handleDownloadSample = () => {
    const sampleCSV = `Date,Merchant,Category,Type,Amount,Status,Note
2026-09-20,"AWS Cloud Infrastructure","Utilities",EXPENSE,48500,"Completed","PO-2026-1049 - Monthly Cloud Hosting"
2026-09-21,"Google Workspace Enterprise","Utilities",EXPENSE,14200,"Completed","PO-2026-1050 - 142 Active Licenses"
2026-09-22,"Razorpay Client Settlement","Salary & Bonus",INCOME,450000,"Completed","INV-2026-902 - B2B SaaS Enterprise Inflow"
2026-09-23,"Tata Power Solar & Electricity","Utilities",EXPENSE,8900,"Completed","PO-2026-1051 - Head Office Energy"
2026-09-24,"Salesforce CRM Enterprise","Utilities",EXPENSE,62000,"Completed","PO-2026-1052 - Annual Renewal"
2026-09-25,"Godrej Commercial Park","Housing",EXPENSE,95000,"Completed","PO-2026-1053 - Bangalore Tech Campus Lease"
2026-09-26,"Deloitte Tax & Statutory Audit","Other",EXPENSE,120000,"Completed","PO-2026-1054 - Q2 Statutory Compliance"`;

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'FinFlow_Sample_Enterprise_Transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1-Click Load Enterprise Demo Batch (1,250 Invoices & Transactions)
  const handleLoadEnterpriseBatch = () => {
    const enterpriseVendors = [
      { name: 'Amazon Web Services (AWS AP-South)', cat: 'Utilities', min: 12000, max: 95000, type: 'EXPENSE' },
      { name: 'Microsoft Azure Cloud Computing', cat: 'Utilities', min: 18000, max: 64000, type: 'EXPENSE' },
      { name: 'Stripe Global Enterprise Settlement', cat: 'Salary & Bonus', min: 150000, max: 650000, type: 'INCOME' },
      { name: 'RazorpayX Corporate Vendor Payout', cat: 'Other', min: 8000, max: 45000, type: 'EXPENSE' },
      { name: 'Dell Technologies India (Server Blades)', cat: 'Shopping', min: 85000, max: 320000, type: 'EXPENSE' },
      { name: 'Godrej Millennium Tech Park Lease', cat: 'Housing', min: 75000, max: 180000, type: 'EXPENSE' },
      { name: 'Salesforce Enterprise Cloud Licenses', cat: 'Utilities', min: 25000, max: 80000, type: 'EXPENSE' },
      { name: 'Deloitte Touche Tohmatsu Audit', cat: 'Other', min: 50000, max: 200000, type: 'EXPENSE' },
      { name: 'Zerodha Broking Treasury Dividend', cat: 'Investments', min: 45000, max: 250000, type: 'INCOME' },
      { name: 'Uber for Business Corporate Commute', cat: 'Transportation', min: 1200, max: 7500, type: 'EXPENSE' },
      { name: 'Blue Tokai Corporate Catering Service', cat: 'Dining & Drinks', min: 3500, max: 15000, type: 'EXPENSE' },
      { name: 'Tata Communications Leased Fiber Line', cat: 'Utilities', min: 14000, max: 38000, type: 'EXPENSE' },
    ];

    const batch: Omit<Transaction, 'id'>[] = [];
    const count = 1250;

    for (let i = 1; i <= count; i++) {
      const template = enterpriseVendors[Math.floor(Math.random() * enterpriseVendors.length)];
      const amount = Math.floor(Math.random() * (template.max - template.min) + template.min);
      const dayOffset = Math.floor(Math.random() * 30);
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - dayOffset);
      const dateStr = dateObj.toISOString().slice(0, 10);

      batch.push({
        merchant: `${template.name} #${i}`,
        category: template.cat as TransactionCategory,
        type: template.type as 'INCOME' | 'EXPENSE',
        amount,
        date: dateStr,
        status: 'Completed',
        account: 'HDFC Corporate Treasury',
        note: `SAP-INVOICE-2026-${1000 + i} [Batch Ingestion]`,
      });
    }

    setSelectedFile({
      name: 'SAP_S4HANA_Q3_Invoices_1250_Batch.csv',
      size: 148200,
    } as File);
    setParsedRows(batch);
    setParseError(null);
  };

  // Ingest batch to ledger
  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    // Smooth progressive loader
    for (let p = 10; p <= 100; p += 20) {
      setImportProgress(p);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    const sourceName = selectedFile?.name || 'Uploaded Invoice CSV';
    const finalFolderId = targetFolderId === 'ALL' ? undefined : targetFolderId;
    importTransactionsBatch(parsedRows, importMode, sourceName, finalFolderId);
    if (finalFolderId) {
      setSelectedProjectId(finalFolderId);
    }

    setIsProcessing(false);
    setIsSuccess(true);

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#6EE7B7', '#3B82F6'],
    });

    setTimeout(() => {
      setIsImportModalOpen(false);
      setIsSuccess(false);
      setSelectedFile(null);
      setParsedRows([]);
      setImportProgress(0);
    }, 1200);
  };

  const totalInflows = parsedRows
    .filter((r) => r.type === 'INCOME')
    .reduce((acc, c) => acc + c.amount, 0);

  const totalOutflows = parsedRows
    .filter((r) => r.type === 'EXPENSE')
    .reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 shadow-2xs">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                Import Transaction Ledger (Bulk CSV)
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200/60">
                  Enterprise Scale
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload batch records from SAP, RazorpayX, Stripe, or HDFC NetBanking
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsImportModalOpen(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Preset Buttons & Sample Template Helper */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">Quick Testing:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadEnterpriseBatch}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Load 1,250 Invoices Batch</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSample}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Sample CSV Template</span>
              </button>
            </div>
          </div>

          {/* Target Project / Folder Selector */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Folder className="h-4 w-4 text-emerald-600" />
                <span>Destination Project / Entity Folder:</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingProject(!isCreatingProject)}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>{isCreatingProject ? 'Close Creator' : '+ New Project Folder'}</span>
              </button>
            </div>

            <div className="relative">
              <select
                value={targetFolderId}
                onChange={(e) => {
                  if (e.target.value === '__CREATE_NEW__') {
                    setIsCreatingProject(true);
                  } else {
                    setTargetFolderId(e.target.value);
                  }
                }}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">🏢 All Projects / Consolidated General Ledger</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    📁 {proj.code} — {proj.name} ({proj.department})
                  </option>
                ))}
                <option value="__CREATE_NEW__">➕ + Create New Project Folder...</option>
              </select>
            </div>

            {/* Inline Project Creation Form */}
            {isCreatingProject && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-3.5 space-y-3 animate-fadeIn shadow-2xs">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FolderPlus className="h-3.5 w-3.5 text-emerald-600" />
                    Create New Project Folder
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Quick On-the-Fly Setup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Project / Entity Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q4 Logistics Expansion"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Project Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PRJ-LOGIS (optional)"
                      value={newProjectCode}
                      onChange={(e) => setNewProjectCode(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={newProjectDept}
                      onChange={(e) => setNewProjectDept(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR & Legal">HR & Legal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Allocated Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={newProjectBudget}
                      onChange={(e) => setNewProjectBudget(e.target.value)}
                      placeholder="1000000"
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingProject(false);
                      setNewProjectName('');
                      setNewProjectCode('');
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!newProjectName.trim()}
                    onClick={handleCreateProjectInline}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>Create & Select Folder</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drag & Drop Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-card border border-slate-100 mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>

              {selectedFile ? (
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    ✓ {parsedRows.length.toLocaleString()} rows successfully detected and parsed
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click or drag another file to replace
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to browse or drag and drop your ledger CSV
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports columns: Date, Merchant/Vendor, Category, Type, Amount, Note/PO
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {parseError && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Parsed Preview Section */}
          {parsedRows.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900">
                    Previewing {Math.min(5, parsedRows.length)} of {parsedRows.length.toLocaleString()} Entries
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    +{formatCurrency(totalInflows, user.currency)}
                  </span>
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                    -{formatCurrency(totalOutflows, user.currency)}
                  </span>
                </div>
              </div>

              {/* Mini Preview Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Vendor / Merchant</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{row.date}</td>
                        <td className="px-3 py-2 font-medium text-slate-900 truncate max-w-[180px]">
                          {row.merchant}
                        </td>
                        <td className="px-3 py-2">
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              row.type === 'INCOME'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold">
                          {row.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(row.amount, user.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Ingestion Mode Choice */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Append to existing ledger</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Replace current ledger</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Ingesting into financial ledger...</span>
                <span>{importProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(false)}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={parsedRows.length === 0 || isProcessing}
            onClick={handleExecuteImport}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-2xs ${
              parsedRows.length === 0 || isProcessing
                ? 'bg-slate-300 cursor-not-allowed'
                : isSuccess
                ? 'bg-slate-900'
                : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Ingesting Records...</span>
              </>
            ) : isSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Ingestion Complete!</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                <span>
                  Confirm & Ingest {parsedRows.length > 0 ? `${parsedRows.length.toLocaleString()} Entries` : ''}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
