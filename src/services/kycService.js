import { KycRequest } from '../types';
import * as driverApi from '../api/driverApi';

// Fetch all driver KYC application records
// Endpoint: GET /api/kyc/list
export async function getKYCList() {
  const data = await driverApi.getKYCList();
  return data.map(k => new KycRequest(k));
}

// Fetch pending driver KYC applications
// Endpoint: GET /api/kyc/pending
export async function getPendingKyc() {
  const data = await driverApi.getPendingKyc();
  return data.map(k => new KycRequest(k));
}

// Update KYC application status (Approve, Reject, Request Reupload)
// Endpoint: POST /api/kyc/:riderId/status
export async function updateKYCStatus(riderId, status, officerName, rejectionNote = '') {
  const data = await driverApi.updateKYCStatus(riderId, status, officerName, rejectionNote);
  return new KycRequest(data);
}

// Approve a driver's KYC credentials
export async function approveKyc(riderId, officerName) {
  return updateKYCStatus(riderId, 'Approved', officerName);
}

// Reject a driver's KYC credentials
export async function rejectKyc(riderId, officerName, reason) {
  return updateKYCStatus(riderId, 'Rejected', officerName, reason);
}

// Request rider to reupload specific documents
export async function requestReupload(riderId, officerName, instructions) {
  return updateKYCStatus(riderId, 'Request Reupload', officerName, instructions);
}

// Block rider from applying for KYC
export async function blockKyc(riderId) {
  return updateKYCStatus(riderId, 'Blocked', 'System Admin', 'Permanently Blocked');
}

// Get KYC action history logs
// Endpoint: GET /api/kyc/:riderId/history
export async function getKycHistory(riderId) {
  const data = await driverApi.getKycHistory(riderId);
  return data;
}
