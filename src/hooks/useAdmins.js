import { useState, useEffect } from 'react';
import * as adminService from '../services/adminService';

export function useAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const createAdmin = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.createAdmin(payload);
      await fetchAdmins(); // Refresh list
      return { success: true, adminId: result.adminId };
    } catch (err) {
      setError(err.message || 'Failed to create admin');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    admins,
    loading,
    error,
    createAdmin,
    refreshAdmins: fetchAdmins
  };
}
