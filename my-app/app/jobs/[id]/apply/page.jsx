"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getJob, createApplication } from "@/utils/api";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const data = await getJob(id);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };
    if (id) fetchJobDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await createApplication({ job: id, cover_letter: coverLetter, resume }, null); 
      setMessage("✅ Application submitted successfully!");
      setTimeout(() => router.push("/jobs"), 2000);
    } catch (err) {
      console.error("Error submitting application:", err);
      setMessage(err.error || "❌ Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <p className="text-center mt-20">Loading job details...</p>;

  return (
    <section className="max-w-xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Apply for {job.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
            rows={5}
            className="w-full border p-3 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">Upload Resume</label>
          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            required
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </section>
  );
}
