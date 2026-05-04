import React from "react";
import { VerificationRow } from "./VerificationRow";
import { GlassCard } from "../../ui/GlassCard";

export function VerificationTable({ requests, onApprove, onReject }) {
  return (
    <GlassCard 
      className="p-1 overflow-hidden" 
      variant="default"
      noPadding
    >
      <div className="bg-glass-surface backdrop-blur-3xl rounded-[1.4rem] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-glass-border/50">
              <th className="px-8 py-6 text-[10px] font-black text-text-muted/30 uppercase tracking-widest">
                Node Identity
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted/30 uppercase tracking-widest">
                Transmission Logic
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted/30 uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted/30 uppercase tracking-widest">
                Timestamp
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted/30 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border/50">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-8 py-20 text-center text-text-muted/20 font-bold italic"
                >
                  No pending transmissions detected.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <VerificationRow
                  key={req.id}
                  request={req}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

