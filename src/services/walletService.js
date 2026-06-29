import { Withdrawal } from '../types';
import * as driverApi from '../api/driverApi';

// Fetch withdrawal requests list
// Endpoint: GET /api/wallet/withdrawals
export async function getWithdrawals() {
  const data = await driverApi.getWithdrawals();
  return data.map(w => new Withdrawal(w));
}

// Approve a withdrawal request
// Endpoint: POST /api/wallet/withdrawals/:id/approve
export async function approveWithdrawal(id, transactionId) {
  const data = await driverApi.approveWithdrawal(id, transactionId);
  return new Withdrawal(data);
}

// Reject a withdrawal request
// Endpoint: POST /api/wallet/withdrawals/:id/reject
export async function rejectWithdrawal(id, reason) {
  const data = await driverApi.rejectWithdrawal(id, reason);
  return new Withdrawal(data);
}

// Fetch financial stats overview
// Endpoint: GET /api/wallet/finance-stats
export async function getFinanceStats() {
  const data = await driverApi.getFinanceStats();
  return data;
}
