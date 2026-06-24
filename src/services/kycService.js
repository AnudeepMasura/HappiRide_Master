import { mockDB, delay } from '../api/mockDb';
import { KycRequest } from '../types';
// import * as driverApi from '../api/driverApi';

// Fetch all driver KYC application records
// Endpoint: GET /api/kyc/list
export async function getKYCList() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.kycList.map(k => new KycRequest(k));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.getKYCList();
  // return data.map(k => new KycRequest(k));
}

// Fetch pending driver KYC applications
// Endpoint: GET /api/kyc/pending
export async function getPendingKyc() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.kycList.filter(k => k.status === 'Pending').map(k => new KycRequest(k));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.getPendingKyc();
  // return data.map(k => new KycRequest(k));
}

// Update KYC application status (Approve, Reject, Request Reupload)
// Endpoint: POST /api/kyc/:riderId/status
export async function updateKYCStatus(riderId, status, officerName, rejectionNote = '') {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  mockDB.kycList = mockDB.kycList.map(k => {
    if (k.riderId === riderId) {
      const historyNode = {
        date: new Date().toISOString().split('T')[0],
        action: status,
        note: rejectionNote || `Kyc review by ${officerName}`
      };
      return { 
        ...k, 
        status, 
        approvedBy: status === 'Approved' ? officerName : k.approvedBy,
        history: [...k.history, historyNode]
      };
    }
    return k;
  });
  
  // Sync rider status
  if (status === 'Approved') {
    mockDB.riders = mockDB.riders.map(r => r.id === riderId ? { ...r, status: 'Active' } : r);
  } else if (status === 'Rejected') {
    mockDB.riders = mockDB.riders.map(r => r.id === riderId ? { ...r, status: 'Restricted' } : r);
  }
  
  const updated = mockDB.kycList.find(k => k.riderId === riderId);
  if (!updated) throw new Error('KYC Request not found');
  return new KycRequest(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.updateKYCStatus(riderId, status, officerName, rejectionNote);
  // return new KycRequest(data);
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
  // --- MOCK DATABASE CODE (Active) ---
  await delay(200);
  const kyc = mockDB.kycList.find(k => k.riderId === riderId);
  if (!kyc) throw new Error('KYC profile not found');
  return kyc.history;

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.getKycHistory(riderId);
  // return data;
}
