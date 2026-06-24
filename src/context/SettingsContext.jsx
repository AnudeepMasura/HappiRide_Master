import React, { createContext, useState, useEffect, useContext } from 'react';
import * as settingsService from '../services/settingsService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const emps = await settingsService.getEmployees();
      const srvs = await settingsService.getServices();
      const cts = await settingsService.getCities();
      
      setEmployees(emps);
      setServices(srvs);
      setCities(cts);
    } catch (err) {
      setError(err.message || 'Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const updateServiceConfig = async (id, updatedConfig) => {
    try {
      const updated = await settingsService.updateServiceConfig(id, updatedConfig);
      setServices(prev => prev.map(s => s.id === id ? updated : s));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCityStatus = async (id, status) => {
    try {
      const updated = await settingsService.updateCityStatus(id, status);
      setCities(prev => prev.map(c => c.id === id ? updated : c));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCityConfig = async (id, config) => {
    try {
      const updated = await settingsService.updateCityConfig(id, config);
      setCities(prev => prev.map(c => c.id === id ? updated : c));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addEmployee = async (employee) => {
    try {
      const result = await settingsService.addEmployee(employee);
      setEmployees(prev => [...prev, result.employee]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleEmployeeStatus = async (id, currentStatus) => {
    try {
      await settingsService.toggleEmployeeStatus(id, currentStatus);
      const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: nextStatus } : e));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <SettingsContext.Provider value={{
      employees,
      services,
      cities,
      loading,
      error,
      refreshSettings: loadSettingsData,
      updateServiceConfig,
      updateCityStatus,
      updateCityConfig,
      addEmployee,
      toggleEmployeeStatus
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;

