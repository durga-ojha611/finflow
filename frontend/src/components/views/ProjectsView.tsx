'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  FolderOpen,
  UploadCloud,
  ArrowRight,
  X,
  Trash2,
} from 'lucide-react';
import { useFinFlow } from '../../context/FinFlowContext';
import { formatCurrency } from '../../lib/utils';

export function ProjectsView() {
  const {
    projects,
    createProject,
    deleteProject,
    selectedProjectId,
    setSelectedProjectId,
    setActiveTab,
    setIsImportModalOpen,
    allTransactions,
    user,
  } = useFinFlow();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Engineering & IT');
  const [allocatedBudget, setAllocatedBudget] = useState(1500000);
  const [color, setColor] = useState('#0284C7');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject({
      name: name.trim(),
      code: code.trim() || `PRJ-${Date.now().toString().slice(-4)}`,
      description: description.trim() || 'Enterprise operational invoice folder',
      department,
      allocatedBudget: Number(allocatedBudget) || 1000000,
      color,
    });

    setName('');
    setCode('');
    setDescription('');
    setIsCreateOpen(false);
  };

  const handleOpenFolder = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveTab('dashboard');
  };

  const handleUploadToFolder = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsImportModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-subtle border border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Project & Invoice Folders</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {projects.length} Active Folders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Segment invoice ingestion, budget guardrails, and cash flow analysis by projects, business units, or SAP workstreams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedProjectId !== 'ALL' && (
            <button
              onClick={() => setSelectedProjectId('ALL')}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Reset to All Entities
            </button>
          )}

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Project Folder</span>
          </button>
        </div>
      </div>

      {/* Global vs Scoped Mode Callout */}
      {selectedProjectId !== 'ALL' && (
        <div className="rounded-2xl bg-slate-100/90 border border-slate-200/80 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              📁
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Active Project Scope:{' '}
                {projects.find((p) => p.id === selectedProjectId)?.name || selectedProjectId}
              </p>
              <p className="text-[11px] text-slate-500">
                All dashboard KPIs, cash flow graphs, and recent transactions are currently scoped to this project folder.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedProjectId('ALL')}
            className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Clear Filter (Show All)
          </button>
        </div>
      )}

      {/* Project Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((folder) => {
          const folderTransactions = allTransactions.filter((t) => t.projectId === folder.id);
          const totalSpend = folderTransactions
            .filter((t) => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);
          const totalInflow = folderTransactions
            .filter((t) => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);
          const pct = Math.min(
            100,
            folder.allocatedBudget > 0
              ? Math.round((totalSpend / folder.allocatedBudget) * 100)
              : 0
          );
          const isSelected = selectedProjectId === folder.id;

          return (
            <div
              key={folder.id}
              className={`rounded-2xl bg-white p-6 shadow-subtle border transition-all flex flex-col justify-between hover:shadow-card ${
                isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-100'
              }`}
            >
              <div>
                {/* Header: Code & Department */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {folder.code}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {folder.department}
                  </span>
                </div>

                {/* Folder Title & Description */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                    style={{ backgroundColor: folder.color }}
                  >
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {folder.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {folder.description}
                    </p>
                  </div>
                </div>

                {/* Invoices Count Chip */}
                <div className="flex items-center justify-between text-xs py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                  <span className="text-slate-500 font-medium">Associated Invoices:</span>
                  <span className="font-bold text-slate-800">
                    {folderTransactions.length > 0 ? (
                      `${folderTransactions.length} Invoices Ingested`
                    ) : (
                      <span className="text-amber-600 font-semibold">Empty Folder (0)</span>
                    )}
                  </span>
                </div>

                {/* Budget Utilization Meter */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Budget Spend</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatCurrency(totalSpend, user.currency)} /{' '}
                      {formatCurrency(folder.allocatedBudget, user.currency)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct > 90 ? '#E11D48' : folder.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{pct}% Allocated</span>
                    {totalInflow > 0 && (
                      <span className="text-emerald-600 font-medium">
                        +{formatCurrency(totalInflow, user.currency)} Inflow
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleUploadToFolder(folder.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-subtle"
                  title="Upload CSV statement specifically into this folder"
                >
                  <UploadCloud className="h-3.5 w-3.5 text-slate-600" />
                  <span>Upload CSV</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenFolder(folder.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
                  >
                    <span>Open Cockpit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => deleteProject(folder.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Project Folder"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCreateOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Create Project Invoice Folder</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Folder Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Logistics & Vendor Settlements"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project Code / Cost Center
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PRJ-LOG-2026"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 border border-slate-200"
                  >
                    <option value="Engineering & IT">Engineering & IT</option>
                    <option value="Operations & Facilities">Operations & Facilities</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Tax Operations">Finance & Tax Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Purpose
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief explanation of invoices grouped under this folder..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Allocated Budget ({user.currency})
                  </label>
                  <input
                    type="number"
                    value={allocatedBudget}
                    onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-900 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Folder Theme Color
                  </label>
                  <div className="flex items-center gap-2 mt-1.5">
                    {['#0284C7', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setColor(c)}
                        className={`h-6 w-6 rounded-full transition-transform ${
                          color === c ? 'scale-125 ring-2 ring-slate-900' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
