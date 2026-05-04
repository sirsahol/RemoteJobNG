"use client";

import React, { useState } from 'react';
import { CloudUpload, CheckCircle, InfoCircle, Send } from 'iconoir-react';

export function VerificationForm({ onSubmit, submitting }) {
  const [formData, setFormData] = useState({
    request_type: 'IDENTITY',
    notes: '',
    evidence: null
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, evidence: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    data.append('request_type', formData.request_type);
    data.append('notes', formData.notes);
    if (formData.evidence) {
      data.append('evidence', formData.evidence);
    }

    const result = await onSubmit(data);
    if (result.success) {
      setSuccess(true);
      setFormData({ request_type: 'IDENTITY', notes: '', evidence: null });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <CheckCircle className="text-blue-500" />
        New Verification Request
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Verification Type</label>
          <select
            name="request_type"
            value={formData.request_type}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="IDENTITY">Identity Verification (NIN/BVN/Passport)</option>
            <option value="SKILL">Skill Certification (Degree/Certificate)</option>
            <option value="INFRASTRUCTURE">Infrastructure Asset (Solar/Starlink/ISP)</option>
            <option value="COMPANY">Company Registration (KYB/CAC)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Supporting Evidence (PDF/Image)</label>
          <div className="relative group">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".pdf,image/*"
              required
            />
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center group-hover:border-blue-500/50 transition-all bg-white/5">
              <CloudUpload className="mx-auto w-12 h-12 text-gray-500 mb-4 group-hover:text-blue-500 transition-colors" />
              <p className="text-gray-300 font-medium">
                {formData.evidence ? formData.evidence.name : 'Click or drag file to upload'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Max file size: 10MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional context for the verification team..."
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-32 resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
            <InfoCircle className="flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
            <CheckCircle className="flex-shrink-0" />
            <p className="text-sm">Verification request submitted successfully!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Send />
              Submit for Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}
