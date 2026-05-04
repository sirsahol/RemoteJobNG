// @dsp obj-887771b3
import React from "react";

export function ProfileSkills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="glass-card p-8 border-glass-border md:col-span-2">
      <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] mb-6">
        Functional Units
      </h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill.id || skill.name}
            className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl"
          >
            {skill.name || skill}
          </span>
        ))}
      </div>
    </div>
  );
}
