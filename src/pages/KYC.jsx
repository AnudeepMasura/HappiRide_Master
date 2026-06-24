import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useKyc } from '../hooks/useKyc';
import { formatDate } from '../utils/helpers';
import ReusableModal from '../components/ReusableModal';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Eye, 
  CheckCircle, 
  XCircle,
  FileText,
  Clock,
  User,
  Car,
  AlertTriangle,
  History,
  Loader2,
  AlertCircle
} from 'lucide-react';

function KYC() {
  const { user } = useAuth(); // Logged-in KYC officer name
  const { kycList, loading, error, refreshKyc, approveKyc, rejectKyc, requestReupload } = useKyc();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal actions
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [modalType, setModalType] = useState(null); // 'details', 'reject', 'reupload'
  const [rejectionNote, setRejectionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100">APPROVED</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-100">REJECTED</span>;
      case 'Request Reupload':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-100">RE-UPLOAD REQ</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">PENDING REVIEW</span>;
    }
  };

  const handleApprove = async (riderId) => {
    setActionLoading(true);
    setActionError('');
    const officerName = user?.name || 'Sanjay Patel';
    
    const res = await approveKyc(riderId, officerName);
    setActionLoading(false);
    
    if (res.success) {
      setModalType(null);
      setSelectedKyc(null);
    } else {
      setActionError(res.error || 'Approve action failed.');
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionNote.trim()) {
      setActionError('Please specify the reason for rejection');
      return;
    }
    setActionLoading(true);
    setActionError('');
    const officerName = user?.name || 'Sanjay Patel';
    
    const res = await rejectKyc(selectedKyc.riderId, officerName, rejectionNote);
    setActionLoading(false);
    
    if (res.success) {
      setModalType(null);
      setSelectedKyc(null);
      setRejectionNote('');
    } else {
      setActionError(res.error || 'Reject action failed.');
    }
  };

  const handleReuploadSubmit = async () => {
    if (!rejectionNote.trim()) {
      setActionError('Please state the specific documents that require reuploading');
      return;
    }
    setActionLoading(true);
    setActionError('');
    const officerName = user?.name || 'Sanjay Patel';
    
    const res = await requestReupload(selectedKyc.riderId, officerName, rejectionNote);
    setActionLoading(false);
    
    if (res.success) {
      setModalType(null);
      setSelectedKyc(null);
      setRejectionNote('');
    } else {
      setActionError(res.error || 'Request Reupload failed.');
    }
  };

  // Filter queue
  const filteredKyc = kycList.filter(k => {
    const matchesStatus = statusFilter === 'All' || k.status === statusFilter;
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      k.riderId.toLowerCase().includes(query) ||
      k.username.toLowerCase().includes(query) ||
      k.mobile.includes(query) ||
      k.serviceType.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });


  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Driver KYC Document Verifications</h2>
        <p className="text-xs text-slate-400 font-medium">Verify driver Aadhaar, PAN, DL, RC, Vehicle Insurance and Pollution certificates.</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2.5 text-xs text-rose-600">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error loading KYC verifications list</p>
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
            placeholder="Search KYC queue by rider ID, username, phone or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Request Reupload">Request Reupload</option>
          </select>
        </div>
      </div>

      {/* KYC QUEUE TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200">
                <th className="px-6 py-3">Rider ID</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Mobile No</th>
                <th className="px-6 py-3">Service Type</th>
                <th className="px-6 py-3">Date Joined</th>
                <th className="px-6 py-3">Approved By</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400">Loading KYC queue...</td>
                </tr>
              ) : filteredKyc.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400">No matching KYC applications.</td>
                </tr>
              ) : (
                filteredKyc.map((k) => (
                  <tr key={k.riderId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{k.riderId}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">@{k.username}</td>
                    <td className="px-6 py-4">{k.mobile}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{k.serviceType}</td>
                    <td className="px-6 py-4 text-slate-400">{k.dateJoined}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {k.approvedBy !== 'N/A' ? k.approvedBy : <span className="text-slate-400 italic">None</span>}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(k.status)}</td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => { setSelectedKyc(k); setModalType('details'); }}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded font-semibold text-[11px] inline-flex items-center gap-1"
                      >
                        <Eye size={12} /> Inspect Docs
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC DETAILS CHECKER MODALS */}
      
      {/* 1. Main Document Checker Modal */}
      <ReusableModal
        isOpen={modalType === 'details'}
        onClose={() => { setSelectedKyc(null); setModalType(null); }}
        title="Rider KYC Document Checker"
        size="2xl"
      >
        {selectedKyc && (
          <div className="space-y-6">
            
            {/* Header Application Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 tracking-tight">Rider ID: {selectedKyc.riderId}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Applied Service: <strong>{selectedKyc.serviceType}</strong> | Registered on: {selectedKyc.dateJoined}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedKyc.status)}
              </div>
            </div>

            {/* Checker Panels split (Personal KYC vs Vehicle KYC) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal KYC Checklist */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <User size={14} className="text-olive-600" />
                    Personal Identifications
                  </h5>
                  
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Aadhaar Card Number</span>
                      <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center">
                        <span>{selectedKyc.personalKyc.aadhaar}</span>
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">✓ verified</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">PAN Card Number</span>
                      <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center">
                        <span>{selectedKyc.personalKyc.pan}</span>
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">✓ verified</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Driving License No</span>
                      <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center">
                        <span>{selectedKyc.personalKyc.dl}</span>
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">✓ verified</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Selfie Photo Verification</span>
                  <div className="h-28 w-28 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden relative group">
                    <img 
                      src={selectedKyc.personalKyc.selfieUrl} 
                      alt="Selfie verification" 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">Expand Selfie</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle KYC Checklist */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <Car size={14} className="text-olive-600" />
                    Vehicle Registrations (RC)
                  </h5>

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">RC Vehicle Plate Number</span>
                      <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center">
                        <span>{selectedKyc.vehicleKyc.rc}</span>
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">✓ verified</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Insurance Policy Number</span>
                      <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center">
                        <span>{selectedKyc.vehicleKyc.insurance}</span>
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">✓ verified</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pollution Certificate Validity</span>
                      <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center">
                        <span>Expiry: {selectedKyc.vehicleKyc.pollution}</span>
                        {selectedKyc.riderId === 'RDR005' ? (
                          <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wide flex items-center gap-1"><AlertTriangle size={10} /> EXPIRED</span>
                        ) : (
                          <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">✓ valid</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Vehicle Photo Inspection</span>
                  <div className="h-28 w-44 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden relative group">
                    <img 
                      src={selectedKyc.vehicleKyc.vehiclePhotos[0]} 
                      alt="Vehicle inspection" 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">Expand Vehicle</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* KYC Applications Timeline History */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <History size={14} className="text-olive-600" />
                Registry Approval Timeline
              </h5>
              <div className="space-y-3">
                {selectedKyc.history.map((node, index) => (
                  <div key={index} className="flex gap-3 text-xs leading-normal">
                    <span className="text-slate-400 shrink-0 font-medium">{node.date}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{node.action}</span>
                      <span className="text-slate-500 text-[11px]">{node.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decisions Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => { setSelectedKyc(null); setModalType(null); }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close Window
              </button>

              {selectedKyc.status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalType('reupload')}
                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Request Re-upload
                  </button>
                  <button
                    onClick={() => setModalType('reject')}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Reject KYC
                  </button>
                  <button
                    onClick={() => handleApprove(selectedKyc.riderId)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    {actionLoading && <Loader2 size={13} className="animate-spin" />}
                    Approve KYC
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </ReusableModal>

      {/* 2. Reject Re-check Modal */}
      <ReusableModal
        isOpen={modalType === 'reject'}
        onClose={() => setModalType('details')}
        title="Confirm KYC Document Rejection"
        size="md"
      >
        {selectedKyc && (
          <div className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex gap-2.5 text-xs text-rose-700 leading-normal mb-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>
                Rejecting KYC application for driver <strong>@{selectedKyc.username}</strong>. You must state the clear cancellation/compliance violation reason.
              </span>
            </div>

            {actionError && (
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded text-xs leading-normal">{actionError}</div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Rejection Cause Details</label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Details of verification failure (e.g. Expired DL, Blur document photo, Name mismatch...)"
                rows={4}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setModalType('details')}
                disabled={actionLoading}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back to Documents
              </button>
              <button 
                onClick={handleRejectSubmit}
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        )}
      </ReusableModal>

      {/* 3. Request Reupload Modal */}
      <ReusableModal
        isOpen={modalType === 'reupload'}
        onClose={() => setModalType('details')}
        title="Request Documents Re-upload"
        size="md"
      >
        {selectedKyc && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-2.5 text-xs text-amber-700 leading-normal mb-2">
              <Clock size={16} className="shrink-0 mt-0.5" />
              <span>
                Requesting document reupload for driver <strong>@{selectedKyc.username}</strong>. State which documents are blur, incorrect or expired so they can re-upload them in the driver app.
              </span>
            </div>

            {actionError && (
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded text-xs leading-normal">{actionError}</div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Reupload Instruction Details</label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="State instructions (e.g. Please re-upload RC card front photo. Current copy is too blurry to read.)"
                rows={4}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setModalType('details')}
                disabled={actionLoading}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back to Documents
              </button>
              <button 
                onClick={handleReuploadSubmit}
                disabled={actionLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Send Request
              </button>
            </div>
          </div>
        )}
      </ReusableModal>

    </div>
  );
};

export default KYC;
