import React from "react";
import Link from "next/link";

const POPULAR_CATEGORIES = [
  { name: "Engineering", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ), slug: "technology" },
  { name: "Product Design", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ), slug: "design-creative" },
  { name: "Intelligence", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ), slug: "data-analytics" },
  { name: "Sales Strategy", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ), slug: "marketing-sales" },
];

export function CategoriesSection() {
  return (
    <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Domain Selection</h2>
                <h3 className="text-4xl font-black text-text-main tracking-tight">Browse via <span className="text-text-muted">Technical Pillars</span></h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {POPULAR_CATEGORIES.map(cat => (
                    <Link key={cat.slug} href={`/jobs?category=${cat.slug}`} 
                        className="glass-card p-10 border-glass-border hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-500 group text-center">
                        <div className="w-14 h-14 bg-glass-surface rounded-[1.25rem] flex items-center justify-center text-text-muted group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all mx-auto mb-8 ring-1 ring-glass-border group-hover:ring-blue-500/20">
                            {cat.icon}
                        </div>
                        <h4 className="text-[10px] font-black text-text-main uppercase tracking-[0.2em]">{cat.name}</h4>
                    </Link>
                ))}
            </div>
        </div>
    </section>
  );
}
