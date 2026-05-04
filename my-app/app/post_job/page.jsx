"use client";

import { usePostJob } from "@/hooks/usePostJob";
import { PostJobHeader } from "@/app/components/post_job/PostJobHeader";
import { PostJobForm } from "@/app/components/post_job/PostJobForm";
import { PostJobSidebar } from "@/app/components/post_job/PostJobSidebar";
import { PostJobSkeleton } from "@/app/components/post_job/PostJobSkeleton";

export default function PostJobPage() {
  const {
    formData,
    submitted,
    submitting,
    error,
    loading,
    handleChange,
    handleSubmit,
  } = usePostJob();

  if (loading) return <PostJobSkeleton />;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative">
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4"></div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <PostJobHeader />
          <PostJobForm 
            formData={formData} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit} 
            submitting={submitting} 
            submitted={submitted} 
            error={error} 
          />
        </div>

        <PostJobSidebar />
      </div>
    </div>
  );
}
