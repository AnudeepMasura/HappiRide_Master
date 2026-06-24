import React, { useState } from 'react';
import { useSupport } from '../hooks/useSupport';
import { useSettings } from '../hooks/useSettings';
import { formatDate } from '../utils/helpers';
import ReusableModal from '../components/ReusableModal';
import { 
  Ticket, 
  Search,
  Filter,
  UserPlus,
  ArrowUpCircle
} from 'lucide-react';

function CustomerSupport() {
  const { 
    tickets, 
    stats, 
    loading, 
    error, 
    assignTicket 
  } = useSupport();

  // Load employee list from settings context to enable actual assignment!
  const { employees } = useSettings();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal controls
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalType, setModalType] = useState(null); // 'assign', 'view'
  const [assignedEmpName, setAssignedEmpName] = useState('');
  const [actionError, setActionError] = useState('');

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-100 uppercase">HIGH</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-100 uppercase">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200/60 uppercase">LOW</span>;
    }
  };

  const openActionModal = (ticket, type) => {
    setSelectedTicket(ticket);
    setModalType(type);
    setAssignedEmpName(ticket.assignedEmployee || '');
    setActionError('');
  };

  const closeActionModal = () => {
    setSelectedTicket(null);
    setModalType(null);
  };

  const handleAssignSubmit = async () => {
    if (!assignedEmpName) {
      setActionError('Please select an employee');
      return;
    }
    const res = await assignTicket(selectedTicket.id, assignedEmpName);
    if (res.success) {
      closeActionModal();
    } else {
      setActionError(res.error || 'Assignment failed');
    }
  };

  const handleEscalate = async (ticket) => {
    const nextPriority = ticket.priority === 'Low' ? 'Medium' : 'High';
    // Emulate API logic to change priority
    ticket.priority = nextPriority;
    // Simple state refresh by assigning or fake triggering support refresh
    await assignTicket(ticket.id, ticket.assignedEmployee);
  };

  // Filters tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesCategory = categoryFilter === 'All' || ticket.category === categoryFilter;
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      ticket.id.toLowerCase().includes(query) ||
      ticket.clientName.toLowerCase().includes(query) ||
      ticket.desc.toLowerCase().includes(query) ||
      (ticket.assignedEmployee && ticket.assignedEmployee.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-xl text-center max-w-lg mx-auto mt-12">
        <h3 className="text-lg font-bold text-slate-800">Support Data Error</h3>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Customer Incidents & Support</h2>
        <p className="text-xs text-slate-400 font-medium">Coordinate resolution pipelines, assign tickets, and audit client complaints.</p>
      </div>

      {/* TICKET STATUS DASHBOARD CARDS */}
      <div className="max-w-xs">
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Support Tickets</span>
            <span className="text-xl font-bold text-slate-800">{loading ? '-' : stats?.totalTickets}</span>
          </div>
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-500">
            <Ticket size={18} />
          </div>
        </div>
      </div>

      {/* FILTER ACTIONS */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search tickets by ID, client name, description or employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500 focus:border-olive-500"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
          >
            <option value="All">All Categories</option>
            <option value="Payment">Payment</option>
            <option value="Ride">Ride</option>
            <option value="Refund">Refund</option>
            <option value="Driver">Driver</option>
            <option value="Technical">Technical</option>
            <option value="KYC">KYC</option>
          </select>
        </div>
      </div>

      {/* TICKETS QUEUE TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200">
                <th className="px-6 py-3">Ticket ID</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Incident Segment</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Assigned Agent</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">Loading support inbox...</td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">No support tickets match the filters.</td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{t.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-700">{t.clientName}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.clientType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{t.category}</td>
                    <td className="px-6 py-4">{getPriorityBadge(t.priority)}</td>
                    <td className="px-6 py-4">
                      {t.assignedEmployee ? (
                        <span className="font-medium text-slate-700">{t.assignedEmployee}</span>
                      ) : (
                        <span className="text-slate-400 italic font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(t.createdDate)}</td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openActionModal(t, 'view')}
                        className="px-2 py-1 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded font-semibold text-[11px]"
                      >
                        Read
                      </button>
                      
                      <button
                        onClick={() => openActionModal(t, 'assign')}
                        className="p-1 border border-slate-200 text-slate-500 hover:text-slate-800 rounded inline-flex items-center text-xs"
                        title="Assign Agent"
                      >
                        <UserPlus size={13} />
                      </button>
                      
                      {t.priority !== 'High' && (
                        <button
                          onClick={() => handleEscalate(t)}
                          className="p-1 border border-slate-200 text-amber-600 hover:text-amber-700 rounded inline-flex items-center text-xs"
                          title="Escalate Priority"
                        >
                          <ArrowUpCircle size={13} />
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

      {/* SUPPORT MODALS SECTION */}
      
      {/* 1. View incident modal */}
      <ReusableModal
        isOpen={modalType === 'view'}
        onClose={closeActionModal}
        title="Support Ticket Details"
        size="md"
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket ID</p>
                <p className="font-semibold text-slate-800">{selectedTicket.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created Date</p>
                <p className="font-semibold text-slate-800">{formatDate(selectedTicket.createdDate)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Profile</p>
                <p className="font-semibold text-slate-800">{selectedTicket.clientName} ({selectedTicket.clientType})</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Employee</p>
                <p className="font-semibold text-slate-800">{selectedTicket.assignedEmployee || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket Category</p>
                <p className="font-semibold text-slate-800">{selectedTicket.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incident Priority</p>
                <p className="font-semibold text-slate-800">{getPriorityBadge(selectedTicket.priority)}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Description</p>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-normal">
                {selectedTicket.desc}
              </p>
            </div>

            {selectedTicket.solution && (
              <div className="border-t border-slate-100 pt-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-green-600">Resolution Solution Notes</p>
                <p className="text-xs text-green-700 bg-green-50 border border-green-100 p-2.5 rounded-lg leading-normal">
                  {selectedTicket.solution}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                onClick={closeActionModal}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </ReusableModal>

      {/* 2. Assign Agent Modal */}
      <ReusableModal
        isOpen={modalType === 'assign'}
        onClose={closeActionModal}
        title="Assign Ticket to Agent"
        size="sm"
      >
        {selectedTicket && (
          <div className="space-y-4">
            {actionError && (
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded text-xs leading-normal">{actionError}</div>
            )}
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Support Employee</label>
              <select
                value={assignedEmpName}
                onChange={(e) => setAssignedEmpName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              >
                <option value="">-- Choose Agent --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                onClick={closeActionModal}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignSubmit}
                className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Assign Ticket
              </button>
            </div>
          </div>
        )}
      </ReusableModal>

    </div>
  );
};

export default CustomerSupport;
