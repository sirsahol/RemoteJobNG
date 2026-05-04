// @dsp obj-f076f751
import React from "react";

export function ApplyStatus({ message, error }) {
  if (!message && !error) return null;
  
  return (
    <>
      {message && (
        <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-8 p-6 bg-red-500/10 border border-red-200 text-red-400 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}
    </>
  );
}
