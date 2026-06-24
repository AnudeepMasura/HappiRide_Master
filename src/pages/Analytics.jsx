import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Landmark, 
  UserPlus, 
  Ticket,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { formatCurrency, exportToCSV, exportToExcel, exportToPDF } from '../utils/helpers';
import * as dashboardService from '../services/dashboardService';

// Analytics Page
function Analytics() {
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Databases matching filter selections
  const [metrics, setMetrics] = useState({
    totalRides: 0,
    completedRides: 0,
    cancelledRides: 0,
    revenue: 0,
    grossValue: 0,
    newUsers: 0,
    newRiders: 0,
    supportTickets: 0
  });

  // Load stats on filter change
  useEffect(() => {
    loadAnalyticsData();
  }, [dateFilter]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const stats = await dashboardService.getStats();
      setMetrics({
        totalRides: stats?.totalRidesToday || 0,
        completedRides: stats?.totalRidesToday ? Math.max(0, stats.totalRidesToday - (stats.totalActiveRides || 0)) : 0,
        cancelledRides: 0, // In backend API, this would be computed/fetched directly
        revenue: stats?.platformRevenue || 0,
        grossValue: stats?.grossOrderValue || 0,
        newUsers: stats?.totalActiveUsers || 0,
        newRiders: stats?.totalActiveRiders || 0,
        supportTickets: stats?.totalSupportTickets || 0
      });
    } catch (err) {
      console.error('Failed to load analytics metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    setIsExporting(true);
    
    // Prepare export rows
    const headers = ['Metric', 'Value'];
    const rows = [
      { Metric: 'Total Rides', Value: metrics.totalRides },
      { Metric: 'Completed Rides', Value: metrics.completedRides },
      { Metric: 'Cancelled Rides', Value: metrics.cancelledRides },
      { Metric: 'Platform Revenue (INR)', Value: metrics.revenue },
      { Metric: 'Gross Order Value (INR)', Value: metrics.grossValue },
      { Metric: 'New Users Registered', Value: metrics.newUsers },
      { Metric: 'New Riders Joined', Value: metrics.newRiders },
      { Metric: 'Support Tickets Created', Value: metrics.supportTickets }
    ];

    setTimeout(() => {
      if (format === 'csv') {
        exportToCSV(headers, rows, `HappiRide_Analytics_${dateFilter.replace(/ /g, '_')}`);
      } else if (format === 'excel') {
        exportToExcel(headers, rows, `HappiRide_Analytics_${dateFilter.replace(/ /g, '_')}`);
      } else if (format === 'pdf') {
        exportToPDF(headers, rows, `HappiRide_Analytics_${dateFilter.replace(/ /g, '_')}`);
      }
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Business Analytics</h2>
          <p className="text-xs text-slate-400">Deep dive analytics and financial reporting filters.</p>
        </div>

        {/* Date Selector Row */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setDateFilter(filter);
                  setShowCustomPicker(false);
                }}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase transition-all ${
                  dateFilter === filter && !showCustomPicker
                    ? 'bg-olive-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
            <button
              onClick={() => {
                setShowCustomPicker(true);
                setDateFilter('Custom');
              }}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase transition-all ${
                showCustomPicker
                  ? 'bg-olive-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Custom Range
            </button>
          </div>

          {showCustomPicker && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 animate-in fade-in duration-200">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="text-xs border-none focus:ring-0 p-1 text-slate-600 focus:outline-none"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input 
                type="date"
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="text-xs border-none focus:ring-0 p-1 text-slate-600 focus:outline-none"
              />
              <button
                onClick={loadAnalyticsData}
                className="px-2.5 py-1 bg-olive-500 text-white rounded text-[10px] uppercase font-bold"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="flex justify-end gap-2 bg-white border border-slate-200 rounded-lg p-3">
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          Export CSV
        </button>
        <button
          onClick={() => handleExport('excel')}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          Export Excel
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          Export PDF
        </button>
      </div>

      {/* METRICS CARDS PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Bookings</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '...' : metrics.totalRides}</span>
          </div>
          <div className="p-2.5 bg-olive-50 rounded-lg text-olive-600">
            <BarChart3 size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Completed Trips</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '...' : metrics.completedRides}</span>
          </div>
          <div className="p-2.5 bg-green-50 rounded-lg text-green-600">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Cancelled Trips</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '...' : metrics.cancelledRides}</span>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600">
            <XCircle size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Gross Order Value</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '...' : formatCurrency(metrics.grossValue)}</span>
          </div>
          <div className="p-2.5 bg-olive-50 rounded-lg text-olive-600">
            <Landmark size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Platform Revenue</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '...' : formatCurrency(metrics.revenue)}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">New User Registries</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '...' : metrics.newUsers}</span>
          </div>
          <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
            <UserPlus size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">New Rider Partners</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '...' : metrics.newRiders}</span>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
            <UserPlus size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Support Incidents</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '...' : metrics.supportTickets}</span>
          </div>
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
            <Ticket size={20} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
