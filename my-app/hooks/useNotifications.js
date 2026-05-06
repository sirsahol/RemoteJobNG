/**
 * useNotifications.js
 * Hook for handling real-time WebSocket notifications and Job Alert management.
 */
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/axiosInstance';

export function useNotifications() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: '',
    keywords: '',
    location: '',
    frequency: 'daily',
    is_active: true
  });

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [notifsRes, alertsRes] = await Promise.all([
        api.get('/notifications/'),
        api.get('/job-alerts/')
      ]);
      setNotifications(notifsRes.data.results || notifsRes.data || []);
      setAlerts(alertsRes.data.results || alertsRes.data || []);
    } catch (err) {
      console.error("Failed to fetch notification data", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!user || !isAuthenticated) return;

    // Use wss if on https
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_URL || 'localhost:8000';
    const wsUrl = `${protocol}//${host}/ws/notifications/`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          const newNotification = {
            id: Date.now(),
            message: data.message,
            created_at: new Date().toISOString(),
            is_read: false
          };
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show browser notification if permitted
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('RemoteJobNG', { body: data.message });
          }
        }
      } catch (err) {
        console.error("WebSocket message parsing error:", err);
      }
    };

    socket.onopen = () => console.log('WebSocket Connected');
    socket.onclose = () => console.log('WebSocket Disconnected');

    return () => {
      socket.close();
    };
  }, [user, isAuthenticated]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read/');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleCreateAlert = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await api.post('/job-alerts/', newAlert);
      setAlerts(prev => [res.data, ...prev]);
      setShowAlertForm(false);
      setNewAlert({ name: '', keywords: '', location: '', frequency: 'daily', is_active: true });
    } catch (err) {
      console.error("Failed to create job alert", err);
    }
  };

  return { 
    notifications, 
    alerts, 
    loading, 
    showAlertForm, 
    setShowAlertForm, 
    newAlert, 
    setNewAlert, 
    markAllRead, 
    markRead, 
    handleCreateAlert 
  };
}
