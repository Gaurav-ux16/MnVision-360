import React from 'react';
import { NavLink } from 'react-router-dom';
import { Landmark, Phone, MapPin, ExternalLink, ShieldAlert, ArrowUp, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0B192C] text-slate-300 text-xs border-t-4 border-[#F28C28] relative mt-12 flex-shrink-0">
      {/* Back to Top Floating Button */}
      <button
        onClick={scrollToTop}
        className="absolute right-6 -top-5 bg-[#1E3A8A] text-orange-400 p-2.5 rounded-full border-2 border-orange-400 shadow-lg hover:bg-orange-400 hover:text-[#0B192C] transition-all duration-200"
        title="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-800">
        {/* Column 1: PSU Authority & Branding */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-extrabold text-base font-serif">
            <Landmark className="w-5 h-5 text-orange-400" />
            <span>MOIL LIMITED</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            A Miniratna Category-I Public Sector Undertaking (PSU) under the Ministry of Steel, Government of India.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 space-y-1 font-mono">
            <p>CIN: L99999MH1962GOI012398</p>
            <p className="text-orange-400/90 font-medium">MnVision 360 v1.0 (Space-to-Mine Platform)</p>
          </div>
        </div>

        {/* Column 2: Head Office & Contact */}
        <div className="space-y-3">
          <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-400" /> Contact Address
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed">
            <strong>MOIL Bhavan</strong>, 1A Katol Road,<br />
            Nagpur - 440 013, Maharashtra, India
          </p>
          <div className="text-xs text-slate-400 space-y-1 pt-1">
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>+91-712-2590050 / 2590051</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-orange-400" />
              <span>contact@moil.nic.in</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Mon - Fri: 09:30 - 17:30 IST</span>
            </p>
          </div>
        </div>

        {/* Column 3: Platform Modules & Quick Links */}
        <div className="space-y-3">
          <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-1">
            Platform Modules
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li><NavLink to="/" className="hover:text-orange-400 transition-colors">Home & Executive Overview</NavLink></li>
            <li><NavLink to="/exploration" className="hover:text-orange-400 transition-colors">Exploration GIS & Prospectivity</NavLink></li>
            <li><NavLink to="/drill-planning" className="hover:text-orange-400 transition-colors">Drill Target AI & Core Specs</NavLink></li>
            <li><NavLink to="/mine-twin" className="hover:text-orange-400 transition-colors">MineTwin 3D Block Model</NavLink></li>
            <li><NavLink to="/production" className="hover:text-orange-400 transition-colors">Production Forecasting & Shortfall</NavLink></li>
            <li><NavLink to="/equipment" className="hover:text-orange-400 transition-colors">Machinery Telemetry & Anomaly</NavLink></li>
            <li><NavLink to="/decisions" className="hover:text-orange-400 transition-colors">Decision Support Center</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-orange-400 transition-colors">MOIL Contact & Office Info</NavLink></li>
          </ul>
        </div>

        {/* Column 4: Official PSU Links & Data Security */}
        <div className="space-y-3">
          <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-orange-400" /> Security & Portals
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li>
              <a href="https://www.moil.nic.in/public/home" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 flex items-center gap-1">
                <span>MOIL Official Website</span>
                <ExternalLink className="w-3 h-3 text-orange-400" />
              </a>
            </li>
            <li>
              <a href="https://steel.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 flex items-center gap-1">
                <span>Ministry of Steel, Govt. of India</span>
                <ExternalLink className="w-3 h-3 text-orange-400" />
              </a>
            </li>
            <li><a href="#" className="hover:text-orange-400">Public Grievances Portal</a></li>
            <li><a href="#" className="hover:text-orange-400">Tenders & Intranet Portal</a></li>
          </ul>
          <div className="pt-2 bg-[#1E3A8A]/40 p-2.5 rounded border border-orange-500/30 text-[11px] text-orange-300">
            ⚠ Operational modules use Prototype Simulation Data. Real multi-source GIS fused for exploration.
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Visitor Counter Strip */}
      <div className="bg-[#060D18] py-4 px-4 md:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            Content managed & updated by <strong>MOIL Limited</strong>. Copyright © 2026. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>Last Updated: <strong>Sep 07, 2026</strong></span>
            <span>|</span>
            <span>Visitor Count: <strong>14,892</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
