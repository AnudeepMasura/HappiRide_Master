import { useState, useEffect } from 'react';
import * as rideService from '../services/rideService';

export function useRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rideService.getRides();
      setRides(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch ride histories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return {
    rides,
    loading,
    error,
    refreshRides: fetchRides
  };
}
