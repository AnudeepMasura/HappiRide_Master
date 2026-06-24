import { useContext } from 'react';
import SettingsContext from '../context/SettingsContext';

export function useEmployees() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useEmployees must be used within a SettingsProvider');
  }

  const {
    employees,
    loading,
    error,
    refreshSettings,
    addEmployee,
    toggleEmployeeStatus
  } = context;

  const createEmployee = async (payload) => {
    return await addEmployee(payload);
  };

  return {
    employees,
    loading,
    error,
    createEmployee,
    toggleEmployeeStatus,
    refreshEmployees: refreshSettings
  };
}
