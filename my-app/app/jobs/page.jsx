"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AllJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/jobs/all/");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          All Remote Job Listings 🌍
        </h1>

        {jobs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {job.company_name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {job.company_name} • {job.location}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {job.description.substring(0, 100)}...
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {job.job_type.replace("_", " ")}
                  </span>
                  {job.salary && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      ₦{job.salary}
                    </span>
                  )}
                </div>

                <Link
                  href={`/jobs/${job.id}`}
                  className="block w-full bg-blue-600 text-center text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No jobs found yet.</p>
        )}
      </div>
    </div>
  );
}
