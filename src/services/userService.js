import { Employee } from '../types'; // Customer profiles share Employee/User schema attributes
import * as customerApi from '../api/customerApi';

// Fetch customer profiles directory
// Endpoint: GET /api/users/list
export async function getUsers() {
  const data = await customerApi.getUsers();
  return data.map(u => new Employee(u));
}

// Toggle or update customer profile status
// Endpoint: POST /api/users/:id/status
export async function updateUserStatus(id, status) {
  const data = await customerApi.updateUserStatus(id, status);
  return new Employee(data);
}
