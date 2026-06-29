import { Admin } from '../types';
import * as authApi from '../api/authApi';

// Called to authenticate administrator user credentials
// Backend returns JWT token and User Details
// Endpoint: POST /api/auth/login
export async function login(email, password) {
  const data = await authApi.login(email, password);
  const { user, token } = data;
  return { success: true, user: new Admin({ ...user, token }) };
}

// Called to invalidate admin session token
// Endpoint: POST /api/auth/logout
export async function logout() {
  const data = await authApi.logout();
  return data;
}

// Called to refresh JWT token
// Endpoint: POST /api/auth/refresh
export async function refreshToken() {
  const data = await authApi.refreshToken();
  return data;
}
