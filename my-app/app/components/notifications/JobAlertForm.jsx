import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function JobAlertForm({ newAlert, setNewAlert, handleCreateAlert }) {
  return (
    <GlassCard 
      className="p-8 mb-8 animate-in slide-in-from-top-4 duration-500"
      variant="default"
    >
        <form onSubmit={handleCreateAlert} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-widest mb-3">Protocol Label</label>
                    <Input
                        placeholder="e.g. Distributed Systems Remote"
                        value={newAlert.name}
                        onChange={e => setNewAlert({...newAlert, name: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-widest mb-3">Filter Keywords (CSV)</label>
                    <Input
                        placeholder="React, Rust, AWS, Architecture"
                        value={newAlert.keywords}
                        onChange={e => setNewAlert({...newAlert, keywords: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-widest mb-3">Engagement Model</label>
                    <select
                        value={newAlert.job_type}
                        onChange={e => setNewAlert({...newAlert, job_type: e.target.value})}
                        className="w-full bg-bg-page/50 border border-glass-border rounded-xl p-4 text-text-main focus:outline-none focus:border-blue-500/50 transition-all text-sm font-black uppercase tracking-widest"
                    >
                        <option value="">Agnostic</option>
                        <option value="full_time">Full Time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-widest mb-3">Sync Frequency</label>
                    <select
                        value={newAlert.frequency}
                        onChange={e => setNewAlert({...newAlert, frequency: e.target.value})}
                        className="w-full bg-bg-page/50 border border-glass-border rounded-xl p-4 text-text-main focus:outline-none focus:border-blue-500/50 transition-all text-sm font-black uppercase tracking-widest"
                    >
                        <option value="daily">Daily Cycle</option>
                        <option value="weekly">Weekly Cycle</option>
                        <option value="instant">Real-time Stream</option>
                    </select>
                </div>
            </div>
            <Button type="submit" variant="primary" className="w-full py-4 text-xs tracking-[0.2em]">
                Deploy Intelligence Trigger
            </Button>
        </form>
    </GlassCard>
  );
}

