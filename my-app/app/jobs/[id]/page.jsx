"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getJob } from "@/utils/api";

export default function JobDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJob(id);
                setJob(data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
                <p>Loading job details...</p>
            </div>
        );
    }

    if (!job || job.detail === "Not found.") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
                <p>Job not found.</p>
                <button
                    onClick={() => router.push("/jobs")}
                    className="text-blue-600 mt-4 hover:underline"
                >
                    ← Back to jobs
                </button>
            </div>
        );
    }

    return (
        <section className="max-w-3xl mx-auto py-12 px-6">
            <button
                onClick={() => router.back()}
                className="text-blue-600 hover:underline mb-6"
            >
                ← Back to jobs
            </button>

            <div className="bg-white shadow-md rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-gray-600 mb-4">
                    {job.company_name} • {job.location} •{" "}
                    {job.job_type?.replace("_", " ").toUpperCase()}
                </p>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                {job.salary && (
                    <p className="font-medium text-gray-900 mb-4">
                        💰 <span className="text-blue-600">₦{job.salary}</span>
                    </p>
                )}

                <div className="flex items-center justify-end mt-6">
                    <Link
                        href={`/jobs/${job.id}/apply`}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
