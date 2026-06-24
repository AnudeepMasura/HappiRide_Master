import { mockDB, delay } from '../api/mockDb';
import { Admin } from '../types';
// import * as authApi from '../api/authApi';

// Called to authenticate administrator user credentials
// Backend returns JWT token and User Details
// Endpoint: POST /api/auth/login
export async function login(email, password) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(500);
  const adminMatch = mockDB.admins.find(
    a => a.email.toLowerCase() === email.toLowerCase()
  );

  if (adminMatch && password === 'password') {
    const token = 'mock-jwt-token-12345';
    const adminObj = new Admin({ ...adminMatch, token });
    return { success: true, user: adminObj };
  }
  
  // Support email-prefix display name fallback for any email in mock
  const nameFromEmail = email.split('@')[0];
  const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
  const fallbackAdmin = new Admin({
    id: 'ADM_FB',
    name: displayName || 'Admin User',
    email: email,
    role: 'Super Admin',
    permissions: ['Dashboard', 'Analytics', 'Wallet', 'Support', 'KYC', 'Settings'],
    status: 'Active',
    token: 'mock-jwt-token-fallback'
  });
  return { success: true, user: fallbackAdmin };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.login(email, password);
  // const { user, token } = data;
  // return { success: true, user: new Admin({ ...user, token }) };
}

// Called to invalidate admin session token
// Endpoint: POST /api/auth/logout
export async function logout() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(100);
  return { success: true };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.logout();
  // return data;
}

// Called to refresh JWT token
// Endpoint: POST /api/auth/refresh
export async function refreshToken() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(100);
  return { success: true, token: 'mock-jwt-refreshed-token' };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.refreshToken();
  // return data;
}
