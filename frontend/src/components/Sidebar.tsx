import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Target, 
  Building2, 
  TrendingUp, 
  Settings, 
  Brain, 
  MapPin, 
  Database,
  Layers,
  Landmark,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Command Center', icon: LayoutDashboard },
    { to: '/exploration', label: 'Exploration GIS', icon: MapIcon },
    { to: '/drill-planning', label: 'Drill Planning', icon: Target },
    { to: '/mine-twin', label: 'MineTwin Blocks', icon: Building2 },
    { to: '/production', label: 'Production Intelligence', icon: TrendingUp },
    { to: '/equipment', label: 'Equipment & Fleet', icon: Settings },
    { to: '/decisions', label: 'Decision Engine', icon: Brain },
    { to: '/field-survey', label: 'Field Survey PWA', icon: MapPin },
    { to: '/data-models', label: 'Data & Models', icon: Database },
  ];

  return (
    <aside className="w-64 bg-[#0B192C] border-r-2 border-[#2B4C7E] flex flex-col justify-between flex-shrink-0 z-20 shadow-2xl">
      <div>
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-brand-border/60 bg-[#060D18]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 flex items-center justify-center shadow-lg border border-orange-300/40">
              <Layers className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="font-extrabold text-base tracking-wide text-white">MnVision 360</h1>
              </div>
              <p className="text-[10px] text-orange-400 font-semibold tracking-wider uppercase">
                MOIL Space-to-Mine
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Landmark className="w-3 h-3 text-orange-400" />
              MOIL Limited PSU
            </span>
            <span className="bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-mono text-[9px]">
              Nagpur
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2.5 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#162C46] text-orange-300 font-bold border-l-4 border-orange-400 shadow-md transform translate-x-1'
                      : 'text-slate-300 hover:text-white hover:bg-[#162C46]/60 hover:border-l-2 hover:border-orange-400/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-orange-400/90" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Official PSU Footer Info */}
      <div className="p-4 border-t border-brand-border/60 bg-[#060D18]/80 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">Ministry of Steel PSU</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">MOIL Bhavan, Nagpur</p>
          <a 
            href="https://www.moil.nic.in/public/home" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-orange-400/80 hover:text-orange-300 transition-colors"
          >
            <span>moil.nic.in</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </aside>
  );
};
