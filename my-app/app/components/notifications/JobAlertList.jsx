import React from "react";

export function JobAlertList({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div className="md:col-span-2 p-10 rounded-2xl border border-glass-border bg-bg-page/2 text-center">
          <p className="text-text-muted/20 font-black text-[10px] uppercase tracking-widest">No active triggers detected.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map(alert => (
            <div key={alert.id} className="glass-card p-5 border-glass-border flex items-center justify-between group hover:border-text-muted/20 transition-all">
                <div>
                    <h4 className="font-black text-text-main text-xs uppercase tracking-widest mb-1">{alert.name || alert.keywords}</h4>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-text-muted/40 uppercase tracking-[0.2em]">{alert.frequency}</span>
                        <span className="w-1 h-1 bg-text-muted/10 rounded-full"></span>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${alert.is_active ? "text-emerald-400" : "text-text-muted/20"}`}>
                            {alert.is_active ? "Operational" : "Offline"}
                        </span>
                    </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-500/40 group-hover:bg-blue-500 shadow-signal transition-all"></div>
            </div>
        ))}
    </div>
  );
}
