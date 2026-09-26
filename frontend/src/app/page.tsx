'use client';

import React, { useState } from 'react';
import { useFinFlow } from '../context/FinFlowContext';
import { Sidebar } from '../components/shared/Sidebar';
import { Header } from '../components/shared/Header';
import { CommandPalette } from '../components/shared/CommandPalette';
import { ImportTransactionsModal } from '../components/modals/ImportTransactionsModal';
import { TimeRangeSection } from '../components/shared/TimeRangeSection';
import { DashboardView } from '../components/views/DashboardView';
import { TransactionsView } from '../components/views/TransactionsView';
import { AnalyticsView } from '../components/views/AnalyticsView';
import { BudgetsView } from '../components/views/BudgetsView';
import { HRView } from '../components/views/HRView';
import { SettingsView } from '../components/views/SettingsView';
import { ProjectsView } from '../components/views/ProjectsView';
import { LandingPageView } from '../components/views/LandingPageView';

export default function Home() {
  const { activeTab } = useFinFlow();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#FBFDFB]">
        <LandingPageView />
        <CommandPalette />
        <ImportTransactionsModal />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header onMobileMenuToggle={() => setIsMobileSidebarOpen(true)} />

        {/* Tab-driven Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
            {/* Dedicated Time Horizon & SLA Audit Filter Section */}
            {activeTab !== 'settings' && <TimeRangeSection />}

            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'projects' && <ProjectsView />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'budgets' && <BudgetsView />}
            {activeTab === 'hr' && <HRView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette />
      <ImportTransactionsModal />
    </div>
  );
}
