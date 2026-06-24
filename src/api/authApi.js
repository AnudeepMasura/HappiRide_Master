import { apiClient } from './client';

// Authentication endpoints
export async function login(email, password) {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

export async function logout() {
  const response = await apiClient.post('/auth/logout');
  return response.data;
}

export async function refreshToken() {
  const response = await apiClient.post('/auth/refresh');
  return response.data;
}

// Master Admin endpoints
export async function getAdmins() {
  const response = await apiClient.get('/admin/list');
  return response.data;
}

export async function getAdminById(id) {
  const response = await apiClient.get(`/admin/${id}`);
  return response.data;
}

export async function createAdmin(payload) {
  const response = await apiClient.post('/admin/create', payload);
  return response.data;
}

export async function updateAdmin(id, payload) {
  const response = await apiClient.put(`/admin/${id}`, payload);
  return response.data;
}

export async function suspendAdmin(id) {
  const response = await apiClient.post(`/admin/${id}/suspend`);
  return response.data;
}

// Employee/Staff endpoints
export async function getEmployees() {
  const response = await apiClient.get('/employees/list');
  return response.data;
}

export async function createEmployee(payload) {
  const response = await apiClient.post('/employees/create', payload);
  return response.data;
}

export async function updateEmployee(id, payload) {
  const response = await apiClient.put(`/employees/${id}`, payload);
  return response.data;
}

export async function assignEmployeeToAdmin(employeeId, adminId) {
  const response = await apiClient.post('/employees/assign', { employeeId, adminId });
  return response.data;
}

export async function toggleEmployeeStatus(id, currentStatus) {
  const response = await apiClient.post(`/employees/${id}/toggle-status`, { currentStatus });
  return response.data;
}
