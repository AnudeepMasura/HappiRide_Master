import { mockDB, delay } from '../api/mockDb';
import { Ride } from '../types';
// import * as bookingApi from '../api/bookingApi';

// Fetch history of platform trips
// Endpoint: GET /api/rides/history
export async function getRides() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.rides.map(r => new Ride(r));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await bookingApi.getRides();
  // return data.map(r => new Ride(r));
}

// Get detail stats of a specific ride
// Endpoint: GET /api/rides/:id
export async function getRideById(id) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(200);
  const ride = mockDB.rides.find(r => r.id === id);
  if (!ride) throw new Error('Ride history booking not found');
  return new Ride(ride);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await bookingApi.getRideById(id);
  // return new Ride(data);
}
