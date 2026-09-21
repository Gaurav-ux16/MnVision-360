import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Layers, MapPin, TrendingUp, Compass, 
  HardHat, Cpu, AlertTriangle, ArrowRight, ShieldCheck, 
  Activity, CheckCircle2, ChevronRight, Sliders, ExternalLink
} from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 font-sans">
      {/* ── 1. OPERATIONAL CONTEXT BANNER ───────────────────────────────────── */}
      <div className="bg-white border border-slate-200 p-5 rounded flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              OPERATIONAL TELEMETRY ACTIVE • BALAGHAT MINE
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-mono text-slate-600">
              DATUM: -385m RL (UNDERGROUND LEVEL 5)
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-950 tracking-tight">
            Integrated Space-to-Mine Operations Deck
          </h1>
          <p className="text-xs text-slate-600 font-normal">
            Continuous decision-support bridging satellite spectral evidence, stope block readiness, and 30-day production forecasting for MOIL Limited.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/app/decide')}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-slate-950 text-xs font-bold rounded transition shadow-xs flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Prescriptive Optimizer</span>
          </button>
          <button
            onClick={() => navigate('/app/explore')}
            className="px-4 py-2 bg-[#0A1128] hover:bg-[#131E3A] text-white text-xs font-semibold rounded transition flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Exploration Map</span>
          </button>
        </div>
      </div>

      {/* ── 2. KEY OPERATIONAL METRICS STRIP ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Stope Readiness */}
        <div className="bg-white border border-slate-200 p-4 rounded shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Stope Readiness Index</span>
            <HardHat className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-slate-950">84.2%</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              5 Gates Monitored
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            4 active stope faces at Balaghat underground datum.
          </p>
        </div>

        {/* Metric 2: 30-Day Forecast */}
        <div className="bg-white border border-slate-200 p-4 rounded shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>30-Day Ore Forecast</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-slate-950">18,450 t</span>
            <span className="text-[11px] font-mono text-slate-500">/ 21,200 t</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            ShortfallShield XGBoost regression model v1.0.
          </p>
        </div>

        {/* Metric 3: Projected Gap */}
        <div className="bg-white border border-slate-200 p-4 rounded shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Projected Gap</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-red-600">-2,750 t</span>
            <span className="text-[11px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              13.0% Deficit
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Shortfall risk triggered against downstream delivery quota.
          </p>
        </div>

        {/* Metric 4: Primary Root Cause */}
        <div className="bg-white border border-slate-200 p-4 rounded shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Top Root Cause (Tree SHAP)</span>
            <Cpu className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-slate-950">42.0%</span>
            <span className="text-[11px] font-medium text-slate-600">Equipment Outage</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            LHD-02 hydraulic pump seal and dumper availability.
          </p>
        </div>

        {/* Metric 5: Prospect Targets */}
        <div className="bg-white border border-slate-200 p-4 rounded shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>AI Exploration Targets</span>
            <Compass className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#0A1128]">5 Zones</span>
            <span className="text-[11px] font-mono font-bold text-[#C5A059]">Top: 0.92</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            SpatialBlockCV multi-spectral PU model (Balaghat AOI).
          </p>
        </div>
      </div>

      {/* ── 3. SPACE-TO-MINE VALUE CHAIN PIPELINE ──────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <span>Space-to-Mine Integrated Operational Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500">
              End-to-end telemetry chain connecting planetary remote sensing to underground stope delivery.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            5 CONNECTED WORKSPACES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
          {/* Station 1: Earth Observation */}
          <div 
            onClick={() => navigate('/app/explore')}
            className="p-4 bg-slate-50 border border-slate-200 rounded hover:border-[#0A1128] hover:bg-slate-100/60 transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 01</span>
              <Compass className="w-4 h-4 text-slate-500 group-hover:text-[#0A1128] transition" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0A1128]">
              Earth Observation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Sentinel-1 SAR polarimetry & Sentinel-2 SWIR ratios mapping Mansar Quartzite surface contacts.
            </p>
            <div className="pt-2 text-[10px] font-semibold text-[#C5A059] flex items-center gap-1">
              <span>View Targets</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Station 2: Geological Validation */}
          <div 
            onClick={() => navigate('/app/explore')}
            className="p-4 bg-slate-50 border border-slate-200 rounded hover:border-[#0A1128] hover:bg-slate-100/60 transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 02</span>
              <MapPin className="w-4 h-4 text-slate-500 group-hover:text-[#0A1128] transition" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0A1128]">
              Geological Assays
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              160 stream sediment assays and diamond core recovery records validating 28.4% - 34.7% Mn grade.
            </p>
            <div className="pt-2 text-[10px] font-semibold text-[#C5A059] flex items-center gap-1">
              <span>Check Assays</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Station 3: Mine Twin 360 */}
          <div 
            onClick={() => navigate('/app/mine')}
            className="p-4 bg-slate-50 border border-slate-200 rounded hover:border-[#0A1128] hover:bg-slate-100/60 transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 03</span>
              <HardHat className="w-4 h-4 text-slate-500 group-hover:text-[#0A1128] transition" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0A1128]">
              Underground Mine Twin
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Real-time 5-gate readiness scoring across cable bolting, ventilation CFM, trackage, and ore chutes.
            </p>
            <div className="pt-2 text-[10px] font-semibold text-[#C5A059] flex items-center gap-1">
              <span>Inspect Blocks</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Station 4: Shortfall Forecasting */}
          <div 
            onClick={() => navigate('/app/produce')}
            className="p-4 bg-slate-50 border border-slate-200 rounded hover:border-[#0A1128] hover:bg-slate-100/60 transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 04</span>
              <TrendingUp className="w-4 h-4 text-slate-500 group-hover:text-[#0A1128] transition" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0A1128]">
              Shortfall Prediction
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              30-day production curve projecting a 2,750 MT gap, decomposed via Tree SHAP feature attributions.
            </p>
            <div className="pt-2 text-[10px] font-semibold text-[#C5A059] flex items-center gap-1">
              <span>View Forecast</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Station 5: Prescriptive Optimization */}
          <div 
            onClick={() => navigate('/app/decide')}
            className="p-4 bg-slate-50 border border-slate-200 rounded hover:border-[#0A1128] hover:bg-slate-100/60 transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 05</span>
              <Cpu className="w-4 h-4 text-slate-500 group-hover:text-[#0A1128] transition" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0A1128]">
              Prescriptive Decision
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Mathematical solver deploying Plan A (+350 MT via Block B-17) and real-time sensitivity simulation.
            </p>
            <div className="pt-2 text-[10px] font-semibold text-[#C5A059] flex items-center gap-1">
              <span>Optimize Output</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. ACTIVE OPERATIONAL ALERTS TABLE ──────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              <span>Real-Time Operational & Geotechnical Log</span>
            </h2>
            <p className="text-xs text-slate-500">Live operational exceptions requiring supervisory authorization.</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">3 ACTIVE ITEMS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                <th className="py-2.5 px-4 font-bold">SEVERITY</th>
                <th className="py-2.5 px-4 font-bold">SUBSYSTEM</th>
                <th className="py-2.5 px-4 font-bold">TELEMETRY / LOCATION</th>
                <th className="py-2.5 px-4 font-bold">OBSERVED VALUE</th>
                <th className="py-2.5 px-4 font-bold">EXPECTED BASELINE</th>
                <th className="py-2.5 px-4 font-bold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                    CRITICAL
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">Shortfall Forecast</td>
                <td className="py-3 px-4">Balaghat 30-Day Aggregate Horizon</td>
                <td className="py-3 px-4 font-mono text-red-600 font-bold">18,450 t (-2,750 t)</td>
                <td className="py-3 px-4 font-mono text-slate-600">21,200 t</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => navigate('/app/decide')}
                    className="px-3 py-1 bg-[#0A1128] hover:bg-[#131E3A] text-white text-[11px] font-semibold rounded transition"
                  >
                    Run Optimizer
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    WARNING
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">Mine Twin Telematics</td>
                <td className="py-3 px-4">Stope BLK-BAL-04 (Access Gate)</td>
                <td className="py-3 px-4 font-mono text-amber-700 font-bold">68% Readiness</td>
                <td className="py-3 px-4 font-mono text-slate-600">&ge; 80% Required</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => navigate('/app/mine')}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded border border-slate-300 transition"
                  >
                    Inspect Block
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    INFORMATIONAL
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">Exploration Target</td>
                <td className="py-3 px-4">Target MN-TGT-001 (21.84°N, 80.72°E)</td>
                <td className="py-3 px-4 font-mono text-emerald-700 font-bold">0.92 Prospectivity</td>
                <td className="py-3 px-4 font-mono text-slate-600">86% Confidence</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => navigate('/app/explore')}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded border border-slate-300 transition"
                  >
                    Inspect Target
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. GEOLOGICAL & SITE PROVENANCE MATRIX ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-2 text-xs">
          <div className="font-mono text-[11px] font-bold text-slate-400 uppercase">
            GEOLOGICAL PROVENANCE
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            Sausar Group Stratigraphy • Mansar Formation
          </h3>
          <p className="text-slate-600 leading-relaxed">
            The Balaghat deposit forms part of the world-class Sausar Mobile Belt. Manganese mineralization is hosted within the Mansar Formation, comprising braunite, hollandite, and bixbyite concordantly interbanded with quartzites and mica-schists.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-700">
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Dip: 65°–75° NW</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Strike: ENE–WSW</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Target Grade: 32.4% Mn</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-2 text-xs">
          <div className="font-mono text-[11px] font-bold text-slate-400 uppercase">
            SCIENTIFIC SAFETY ASSURANCE
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            Remote Sensing & Field Verification Protocol
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Multi-source satellite remote sensing provides surface structural alignment, roughness polarimetry, and mineral spectral reflectance. In compliance with JORC/UNFC reporting standards, satellite signatures indicate surface prospectivity only; subterranean ore thickness requires diamond core drillholes.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-700">
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">SpatialBlockCV: 5 Folds</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">EPSG:4326 Datum</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Zero Hallucination AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
