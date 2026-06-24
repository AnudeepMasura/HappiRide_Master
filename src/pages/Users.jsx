import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Search } from 'lucide-react';

function Users() {
  const { users, loading, error } = useUsers();
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users by search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.id.toLowerCase().includes(query) ||
      user.fullName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.mobileNumber.includes(query)
    );
  });

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-xl text-center max-w-lg mx-auto mt-12">
        <h3 className="text-lg font-bold text-slate-800">User Data Error</h3>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">User Customer Directory</h2>
        <p className="text-xs text-slate-400 font-medium">Oversee client registries.</p>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search users by name, mobile, username or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500 focus:border-olive-500"
          />
        </div>
      </div>

      {/* MAIN USERS DIRECTORY TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200">
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Mobile No</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3 text-right">Trips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">Loading customer profiles...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">No matching user accounts found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{user.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{user.fullName}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{user.username}</td>
                    <td className="px-6 py-4">{user.mobileNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{user.gender}</td>
                    <td className="px-6 py-4 text-right">{user.rideCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Users;
