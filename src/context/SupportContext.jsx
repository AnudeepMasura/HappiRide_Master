import React, { createContext, useState, useEffect, useContext } from 'react';
import * as supportService from '../services/supportService';

const SupportContext = createContext();

export const SupportProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supportService.getTickets();
      setTickets(data);

      // Summarize ticket states
      const total = data.length;
      const open = data.filter(t => t.status === 'Open').length;
      const pending = data.filter(t => t.status === 'Pending').length;
      const closed = data.filter(t => t.status === 'Closed').length;

      setStats({
        totalTickets: total,
        openTickets: open,
        pendingTickets: pending,
        closedTickets: closed
      });

    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id, status, solution = '') => {
    try {
      const updated = await supportService.updateTicketStatus(id, status, solution);
      setTickets(prev => prev.map(t => t.id === id ? updated : t));
      loadTickets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const assignTicket = async (id, employeeName) => {
    try {
      const updated = await supportService.assignTicket(id, employeeName);
      setTickets(prev => prev.map(t => t.id === id ? updated : t));
      loadTickets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <SupportContext.Provider value={{ tickets, stats, loading, error, refreshTickets: loadTickets, updateTicketStatus, assignTicket }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => useContext(SupportContext);
export default SupportContext;

