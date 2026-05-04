import { GlassCard } from "../ui/GlassCard";

export function EmployerStats({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, i) => (
        <GlassCard 
          key={stat.label} 
          className="p-6 group transition-all animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: `${i * 100}ms` }}
          variant="default"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl group-hover:scale-110 transition-transform">{stat.icon}</span>
            <p className="text-text-muted font-bold uppercase tracking-widest text-[9px]">{stat.label}</p>
          </div>
          <p className="text-3xl font-black text-text-main">{stat.value}</p>
        </GlassCard>
      ))}
    </div>
  );
}

