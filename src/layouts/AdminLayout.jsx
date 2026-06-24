import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from '../components/NotificationCenter';
import Breadcrumbs from '../components/Breadcrumbs';
import { 
  LayoutDashboard, 
  BarChart3, 
  Wallet, 
  History, 
  Users, 
  UserCheck, 
  HelpCircle, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';

function AdminLayout() {
  const { user, logout, hasPermission } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sidebar items definition with permission mapping
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, permission: 'Dashboard' },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, permission: 'Analytics' },
    { name: 'Wallet', path: '/wallet', icon: Wallet, permission: 'Wallet' },
    { name: 'Ride History', path: '/ride-history', icon: History, permission: 'Dashboard' }, // Dashboard permission covers history
    { name: 'Users', path: '/users', icon: Users, permission: 'Dashboard' },
    { name: 'Riders', path: '/riders', icon: UserCheck, permission: 'Dashboard' },
    { name: 'Customer Support', path: '/support', icon: HelpCircle, permission: 'Support' },
    { name: 'KYC', path: '/kyc', icon: ShieldCheck, permission: 'KYC' },
    { name: 'Settings', path: '/settings', icon: Settings, permission: 'Settings' }
  ];

  // Filters items based on current admin permissions
  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* 1. FIXED SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-20">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-olive-600 tracking-tight">Happi Ride</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-olive-50 text-olive-700 rounded-md border border-olive-100">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                  isActive 
                    ? 'bg-olive-500 text-white shadow-sm shadow-olive-600/10' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. DRAWER SIDEBAR FOR MOBILE/TABLET */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]" 
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Menu Drawer */}
          <aside className="relative flex flex-col w-64 bg-white border-r border-slate-200 h-full z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
              <span className="text-lg font-bold text-olive-600">Happi Ride</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {filteredMenuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isActive 
                        ? 'bg-olive-500 text-white' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 fixed top-0 right-0 left-0 md:left-64 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-bold text-slate-800 hidden sm:block">Happi Ride Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <NotificationCenter />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <div className="h-8 w-8 rounded-full bg-olive-100 text-olive-700 font-bold flex items-center justify-center text-xs border border-olive-200">
                  {user?.name ? user.name.split(' ').map(n=>n[0]).join('') : <User size={16} />}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-700 leading-none">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user?.role || 'Guest'}</p>
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-700">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    
                    <Link 
                      to="/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    >
                      <Settings size={14} />
                      System Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border-t border-slate-100"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 mt-16 overflow-y-auto">
          {/* Breadcrumbs for tracking path */}
          <Breadcrumbs />

          {/* Subpages renderer */}
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
