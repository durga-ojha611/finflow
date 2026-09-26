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
  ChevronDown,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { Transaction, TransactionCategory } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RawCSVRow {
  [key: string]: string;
}

interface ColumnMapping {
  dateCol: string;
  merchantCol: string;
  categoryCol: string;
  typeCol: string;
  amountCol: string;
  noteCol: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse a CSV string into headers + raw rows (handles quoted fields) */
function parseRawCSV(text: string): { headers: string[]; rows: RawCSVRow[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.replace(/^["']|["']$/g, '').trim());
  const rows: RawCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.every((c) => c === '')) continue;
    const row: RawCSVRow = {};
    headers.forEach((h, idx) => { row[h] = (cols[idx] ?? '').replace(/^["']|["']$/g, '').trim(); });
    rows.push(row);
  }

  return { headers, rows };
}

/** Auto-guess best column mapping from headers — covers SAP/ERP/bank CSV formats */
function autoGuessMapping(headers: string[]): ColumnMapping {
  // Priority-ordered keyword match: scans headers array, returns FIRST header that matches ANY keyword
  const find = (...keywords: string[]) =>
    headers.find((h) => keywords.some((kw) => h.toLowerCase() === kw.toLowerCase() || h.toLowerCase().includes(kw.toLowerCase()))) ?? '';

  return {
    // Date: ONLY match genuine date columns — do NOT include 'invoice' (would wrongly match invoiceId)
    dateCol: find('date', 'valuedate', 'transactiondate', 'txndate', 'receiveddate', 'postdate', 'posteddate', 'approvaldate', 'completeddate', 'time', 'period'),

    // Merchant: vendorName is listed FIRST so it takes priority over generic 'name' columns
    // Full multi-word names are preserved — parser splits ONLY on commas, not spaces
    merchantCol: find('vendorname', 'vendor', 'merchant', 'payee', 'beneficiary', 'counterparty', 'party', 'narration', 'particulars', 'name', 'description'),

    // Category: covers ERP department, SAP stage/status, account head etc.
    categoryCol: find('category', 'department', 'dept', 'currentstage', 'stage', 'saprawstatus', 'documentstatus', 'head', 'accounttype', 'ledger', 'section'),

    // Type: covers SAP credit/debit flag, bank Dr/Cr, transaction direction
    typeCol: find('txntype', 'transactiontype', 'type', 'direction', 'credit/debit', 'dr/cr', 'drcr', 'drcrflag', 'flow', 'mode'),

    // Amount: grossAmount / netAmount come FIRST to take priority over generic 'amount'
    amountCol: find('grossamount', 'netamount', 'amount', 'total', 'value', 'sum', 'price', 'net', 'inr', 'debitamount', 'creditamount'),

    // Note/Reference: poNumber listed before invoiceid so PO takes priority as note
    noteCol: find('ponumber', 'invoiceid', 'referenceno', 'refno', 'reference', 'po', 'memo', 'remarks', 'note', 'narration', 'description', 'particulars'),
  };
}

/** Convert raw rows + mapping into Transaction objects */
function mapToTransactions(rows: RawCSVRow[], mapping: ColumnMapping, headers: string[]): Omit<Transaction, 'id'>[] {
  const result: Omit<Transaction, 'id'>[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // ── Amount: try mapped col, then scan all cols for first numeric value ──
    let rawAmountStr = mapping.amountCol ? row[mapping.amountCol] ?? '' : '';
    if (!rawAmountStr) {
      for (const h of headers) {
        const v = (row[h] ?? '').replace(/[₹$,\s]/g, '');
        if (!isNaN(parseFloat(v)) && parseFloat(v) !== 0) { rawAmountStr = row[h] ?? ''; break; }
      }
    }
    const cleanAmt = rawAmountStr.replace(/[₹$,\s]/g, '');
    const numAmount = Math.abs(parseFloat(cleanAmt) || 0);
    if (isNaN(numAmount) || numAmount === 0) continue;

    // ── Type: credit/debit inference ──
    let inferredType: 'INCOME' | 'EXPENSE' = 'EXPENSE';
    if (mapping.typeCol && row[mapping.typeCol]) {
      const rawType = row[mapping.typeCol].toUpperCase();
      if (rawType.includes('INC') || rawType.includes('CREDIT') || rawType.includes('CR') || rawType.includes('INFLOW') || rawType === 'IN') {
        inferredType = 'INCOME';
      }
    } else if (rawAmountStr.startsWith('+')) {
      inferredType = 'INCOME';
    }

    // ── Date ──
    const rawDate = mapping.dateCol && row[mapping.dateCol]
      ? row[mapping.dateCol]
      : new Date().toISOString().slice(0, 10);

    // ── Merchant: full multi-word name (parser no longer splits on spaces) ──
    const rawMerchant = mapping.merchantCol && row[mapping.merchantCol]
      ? row[mapping.merchantCol]            // e.g. "Power Grid Corp" — full name preserved
      : `Record #${i + 1}`;

    // ── Category: use mapped col value; fallback to department/stage/status if empty ──
    let rawCat = mapping.categoryCol && row[mapping.categoryCol]
      ? row[mapping.categoryCol]
      : '';

    if (!rawCat) {
      // Fallback: try common ERP/SAP columns that carry category-like info
      const fallbackKeys = headers.filter((h) =>
        ['department', 'dept', 'stage', 'status', 'currentstage', 'saprawstatus', 'documentstatus', 'section', 'head']
          .some((kw) => h.toLowerCase().includes(kw))
      );
      for (const fk of fallbackKeys) {
        if (row[fk]) { rawCat = row[fk]; break; }
      }
    }
    if (!rawCat) rawCat = 'Other';

    // ── Note ──
    const rawNote = mapping.noteCol && row[mapping.noteCol]
      ? row[mapping.noteCol]
      : undefined;

    result.push({
      merchant: rawMerchant || `Record #${i + 1}`,
      category: rawCat as TransactionCategory,
      amount: numAmount,
      type: inferredType,
      date: rawDate || new Date().toISOString().slice(0, 10),
      status: 'Completed',
      account: 'Imported',
      note: rawNote,
    });
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ImportTransactionsModal() {
  const {
    isImportModalOpen, setIsImportModalOpen, importTransactionsBatch,
    user, projects, selectedProjectId, setSelectedProjectId, createProject,
  } = useFinFlow();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRawRows, setCsvRawRows] = useState<RawCSVRow[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({ dateCol: '', merchantCol: '', categoryCol: '', typeCol: '', amountCol: '', noteCol: '' });
  const [showMapping, setShowMapping] = useState(false);
  const [parsedRows, setParsedRows] = useState<Omit<Transaction, 'id'>[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('replace');
  const [targetFolderId, setTargetFolderId] = useState<string>(() =>
    selectedProjectId !== 'ALL' ? selectedProjectId : (projects[0]?.id || 'ALL')
  );
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectDept, setNewProjectDept] = useState('Operations');
  const [newProjectBudget, setNewProjectBudget] = useState('1000000');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateProjectInline = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = newProjectName.trim();
    if (!trimmedName) return;
    const generatedCode = newProjectCode.trim() || `PRJ-${trimmedName.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const created = createProject({ name: trimmedName, code: generatedCode, description: `Operational folder for ${trimmedName}`, department: newProjectDept, allocatedBudget: Number(newProjectBudget) || 1000000, color: '#0284C7' });
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

  if (!isImportModalOpen) return null;

  const applyMapping = (newMapping: ColumnMapping) => {
    setMapping(newMapping);
    if (csvRawRows.length > 0) {
      const transactions = mapToTransactions(csvRawRows, newMapping, csvHeaders);
      setParsedRows(transactions);
      setParseError(transactions.length === 0 ? 'No valid records with current mapping. Adjust the Amount column.' : null);
    }
  };

  const processCSVContent = (text: string) => {
    setParseError(null);
    const { headers, rows } = parseRawCSV(text);
    if (headers.length === 0 || rows.length === 0) { setParseError('CSV file is empty or has no data rows.'); return; }
    const hasNumericCol = headers.some((h) => rows.slice(0, 5).some((r) => !isNaN(parseFloat((r[h] ?? '').replace(/[₹$,\s]/g, '')))));
    if (!hasNumericCol) { setParseError('Could not detect any numeric Amount column. Please check your CSV file.'); return; }
    setCsvHeaders(headers);
    setCsvRawRows(rows);
    const guessed = autoGuessMapping(headers);
    setMapping(guessed);
    const transactions = mapToTransactions(rows, guessed, headers);
    if (transactions.length === 0) setParseError('No valid records could be parsed. Please map columns manually.');
    setParsedRows(transactions);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelected(e.dataTransfer.files[0]);
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file); setCsvHeaders([]); setCsvRawRows([]); setParsedRows([]); setParseError(null); setShowMapping(false);
    const reader = new FileReader();
    reader.onload = (event) => processCSVContent(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const sampleCSV = `Date,Merchant,Category,Type,Amount,Note
2026-09-20,AWS Cloud Infrastructure,Utilities,EXPENSE,48500,PO-2026-1049
2026-09-21,Google Workspace Enterprise,Utilities,EXPENSE,14200,PO-2026-1050
2026-09-22,Razorpay Client Settlement,Salary & Bonus,INCOME,450000,INV-2026-902
2026-09-23,Tata Power Solar,Utilities,EXPENSE,8900,PO-2026-1051
2026-09-24,Salesforce CRM Enterprise,Utilities,EXPENSE,62000,PO-2026-1052`;
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.setAttribute('download', 'FinFlow_Sample_Transactions.csv');
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleLoadEnterpriseBatch = () => {
    const vendors = [
      { name: 'Amazon Web Services (AWS AP-South)', cat: 'Utilities', min: 12000, max: 95000, type: 'EXPENSE' },
      { name: 'Microsoft Azure Cloud Computing', cat: 'Utilities', min: 18000, max: 64000, type: 'EXPENSE' },
      { name: 'Stripe Global Enterprise Settlement', cat: 'Salary & Bonus', min: 150000, max: 650000, type: 'INCOME' },
      { name: 'RazorpayX Corporate Vendor Payout', cat: 'Other', min: 8000, max: 45000, type: 'EXPENSE' },
      { name: 'Dell Technologies India', cat: 'Shopping', min: 85000, max: 320000, type: 'EXPENSE' },
      { name: 'Godrej Millennium Tech Park Lease', cat: 'Housing', min: 75000, max: 180000, type: 'EXPENSE' },
      { name: 'Salesforce Enterprise Cloud Licenses', cat: 'Utilities', min: 25000, max: 80000, type: 'EXPENSE' },
      { name: 'Deloitte Touche Tohmatsu Audit', cat: 'Other', min: 50000, max: 200000, type: 'EXPENSE' },
      { name: 'Zerodha Broking Treasury Dividend', cat: 'Investments', min: 45000, max: 250000, type: 'INCOME' },
      { name: 'Uber for Business Corporate Commute', cat: 'Transportation', min: 1200, max: 7500, type: 'EXPENSE' },
      { name: 'Blue Tokai Corporate Catering', cat: 'Dining & Drinks', min: 3500, max: 15000, type: 'EXPENSE' },
      { name: 'Tata Communications Leased Fiber', cat: 'Utilities', min: 14000, max: 38000, type: 'EXPENSE' },
    ];
    const batch: Omit<Transaction, 'id'>[] = [];
    for (let i = 1; i <= 1250; i++) {
      const t = vendors[Math.floor(Math.random() * vendors.length)];
      const amount = Math.floor(Math.random() * (t.max - t.min) + t.min);
      const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 30));
      batch.push({ merchant: `${t.name} #${i}`, category: t.cat as TransactionCategory, type: t.type as 'INCOME' | 'EXPENSE', amount, date: d.toISOString().slice(0, 10), status: 'Completed', account: 'HDFC Corporate Treasury', note: `SAP-INVOICE-2026-${1000 + i}` });
    }
    setSelectedFile({ name: 'SAP_S4HANA_Q3_Invoices_1250_Batch.csv', size: 148200 } as File);
    setCsvHeaders([]); setCsvRawRows([]); setParsedRows(batch); setParseError(null); setShowMapping(false);
  };

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);
    for (let p = 10; p <= 100; p += 20) { setImportProgress(p); await new Promise((r) => setTimeout(r, 80)); }
    const sourceName = selectedFile?.name || 'Uploaded Invoice CSV';
    const finalFolderId = targetFolderId === 'ALL' ? undefined : targetFolderId;
    importTransactionsBatch(parsedRows, importMode, sourceName, finalFolderId);
    if (finalFolderId) setSelectedProjectId(finalFolderId);
    setIsProcessing(false); setIsSuccess(true);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors: ['#10B981', '#34D399', '#6EE7B7', '#3B82F6'] });
    setTimeout(() => { setIsImportModalOpen(false); setIsSuccess(false); setSelectedFile(null); setParsedRows([]); setCsvHeaders([]); setCsvRawRows([]); setImportProgress(0); }, 1200);
  };

  const totalInflows = parsedRows.filter((r) => r.type === 'INCOME').reduce((a, c) => a + c.amount, 0);
  const totalOutflows = parsedRows.filter((r) => r.type === 'EXPENSE').reduce((a, c) => a + c.amount, 0);

  const ColSelect = ({ label, value, field, optional }: { label: string; value: string; field: keyof ColumnMapping; optional?: boolean }) => (
    <div>
      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
        {label} {optional && <span className="text-slate-400 font-normal">(optional)</span>}
      </label>
      <select
        value={value}
        onChange={(e) => applyMapping({ ...mapping, [field]: e.target.value })}
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        <option value="">— Not Mapped —</option>
        {csvHeaders.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                Import Transaction Ledger (Bulk CSV)
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200/60">
                  Universal Parser
                </span>
              </h2>
              <p className="text-xs text-slate-500">Any CSV format — all columns auto-detected &amp; shown</p>
            </div>
          </div>
          <button onClick={() => setIsImportModalOpen(false)} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Quick actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">Quick Testing:</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleLoadEnterpriseBatch} className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm">
                <Sparkles className="h-3.5 w-3.5" /><span>Load 1,250 Invoices Batch</span>
              </button>
              <button type="button" onClick={handleDownloadSample} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors">
                <Download className="h-3.5 w-3.5 text-slate-500" /><span>Sample CSV Template</span>
              </button>
            </div>
          </div>

          {/* Target project */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Folder className="h-4 w-4 text-emerald-600" /><span>Destination Project / Entity Folder:</span>
              </label>
              <button type="button" onClick={() => setIsCreatingProject(!isCreatingProject)} className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
                <FolderPlus className="h-3.5 w-3.5" /><span>{isCreatingProject ? 'Close Creator' : '+ New Project Folder'}</span>
              </button>
            </div>

            {projects.length === 0 && !isCreatingProject && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <p className="text-xs font-bold text-amber-900">No custom project folder created yet</p>
                  <p className="text-[11px] text-amber-700">Create a project folder first so uploaded invoices are mapped to your workspace.</p>
                </div>
                <button type="button" onClick={() => setIsCreatingProject(true)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0 cursor-pointer">
                  + Create Project Folder
                </button>
              </div>
            )}

            <div className="relative">
              <select value={targetFolderId} onChange={(e) => { if (e.target.value === '__CREATE_NEW__') setIsCreatingProject(true); else setTargetFolderId(e.target.value); }} className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer">
                <option value="ALL">🏢 All Projects / Consolidated General Ledger</option>
                {projects.map((proj) => <option key={proj.id} value={proj.id}>📁 {proj.code} — {proj.name} ({proj.department})</option>)}
                <option value="__CREATE_NEW__">➕ + Create New Project Folder...</option>
              </select>
            </div>

            {isCreatingProject && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-3.5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><FolderPlus className="h-3.5 w-3.5 text-emerald-600" />Create New Project Folder</span>
                  <span className="text-[10px] text-slate-500 font-medium">Quick On-the-Fly Setup</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project / Entity Name <span className="text-rose-500">*</span></label>
                    <input type="text" required placeholder="e.g. Q4 Logistics Expansion" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Code</label>
                    <input type="text" placeholder="e.g. PRJ-LOGIS (optional)" value={newProjectCode} onChange={(e) => setNewProjectCode(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                    <select value={newProjectDept} onChange={(e) => setNewProjectDept(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option>Operations</option><option>Engineering</option><option>Finance</option><option>Marketing</option><option>Sales</option><option>HR &amp; Legal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Allocated Budget (₹)</label>
                    <input type="number" value={newProjectBudget} onChange={(e) => setNewProjectBudget(e.target.value)} placeholder="1000000" className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button type="button" onClick={() => { setIsCreatingProject(false); setNewProjectName(''); setNewProjectCode(''); }} className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
                  <button type="button" disabled={!newProjectName.trim()} onClick={handleCreateProjectInline} className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer">
                    <FolderPlus className="h-3.5 w-3.5" /><span>Create &amp; Select Folder</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drag & Drop */}
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${dragActive ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]' : selectedFile ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'}`}
          >
            <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt" onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])} className="hidden" />
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md border border-slate-100 mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    ✓ {csvHeaders.length > 0 ? `${csvHeaders.length} columns detected · ` : ''}{parsedRows.length.toLocaleString()} rows parsed
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Click or drag another file to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-slate-800">Click to browse or drag &amp; drop your ledger CSV</p>
                  <p className="text-xs text-slate-400 mt-1">Any CSV format — all columns auto-detected &amp; displayed</p>
                </div>
              )}
            </div>
          </div>

          {/* Detected Headers Badge Strip */}
          {csvHeaders.length > 0 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  {csvHeaders.length} Columns Detected in Your CSV
                </span>
                <button type="button" onClick={() => setShowMapping(!showMapping)} className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-white border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  <RefreshCw className="h-3 w-3" />
                  {showMapping ? 'Hide Mapping' : 'Edit Column Mapping'}
                  <ChevronDown className={`h-3 w-3 transition-transform ${showMapping ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {csvHeaders.map((h) => {
                  const isMapped = Object.values(mapping).includes(h);
                  return (
                    <span key={h} className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${isMapped ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-600 border-slate-200'}`}>
                      {h}
                    </span>
                  );
                })}
              </div>
              <p className="text-[10px] text-blue-700">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1 align-middle" />
                Green = mapped to a field &nbsp;|&nbsp; White = present in CSV but not mapped
              </p>
            </div>
          )}

          {/* Column Mapping UI */}
          {showMapping && csvHeaders.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <p className="text-xs font-bold text-slate-800">Map CSV Columns → FinFlow Fields</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ColSelect label="📅 Date" value={mapping.dateCol} field="dateCol" />
                <ColSelect label="🏪 Merchant / Vendor" value={mapping.merchantCol} field="merchantCol" />
                <ColSelect label="🏷️ Category" value={mapping.categoryCol} field="categoryCol" optional />
                <ColSelect label="↕️ Type (Income/Expense)" value={mapping.typeCol} field="typeCol" optional />
                <ColSelect label="💰 Amount *" value={mapping.amountCol} field="amountCol" />
                <ColSelect label="📝 Note / Reference" value={mapping.noteCol} field="noteCol" optional />
              </div>
              <p className="text-[10px] text-slate-500">* Amount is required. Date &amp; Merchant are strongly recommended.</p>
            </div>
          )}

          {/* Error */}
          {parseError && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" /><span>{parseError}</span>
            </div>
          )}

          {/* Preview section */}
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
                  <span className="text-emerald-700 font-bold flex items-center gap-1"><ArrowUpRight className="h-3.5 w-3.5" />+{formatCurrency(totalInflows, user.currency)}</span>
                  <span className="text-rose-600 font-bold flex items-center gap-1"><ArrowDownLeft className="h-3.5 w-3.5" />-{formatCurrency(totalOutflows, user.currency)}</span>
                </div>
              </div>

              {/* Raw CSV preview — ALL detected columns */}
              {csvRawRows.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white">
                  <p className="text-[10px] font-semibold text-blue-700 px-3 pt-2 pb-1 border-b border-blue-50 bg-blue-50/50">
                    Raw CSV Preview — All {csvHeaders.length} columns from your file
                  </p>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        {csvHeaders.map((h) => (
                          <th key={h} className="px-3 py-2 whitespace-nowrap">
                            {h}{Object.values(mapping).includes(h) && <span className="ml-1 text-emerald-600">✓</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {csvRawRows.slice(0, 5).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          {csvHeaders.map((h) => (
                            <td key={h} className="px-3 py-2 max-w-[160px] truncate text-[11px]">
                              {row[h] || <span className="text-slate-300">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mapped preview */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <p className="text-[10px] font-semibold text-slate-600 px-3 pt-2 pb-1 border-b border-slate-100 bg-slate-50/80">
                  Mapped Transaction Preview (how it will be saved)
                </p>
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
                        <td className="px-3 py-2 font-medium text-slate-900 truncate max-w-[160px]">{row.merchant}</td>
                        <td className="px-3 py-2"><span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">{row.category}</span></td>
                        <td className="px-3 py-2"><span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${row.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{row.type}</span></td>
                        <td className="px-3 py-2 text-right font-mono font-bold">{row.type === 'INCOME' ? '+' : '-'}{formatCurrency(row.amount, user.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Import mode */}
              <div className="flex items-center gap-4 text-xs pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                  <input type="radio" name="importMode" checked={importMode === 'append'} onChange={() => setImportMode('append')} className="text-emerald-600 focus:ring-emerald-500" />
                  <span>Append to existing ledger</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                  <input type="radio" name="importMode" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} className="text-emerald-600 focus:ring-emerald-500" />
                  <span>Replace current ledger</span>
                </label>
              </div>
            </div>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Ingesting into financial ledger...</span><span>{importProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-emerald-500 transition-all duration-150" style={{ width: `${importProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between shrink-0">
          <button type="button" onClick={() => setIsImportModalOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedRows.length === 0 || isProcessing}
            onClick={handleExecuteImport}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-sm ${parsedRows.length === 0 || isProcessing ? 'bg-slate-300 cursor-not-allowed' : isSuccess ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98]'}`}
          >
            {isProcessing ? (<><Loader2 className="h-4 w-4 animate-spin" /><span>Ingesting Records...</span></>) :
             isSuccess ? (<><Check className="h-4 w-4" /><span>Ingestion Complete!</span></>) :
             (<><UploadCloud className="h-4 w-4" /><span>Confirm &amp; Ingest {parsedRows.length > 0 ? `${parsedRows.length.toLocaleString()} Entries` : ''}</span></>)}
          </button>
        </div>
      </div>
    </div>
  );
}
