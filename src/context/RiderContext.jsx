import React, { createContext, useState, useEffect, useContext } from 'react';
import * as riderService from '../services/riderService';

const RiderContext = createContext();

export const RiderProvider = ({ children }) => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await riderService.getRiders();
      setRiders(data);
    } catch (err) {
      setError(err.message || 'Failed to load riders');
    } finally {
      setLoading(false);
    }
  };

  const updateRiderStatus = async (id, status) => {
    try {
      const updatedRider = await riderService.updateRiderStatus(id, status);
      setRiders(prev => prev.map(r => r.id === id ? updatedRider : r));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <RiderContext.Provider value={{ riders, loading, error, refreshRiders: loadRiders, updateRiderStatus }}>
      {children}
    </RiderContext.Provider>
  );
};

export const useRiders = () => useContext(RiderContext);
export default RiderContext;

