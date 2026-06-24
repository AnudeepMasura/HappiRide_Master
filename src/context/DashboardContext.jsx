import React, { createContext, useState, useEffect, useContext } from 'react';
import * as dashboardService from '../services/dashboardService';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await dashboardService.getStats();
      const chartsData = await dashboardService.getCharts();
      setStats(statsData);
      setCharts(chartsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider value={{ stats, charts, loading, error, refreshData: loadDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
export default DashboardContext;

