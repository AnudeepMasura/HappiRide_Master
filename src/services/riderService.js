import { mockDB, delay } from '../api/mockDb';
import { Rider } from '../types';
// import * as driverApi from '../api/driverApi';

// Fetch list of driver partners
// Endpoint: GET /api/riders/list
export async function getRiders() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.riders.map(r => new Rider(r));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.getRiders();
  // return data.map(r => new Rider(r));
}

// Get details of a single driver partner
// Endpoint: GET /api/riders/:id
export async function getRiderById(id) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(200);
  const rider = mockDB.riders.find(r => r.id === id);
  if (!rider) throw new Error('Rider not found');
  return new Rider(rider);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.getRiderById(id);
  // return new Rider(data);
}

// Change rider account state (Active, Restricted, Suspended)
// Endpoint: POST /api/riders/:id/status
export async function updateRiderStatus(id, status) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  mockDB.riders = mockDB.riders.map(r => r.id === id ? { ...r, status } : r);
  const updated = mockDB.riders.find(r => r.id === id);
  if (!updated) throw new Error('Rider not found');
  return new Rider(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.updateRiderStatus(id, status);
  // return new Rider(data);
}

// Create new driver profile
// Endpoint: POST /api/riders/create
export async function createRider(payload) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(400);
  const newRider = new Rider({
    id: `RDR${String(mockDB.riders.length + 1).padStart(3, '0')}`,
    status: 'Active',
    ...payload
  });
  mockDB.riders.push(newRider);
  return newRider;

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await driverApi.createRider(payload);
  // return new Rider(data);
}
