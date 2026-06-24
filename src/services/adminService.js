import { mockDB, delay } from '../api/mockDb';
import { Admin } from '../types';
// import * as authApi from '../api/authApi';

// Called when Master Admin creates a KYC or Operations Admin
// Endpoint: POST /api/admin/create
export async function createAdmin(payload) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(500);
  const newAdmin = new Admin({
    id: `ADM${String(mockDB.admins.length + 1).padStart(3, '0')}`,
    status: 'Active',
    ...payload
  });
  mockDB.admins.push(newAdmin);
  return { success: true, adminId: newAdmin.id };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.createAdmin(payload);
  // return data;
}

// Fetch list of admin users
// Endpoint: GET /api/admin/list
export async function getAdmins() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.admins.map(a => new Admin(a));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.getAdmins();
  // return data.map(a => new Admin(a));
}

// Get details of a specific admin user
// Endpoint: GET /api/admin/:id
export async function getAdminById(id) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(200);
  const admin = mockDB.admins.find(a => a.id === id);
  if (!admin) throw new Error('Admin not found');
  return new Admin(admin);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.getAdminById(id);
  // return new Admin(data);
}

// Update admin details
// Endpoint: PUT /api/admin/:id
export async function updateAdmin(id, payload) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  mockDB.admins = mockDB.admins.map(a => a.id === id ? { ...a, ...payload } : a);
  const updated = mockDB.admins.find(a => a.id === id);
  if (!updated) throw new Error('Admin not found');
  return new Admin(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.updateAdmin(id, payload);
  // return new Admin(data);
}

// Suspend an admin account
// Endpoint: POST /api/admin/:id/suspend
export async function suspendAdmin(id) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  mockDB.admins = mockDB.admins.map(a => a.id === id ? { ...a, status: 'Suspended' } : a);
  const updated = mockDB.admins.find(a => a.id === id);
  if (!updated) throw new Error('Admin not found');
  return new Admin(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.suspendAdmin(id);
  // return new Admin(data);
}
