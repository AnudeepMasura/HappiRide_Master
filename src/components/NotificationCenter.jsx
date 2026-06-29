import React, { useState, useRef, useEffect } from 'react';
import { Bell, Info, ShieldAlert, BadgePercent, Landmark, Ticket } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import * as dashboardService from '../services/dashboardService';

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await dashboardService.getNotifications();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    }
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'KYC':
        return <ShieldAlert size={15} className="text-amber-600" />;
      case 'WALLET':
        return <Landmark size={15} className="text-emerald-600" />;
      case 'SUPPORT':
        return <Ticket size={15} className="text-indigo-600" />;
      case 'REVENUE':
        return <BadgePercent size={15} className="text-olive-600" />;
      default:
        return <Info size={15} className="text-slate-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-olive-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <span className="font-bold text-sm text-slate-800">System Notifications</span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs text-olive-600 hover:text-olive-700 font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`flex gap-3 p-4 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-olive-50/20' : ''}`}
                >
                  <div className="mt-0.5 p-1.5 bg-slate-100 rounded-lg h-fit">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-slate-700 leading-normal ${!n.read ? 'font-medium' : ''}`}>
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {formatDate(n.date)}
                    </span>
                  </div>
                  {!n.read && (
                    <div className="h-1.5 w-1.5 bg-olive-500 rounded-full mt-2 self-start shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 text-center">
            <span className="text-xs text-slate-400">Showing last 5 updates</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
