"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { NotificationHeader } from "@/app/components/notifications/NotificationHeader";
import { NotificationFeed } from "@/app/components/notifications/NotificationFeed";
import { JobAlertForm } from "@/app/components/notifications/JobAlertForm";
import { JobAlertList } from "@/app/components/notifications/JobAlertList";
import { NotificationSkeleton } from "@/app/components/notifications/NotificationSkeleton";

export default function NotificationsPage() {
  const {
    notifications,
    alerts,
    loading,
    showAlertForm,
    setShowAlertForm,
    newAlert,
    setNewAlert,
    markAllRead,
    markRead,
    handleCreateAlert,
  } = useNotifications();

  if (loading) return <NotificationSkeleton />;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        
        <NotificationHeader 
          hasUnread={notifications.some(n => !n.is_read)} 
          markAllRead={markAllRead} 
        />

        <section className="space-y-4">
            <NotificationFeed 
              notifications={notifications} 
              markRead={markRead} 
            />
        </section>

        <section className="pt-10 border-t border-glass-border">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-black text-text-main tracking-tight">Deployment <span className="text-blue-400">Triggers</span></h2>
                    <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-[0.2em] mt-1">Automated role detection protocols.</p>
                </div>
                <button
                    onClick={() => setShowAlertForm(!showAlertForm)}
                    className="px-6 py-3 bg-bg-page/10 hover:bg-text-main text-text-main hover:text-bg-page rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                    {showAlertForm ? "Abort" : "+ Configure Alert"}
                </button>
            </div>

            {showAlertForm && (
                <JobAlertForm 
                  newAlert={newAlert} 
                  setNewAlert={setNewAlert} 
                  handleCreateAlert={handleCreateAlert} 
                />
            )}

            <JobAlertList alerts={alerts} />
        </section>
      </div>
    </div>
  );
}
