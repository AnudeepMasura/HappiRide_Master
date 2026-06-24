import { apiClient } from './client';

// Vehicle service configurations
export async function getServices() {
  const response = await apiClient.get('/settings/services');
  return response.data;
}

export async function updateService(id, payload) {
  const response = await apiClient.put(`/settings/services/${id}`, payload);
  return response.data;
}

// Operational cities settings
export async function getCities() {
  const response = await apiClient.get('/settings/cities');
  return response.data;
}

export async function updateCityStatus(id, status) {
  const response = await apiClient.post(`/settings/cities/${id}/status`, { status });
  return response.data;
}

export async function updateCityConfig(id, payload) {
  const response = await apiClient.put(`/settings/cities/${id}`, payload);
  return response.data;
}
