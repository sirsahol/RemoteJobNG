// @dsp obj-9fcbed9a
import React from "react";

export function ApplyHeader({ job }) {
  return (
    <div className="mb-10 text-center md:text-left">
      <span className="text-blue-500 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">
        Application Protocol
      </span>
      <h1 className="text-3xl font-black text-text-main tracking-tight leading-tight">
         Apply for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-indigo-400">{job.title}</span>
      </h1>
      <p className="text-text-muted mt-2 font-medium">
        {job.company_name} · {job.location}
      </p>
    </div>
  );
}
