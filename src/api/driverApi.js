import { apiClient } from './client';

// Driver Partners (Riders) endpoints
export async function getRiders() {
  const response = await apiClient.get('/riders/list');
  return response.data;
}

export async function getRiderById(id) {
  const response = await apiClient.get(`/riders/${id}`);
  return response.data;
}

export async function updateRiderStatus(id, status) {
  const response = await apiClient.post(`/riders/${id}/status`, { status });
  return response.data;
}

export async function createRider(payload) {
  const response = await apiClient.post('/riders/create', payload);
  return response.data;
}

// KYC application endpoints
export async function getKYCList() {
  const response = await apiClient.get('/kyc/list');
  return response.data;
}

export async function getPendingKyc() {
  const response = await apiClient.get('/kyc/pending');
  return response.data;
}

export async function updateKYCStatus(riderId, status, officerName, rejectionNote = '') {
  const response = await apiClient.post(`/kyc/${riderId}/status`, { status, officerName, rejectionNote });
  return response.data;
}

export async function getKycHistory(riderId) {
  const response = await apiClient.get(`/kyc/${riderId}/history`);
  return response.data;
}

// Wallet & Withdrawal endpoints
export async function getWithdrawals() {
  const response = await apiClient.get('/wallet/withdrawals');
  return response.data;
}

export async function approveWithdrawal(id, transactionId) {
  const response = await apiClient.post(`/wallet/withdrawals/${id}/approve`, { transactionId });
  return response.data;
}

export async function rejectWithdrawal(id, reason) {
  const response = await apiClient.post(`/wallet/withdrawals/${id}/reject`, { reason });
  return response.data;
}

export async function getFinanceStats() {
  const response = await apiClient.get('/wallet/finance-stats');
  return response.data;
}
