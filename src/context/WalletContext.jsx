import React, { createContext, useState, useEffect, useContext } from 'react';
import * as walletService from '../services/walletService';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [financeStats, setFinanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await walletService.getWithdrawals();
      setWithdrawals(data);

      const stats = await walletService.getFinanceStats();
      setFinanceStats(stats);
    } catch (err) {
      setError(err.message || 'Failed to load wallet log');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id, transactionId) => {
    try {
      const updated = await walletService.approveWithdrawal(id, transactionId);
      setWithdrawals(prev => prev.map(w => w.id === id ? updated : w));
      loadWalletData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const rejectRequest = async (id, reason) => {
    try {
      const updated = await walletService.rejectWithdrawal(id, reason);
      setWithdrawals(prev => prev.map(w => w.id === id ? updated : w));
      loadWalletData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <WalletContext.Provider value={{ withdrawals, financeStats, loading, error, refreshWallet: loadWalletData, approveRequest, rejectRequest }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
export default WalletContext;

