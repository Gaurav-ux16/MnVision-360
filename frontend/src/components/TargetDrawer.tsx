import React from 'react';
import { 
  X, Target, ShieldCheck, AlertCircle, Compass, Layers, 
  MapPin, Activity, ChevronRight, ArrowRight
} from 'lucide-react';
import { PrototypeBadge } from './PrototypeBadge';

export interface TargetData {
  id: string;
  target_id: string;
  mn_target_code?: string;
  name: string;
  rank: number;
  priority_level: string;
  prospectivity_score: number;
  confidence_pct: number;
  applicability: string;
  area_sqkm: number;
  latitude: number;
  longitude: number;
  predicted_grade: string;
  geology_match: string;
  recommended_action: string;
  evidence: {
    cem_anomaly?: number;
    structural_lineament_density?: number;
    geophysics_gravity?: number;
    geochemistry_mn_ppm?: number;
    sar_polarization_ratio?: number;
    dem_slope_deg?: number;
    [key: string]: any;
  };
  scientific_safety_note: string;
  is_prototype?: boolean;
}

interface TargetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  target: TargetData | null;
  onPlanDrilling?: (target: TargetData) => void;
}

export const TargetDrawer: React.FC<TargetDrawerProps> = ({
  isOpen,
  onClose,
  target,
  onPlanDrilling,
}) => {
  if (!isOpen || !target) return null;

  const prospectivityPct = Math.round(target.prospectivity_score * 100);
  const isHighApplicability = target.applicability.toUpperCase() === 'HIGH';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl border-l border-slate-300 flex flex-col font-sans animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="bg-[#0A1128] text-white p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#131E3A] border border-[#C5A059] text-[#C5A059] font-mono font-bold flex items-center justify-center text-sm shadow-xs">
            #{target.rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C5A059] tracking-wider">
                {target.mn_target_code || target.target_id}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {target.priority_level} Priority
              </span>
            </div>
            <h3 className="text-base font-serif font-bold text-white tracking-tight">{target.name}</h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close Drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8F9FA]">
        {/* Prototype Honesty Banner */}
        <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded p-3 text-xs text-slate-800">
          <div className="flex items-center gap-2 font-medium">
            <Compass className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Multi-Source Exploration Target • Balaghat District (MP)</span>
          </div>
          <PrototypeBadge label="DEMO DATA" />
        </div>

        {/* 3 Key Metrics Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded border border-slate-200 text-center shadow-xs">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Prospectivity</span>
            <span className="text-2xl font-mono font-bold text-[#0A1128] mt-1 block">{prospectivityPct}%</span>
            <span className="text-[10px] text-emerald-700 font-semibold">PU Learning Model</span>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-200 text-center shadow-xs">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Evidence Quality</span>
            <span className="text-2xl font-mono font-bold text-slate-800 mt-1 block">{target.confidence_pct}%</span>
            <span className="text-[10px] text-slate-500 font-medium">7 Sensor Layers</span>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-200 text-center shadow-xs">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Applicability</span>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                isHighApplicability 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {target.applicability}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">In-Domain Valid</span>
          </div>
        </div>

        {/* Spatial Coordinates & Geology Match */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span className="font-semibold text-slate-800">Coordinates:</span>
              <span className="font-mono text-slate-900 font-bold">{target.latitude.toFixed(4)}° N, {target.longitude.toFixed(4)}° E</span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">Area: {target.area_sqkm} km²</span>
          </div>

          <div className="text-xs space-y-1">
            <div className="text-slate-500 font-mono uppercase text-[10px] font-bold">Host Geology Match:</div>
            <p className="text-slate-800 font-medium bg-slate-50 p-2.5 rounded border border-slate-200">
              {target.geology_match}
            </p>
          </div>

          <div className="text-xs space-y-1">
            <div className="text-slate-500 font-mono uppercase text-[10px] font-bold">Predicted Ore Grade:</div>
            <p className="text-emerald-800 font-mono font-bold bg-emerald-50/60 p-2.5 rounded border border-emerald-200">
              {target.predicted_grade}
            </p>
          </div>
        </div>

        {/* Multi-Source Evidence Fusion Breakdown */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Multi-Source Sensor Evidence Breakdown
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Normalized</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Spectral CEM */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Constrained Energy Minimization (CEM Spectral Anomaly)</span>
                <span className="font-mono font-bold text-slate-900">
                  {Math.round((target.evidence.cem_anomaly ?? 0.88) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded" 
                  style={{ width: `${Math.round((target.evidence.cem_anomaly ?? 0.88) * 100)}%` }}
                />
              </div>
            </div>

            {/* Structural Lineaments */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Structural Lineament Density (Fault Proximity)</span>
                <span className="font-mono font-bold text-slate-900">
                  {Math.round((target.evidence.structural_lineament_density ?? 0.81) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded" 
                  style={{ width: `${Math.round((target.evidence.structural_lineament_density ?? 0.81) * 100)}%` }}
                />
              </div>
            </div>

            {/* Geochemistry */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Geochemical Sample Anomaly (Stream Sediment MnO)</span>
                <span className="font-mono font-bold text-slate-900">
                  {target.evidence.geochemistry_mn_ppm ?? 2840} ppm
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-[#C5A059] rounded" 
                  style={{ width: '85%' }}
                />
              </div>
            </div>

            {/* SAR Polarimetry */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Sentinel-1 SAR Polarimetric Roughness (VV/VH)</span>
                <span className="font-mono font-bold text-slate-900">
                  {target.evidence.sar_polarization_ratio ?? 0.68}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded" 
                  style={{ width: `${Math.round((target.evidence.sar_polarization_ratio ?? 0.68) * 100)}%` }}
                />
              </div>
            </div>

            {/* Geophysics Gravity */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Bouguer Gravity Anomaly Correlation</span>
                <span className="font-mono font-bold text-slate-900">
                  {target.evidence.geophysics_gravity ?? 0.62}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded" 
                  style={{ width: `${Math.round((target.evidence.geophysics_gravity ?? 0.62) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Safety Disclosure Notice */}
        <div className="p-3.5 rounded bg-amber-50/80 border border-amber-300 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-mono font-bold text-amber-950 uppercase text-[10px]">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Scientific Exploration Safety Principle</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900">
            {target.scientific_safety_note || 
              "Satellite observations provide surface and near-surface evidence contributing to prospectivity modelling. Subsurface manganese deposit verification strictly requires field reconnaissance, geophysical sounding, and diamond core drilling."}
          </p>
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
        >
          Close Drawer
        </button>

        <button
          onClick={() => {
            if (onPlanDrilling) onPlanDrilling(target);
          }}
          className="flex-1 px-4 py-2 rounded bg-[#0A1128] hover:bg-[#131E3A] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
        >
          <span>Plan Verification Drillhole</span>
          <ArrowRight className="w-4 h-4 text-[#C5A059]" />
        </button>
      </div>
    </div>
  );
};
