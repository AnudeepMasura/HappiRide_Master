import React, { createContext, useState, useEffect, useContext } from 'react';
import * as userService from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      const updatedUser = await userService.updateUserStatus(id, status);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <UserContext.Provider value={{ users, loading, error, refreshUsers: loadUsers, updateUserStatus }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
export default UserContext;

