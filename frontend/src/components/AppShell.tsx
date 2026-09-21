import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Compass, HardHat, TrendingUp, Cpu, 
  Map as MapIcon, MessageSquare, ShieldAlert, Mic, Search, 
  Bell, LogOut, Sliders, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VoiceModal } from './VoiceModal';
import { WhatIfModal } from './WhatIfModal';
import { MnAssist } from './MnAssist';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Modal / Drawer States
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [isMnAssistOpen, setIsMnAssistOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Exactly the 7 primary workspaces specified:
  // Command Center, Explore, Mine, Produce, Decide, Map, MnAssist
  const NAV_ITEMS = [
    { name: 'Command Center', path: '/app/command', icon: LayoutDashboard },
    { name: 'Explore', path: '/app/explore', icon: Compass },
    { name: 'Mine', path: '/app/mine', icon: HardHat },
    { name: 'Produce', path: '/app/produce', icon: TrendingUp },
    { name: 'Decide', path: '/app/decide', icon: Cpu },
    { name: 'Map', path: '/app/map', icon: MapIcon },
    { name: 'MnAssist', action: 'mnassist', icon: MessageSquare },
  ];

  const SECONDARY_NAV = [
    { name: 'Audit & System', path: '/app/security', icon: ShieldAlert },
    { name: 'Data Registry', path: '/app/data-models', icon: Layers },
  ];

  const NOTIFICATIONS = [
    { id: 1, title: 'Production Gap Alert', text: 'Balaghat 7-day forecast indicates 350 MT deficit vs 2,800 MT target.', time: '12m ago', unread: true },
    { id: 2, title: 'Equipment Telemetry', text: 'Dump truck EX-104 offline for hydraulic overhaul in Stope B-17.', time: '45m ago', unread: true },
    { id: 3, title: 'Core Assay Validated', text: 'Assay ASY-BAL-001 confirmed 34.5% Mn. Ready for model retraining.', time: '2h ago', unread: false },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    if (query.includes('target') || query.includes('explore')) navigate('/app/explore');
    else if (query.includes('mine') || query.includes('block')) navigate('/app/mine');
    else if (query.includes('shortfall') || query.includes('produce')) navigate('/app/produce');
    else if (query.includes('what-if') || query.includes('decide') || query.includes('opt')) navigate('/app/decide');
    else if (query.includes('map') || query.includes('gis')) navigate('/app/map');
    else navigate('/app/command');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-slate-900 flex flex-col font-sans">
      {/* ── PERSISTENT INDUSTRIAL TOPBAR ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-[#0A1128] text-white border-b border-slate-800 h-16 flex items-center justify-between px-6 shadow-sm">
        {/* Left: Organization & Branding */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/app/command')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-8 h-8 rounded bg-[#131E3A] border border-[#C5A059] text-[#C5A059] font-serif font-black flex items-center justify-center text-sm shadow-sm">
              Mn
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide text-white group-hover:text-[#C5A059] transition">
                  MnVision 360
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700 tracking-wider">
                  MOIL Limited
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:block font-mono">
                Space-to-Mine Intelligence Platform
              </span>
            </div>
          </button>
        </div>

        {/* Center: Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search targets, stopes, shortfall alerts, or operational queries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded bg-slate-900/90 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:bg-slate-900 focus:outline-none focus:border-[#C5A059] transition"
            />
          </div>
        </form>

        {/* Right: Actions, Voice, User Profile */}
        <div className="flex items-center gap-3">
          {/* Global Voice Command Button */}
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition"
            title="Global Voice Command Interface"
          >
            <Mic className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden lg:inline">Voice</span>
          </button>

          {/* What-If Simulation Trigger */}
          <button
            onClick={() => setIsWhatIfOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#C5A059] hover:bg-[#B38F46] text-slate-950 text-xs font-bold transition shadow-xs"
            title="Open Operational What-If Sensitivity Simulation"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">What-If Sandbox</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white relative transition border border-transparent hover:border-slate-700"
              title="Operational Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-xl border border-slate-200 text-slate-900 p-4 space-y-3 z-50 animate-in fade-in duration-100">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Intelligence Notifications</span>
                  <button 
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={`p-2.5 rounded text-xs space-y-1 ${n.unread ? 'bg-amber-50/70 border border-amber-200' : 'bg-slate-50 border border-slate-200'}`}>
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-left text-xs leading-tight hidden xl:block">
              <span className="font-semibold text-white block">{user?.full_name || user?.username || 'Executive Officer'}</span>
              <span className="text-[10px] text-[#C5A059] font-mono block">{user?.role || 'Operations Manager'}</span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE SHELL (PERSISTENT SIDEBAR + CONTENT) ─────────────── */}
      <div className="flex-1 flex w-full">
        {/* Persistent Left Sidebar */}
        <aside className="w-60 bg-[#0A1128] text-white flex-shrink-0 border-r border-slate-800 flex flex-col justify-between p-4 hidden md:flex">
          <div className="space-y-6">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Operational Workspaces
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isMnAssist = item.action === 'mnassist';
                const isActive = !isMnAssist && location.pathname.startsWith(item.path);

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (isMnAssist) {
                        setIsMnAssistOpen((prev) => !prev);
                      } else {
                        navigate(item.path!);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition text-left ${
                      isActive
                        ? 'bg-[#141E38] text-white font-bold border-l-2 border-[#C5A059]'
                        : isMnAssist && isMnAssistOpen
                        ? 'bg-[#141E38] text-white font-bold border-l-2 border-[#C5A059]'
                        : 'text-slate-300 hover:bg-slate-900/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive || (isMnAssist && isMnAssistOpen) ? 'text-[#C5A059]' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                Governance & Registry
              </div>
              <nav className="space-y-1">
                {SECONDARY_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);

                  return (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition text-left ${
                        isActive
                          ? 'bg-[#141E38] text-white font-semibold border-l-2 border-[#C5A059]'
                          : 'text-slate-400 hover:bg-slate-900/40 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Active Mine Information Card in Sidebar */}
          <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-[#C5A059] font-mono text-[10px] font-bold">
              <span>ACTIVE SITE</span>
              <span>MN-BAL-001</span>
            </div>
            <span className="font-semibold text-white block">Balaghat Underground Mine</span>
            <span className="text-[10px] text-slate-400 block font-mono">Datum: -385m RL • Sausar Group</span>
          </div>
        </aside>

        {/* Dynamic Workspace Content */}
        <main className="flex-1 w-full overflow-y-auto bg-[#F8F9FA]">
          <Outlet />
        </main>
      </div>

      {/* Floating or Sidebar-Toggled MnAssist AI Assistant */}
      <MnAssist 
        externalIsOpen={isMnAssistOpen} 
        onClose={() => setIsMnAssistOpen(false)} 
      />

      {/* Global Voice Modal */}
      <VoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />

      {/* Global What-If Simulator Modal */}
      <WhatIfModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};
