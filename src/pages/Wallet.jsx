import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { formatCurrency, formatDate } from '../utils/helpers';
import { 
  TrendingUp, 
  Wallet as WalletIcon, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react';

function Wallet() {
  const { 
    financeStats, 
    withdrawals,
    loading, 
    error,
    approveRequest,
    rejectRequest
  } = useWallet();

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleApprove = async (id) => {
    const txnId = window.prompt("Enter bank transaction reference ID:");
    if (!txnId) return;
    
    setActionLoadingId(id);
    setActionError('');
    const res = await approveRequest(id, txnId);
    setActionLoadingId(null);
    if (!res.success) {
      setActionError(res.error || 'Failed to approve payout request.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter payout rejection reason:");
    if (!reason) return;

    setActionLoadingId(id);
    setActionError('');
    const res = await rejectRequest(id, reason);
    setActionLoadingId(null);
    if (!res.success) {
      setActionError(res.error || 'Failed to reject payout request.');
    }
  };

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-xl text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="mx-auto text-rose-600 mb-3" size={36} />
        <h3 className="text-lg font-bold text-slate-800">Financial Data Error</h3>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100">APPROVED</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-100">REJECTED</span>;
      case 'Pending':
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">PENDING</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Payout Ledger & Wallet</h2>
        <p className="text-xs text-slate-400 font-medium">Manage driver withdrawal requests and transactional reconciliations.</p>
      </div>

      {actionError && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2.5 text-xs text-rose-600">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {/* FINANCE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Gross Order Value</span>
          <h3 className="text-lg font-extrabold text-slate-800">{loading ? '-' : formatCurrency(financeStats?.grossOrderValue)}</h3>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp size={11} className="text-green-600" /> +15.1% since last week
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Commission Revenue</span>
          <h3 className="text-lg font-extrabold text-slate-800">{loading ? '-' : formatCurrency(financeStats?.revenue)}</h3>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp size={11} className="text-green-600" /> 15% platform fee
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Available Balance</span>
          <h3 className="text-lg font-extrabold text-slate-800">{loading ? '-' : formatCurrency(financeStats?.availableBalance)}</h3>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <WalletIcon size={11} className="text-olive-600" /> Float escrow hold
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Withdrawal Requests</span>
          <h3 className="text-lg font-extrabold text-slate-800">{loading ? '-' : financeStats?.withdrawalRequests}</h3>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Clock size={11} className="text-amber-600" /> Pending review queue
          </div>
        </div>
      </div>

      {/* WITHDRAWALS LIST TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending & Historical Payout Queue</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Approve driver balances payout requests into corresponding bank accounts.</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold bg-slate-200 text-slate-700 rounded-md">
            {withdrawals?.length || 0} Total Requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200">
                <th className="px-6 py-3">Payout ID</th>
                <th className="px-6 py-3">Driver Partner</th>
                <th className="px-6 py-3">Bank Details</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3">Request Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Txn ID / Reason</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400">Loading withdrawals ledger...</td>
                </tr>
              ) : !withdrawals || withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400">No withdrawal requests found.</td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{w.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-700">{w.riderName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {w.riderId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{w.bankAccount}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(w.amount)}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(w.date)}</td>
                    <td className="px-6 py-4">{getStatusBadge(w.status)}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-[10px]">
                      {w.status === 'Approved' ? (
                        <span className="text-green-700 font-semibold">{w.trxnId}</span>
                      ) : w.status === 'Rejected' ? (
                        <span className="text-rose-600">{w.rejectionReason}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {w.status === 'Pending' ? (
                        <>
                          <button
                            disabled={actionLoadingId !== null}
                            onClick={() => handleApprove(w.id)}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-[11px] disabled:opacity-50"
                          >
                            {actionLoadingId === w.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              'Approve'
                            )}
                          </button>
                          <button
                            disabled={actionLoadingId !== null}
                            onClick={() => handleReject(w.id)}
                            className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded font-semibold text-[11px] disabled:opacity-50"
                          >
                            {actionLoadingId === w.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              'Reject'
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-medium uppercase font-sans">Reconciled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Wallet;
