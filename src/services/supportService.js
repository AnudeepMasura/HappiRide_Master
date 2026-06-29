import { SupportTicket } from '../types';
import * as customerApi from '../api/customerApi';

// Fetch client complaints and support tickets
// Endpoint: GET /api/support/tickets
export async function getTickets() {
  const data = await customerApi.getTickets();
  return data.map(t => new SupportTicket(t));
}

// Update ticket state (Open, Pending, Closed)
// Endpoint: POST /api/support/tickets/:id/status
export async function updateTicketStatus(id, status, solution = '') {
  const data = await customerApi.updateTicketStatus(id, status, solution);
  return new SupportTicket(data);
}

// Assign support ticket to an employee agent
// Endpoint: POST /api/support/tickets/:id/assign
export async function assignTicket(id, employeeName) {
  const data = await customerApi.assignTicket(id, employeeName);
  return new SupportTicket(data);
}
