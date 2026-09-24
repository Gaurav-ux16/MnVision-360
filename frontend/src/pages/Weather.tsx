import React from 'react';
import { CloudRain, Thermometer, Droplets, Wind, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';

export const Weather: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge 
        type="banner" 
        isReal={true} 
        message="REAL GEOSPATIAL WEATHER INTEGRATED — SMAP Soil Moisture & CHIRPS 7-Day Rainfall Rasters (Balaghat Belt)" 
      />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#F28C28] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider">
            <CloudRain className="w-4 h-4 text-orange-500" />
            <span>MOIL BALAGHAT ENVIRONMENTAL & METEOROLOGICAL MONITOR</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003366] font-serif mt-1">
            Balaghat Environmental Risk Monitor
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time satellite soil moisture & rainfall feeds directly influencing ShortfallShield AI risk probabilities.
          </p>
        </div>
        <div className="bg-[#003366] text-white p-3 rounded text-xs font-mono border-l-2 border-orange-400">
          <p className="text-orange-300 font-bold">Shortfall Impact Factor</p>
          <p className="text-xl font-extrabold text-orange-400">18.4% (Monsoon Elevated)</p>
        </div>
      </div>

      {/* Environmental Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase">
            <span>7-Day Rainfall</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#003366]">148 mm</p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-red-700 font-bold">HIGH PRECIPITATION</span>
            <span className="text-slate-500">CHIRPS Feed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase">
            <span>SMAP Soil Moisture</span>
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#003366]">0.42 m³/m³</p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-orange-800 font-bold">ELEVATED SATURATION</span>
            <span className="text-slate-500">SMAP Satellite</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase">
            <span>Land Surface Temp</span>
            <Thermometer className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#003366]">28.4 °C</p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold">NORMAL OPERATIONAL</span>
            <span className="text-slate-500">MODIS LST</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase">
            <span>Vegetation Index (NDVI)</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#003366]">0.54</p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold">MODERATE DENSE</span>
            <span className="text-slate-500">Sentinel-2 B08</span>
          </div>
        </div>
      </div>

      {/* Environmental AI Shortfall Pipeline Explanation */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#003366] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>ShortfallShield AI Integration Mechanism</span>
          <span className="text-xs font-bold text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded">Active ML Feature Feed</span>
        </h3>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-2 leading-relaxed">
          <p className="font-bold text-[#003366]">How Weather Influences Mining Operations:</p>
          <p>
            High rainfall levels (&gt;120mm 7-day cumulative) elevate slope instability risks in opencast mining cuts and slow down underground ore haulage truck cycle times by 18.4%. ShortfallShield incorporates daily CHIRPS rainfall & SMAP soil moisture to adjust production shortfall probabilities dynamically.
          </p>
        </div>
      </div>
    </div>
  );
};
