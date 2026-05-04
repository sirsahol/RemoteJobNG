/**
 * useEmployerInsights.js
 * Logic hook for accessing neural intelligence and candidate matching.
 */
import { useState, useEffect } from 'react';
import api from '@/utils/api';

export function useEmployerInsights() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const fetchMatches = async (searchQuery = '') => {
    try {
      setLoading(true);
      const response = await api.get('/intelligence/candidates/', {
        params: { q: searchQuery }
      });
      setMatches(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load neural insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    search: fetchMatches
  };
}
