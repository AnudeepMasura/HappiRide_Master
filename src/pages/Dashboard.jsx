import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import KPICard from '../components/KPICard';
import { 
  Car, 
  Activity, 
  Users, 
  UserCheck, 
  TrendingUp, 
  Percent, 
  Ticket, 
  AlertCircle,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

function Dashboard() {
  const { stats, loading, error, refreshData } = useDashboard();

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-xl text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="mx-auto text-rose-600 mb-3" size={36} />
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">System Fetch Error</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-normal">{error}</p>
        <button 
          onClick={refreshData}
          className="mt-4 px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Executive Dashboard</h2>
          <p className="text-xs text-slate-400">Real-time overview of Happi Ride platform logistics and earnings.</p>
        </div>
        <button 
          onClick={refreshData}
          disabled={loading}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span className="text-xs font-semibold hidden sm:inline">Refresh Data</span>
        </button>
      </div>

      {/* 10 KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Rides Today"
          value={loading ? '-' : stats?.totalRidesToday}
          change="0.0%"
          isPositive={true}
          icon={Car}
          loading={loading}
        />
        <KPICard
          title="Total Active Rides"
          value={loading ? '-' : stats?.totalActiveRides}
          change="0.0%"
          isPositive={true}
          icon={Activity}
          loading={loading}
        />
        <KPICard
          title="Total Active Users"
          value={loading ? '-' : stats?.totalActiveUsers}
          change="0.0%"
          isPositive={true}
          icon={Users}
          loading={loading}
        />
        <KPICard
          title="Total Active Riders"
          value={loading ? '-' : stats?.totalActiveRiders}
          change="0.0%"
          isPositive={true}
          icon={UserCheck}
          loading={loading}
        />
        <KPICard
          title="Rides Per User"
          value={loading ? '-' : stats?.ridesPerUser}
          change="0.0%"
          isPositive={false}
          icon={TrendingDown}
          loading={loading}
        />
        <KPICard
          title="Rides Per Rider"
          value={loading ? '-' : stats?.ridesPerRider}
          change="0.0%"
          isPositive={true}
          icon={TrendingUp}
          loading={loading}
        />
        <KPICard
          title="Gross Order Value"
          value={loading ? '-' : formatCurrency(stats?.grossOrderValue)}
          change="0.0%"
          isPositive={true}
          icon={Percent}
          loading={loading}
        />
        <KPICard
          title="Platform Revenue"
          value={loading ? '-' : formatCurrency(stats?.platformRevenue)}
          change="0.0%"
          isPositive={true}
          icon={Percent}
          loading={loading}
        />
        <KPICard
          title="Total Support Tickets"
          value={loading ? '-' : stats?.totalSupportTickets}
          change="0.0%"
          isPositive={false}
          icon={Ticket}
          loading={loading}
        />
        <KPICard
          title="Active Tickets"
          value={loading ? '-' : stats?.activeTickets}
          change="0.0%"
          isPositive={false}
          icon={Ticket}
          loading={loading}
        />
      </div>

    </div>
  );
};

export default Dashboard;
