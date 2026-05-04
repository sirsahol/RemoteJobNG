/**
 * useNotifications.js
 * Hook for handling real-time WebSocket notifications.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Use wss if on https
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_URL || 'localhost:8000';
    const wsUrl = `${protocol}//${host}/ws/notifications/`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = json.parse(event.data);
      if (data.type === 'notification') {
        const newNotification = {
          id: Date.now(),
          message: data.message,
          timestamp: new Date().toISOString(),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
          new Notification('RemoteWorkNaija', { body: data.message });
        }
      }
    };

    socket.onopen = () => console.log('WebSocket Connected');
    socket.onclose = () => console.log('WebSocket Disconnected');

    return () => {
      socket.close();
    };
  }, [user]);

  const markAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAsRead };
}
