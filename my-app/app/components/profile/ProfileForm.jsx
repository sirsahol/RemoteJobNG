"use client";

import React from 'react';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';

const ProfileForm = ({ 
  form, 
  infra, 
  saving, 
  success, 
  error, 
  onChange, 
  onInfraToggle, 
  onSubmit, 
  setVisibility 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-12">
      {/* Base Identity Group */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] flex items-center gap-3">
          <span className="w-4 h-px bg-glass-border/20"></span>
          Base Parameters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Primary Identifier" 
            name="first_name" 
            value={form.first_name} 
            onChange={onChange} 
          />
          <Input 
            label="Secondary Identifier" 
            name="last_name" 
            value={form.last_name} 
            onChange={onChange} 
          />
        </div>
      </section>

      {/* Career Signal Group */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] flex items-center gap-3">
          <span className="w-4 h-px bg-glass-border/20"></span>
          Career Signal
        </h2>
        <div className="space-y-6">
          <Input 
            label="Professional Headline" 
            name="headline" 
            value={form.headline} 
            onChange={onChange}
            placeholder="e.g. Lead Distributed Systems Engineer"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Spatial Coordinate" 
              name="location" 
              value={form.location} 
              onChange={onChange} 
            />
            <Input 
              label="Operational Lifecycle (Years)" 
              type="number" 
              name="years_of_experience" 
              value={form.years_of_experience} 
              onChange={onChange} 
            />
          </div>
        </div>
      </section>

      {/* Infrastructure Assets */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] flex items-center gap-3">
          <span className="w-4 h-px bg-glass-border/20"></span>
          Infrastructure Assets
        </h2>
        <p className="text-text-muted text-[11px] mb-4 font-medium leading-relaxed">Attest to your workspace reliability to increase employer confidence.</p>
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
              onClick={() => onInfraToggle(item.key)}
              className={`p-4 rounded-xl border transition-all text-center group ${infra[item.key] ? "bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-glass-surface border-glass-border text-text-muted hover:border-text-muted/50"}`}
            >
              <span className="block text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* External Links Group */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] flex items-center gap-3">
          <span className="w-4 h-px bg-glass-border/20"></span>
          Neural Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["website", "linkedin_url", "github_url"].map(name => (
            <div key={name} className={name === "website" ? "md:col-span-2" : ""}>
              <Input 
                label={name.replace("_", " ")} 
                name={name} 
                value={form[name]} 
                onChange={onChange} 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Intelligence Bio */}
      <section className="space-y-6">
        <TextArea 
          label="Dossier Metadata (Bio)" 
          name="bio" 
          value={form.bio} 
          onChange={onChange} 
          rows={6}
          placeholder="Compose a compelling narrative of your technical expertise and career achievements..."
        />
      </section>

      {/* Visibility Toggle */}
      <div className="p-6 rounded-2xl bg-glass-surface border border-glass-border flex items-center justify-between group">
        <div>
          <label htmlFor="is_profile_public" className="text-xs font-bold text-text-main mb-1 block">Public Visibility Protocol</label>
          <p className="text-text-muted text-[9px] font-medium uppercase tracking-widest">Allow global search engines to index your profile.</p>
        </div>
        <button
          type="button"
          onClick={() => setVisibility(!form.is_profile_public)}
          className={`w-12 h-6 rounded-full relative transition-colors ${form.is_profile_public ? "bg-blue-600" : "bg-glass-border/30"}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-text-main rounded-full transition-all ${form.is_profile_public ? "left-7" : "left-1"}`}></div>
        </button>
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit" 
          isLoading={saving}
          className="flex-1 py-5 text-xs uppercase tracking-widest"
        >
          Commit Protocol
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
