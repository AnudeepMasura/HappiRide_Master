import { Rider } from '../types';
import * as driverApi from '../api/driverApi';

// Fetch list of driver partners
// Endpoint: GET /api/riders/list
export async function getRiders() {
  const data = await driverApi.getRiders();
  return data.map(r => new Rider(r));
}

// Get details of a single driver partner
// Endpoint: GET /api/riders/:id
export async function getRiderById(id) {
  const data = await driverApi.getRiderById(id);
  return new Rider(data);
}

// Change rider account state (Active, Restricted, Suspended)
// Endpoint: POST /api/riders/:id/status
export async function updateRiderStatus(id, status) {
  const data = await driverApi.updateRiderStatus(id, status);
  return new Rider(data);
}

// Create new driver profile
// Endpoint: POST /api/riders/create
export async function createRider(payload) {
  const data = await driverApi.createRider(payload);
  return new Rider(data);
}
