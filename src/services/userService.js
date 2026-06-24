import { mockDB, delay } from '../api/mockDb';
import { Employee } from '../types'; // Customer profiles share Employee/User schema attributes
// import * as customerApi from '../api/customerApi';

// Fetch customer profiles directory
// Endpoint: GET /api/users/list
export async function getUsers() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.users.map(u => new Employee(u));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await customerApi.getUsers();
  // return data.map(u => new Employee(u));
}

// Toggle or update customer profile status
// Endpoint: POST /api/users/:id/status
export async function updateUserStatus(id, status) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  mockDB.users = mockDB.users.map(u => u.id === id ? { ...u, status } : u);
  const updated = mockDB.users.find(u => u.id === id);
  if (!updated) throw new Error('User not found');
  return new Employee(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await customerApi.updateUserStatus(id, status);
  // return new Employee(data);
}
