"use client";
import { useParams, useRouter } from "next/navigation";
import { useJobDetails } from "@/hooks/useJobDetails";
import { JobHero, JobContent, JobSidebar } from "@/app/components/jobs/details";
import LoadingScreen from "@/app/components/LoadingScreen";

/**
 * Job Details Orchestration Tier.
 */
export default function JobDetails() {
    const { id } = useParams();
    const router = useRouter();
    const {
        job,
        loading,
        saved,
        saving,
        handleSave,
        formatSalary
    } = useJobDetails(id);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!job || job.detail === "Not found.") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-text-muted">
                <p className="text-xl font-bold">Protocol Missing.</p>
                <button
                    onClick={() => router.push("/jobs")}
                    className="text-blue-600 dark:text-blue-400 mt-4 hover:underline font-black uppercase text-xs tracking-widest"
                >
                    &larr; Query Market
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="text-text-muted hover:text-text-main transition-colors mb-8 flex items-center gap-2 group"
                >
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminal Stream</span>
                </button>

                <div className="glass-card overflow-hidden border-glass-border animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <JobHero job={job} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-glass-border">
                        <JobContent 
                            job={job} 
                            saved={saved} 
                            saving={saving} 
                            onSave={handleSave} 
                        />
                        <JobSidebar 
                            job={job} 
                            formattedSalary={formatSalary()} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
