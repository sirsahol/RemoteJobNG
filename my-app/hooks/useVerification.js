/**
 * useVerification.js
 * Logic hook for managing user-side verification requests.
 */
import { useState, useEffect } from 'react';
import api from '@/utils/api';

export function useVerification() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/verification/requests/');
      setRequests(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch verification requests.');
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async (formData) => {
    try {
      setSubmitting(true);
      const response = await api.post('/verification/requests/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRequests([response.data, ...requests]);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to submit verification request.';
      return { success: false, error: message };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    requests,
    loading,
    error,
    submitting,
    submitRequest,
    refresh: fetchRequests
  };
}
