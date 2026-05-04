import React from 'react';
import { GlassCard } from '../ui/GlassCard';

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, i) => (
        <GlassCard 
          key={stat.label} 
          className={`p-8 bg-gradient-to-br ${stat.color} animate-in fade-in slide-in-from-bottom-4 duration-700`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-text-main/10 font-black text-4xl">0{i+1}</span>
          </div>
          <p className="text-4xl font-black text-text-main mb-1">{stat.value}</p>
          <p className="text-text-muted font-bold uppercase tracking-widest text-[10px]">
            {stat.label}
          </p>
        </GlassCard>
      ))}
    </div>
  );
};

export default StatsGrid;

