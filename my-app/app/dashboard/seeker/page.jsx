"use client";

import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingScreen from '@/app/components/LoadingScreen';

// Modular UI Components
import VerificationRibbon from '@/app/components/dashboard/VerificationRibbon';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import StatsGrid from '@/app/components/dashboard/StatsGrid';
import ApplicationsFeed from '@/app/components/dashboard/ApplicationsFeed';
import NeuralMatches from '@/app/components/dashboard/NeuralMatches';
import SavedJobs from '@/app/components/dashboard/SavedJobs';
import NetworkPulse from '@/app/components/dashboard/NetworkPulse';
import AlertConfig from '@/app/components/dashboard/AlertConfig';

// Logic Tier
import { useSeekerDashboard } from '@/hooks/useSeekerDashboard';

export default function SeekerDashboard() {
  const {
    user,
    dataLoading,
    stats,
    badges,
    integrityScore,
    applications,
    neuralMatches,
    savedJobs,
    alerts,
    showAlertForm,
    setShowAlertForm,
    newAlert,
    setNewAlert,
    handleCreateAlert,
    handleToggleAlert,
    handleDeleteAlert
  } = useSeekerDashboard();

  if (dataLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-bg-main selection:bg-blue-600/30">
      <Navbar />
      
      {/* Verification Ribbon Tier */}
      <VerificationRibbon badges={badges} integrityScore={integrityScore} />

      <main className="max-w-5xl mx-auto px-6 pt-36 pb-24">
        {/* Header Tier */}
        <DashboardHeader 
          username={user?.username || 'Operator'} 
          onShowAlertForm={setShowAlertForm} 
        />

        {/* Analytics Tier */}
        <StatsGrid stats={stats} />

        {/* Intelligence Tier */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Active Transmissions (Applications) */}
          <ApplicationsFeed applications={applications} />

          {/* Neural Matches */}
          <NeuralMatches matches={neuralMatches} />
        </div>

        {/* Tactical Tier */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Saved Nodes */}
          <SavedJobs savedJobs={savedJobs} />

          {/* Network Pulse */}
          <div className="lg:col-span-2">
            <NetworkPulse />
          </div>
        </div>

        {/* Configuration Tier */}
        <AlertConfig 
          alerts={alerts}
          showAlertForm={showAlertForm}
          setShowAlertForm={setShowAlertForm}
          newAlert={newAlert}
          setNewAlert={setNewAlert}
          onCreateAlert={handleCreateAlert}
          onToggleAlert={handleToggleAlert}
          onDeleteAlert={handleDeleteAlert}
        />
      </main>

      <Footer />
    </div>
  );
}

