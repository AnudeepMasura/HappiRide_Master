import React, { useState } from 'react';
import { useRiders } from '../hooks/useRiders';
import { formatCurrency, formatDate } from '../utils/helpers';
import ReusableModal from '../components/ReusableModal';
import { 
  Search, 
  Filter, 
  UserCheck, 
  MapPin, 
  Star, 
  Wallet, 
  Award,
  ChevronDown,
  Info,
  Sliders,
  History,
  AlertCircle
} from 'lucide-react';

function Riders() {
  const { riders, loading, error, updateRiderStatus } = useRiders();
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal controls
  const [selectedRider, setSelectedRider] = useState(null);
  const [modalType, setModalType] = useState(null); // 'details', 'history'

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100">ACTIVE</span>;
      case 'Restricted':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-100">RESTRICTED</span>;
      case 'Suspended':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-100">SUSPENDED</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-50 text-slate-700 border border-slate-100">{status}</span>;
    }
  };

  const handleStatusChange = async (riderId, newStatus) => {
    await updateRiderStatus(riderId, newStatus);
    if (selectedRider && selectedRider.id === riderId) {
      setSelectedRider(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Filter riders
  const filteredRiders = riders.filter(rider => {
    const matchesStatus = statusFilter === 'All' || rider.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      rider.id.toLowerCase().includes(query) ||
      rider.fullName.toLowerCase().includes(query) ||
      rider.username.toLowerCase().includes(query) ||
      rider.mobileNumber.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Rider Partner Directory</h2>
        <p className="text-xs text-slate-400 font-medium">Verify driver profiles, check operational compliance ratings, adjust wallet logs and service categories.</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2.5 text-xs text-rose-600">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error loading riders list</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search riders by name, mobile, username or ID..."
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
            <option value="Active">Active</option>
            <option value="Restricted">Restricted</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* DIRECTORY TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200">
                <th className="px-6 py-3">Rider ID</th>
                <th className="px-6 py-3">Rider Name</th>
                <th className="px-6 py-3">Mobile No</th>
                <th className="px-6 py-3">Service Segments</th>
                <th className="px-6 py-3 text-right">Ratings</th>
                <th className="px-6 py-3 text-right">Wallet Balance</th>
                <th className="px-6 py-3 text-right">Gross Income</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400">Loading rider profiles...</td>
                </tr>
              ) : filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400">No matching rider partners found.</td>
                </tr>
              ) : (
                filteredRiders.map((rider) => (
                  <tr key={rider.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{rider.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-700">{rider.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">@{rider.username}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{rider.mobileNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {rider.currentServiceTypes.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {rider.ratings.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(rider.wallet)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-700">{formatCurrency(rider.grossEarnings)}</td>
                    <td className="px-6 py-4">{getStatusBadge(rider.status)}</td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => { setSelectedRider(rider); setModalType('details'); }}
                        className="px-2 py-1 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded font-semibold text-[11px]"
                      >
                        Profile
                      </button>
                      
                      {rider.status !== 'Active' ? (
                        <button
                          onClick={() => handleStatusChange(rider.id, 'Active')}
                          className="px-2 py-1 bg-olive-500 hover:bg-olive-600 text-white rounded font-semibold text-[11px]"
                        >
                          Activate
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStatusChange(rider.id, 'Restricted')}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded font-semibold text-[11px]"
                          >
                            Restrict
                          </button>
                          <button
                            onClick={() => handleStatusChange(rider.id, 'Suspended')}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-semibold text-[11px]"
                          >
                            Suspend
                          </button>
                        </>
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
      
      {/* 1. Rider details Modal */}
      <ReusableModal
        isOpen={modalType === 'details'}
        onClose={() => { setSelectedRider(null); setModalType(null); }}
        title="Rider Partner Profile Details"
        size="lg"
      >
        {selectedRider && (
          <div className="space-y-6">
            
            {/* Header profile details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-olive-100 text-olive-700 font-extrabold flex items-center justify-center rounded-full text-lg border border-olive-200">
                  {selectedRider.fullName.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">{selectedRider.fullName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {selectedRider.id} | username: @{selectedRider.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedRider.status)}
                <div className="h-4 w-[1px] bg-slate-300"></div>
                <div className="flex gap-1">
                  {selectedRider.status !== 'Active' && (
                    <button
                      onClick={() => handleStatusChange(selectedRider.id, 'Active')}
                      className="px-3 py-1 bg-olive-500 hover:bg-olive-600 text-white rounded text-[10px] font-bold uppercase tracking-wider"
                    >
                      Activate
                    </button>
                  )}
                  {selectedRider.status !== 'Restricted' && (
                    <button
                      onClick={() => handleStatusChange(selectedRider.id, 'Restricted')}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wider"
                    >
                      Restrict
                    </button>
                  )}
                  {selectedRider.status !== 'Suspended' && (
                    <button
                      onClick={() => handleStatusChange(selectedRider.id, 'Suspended')}
                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[10px] font-bold uppercase tracking-wider"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Contact Details */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Info size={14} className="text-olive-600" />
                  Personal & Contact Details
                </h5>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between"><span className="text-slate-400">Mobile Phone:</span> <span className="font-semibold text-slate-800">{selectedRider.mobileNumber}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Email Address:</span> <span className="font-semibold text-slate-800">{selectedRider.email}</span></div>
                  <div className="flex justify-between flex-col gap-0.5">
                    <span className="text-slate-400">Address Profile:</span> 
                    <span className="font-semibold text-slate-800 p-2 bg-slate-50 border border-slate-100 rounded-md mt-1">{selectedRider.address}</span>
                  </div>
                </div>
              </div>

              {/* 2. Operations Service Types */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Sliders size={14} className="text-olive-600" />
                  Services Entitlements
                </h5>
                
                {/* Check list layout */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    'Intracity Bike',
                    'Intracity Auto',
                    'Intracity Cab',
                    'Car Taxi',
                    'Car Pooling',
                    'Private Travels',
                    'Rentals'
                  ].map((service) => {
                    const isEnabled = selectedRider.currentServiceTypes.includes(service) || 
                                     (service === 'Intracity Cab' && selectedRider.currentServiceTypes.includes('Car Taxi')) ||
                                     (service === 'Rentals' && selectedRider.currentServiceTypes.includes('Rentals'));
                    return (
                      <div key={service} className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${isEnabled ? 'bg-olive-500' : 'bg-slate-200'}`} />
                        <span className={isEnabled ? 'font-semibold text-slate-800' : 'text-slate-400'}>{service}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Performance Stats */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Award size={14} className="text-olive-600" />
                  Performance Metrics
                </h5>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Compliance Rating:</span> 
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                      <Star size={12} className="text-amber-500 fill-amber-500" /> {selectedRider.ratings.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="flex justify-between"><span className="text-slate-400">Total Completed Trips:</span> <span className="font-semibold text-slate-800">142 bookings</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Trips Completion Rate:</span> <span className="font-bold text-green-600">{selectedRider.completionRate}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Operator Cancellation Rate:</span> <span className="font-bold text-rose-600">{selectedRider.cancellationRate}%</span></div>
                </div>
              </div>

              {/* 4. Financial Statistics */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Wallet size={14} className="text-olive-600" />
                  Wallet & Earnings
                </h5>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between"><span className="text-slate-400">Available Wallet Balance:</span> <span className="font-bold text-olive-600">{formatCurrency(selectedRider.wallet)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Gross Earnings (Fare):</span> <span className="font-bold text-slate-800">{formatCurrency(selectedRider.grossEarnings)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Happi Ride Commission Paid:</span> <span className="font-bold text-slate-800">{formatCurrency(selectedRider.revenue)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Referrals Invited Rewards:</span> <span className="font-bold text-green-600">{formatCurrency(selectedRider.referralEarnings)} ({selectedRider.referralCount} partners)</span></div>
                </div>
              </div>

            </div>

            {/* Simulated History Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button 
                onClick={() => setModalType('history')}
                className="flex items-center gap-1.5 text-xs text-olive-600 hover:text-olive-700 font-semibold"
              >
                <History size={14} />
                View Trips History Logs
              </button>

              <button
                onClick={() => { setSelectedRider(null); setModalType(null); }}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Close Profile Panel
              </button>
            </div>

          </div>
        )}
      </ReusableModal>

      {/* 2. History Log Modal */}
      <ReusableModal
        isOpen={modalType === 'history'}
        onClose={() => setModalType('details')}
        title="Rider Partner Trips Log"
        size="md"
      >
        {selectedRider && (
          <div className="space-y-4">
            <p className="text-[10px] text-slate-400 font-medium">Showing latest completions logs for <strong>{selectedRider.fullName}</strong>.</p>
            
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {[
                { id: 'RID001', route: 'Madhapur Metro -> Inorbit Mall', fare: 0, date: '2026-06-09T10:15:00Z', status: 'Completed' },
                { id: 'RID006', route: 'Secunderabad -> Jubilee Hills', fare: 0, date: '2026-06-09T14:20:00Z', status: 'Cancelled' },
                { id: 'RID009', route: 'Kondapur -> Gachibowli DLF', fare: 0, date: '2026-06-08T18:30:00Z', status: 'Completed' }
              ].map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{log.id}</span>
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                        log.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{log.route}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{formatDate(log.date)}</span>
                  </div>
                  <span className="font-bold text-slate-800">{formatCurrency(log.fare)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setModalType('details')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Back to Profile
              </button>
            </div>
          </div>
        )}
      </ReusableModal>

    </div>
  );
};

export default Riders;
