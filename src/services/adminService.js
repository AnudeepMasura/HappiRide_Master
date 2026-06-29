import { Admin } from '../types';
import * as authApi from '../api/authApi';

// Called when Master Admin creates a KYC or Operations Admin
// Endpoint: POST /api/admin/create
export async function createAdmin(payload) {
  const data = await authApi.createAdmin(payload);
  return data;
}

// Fetch list of admin users
// Endpoint: GET /api/admin/list
export async function getAdmins() {
  const data = await authApi.getAdmins();
  return data.map(a => new Admin(a));
}

// Get details of a specific admin user
// Endpoint: GET /api/admin/:id
export async function getAdminById(id) {
  const data = await authApi.getAdminById(id);
  return new Admin(data);
}

// Update admin details
// Endpoint: PUT /api/admin/:id
export async function updateAdmin(id, payload) {
  const data = await authApi.updateAdmin(id, payload);
  return new Admin(data);
}

// Suspend an admin account
// Endpoint: POST /api/admin/:id/suspend
export async function suspendAdmin(id) {
  const data = await authApi.suspendAdmin(id);
  return new Admin(data);
}
