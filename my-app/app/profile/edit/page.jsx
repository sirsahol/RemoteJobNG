"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

export default function EditProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading, user: authUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "", last_name: "", headline: "", bio: "",
    location: "", website: "", linkedin_url: "", github_url: "",
    years_of_experience: "", is_profile_public: true,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [badges, setBadges] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [infra, setInfra] = useState({
    solar: false, dual_isp: false, starlink: false, backup_battery: false
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/profile/edit");
      return;
    }
    api.get("/users/me/").then(res => {
      const u = res.data;
      setForm({
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        headline: u.headline || "",
        bio: u.bio || "",
        location: u.location || "",
        website: u.website || "",
        linkedin_url: u.linkedin_url || "",
        github_url: u.github_url || "",
        years_of_experience: u.years_of_experience || "",
        is_profile_public: u.is_profile_public ?? true,
      });
    }).catch(console.error);

    // Fetch Verification Data
    api.get("/v1/verification/badges/my_badges/").then(res => setBadges(res.data)).catch(console.error);
    api.get("/v1/verification/requests/").then(res => {
      const latest = res.data[0];
      if (latest) setVerificationStatus(latest);
    }).catch(console.error);
  }, [loading, isAuthenticated, router]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.patch("/users/me/", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to commit changes to protocol.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );


  const handleInfraToggle = (key) => {
    setInfra(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRequestVerification = async (type, file = null) => {
    try {
      const formData = new FormData();
      formData.append("request_type", type);
      formData.append("metadata", JSON.stringify({ source: "web_v4_editor" }));
      if (file) {
        formData.append("evidence", file);
      }

      const res = await api.post("/v1/verification/requests/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setVerificationStatus(res.data);
      alert("Verification protocol initiated. Evidence uploaded. Awaiting review.");
    } catch (err) {
      alert("Failed to initiate verification. Ensure file is within size limits.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button
            onClick={() => router.back()}
            className="text-white/40 hover:text-white transition-colors mb-8 flex items-center gap-2 group"
        >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Editor</span>
        </button>

        <div className="glass-card p-10 border-white/10 animate-in zoom-in-95 duration-700">
          <div className="mb-12">
            <span className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Personal Identity</span>
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Configure <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Profile Protocol</span></h1>
            <p className="text-white/40 mt-3 font-medium">Calibrate your professional presence for the global market.</p>
          </div>

          {success && (
            <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center font-bold animate-in fade-in duration-300">
              Protocol Synchronized. Profile updated successfully.
            </div>
          )}
          {error && (
            <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center font-bold animate-in fade-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Base Identity Group */}
            <section className="space-y-6">
               <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                 <span className="w-4 h-px bg-white/10"></span>
                 Base Parameters
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Given Name</label>
                  <input type="text" name="first_name" value={form.first_name} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Family Name</label>
                  <input type="text" name="last_name" value={form.last_name} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all" />
                </div>
              </div>
            </section>

            {/* Career Signal Group */}
            <section className="space-y-6">
               <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                 <span className="w-4 h-px bg-white/10"></span>
                 Career Signal
               </h2>
               <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Professional Headline</label>
                    <input type="text" name="headline" value={form.headline} onChange={handleChange}
                      placeholder="e.g. Lead Distributed Systems Engineer"
                      className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Geographic Location</label>
                      <input type="text" name="location" value={form.location} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Professional Tenure (Years)</label>
                      <input type="number" name="years_of_experience" value={form.years_of_experience} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all" />
                    </div>
                  </div>
               </div>
            </section>

            {/* Infrastructure Assets - New Section */}
            <section className="space-y-6">
               <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                 <span className="w-4 h-px bg-white/10"></span>
                 Infrastructure Assets
               </h2>
               <p className="text-white/40 text-[11px] mb-4 font-medium leading-relaxed">Attest to your workspace reliability to increase employer confidence.</p>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "solar", label: "Solar" },
                    { key: "dual_isp", label: "Dual ISP" },
                    { key: "starlink", label: "Starlink" },
                    { key: "backup_battery", label: "UPS/Battery" }
                  ].map(item => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleInfraToggle(item.key)}
                      className={`p-4 rounded-xl border transition-all text-center group ${infra[item.key] ? "bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"}`}
                    >
                      <span className="block text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
               </div>
            </section>

            {/* Verification Protocol - Functional */}
            <section className="space-y-6">
               <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                 <span className="w-4 h-px bg-white/10"></span>
                 Verification Protocol
               </h2>
                {/* Badges Display */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {badges.map(b => (
                      <div key={b.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <span className="text-sm">{b.badge.icon}</span>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{b.badge.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Identity Verification */}
                <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/10 flex items-center justify-between group">
                   <div className="flex gap-4 items-center">
                     <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                     </div>
                     <div>
                       <span className="text-[11px] font-bold text-white block">Identity Verification</span>
                       <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                         {badges.find(b => b.badge.slug === 'identity-verified') ? "Verified" : "Elevate your trust score by 40%"}
                       </p>
                     </div>
                   </div>
                   {!badges.find(b => b.badge.slug === 'identity-verified') && (
                     <button 
                       type="button" 
                       onClick={() => handleRequestVerification('IDENTITY')}
                       className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors"
                     >
                       Request Link
                     </button>
                   )}
                </div>                 <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 space-y-6 group">
                   <div className="flex items-center justify-between">
                     <div className="flex gap-4 items-center">
                       <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       </div>
                       <div>
                         <span className="text-[11px] font-bold text-white block">Infrastructure Audit</span>
                         <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                           {badges.find(b => b.badge.slug === 'starlink-verified' || b.badge.slug === 'solar-powered') ? "Verified Assets" : "Verify Starlink/Solar Reliability"}
                         </p>
                       </div>
                     </div>
                     {!verificationStatus || verificationStatus.status === 'REJECTED' ? (
                       <label className="cursor-pointer text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                         Upload Evidence
                         <input 
                           type="file" 
                           className="hidden" 
                           accept="image/*,.pdf" 
                           onChange={(e) => handleRequestVerification('INFRASTRUCTURE', e.target.files[0])} 
                         />
                       </label>
                     ) : (
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{verificationStatus.status}</span>
                     )}
                   </div>
                   {verificationStatus?.rejection_reason && verificationStatus.status === 'REJECTED' && (
                     <p className="text-[10px] text-red-400/60 font-medium bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                       Rejection Reason: {verificationStatus.rejection_reason}
                     </p>
                   )}
                 </div>
                 &gt;

                {/* Skill Verification */}
                <div className="p-6 rounded-2xl bg-purple-600/5 border border-purple-500/10 flex items-center justify-between group">
                   <div className="flex gap-4 items-center">
                     <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                     </div>
                     <div>
                       <span className="text-[11px] font-bold text-white block">Elite Skill Certification</span>
                       <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                         {badges.find(b => b.badge.slug === 'elite-talent') ? "Certified" : "Verify Technical Dominance"}
                       </p>
                     </div>
                   </div>
                   <button 
                     type="button" 
                     onClick={() => handleRequestVerification('SKILL')}
                     className="text-[9px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors"
                   >
                     Request Exam
                   </button>
                </div>
            </section>

            {/* External Links Group */}
            <section className="space-y-6">
               <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                 <span className="w-4 h-px bg-white/10"></span>
                 Digital Footprint
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["website", "linkedin_url", "github_url"].map(name => (
                    <div key={name} className={name === "website" ? "md:col-span-2" : ""}>
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">{name.replace("_", " ")}</label>
                      <input type="text" name={name} value={form[name]} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all" />
                    </div>
                  ))}
               </div>
            </section>

            {/* Intelligence Bio */}
            <section className="space-y-6">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Identity Narrative (Bio)</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={6}
                placeholder="Compose a compelling narrative of your technical expertise and career achievements..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-white focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all resize-none leading-relaxed font-medium" />
            </section>

            {/* Visibility Toggle */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group">
              <div>
                <label htmlFor="is_profile_public" className="text-xs font-bold text-white mb-1 block">Public Visibility Protocol</label>
                <p className="text-white/20 text-[9px] font-medium uppercase tracking-widest">Allow global search engines to index your profile.</p>
              </div>
              <button
                type="button"
                onClick={() => setForm(f => ({...f, is_profile_public: !f.is_profile_public}))}
                className={`w-12 h-6 rounded-full relative transition-colors ${form.is_profile_public ? "bg-blue-600" : "bg-white/10"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.is_profile_public ? "left-7" : "left-1"}`}></div>
              </button>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50">
                {saving ? "Synchronizing..." : "Commit Protocol"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
