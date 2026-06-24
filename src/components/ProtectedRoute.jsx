import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children, moduleName }) {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-screen flex flex-col items-center justify-center bg-slate-50 min-h-screen">
        <Loader2 className="animate-spin text-olive-500 mb-2" size={32} />
        <span className="text-sm font-semibold text-slate-500">Checking credentials...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save current path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional role-based permissions validation
  if (moduleName && !hasPermission(moduleName)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-xl max-w-lg mx-auto mt-20 shadow-sm text-center">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-full mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6V9m0 12a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">Access Denied</h3>
        <p className="text-sm text-slate-500 leading-normal mb-5">
          Your admin account role <strong>({user.role})</strong> does not possess the permissions required to view the <strong>{moduleName}</strong> workspace.
        </p>
        <a 
          href="/dashboard" 
          className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
