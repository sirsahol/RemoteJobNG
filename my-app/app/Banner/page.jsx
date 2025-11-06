"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/jobs/all/");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-10 md:p-16 mt-10">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Remote Jobs for Nigerians Who Dream Big 🌍
          </h1>
          <p className="text-gray-600 mb-6">
            Discover verified opportunities from trusted companies — work from anywhere, get paid globally.
          </p>
          <div className="space-x-4">
            <Link
              href="/jobs"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Find Jobs
            </Link>

            <Link
              href="/post_job"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition"
            >
              Post a Job
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <div className="h-64 w-64 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-6xl">💼</span>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Featured Remote Jobs
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.length > 0 ? (
              jobs.map((job) => (
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

                  {/* 👇 Added Link for Job Details */}
                  <Link href={`/jobs/${job.id}`}>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                      View Details
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No jobs available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-white py-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Why Choose RemoteJobsNG?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            { icon: "🇳🇬", title: "Built for Nigerians", desc: "Designed to connect Nigerians to global remote jobs." },
            { icon: "🔒", title: "Verified Jobs", desc: "Every listing is manually verified for legitimacy." },
            { icon: "🌍", title: "Global Reach", desc: "Access opportunities from across the world." },
          ].map((item, i) => (
            <div key={i} className="bg-blue-50 p-6 rounded-2xl text-center shadow-sm">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-gray-400 text-sm py-8">
        © 2025 RemoteJobsNG — Made with ❤️ in Nigeria
      </footer>
    </div>
  );
}
