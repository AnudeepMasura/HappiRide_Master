import { Ride } from '../types';
import * as bookingApi from '../api/bookingApi';

// Fetch history of platform trips
// Endpoint: GET /api/rides/history
export async function getRides() {
  const data = await bookingApi.getRides();
  return data.map(r => new Ride(r));
}

// Get detail stats of a specific ride
// Endpoint: GET /api/rides/:id
export async function getRideById(id) {
  const data = await bookingApi.getRideById(id);
  return new Ride(data);
}
