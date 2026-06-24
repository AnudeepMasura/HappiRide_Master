import { mockDB, delay } from '../api/mockDb';
import { SupportTicket } from '../types';
// import * as customerApi from '../api/customerApi';

// Fetch client complaints and support tickets
// Endpoint: GET /api/support/tickets
export async function getTickets() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return mockDB.tickets.map(t => new SupportTicket(t));

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await customerApi.getTickets();
  // return data.map(t => new SupportTicket(t));
}

// Update ticket state (Open, Pending, Closed)
// Endpoint: POST /api/support/tickets/:id/status
export async function updateTicketStatus(id, status, solution = '') {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  mockDB.tickets = mockDB.tickets.map(t => 
    t.id === id ? { ...t, status, solution } : t
  );
  const updated = mockDB.tickets.find(t => t.id === id);
  if (!updated) throw new Error('Ticket not found');
  return new SupportTicket(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await customerApi.updateTicketStatus(id, status, solution);
  // return new SupportTicket(data);
}

// Assign support ticket to an employee agent
// Endpoint: POST /api/support/tickets/:id/assign
export async function assignTicket(id, employeeName) {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  mockDB.tickets = mockDB.tickets.map(t => 
    t.id === id ? { ...t, assignedEmployee: employeeName } : t
  );
  const updated = mockDB.tickets.find(t => t.id === id);
  if (!updated) throw new Error('Ticket not found');
  return new SupportTicket(updated);

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await customerApi.assignTicket(id, employeeName);
  // return new SupportTicket(data);
}
