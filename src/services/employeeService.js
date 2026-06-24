import { mockDB, delay } from '../api/mockDb';
import { Employee } from '../types';
// import * as authApi from '../api/authApi';

// Create a new platform employee staff account
// Endpoint: POST /api/employees/create
export async function createEmployee(payload) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(500);
  const newEmp = new Employee({
    id: `EMP${String(mockDB.employees.length + 1).padStart(3, '0')}`,
    status: 'Active',
    ...payload
  });
  mockDB.employees.push(newEmp);
  return { success: true, employee: newEmp };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.createEmployee(payload);
  // return { success: true, employee: new Employee(data.employee || data) };
}

// Fetch list of employee staff accounts
// Endpoint: GET /api/employees/list
export async function getEmployees() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.employees.map(e => new Employee(e));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.getEmployees();
  // return data.map(e => new Employee(e));
}

// Assign employee staff member to a supervisor admin
// Endpoint: POST /api/employees/assign
export async function assignEmployeeToAdmin(employeeId, adminId) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  mockDB.employees = mockDB.employees.map(e => e.id === employeeId ? { ...e, assignedAdminId: adminId } : e);
  const updated = mockDB.employees.find(e => e.id === employeeId);
  if (!updated) throw new Error('Employee not found');
  return new Employee(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.assignEmployeeToAdmin(employeeId, adminId);
  // return new Employee(data);
}

// Update employee details
// Endpoint: PUT /api/employees/:id
export async function updateEmployee(id, payload) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  mockDB.employees = mockDB.employees.map(e => e.id === id ? { ...e, ...payload } : e);
  const updated = mockDB.employees.find(e => e.id === id);
  if (!updated) throw new Error('Employee not found');
  return new Employee(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.updateEmployee(id, payload);
  // return new Employee(data);
}

// Toggle active/inactive status of an employee
// Endpoint: POST /api/employees/:id/toggle-status
export async function toggleEmployeeStatus(id, currentStatus) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  mockDB.employees = mockDB.employees.map(e => e.id === id ? { ...e, status: nextStatus } : e);
  const updated = mockDB.employees.find(e => e.id === id);
  if (!updated) throw new Error('Employee not found');
  return new Employee(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.toggleEmployeeStatus(id, currentStatus);
  // return new Employee(data);
}

export async function updateEmployeeStatus(id, status) {
  return toggleEmployeeStatus(id, status === 'Active' ? 'Inactive' : 'Active');
}
