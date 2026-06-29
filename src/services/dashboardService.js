import * as bookingApi from '../api/bookingApi';

// Get platform KPIs (Active users, rides, earnings)
// Endpoint: GET /api/dashboard/stats
export async function getStats() {
  const data = await bookingApi.getStats();
  return data;
}

// Get data for analytics graphs
// Endpoint: GET /api/dashboard/charts
export async function getCharts() {
  const data = await bookingApi.getCharts();
  return data;
}

// Get system notifications for admin alert panel
// Endpoint: GET /api/dashboard/notifications
export async function getNotifications() {
  const data = await bookingApi.getNotifications();
  return data;
}
