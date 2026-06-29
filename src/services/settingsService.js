import { Service, City } from '../types';
import * as vehicleApi from '../api/vehicleApi';
import * as authApi from '../api/authApi';

// Fetch platform service types configurations
// Endpoint: GET /api/settings/services
export async function getServices() {
  const data = await vehicleApi.getServices();
  return data.map(s => new Service(s));
}

// Update fares for a service category
// Endpoint: PUT /api/settings/services/:id
export async function updateService(id, payload) {
  const data = await vehicleApi.updateService(id, payload);
  return new Service(data);
}

export async function updateServiceConfig(id, payload) {
  return updateService(id, payload);
}

// Fetch operational cities settings
// Endpoint: GET /api/settings/cities
export async function getCities() {
  const data = await vehicleApi.getCities();
  return data.map(c => new City(c));
}

// Toggle city operational status
// Endpoint: POST /api/settings/cities/:id/status
export async function updateCityStatus(id, status) {
  const data = await vehicleApi.updateCityStatus(id, status);
  return new City(data);
}

// Update city municipal settings
// Endpoint: PUT /api/settings/cities/:id
export async function updateCityConfig(id, payload) {
  const data = await vehicleApi.updateCityConfig(id, payload);
  return new City(data);
}

// Employee management delegations
export async function toggleEmployeeStatus(id, currentStatus) {
  await authApi.toggleEmployeeStatus(id, currentStatus);
  return { success: true };
}

export async function addEmployee(employee) {
  const data = await authApi.createEmployee(employee);
  return { success: true, employee: data.employee || data };
}

// Fetch list of employee staff accounts
export async function getEmployees() {
  const data = await authApi.getEmployees();
  return data;
}

export async function updateEmployeeStatus(id, status) {
  return toggleEmployeeStatus(id, status === 'Active' ? 'Inactive' : 'Active');
}
