import React from 'react';

function KPICard({ title, value, change, isPositive, icon: Icon, loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        </div>
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-sm transition-shadow duration-200 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className="p-2 bg-olive-50 rounded-lg text-olive-500">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        {change && (
          <p className="text-xs mt-2 flex items-center">
            <span className={`font-semibold mr-1 ${isPositive ? 'text-green-600' : 'text-rose-600'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
            <span className="text-slate-400">vs yesterday</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default KPICard;
