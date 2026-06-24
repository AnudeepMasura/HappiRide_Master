import { mockDB, delay } from '../api/mockDb';
import { Withdrawal } from '../types';
// import * as driverApi from '../api/driverApi';

// Fetch withdrawal requests list
// Endpoint: GET /api/wallet/withdrawals
export async function getWithdrawals() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.withdrawals.map(w => new Withdrawal(w));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.getWithdrawals();
  // return data.map(w => new Withdrawal(w));
}

// Approve a withdrawal request
// Endpoint: POST /api/wallet/withdrawals/:id/approve
export async function approveWithdrawal(id, transactionId) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  mockDB.withdrawals = mockDB.withdrawals.map(w => 
    w.id === id ? { ...w, status: 'Approved', trxnId: transactionId } : w
  );
  const updated = mockDB.withdrawals.find(w => w.id === id);
  if (!updated) throw new Error('Withdrawal record not found');
  return new Withdrawal(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.approveWithdrawal(id, transactionId);
  // return new Withdrawal(data);
}

// Reject a withdrawal request
// Endpoint: POST /api/wallet/withdrawals/:id/reject
export async function rejectWithdrawal(id, reason) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  mockDB.withdrawals = mockDB.withdrawals.map(w => 
    w.id === id ? { ...w, status: 'Rejected', rejectionReason: reason } : w
  );
  const updated = mockDB.withdrawals.find(w => w.id === id);
  if (!updated) throw new Error('Withdrawal record not found');
  return new Withdrawal(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.rejectWithdrawal(id, reason);
  // return new Withdrawal(data);
}

// Fetch financial stats overview
// Endpoint: GET /api/wallet/finance-stats
export async function getFinanceStats() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  const data = mockDB.withdrawals;
  const pendingCount = data.filter(w => w.status === 'Pending').length;
  const completedCount = data.filter(w => w.status === 'Approved').length;
  const pendingAmount = data.filter(w => w.status === 'Pending').reduce((sum, w) => sum + w.amount, 0);
  const completedAmount = data.filter(w => w.status === 'Approved').reduce((sum, w) => sum + w.amount, 0);

  return {
    grossOrderValue: 2200, 
    revenue: 330,
    availableBalance: 2450,
    withdrawalRequests: pendingCount,
    pendingWithdrawals: pendingAmount,
    completedWithdrawals: completedAmount
  };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.getFinanceStats();
  // return data;
}
