// @dsp obj-b9b4a206
import React from "react";

export function ApplyForm({ 
  coverLetter, 
  setCoverLetter, 
  resume, 
  setResume, 
  submitting, 
  onSubmit 
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] mb-4">
          Value Proposition (Cover Letter)
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
          rows={8}
          placeholder="Detail your unique expertise and strategic alignment..."
          className="w-full bg-glass-surface border border-glass-border rounded-2xl p-6 text-text-main placeholder-text-muted/40 focus:outline-none focus:bg-glass-surface/80 focus:border-blue-500/50 transition-all resize-none font-medium leading-relaxed"
        />
      </div>

      <div className="p-8 rounded-2xl bg-glass-surface border border-glass-border border-dashed hover:border-blue-500/30 transition-all group">
        <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] mb-4">
          Supporting Documentation (Resume)
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-text-muted/40 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-text-main font-bold text-xs">
              {resume ? resume.name : "Select PDF or DOCX"}
            </p>
            <p className="text-text-muted/30 text-[9px] mt-1 uppercase font-black tracking-tighter">
              Max file size 5MB
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
      >
        {submitting ? "Transmitting..." : "Initiate Application"}
      </button>
    </form>
  );
}
