import React from 'react';

export const AdminStatCard = ({ title, value, icon: Icon, color = 'sky', subtext }) => {
  const colorMap = {
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  const activeColor = colorMap[color] || colorMap.sky;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center justify-between hover:border-slate-300 transition-colors">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{value}</h3>
        {subtext && <p className="text-[11px] text-slate-400 font-medium">{subtext}</p>}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${activeColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default AdminStatCard;
