import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const AlertConfig = ({ 
  alerts, 
  showAlertForm, 
  setShowAlertForm, 
  newAlert, 
  setNewAlert, 
  onCreateAlert, 
  onToggleAlert, 
  onDeleteAlert 
}) => {
  return (
    <GlassCard 
      className="animate-in fade-in slide-in-from-bottom-4 duration-1000"
      variant="default"
      noPadding
    >
      <div className="p-8 border-b border-glass-border flex justify-between items-center bg-glass-surface/50">
        <div>
          <h2 className="text-xl font-black text-text-main uppercase tracking-tighter italic">
            Alert Configuration
          </h2>
          <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">
            Targeted Market Surveillance
          </p>
        </div>
        <button 
          onClick={() => setShowAlertForm(!showAlertForm)} 
          className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-600/30 hover:border-blue-600 transition-all pb-1"
        >
          {showAlertForm ? 'Cancel Operation' : '+ Add Surveillance Node'}
        </button>
      </div>

      <div className="p-8">
        {showAlertForm && (
          <form onSubmit={onCreateAlert} className="mb-10 p-6 rounded-2xl bg-blue-600/5 border border-blue-600/20 animate-in zoom-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                  Target Designation
                </label>
                <Input 
                  type="text" 
                  placeholder="e.g. Senior Frontend"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                  Signal Keywords
                </label>
                <Input 
                  type="text" 
                  placeholder="React, Next.js, AI"
                  value={newAlert.keywords}
                  onChange={(e) => setNewAlert({...newAlert, keywords: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              variant="primary"
              className="mt-6 w-full py-4 uppercase tracking-[0.3em]"
            >
              Initialize Node
            </Button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="p-6 rounded-2xl bg-glass-surface border border-glass-border hover:border-blue-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-text-main uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {alert.name}
                    </h3>
                    <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest italic">
                      {alert.frequency} Pulse
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onToggleAlert(alert.id)}
                      className={`w-10 h-5 rounded-full relative transition-all border ${alert.is_active ? 'bg-blue-600 border-blue-600' : 'bg-glass-border border-glass-border'}`}
                      aria-label={alert.is_active ? "Deactivate alert" : "Activate alert"}
                    >
                      <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${alert.is_active ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                    <button 
                      onClick={() => onDeleteAlert(alert.id)} 
                      className="text-text-muted hover:text-red-500 transition-colors"
                      aria-label="Delete alert"
                    >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {alert.keywords?.split(',').map(tag => (
                    <Badge key={tag} variant="outline" className="text-[9px]">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-text-muted font-black uppercase tracking-widest text-[10px] italic">
              No surveillance nodes established...
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default AlertConfig;

