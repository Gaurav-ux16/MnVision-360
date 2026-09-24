import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'ok' | 'warning' | 'danger';
  isPrototype?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = 'ok',
  isPrototype = false,
  icon,
  subtitle,
}) => {
  const statusColor = {
    ok: 'border-slate-200 hover:border-[#1E3A8A]',
    warning: 'border-orange-300 bg-orange-50/50',
    danger: 'border-red-300 bg-red-50/50',
  }[status];

  return (
    <div className={`bg-white rounded border p-4 transition-all duration-150 shadow-sm relative overflow-hidden ${statusColor}`}>
      <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider mb-1.5">
        <span className="truncate">{title}</span>
        {icon && <span className="text-[#1E3A8A]">{icon}</span>}
      </div>
      
      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-extrabold tracking-tight text-[#0B192C]">{value}</span>
        {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
        {subtitle && <span className="text-slate-500 text-[11px] truncate">{subtitle}</span>}
        {trendValue && (
          <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${
            trend === 'up' ? 'text-emerald-700' : trend === 'down' ? 'text-red-700' : 'text-slate-600'
          }`}>
            {trend === 'up' && '▲'}
            {trend === 'down' && '▼'}
            {trendValue}
          </span>
        )}
      </div>

      {isPrototype && (
        <div className="mt-1 flex justify-end">
          <span className="text-[9px] uppercase tracking-wider text-orange-700 font-bold">
            Simulation Data
          </span>
        </div>
      )}
    </div>
  );
};
