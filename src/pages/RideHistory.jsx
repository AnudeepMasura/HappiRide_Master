import React, { useState } from 'react';
import { useRides } from '../hooks/useRides';
import { formatCurrency, formatDate } from '../utils/helpers';
import ReusableModal from '../components/ReusableModal';
import { 
  Search, 
  Filter, 
  MapPin, 
  Download, 
  Eye, 
  Map, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Info
} from 'lucide-react';

function RideHistory() {
  const { rides, loading, error } = useRides();
  
  // Filtering states
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal actions states
  const [selectedRide, setSelectedRide] = useState(null);
  const [modalType, setModalType] = useState(null); // 'details', 'route'

  // Service segments
  const tabs = [
    { name: 'All', value: 'All' },
    { name: 'Intracity', value: 'Intracity' },
    { name: 'Car Taxi', value: 'Car Taxi' },
    { name: 'Car Pooling', value: 'Car Pooling' },
    { name: 'Private Travels', value: 'Private Car Travels' },
    { name: 'Car Rentals', value: 'Car Rentals' },
    { name: 'Bike Rentals', value: 'Bike Rentals' }
  ];


  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100">COMPLETED</span>;
      case 'Cancelled':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-100">CANCELLED</span>;
      case 'Ongoing':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100 animate-pulse">ONGOING</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-50 text-slate-700 border border-slate-100">{status}</span>;
    }
  };

  const downloadInvoice = (ride) => {
    const invoiceText = `
HAPPI RIDE SERVICE INVOICE
===================================================
Invoice Date: ${new Date().toLocaleDateString()}
Ride ID: ${ride.id}
Ride Date: ${new Date(ride.date).toLocaleDateString()}
===================================================
Customer Profile: ${ride.user}
Rider Operator: ${ride.rider}
Service Category: ${ride.service}
---------------------------------------------------
Pickup Location: ${ride.pickup}
Destination Location: ${ride.drop}
---------------------------------------------------
Fare Summary:
Base Booking Fare: ${formatCurrency(ride.fare * 0.3)}
Distance Charges: ${formatCurrency(ride.fare * 0.7)}

TOTAL AMOUNT PAID: ${formatCurrency(ride.fare)}
(Calculated inclusive of taxes and platform fees)
===================================================
Thank you for using Happi Ride!
`;
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HappiRide_Invoice_${ride.id}.txt`);
    link.click();
  };

  // Filter logic
  const filteredRides = rides.filter(ride => {
    // Tab filtering
    const matchesTab = activeTab === 'All' || ride.service === activeTab || ride.type === activeTab;
    
    // Status filtering
    const matchesStatus = statusFilter === 'All' || ride.status === statusFilter;

    // Search query matching
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      ride.id.toLowerCase().includes(query) ||
      ride.user.toLowerCase().includes(query) ||
      ride.rider.toLowerCase().includes(query) ||
      ride.pickup.toLowerCase().includes(query) ||
      ride.drop.toLowerCase().includes(query);

    return matchesTab && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Ride History Ledger</h2>
        <p className="text-xs text-slate-400 font-medium">Verify historical trip transactions, download customer invoices, and simulate route paths.</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2.5 text-xs text-rose-600">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error loading ride history</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* SERVICE TABS */}
      <div className="border-b border-slate-200">
        <nav className="flex flex-wrap -mb-px gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 border-b-2 text-xs font-semibold tracking-wide uppercase transition-colors whitespace-nowrap ${
                activeTab === tab.value
                  ? 'border-olive-500 text-olive-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search by ID, User, Rider, Pickup or Destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500 focus:border-olive-500"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500 focus:border-olive-500"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200">
                <th className="px-6 py-3">Ride ID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Rider Partner</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Routes</th>
                <th className="px-6 py-3 text-right">Fare</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400">Loading ride history database...</td>
                </tr>
              ) : filteredRides.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400">No matching ride logs found.</td>
                </tr>
              ) : (
                filteredRides.map((ride) => (
                  <tr key={ride.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{ride.id}</td>
                    <td className="px-6 py-4">{ride.user}</td>
                    <td className="px-6 py-4">{ride.rider || <span className="text-slate-400 italic">Unassigned</span>}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{ride.service}</td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="flex flex-col gap-0.5">
                        <p className="truncate"><span className="text-[10px] bg-slate-100 px-1 py-0.2 rounded text-slate-500 mr-1">PICKUP</span>{ride.pickup}</p>
                        <p className="truncate"><span className="text-[10px] bg-slate-100 px-1 py-0.2 rounded text-slate-500 mr-1">DROP</span>{ride.drop}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(ride.fare)}</td>
                    <td className="px-6 py-4">{getStatusBadge(ride.status)}</td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(ride.date)}</td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => { setSelectedRide(ride); setModalType('details'); }}
                        title="View Details"
                        className="p-1 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => { setSelectedRide(ride); setModalType('route'); }}
                        title="View Route"
                        className="p-1 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded"
                      >
                        <Map size={13} />
                      </button>
                      {ride.status === 'Completed' && (
                        <button
                          onClick={() => downloadInvoice(ride)}
                          title="Download Invoice"
                          className="p-1 border border-slate-200 text-olive-600 hover:text-olive-700 hover:bg-olive-50/50 rounded"
                        >
                          <Download size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REUSABLE MODALS */}
      
      {/* 1. Details Modal */}
      <ReusableModal
        isOpen={modalType === 'details'}
        onClose={() => { setSelectedRide(null); setModalType(null); }}
        title="Ride Transaction Ledger"
        size="md"
      >
        {selectedRide && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Booking ID</p>
                <p className="font-semibold text-slate-800">{selectedRide.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Booking Date</p>
                <p className="font-semibold text-slate-800">{formatDate(selectedRide.date)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">User Customer</p>
                <p className="font-semibold text-slate-800">{selectedRide.user}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Driver Operator</p>
                <p className="font-semibold text-slate-800">{selectedRide.rider || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Service Segment</p>
                <p className="font-semibold text-slate-800">{selectedRide.service}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ride Fare Settled</p>
                <p className="font-extrabold text-slate-800">{formatCurrency(selectedRide.fare)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Logistics Route</p>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg space-y-2.5">
                  <div className="flex gap-2">
                    <MapPin size={15} className="text-olive-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</p>
                      <p className="font-medium text-slate-700">{selectedRide.pickup}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200/60 my-2"></div>
                  <div className="flex gap-2">
                    <MapPin size={15} className="text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Drop Location</p>
                      <p className="font-medium text-slate-700">{selectedRide.drop}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => { setSelectedRide(null); setModalType(null); }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {selectedRide.status === 'Completed' && (
                <button
                  onClick={() => downloadInvoice(selectedRide)}
                  className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Download size={13} />
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        )}
      </ReusableModal>

      {/* 2. Route map simulator modal */}
      <ReusableModal
        isOpen={modalType === 'route'}
        onClose={() => { setSelectedRide(null); setModalType(null); }}
        title="Route Simulator Map"
        size="lg"
      >
        {selectedRide && (
          <div className="space-y-4">
            {/* Mock Map canvas box */}
            <div className="w-full h-80 bg-slate-100 border border-slate-200 rounded-lg relative overflow-hidden flex items-center justify-center">
              
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-15" style={{ 
                backgroundImage: 'radial-gradient(#556b2f 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
              }}></div>
              
              {/* Simulated Map components */}
              <div className="absolute p-4 max-w-sm bg-white/95 border border-slate-200 rounded-lg shadow-md top-4 left-4 text-[10px] leading-relaxed text-slate-600 z-10">
                <p className="font-bold text-slate-700 text-xs mb-1.5 uppercase">Simulated Trip Info</p>
                <p><strong>Pickup:</strong> {selectedRide.pickup}</p>
                <p><strong>Destination:</strong> {selectedRide.drop}</p>
                <p className="mt-1 font-semibold text-olive-700">Estimated Distance: 12.5 KM (ETA: 24 Mins)</p>
              </div>

              {/* Line simulation */}
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                <path 
                  d="M 150 250 Q 250 100 450 180 T 600 120" 
                  fill="none" 
                  stroke="#556B2F" 
                  strokeWidth="3.5" 
                  strokeDasharray="6 4"
                  className="animate-[dash_5s_linear_infinite]"
                />
                {/* Starting pin */}
                <circle cx="150" cy="250" r="7" fill="#556B2F" stroke="white" strokeWidth="2" />
                {/* Ending pin */}
                <circle cx="600" cy="120" r="7" fill="#be123c" stroke="white" strokeWidth="2" />
              </svg>
              
              {/* Markers tags */}
              <div className="absolute text-[10px] font-bold bg-olive-500 text-white px-2 py-0.5 rounded shadow" style={{ left: '115px', top: '265px' }}>
                START
              </div>
              <div className="absolute text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded shadow" style={{ left: '575px', top: '135px' }}>
                DESTINATION
              </div>

              <div className="text-center z-10 bg-white/80 p-2.5 rounded-lg border border-slate-200">
                <p className="text-xs font-bold text-slate-800">Visual Route Rendering</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Interactive Map rendering requires API keys integration.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => { setSelectedRide(null); setModalType(null); }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Close Map Preview
              </button>
            </div>
          </div>
        )}
      </ReusableModal>

    </div>
  );
};

export default RideHistory;
