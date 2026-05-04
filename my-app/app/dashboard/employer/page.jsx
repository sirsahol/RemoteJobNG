"use client";
import { useEmployerDashboard } from "@/hooks/useEmployerDashboard";
import { EmployerHeader, EmployerStats, JobsTable, EmployerInsights } from "@/app/components/employer";
import LoadingScreen from "@/app/components/LoadingScreen";

/**
 * Employer Dashboard Orchestration Tier.
 * Composes the layout using logic from useEmployerDashboard and UI from employer components.
 */
export default function EmployerDashboard() {
  const { 
    user, 
    myJobs, 
    stats, 
    isLoading, 
    handleCloseJob 
  } = useEmployerDashboard();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <EmployerHeader 
          companyName={user?.company_name} 
          username={user?.username} 
        />

        <EmployerStats stats={stats} />

        <JobsTable 
          myJobs={myJobs} 
          handleCloseJob={handleCloseJob} 
        />

        <EmployerInsights />
      </div>
    </div>
  );
}
