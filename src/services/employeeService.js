import { Employee } from '../types';
import * as authApi from '../api/authApi';

// Create a new platform employee staff account
// Endpoint: POST /api/employees/create
export async function createEmployee(payload) {
  const data = await authApi.createEmployee(payload);
  return { success: true, employee: new Employee(data.employee || data) };
}

// Fetch list of employee staff accounts
// Endpoint: GET /api/employees/list
export async function getEmployees() {
  const data = await authApi.getEmployees();
  return data.map(e => new Employee(e));
}

// Assign employee staff member to a supervisor admin
// Endpoint: POST /api/employees/assign
export async function assignEmployeeToAdmin(employeeId, adminId) {
  const data = await authApi.assignEmployeeToAdmin(employeeId, adminId);
  return new Employee(data);
}

// Update employee details
// Endpoint: PUT /api/employees/:id
export async function updateEmployee(id, payload) {
  const data = await authApi.updateEmployee(id, payload);
  return new Employee(data);
}

// Toggle active/inactive status of an employee
// Endpoint: POST /api/employees/:id/toggle-status
export async function toggleEmployeeStatus(id, currentStatus) {
  const data = await authApi.toggleEmployeeStatus(id, currentStatus);
  return new Employee(data);
}

export async function updateEmployeeStatus(id, status) {
  return toggleEmployeeStatus(id, status === 'Active' ? 'Inactive' : 'Active');
}
