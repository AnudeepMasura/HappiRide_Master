import { apiClient } from './client';

// Booking (Ride) endpoints
export async function getRides() {
  const response = await apiClient.get('/rides/history');
  return response.data;
}

export async function getRideById(id) {
  const response = await apiClient.get(`/rides/${id}`);
  return response.data;
}

// Dashboard statistics & chart metrics endpoints
export async function getStats() {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
}

export async function getCharts() {
  const response = await apiClient.get('/dashboard/charts');
  return response.data;
}
