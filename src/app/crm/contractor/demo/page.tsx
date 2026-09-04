'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { DemoHeader } from '@/components/contractor-demo/DemoHeader';
import { DemoSidebar, DemoTabKey } from '@/components/contractor-demo/DemoSidebar';
import { DashboardView } from '@/components/contractor-demo/DashboardView';
import { LeadsView } from '@/components/contractor-demo/LeadsView';
import { SurveyView } from '@/components/contractor-demo/SurveyView';
import { RABView } from '@/components/contractor-demo/RABView';
import { ProjectsView } from '@/components/contractor-demo/ProjectsView';
import { SPKView } from '@/components/contractor-demo/SPKView';
import { MaterialView } from '@/components/contractor-demo/MaterialView';
import { TeamView } from '@/components/contractor-demo/TeamView';
import { ActivityView } from '@/components/contractor-demo/ActivityView';
import { ReportView } from '@/components/contractor-demo/ReportView';
import { ConsultationBanner } from '@/components/contractor-demo/ConsultationBanner';
import { useDemoState } from '@/components/contractor-demo/useDemoState';

export default function ContractorCRMDemoPage() {
  const [activeTab, setActiveTab] = useState<DemoTabKey>('dashboard');

  const {
    isLoaded,
    leads,
    projects,
    surveys,
    rabItems,
    spkList,
    materials,
    team,
    activities,
    addLead,
    updateLeadStatus,
    deleteLead,
    addSurvey,
    updateSurveyStatus,
    addRABItem,
    updateRABQuantity,
    deleteRABItem,
    updateProjectStage,
    addMaterial,
    updateMaterialStatus,
    addTeamMember,
    deleteTeamMember,
    assignTeamProject,
    resetDemo,
  } = useDemoState();

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
                projectCount={projects.length}
                surveyCount={surveys.length}
              />
            </div>
          </aside>

          {/* Main Workspace Column */}
          <section className="lg:col-span-9 min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardView
                leads={leads}
                projects={projects}
                surveys={surveys}
                rabItems={rabItems}
                activities={activities}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'leads' && (
              <LeadsView
                leads={leads}
                onAddLead={addLead}
                onUpdateStatus={updateLeadStatus}
                onDeleteLead={deleteLead}
              />
            )}

            {activeTab === 'survey' && (
              <SurveyView
                surveys={surveys}
                leads={leads}
                onAddSurvey={addSurvey}
                onUpdateStatus={updateSurveyStatus}
              />
            )}

            {activeTab === 'rab' && (
              <RABView
                rabItems={rabItems}
                projects={projects}
                onAddRABItem={addRABItem}
                onUpdateQuantity={updateRABQuantity}
                onDeleteRABItem={deleteRABItem}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsView projects={projects} onUpdateStage={updateProjectStage} />
            )}

            {activeTab === 'spk' && <SPKView spkList={spkList} />}

            {activeTab === 'material' && (
              <MaterialView
                materials={materials}
                projects={projects}
                onAddMaterial={addMaterial}
                onUpdateStatus={updateMaterialStatus}
              />
            )}

            {activeTab === 'team' && (
              <TeamView
                team={team}
                projects={projects}
                onAddMember={addTeamMember}
                onDeleteMember={deleteTeamMember}
                onAssignProject={assignTeamProject}
              />
            )}

            {activeTab === 'activity' && <ActivityView activities={activities} />}

            {activeTab === 'reports' && (
              <ReportView
                leads={leads}
                projects={projects}
                rabItems={rabItems}
                materials={materials}
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
