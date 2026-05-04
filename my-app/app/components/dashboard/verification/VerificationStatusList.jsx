"use client";

import React from 'react';
import { Clock, CheckCircle, Cancel, WarningCircle } from 'iconoir-react';

export function VerificationStatusList({ requests }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="text-emerald-500" />;
      case 'REJECTED': return <Cancel className="text-red-500" />;
      case 'IN_PROGRESS': return <Clock className="text-blue-500" />;
      default: return <WarningCircle className="text-amber-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'VERIFIED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
        <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Requests Yet</h3>
        <p className="text-gray-400">Complete your profile verification to unlock premium features and trust badges.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
      {requests.map((request) => (
        <div 
          key={request.id}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${getStatusClass(request.status)}`}>
                {getStatusIcon(request.status)}
              </div>
              <div>
                <h4 className="text-white font-bold">{request.request_type.replace('_', ' ')}</h4>
                <p className="text-sm text-gray-500">Submitted on {new Date(request.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusClass(request.status)}`}>
                {request.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          {(request.status === 'REJECTED' && request.rejection_reason) && (
            <div className="mt-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
              <p className="text-xs font-bold text-red-400 uppercase mb-1">Feedback</p>
              <p className="text-sm text-gray-400">{request.rejection_reason}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
