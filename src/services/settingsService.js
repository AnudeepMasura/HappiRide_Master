import { mockDB, delay } from '../api/mockDb';
import { Service, City } from '../types';
// import * as vehicleApi from '../api/vehicleApi';
// import * as authApi from '../api/authApi';

// Fetch platform service types configurations
// Endpoint: GET /api/settings/services
export async function getServices() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.services.map(s => new Service(s));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await vehicleApi.getServices();
  // return data.map(s => new Service(s));
}

// Update fares for a service category
// Endpoint: PUT /api/settings/services/:id
export async function updateService(id, payload) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  mockDB.services = mockDB.services.map(s => s.id === id ? { ...s, ...payload } : s);
  const updated = mockDB.services.find(s => s.id === id);
  if (!updated) throw new Error('Service configuration not found');
  return new Service(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await vehicleApi.updateService(id, payload);
  // return new Service(data);
}

export async function updateServiceConfig(id, payload) {
  return updateService(id, payload);
}

// Fetch operational cities settings
// Endpoint: GET /api/settings/cities
export async function getCities() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.cities.map(c => new City(c));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await vehicleApi.getCities();
  // return data.map(c => new City(c));
}

// Toggle city operational status
// Endpoint: POST /api/settings/cities/:id/status
export async function updateCityStatus(id, status) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  mockDB.cities = mockDB.cities.map(c => c.id === id ? { ...c, status } : c);
  const updated = mockDB.cities.find(c => c.id === id);
  if (!updated) throw new Error('City registry not found');
  return new City(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await vehicleApi.updateCityStatus(id, status);
  // return new City(data);
}

// Update city municipal settings
// Endpoint: PUT /api/settings/cities/:id
export async function updateCityConfig(id, payload) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  mockDB.cities = mockDB.cities.map(c => c.id === id ? { ...c, ...payload } : c);
  const updated = mockDB.cities.find(c => c.id === id);
  if (!updated) throw new Error('City registry not found');
  return new City(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await vehicleApi.updateCityConfig(id, payload);
  // return new City(data);
}

// Employee management delegations
export async function toggleEmployeeStatus(id, currentStatus) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  mockDB.employees = mockDB.employees.map(e => e.id === id ? { ...e, status: nextStatus } : e);
  return { success: true };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // await authApi.toggleEmployeeStatus(id, currentStatus);
  // return { success: true };
}

export async function addEmployee(employee) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  const newEmp = {
    id: `EMP${String(mockDB.employees.length + 1).padStart(3, '0')}`,
    status: 'Active',
    ...employee
  };
  mockDB.employees.push(newEmp);
  return { success: true, employee: newEmp };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.createEmployee(employee);
  // return { success: true, employee: data.employee || data };
}

export async function getEmployees() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return [...mockDB.employees];

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await authApi.getEmployees();
  // return data;
}

export async function updateEmployeeStatus(id, status) {
  return toggleEmployeeStatus(id, status === 'Active' ? 'Inactive' : 'Active');
}
