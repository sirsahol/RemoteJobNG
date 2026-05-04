"use client";

import React from 'react';
import { useEmployerInsights } from '@/hooks/useEmployerInsights';
import { ShieldCheck, Star, Brain, ArrowRight } from 'iconoir-react';

export function EmployerInsights() {
  const { matches, loading, error } = useEmployerInsights();

  if (loading) return null; // Let the main dashboard handle loading if needed, or show skeleton

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Brain className="text-indigo-400" />
            Neural Talent Matching
          </h2>
          <p className="text-gray-500">AI-ranked candidates based on semantic skills and verified trust signals.</p>
        </div>
        <button className="text-indigo-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group">
          View All Insights
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.slice(0, 3).map((candidate) => (
          <div 
            key={candidate.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg">
                {candidate.username[0].toUpperCase()}
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                <Star className="w-3 h-3 fill-current" />
                {candidate.reputation_score}% Trust
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
              {candidate.username}
            </h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {candidate.bio || 'Expert professional ready for remote work.'}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {(candidate.skills || ['Python', 'React', 'AWS']).slice(0, 3).map(skill => (
                <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {skill}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {candidate.is_verified && (
                  <ShieldCheck className="text-blue-400 w-5 h-5" />
                )}
                <span className="text-xs text-gray-500">Verified Professional</span>
              </div>
              <button className="bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded-xl transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
