'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { DemoHeader } from '@/components/business-demo/DemoHeader';
import { DemoSidebar } from '@/components/business-demo/DemoSidebar';
import { DashboardView } from '@/components/business-demo/DashboardView';
import { LeadsView } from '@/components/business-demo/LeadsView';
import { PipelineView } from '@/components/business-demo/PipelineView';
import { FollowUpView } from '@/components/business-demo/FollowUpView';
import { DealsView } from '@/components/business-demo/DealsView';
import { ReportView } from '@/components/business-demo/ReportView';
import { ConsultationBanner } from '@/components/business-demo/ConsultationBanner';
import { useDemoState } from '@/components/business-demo/useDemoState';
import { BusinessTabKey } from '@/components/business-demo/types';

export default function BusinessCRMDemoPage() {
  const [activeTab, setActiveTab] = useState<BusinessTabKey>('dashboard');

  const {
    isLoaded,
    leads,
    followups,
    products,
    deals,
    activities,
    addLead,
    updateLead,
    updateLeadStage,
    deleteLead,
    addFollowUp,
    completeFollowUp,
    deleteFollowUp,
    addDeal,
    updateDealStatus,
    deleteDeal,
    resetDemo,
  } = useDemoState();

  const todayStr = '2026-09-04';
  const urgentFollowUpCount = followups.filter(
    (f) => f.status === 'Terlambat' || (f.dueDate === todayStr && f.status === 'Pending')
  ).length;

  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#10231B] font-sans antialiased selection:bg-[#16A36A] selection:text-white">
      {/* DINAMIS Global Navbar */}
      <Navbar />

      {/* Demo Top Header with Breadcrumbs & Reset */}
      <DemoHeader onReset={resetDemo} />

      {/* Main Interactive Demo Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Menu Column */}
          <aside className="lg:col-span-3 sticky top-24 z-10">
            <div className="bg-white rounded-3xl border border-[#E2EAE5] p-3 sm:p-4 shadow-xs">
              <DemoSidebar
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                leadCount={leads.length}
                urgentFollowUpCount={urgentFollowUpCount}
                dealCount={deals.length}
              />
            </div>
          </aside>

          {/* Main Workspace Column */}
          <section className="lg:col-span-9 min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardView
                leads={leads}
                followups={followups}
                deals={deals}
                activities={activities}
                onNavigate={setActiveTab}
                onCompleteFollowUp={completeFollowUp}
              />
            )}

            {activeTab === 'leads' && (
              <LeadsView
                leads={leads}
                activities={activities}
                onAddLead={addLead}
                onUpdateLead={updateLead}
                onUpdateStage={updateLeadStage}
                onDeleteLead={deleteLead}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelineView
                leads={leads}
                onUpdateStage={updateLeadStage}
              />
            )}

            {activeTab === 'followup' && (
              <FollowUpView
                followups={followups}
                leads={leads}
                onAddFollowUp={addFollowUp}
                onCompleteFollowUp={completeFollowUp}
                onDeleteFollowUp={deleteFollowUp}
              />
            )}

            {activeTab === 'deals' && (
              <DealsView
                deals={deals}
                leads={leads}
                products={products}
                onAddDeal={addDeal}
                onUpdateDealStatus={updateDealStatus}
                onDeleteDeal={deleteDeal}
              />
            )}

            {activeTab === 'reports' && (
              <ReportView
                leads={leads}
                followups={followups}
                deals={deals}
              />
            )}
          </section>
        </div>

        {/* Bottom Consultation Banner */}
        <ConsultationBanner />
      </div>

      {/* DINAMIS Global Footer */}
      <Footer />
    </main>
  );
}
