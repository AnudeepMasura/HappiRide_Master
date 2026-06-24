import { mockDB, delay } from '../api/mockDb';
// import * as bookingApi from '../api/bookingApi';

// Get platform KPIs (Active users, rides, earnings)
// Endpoint: GET /api/dashboard/stats
export async function getStats() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  
  // Simulate real calculations
  const rides = mockDB.rides;
  const users = mockDB.users;
  const riders = mockDB.riders;
  const tickets = mockDB.tickets;

  const totalRidesToday = rides.length; 
  const totalActiveRides = rides.filter(r => r.status === 'Ongoing').length;
  const totalActiveUsers = users.filter(u => u.status === 'Active').length;
  const totalActiveRiders = riders.filter(r => r.status === 'Active').length;

  // Ratios
  const ridesPerUser = totalActiveUsers > 0 ? Number((totalRidesToday / totalActiveUsers).toFixed(1)) : 0;
  const ridesPerRider = totalActiveRiders > 0 ? Number((totalRidesToday / totalActiveRiders).toFixed(1)) : 0;

  // Finances
  const grossOrderValue = rides.reduce((sum, r) => sum + r.fare, 0);
  const platformRevenue = rides.reduce((sum, r) => sum + (r.fare * 0.15), 0); // 15% platform fee

  const totalSupportTickets = tickets.length;
  const activeTickets = tickets.filter(t => t.status === 'Open' || t.status === 'Pending').length;

  return {
    totalRidesToday,
    totalActiveRides,
    totalActiveUsers,
    totalActiveRiders,
    ridesPerUser,
    ridesPerRider,
    grossOrderValue,
    platformRevenue,
    totalSupportTickets,
    activeTickets
  };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await bookingApi.getStats();
  // return data;
}

// Get data for analytics graphs
// Endpoint: GET /api/dashboard/charts
export async function getCharts() {
  // --- MOCK DATABASE CODE (Active) ---
  await delay(300);
  return {
    dailyRideTrend: [
      { date: 'Mon', count: 12 },
      { date: 'Tue', count: 18 },
      { date: 'Wed', count: 15 },
      { date: 'Thu', count: 20 },
      { date: 'Fri', count: 24 },
      { date: 'Sat', count: 30 },
      { date: 'Sun', count: 22 }
    ],
    revenueTrend: [
      { date: 'Mon', amount: 1500 },
      { date: 'Tue', amount: 2200 },
      { date: 'Wed', amount: 1800 },
      { date: 'Thu', amount: 2800 },
      { date: 'Fri', amount: 3200 },
      { date: 'Sat', amount: 4500 },
      { date: 'Sun', amount: 3000 }
    ],
    riderGrowth: [
      { date: 'Week 1', count: 2 },
      { date: 'Week 2', count: 5 },
      { date: 'Week 3', count: 8 },
      { date: 'Week 4', count: 12 }
    ],
    userGrowth: [
      { date: 'Week 1', count: 10 },
      { date: 'Week 2', count: 25 },
      { date: 'Week 3', count: 45 },
      { date: 'Week 4', count: 80 }
    ]
  };

  // --- LIVE BACKEND INTEGRATION (Commented Out) ---
  // const data = await bookingApi.getCharts();
  // return data;
}
