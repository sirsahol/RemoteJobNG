"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

const STATS = [
  { label: "Remote Jobs", value: "10,000+" },
  { label: "Companies Hiring", value: "500+" },
  { label: "Nigerian Professionals", value: "15,000+" },
  { label: "Countries", value: "50+" },
];

const POPULAR_CATEGORIES = [
  { name: "Technology", icon: "💻", slug: "technology" },
  { name: "Design & Creative", icon: "🎨", slug: "design-creative" },
  { name: "Marketing & Sales", icon: "📈", slug: "marketing-sales" },
  { name: "Writing & Content", icon: "✍️", slug: "writing-content" },
  { name: "Data & Analytics", icon: "📊", slug: "data-analytics" },
  { name: "Customer Support", icon: "🎧", slug: "customer-support" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs/?is_featured=true&page_size=6")
      .then(res => setFeaturedJobs(res.data.results || res.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-green-600 text-green-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            The #1 Remote Jobs Platform for Nigerians
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Work Globally,<br />
            <span className="text-yellow-400">Live in Nigeria</span>
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Thousands of global remote jobs from top international companies, curated for Nigerian professionals.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Job title, skill, or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button type="submit"
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition text-base">
              Search Jobs
            </button>
          </form>

          <p className="text-green-200 text-sm mt-4">Popular: Python Developer · UX Designer · Content Writer · Customer Support</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-green-800 border-t border-green-700 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
          {STATS.map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-yellow-400">{stat.value}</p>
              <p className="text-green-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
            <p className="text-gray-500">Find jobs in your area of expertise</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/jobs?category_slug=${cat.slug}`}
                className="bg-white rounded-2xl p-4 text-center border border-gray-100 hover:border-green-300 hover:shadow-md transition group">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-green-800">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
              <Link href="/jobs?is_featured=true" className="text-green-700 hover:underline text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {featuredJobs.slice(0, 4).map(job => (
                <Link key={job.id} href={`/jobs/${job.slug || job.id}`}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-md transition flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-800 font-bold text-lg flex-shrink-0">
                    {job.company_logo_url
                      ? <img src={job.company_logo_url} alt={job.company_name} className="h-10 w-10 object-contain rounded-lg" />
                      : job.company_name?.charAt(0)
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.company_name} · {job.location || "Remote"}</p>
                    <div className="flex gap-1.5 mt-2">
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">{job.job_type?.replace("_", " ")}</span>
                      {job.salary_min && job.is_salary_public && (
                        <span className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded">
                          ${Number(job.salary_min).toLocaleString()}{job.salary_max ? `–${Number(job.salary_max).toLocaleString()}` : "+"}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why RemoteWorkNaija */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for Nigerian Professionals</h2>
          <p className="text-gray-500 text-lg mb-12">We know the unique challenges of working remotely from Nigeria. We built this for you.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🌍", title: "Global Opportunities", desc: "Jobs from companies in the US, UK, EU, Canada, and beyond — all open to Nigerian talent." },
              { icon: "💰", title: "Salary Transparency", desc: "Every job shows salary in USD, GBP, or EUR so you know exactly what you'll earn." },
              { icon: "🔔", title: "Smart Job Alerts", desc: "Set up alerts by skill, type, and salary. Get notified the moment your dream job is posted." },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-green-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Ready to find your next remote job?</h2>
          <p className="text-green-200 mb-8">Join thousands of Nigerian professionals already working globally.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs" className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition">
              Browse Jobs
            </Link>
            <Link href="/signup" className="border border-green-400 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-700 transition">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-3">RemoteWorkNaija</h4>
            <p className="text-sm">Global remote jobs for Nigerian professionals.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Job Seekers</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/jobs" className="hover:text-white">Browse Jobs</Link></li>
              <li><Link href="/signup" className="hover:text-white">Create Account</Link></li>
              <li><Link href="/dashboard/seeker" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Employers</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/pricing" className="hover:text-white">Post a Job</Link></li>
              <li><Link href="/dashboard/employer" className="hover:text-white">Employer Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><a href="mailto:support@remoteworknaija.com" className="hover:text-white">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} RemoteWorkNaija. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
