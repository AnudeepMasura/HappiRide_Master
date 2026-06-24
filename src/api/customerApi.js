import { apiClient } from './client';

// Customer (Users) endpoints
export async function getUsers() {
  const response = await apiClient.get('/users/list');
  return response.data;
}

export async function updateUserStatus(id, status) {
  const response = await apiClient.post(`/users/${id}/status`, { status });
  return response.data;
}

// Support Tickets endpoints
export async function getTickets() {
  const response = await apiClient.get('/support/tickets');
  return response.data;
}

export async function updateTicketStatus(id, status, solution = '') {
  const response = await apiClient.post(`/support/tickets/${id}/status`, { status, solution });
  return response.data;
}

export async function assignTicket(id, employeeName) {
  const response = await apiClient.post(`/support/tickets/${id}/assign`, { employeeName });
  return response.data;
}
