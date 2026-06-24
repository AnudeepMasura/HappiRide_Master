import { useState, useEffect } from 'react';
import * as kycService from '../services/kycService';

export function useKyc() {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKycList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kycService.getKYCList();
      setKycList(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch KYC queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycList();
  }, []);

  const updateKycStatus = async (riderId, status, officerName, note = '') => {
    setError(null);
    try {
      const updated = await kycService.updateKYCStatus(riderId, status, officerName, note);
      // Sync local list state
      setKycList(prev => prev.map(k => k.riderId === riderId ? updated : k));
      return { success: true, kyc: updated };
    } catch (err) {
      setError(err.message || 'Failed to update KYC status');
      return { success: false, error: err.message };
    }
  };

  const approveKyc = async (riderId, officerName) => {
    return updateKycStatus(riderId, 'Approved', officerName);
  };

  const rejectKyc = async (riderId, officerName, reason) => {
    return updateKycStatus(riderId, 'Rejected', officerName, reason);
  };

  const requestReupload = async (riderId, officerName, instructions) => {
    return updateKycStatus(riderId, 'Request Reupload', officerName, instructions);
  };

  return {
    kycList,
    loading,
    error,
    refreshKyc: fetchKycList,
    updateKycStatus,
    approveKyc,
    rejectKyc,
    requestReupload
  };
}
