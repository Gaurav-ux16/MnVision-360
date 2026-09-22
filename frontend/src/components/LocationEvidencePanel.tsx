import React from 'react';
import { 
  MapPin, ShieldCheck, AlertTriangle, Target, Compass, Database, 
  Layers, ExternalLink, Activity, ArrowRight, CheckCircle2, FileText
} from 'lucide-react';

export interface LocationMetadata {
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  sector: string;
  geological_basin: string;
  geological_unit: string;
  in_known_craton: boolean;
  confidence: {
    score: number;
    data_quality: string;
    ood_applicability_score: number;
    applicability_domain: string;
  };
  nearest_target?: {
    target_id: string;
    name: string;
    rank: number;
    prospectivity_score: number;
    distance_km: number;
    is_within_zone: boolean;
  } | null;
}

export interface DrillholeInterval {
  from_depth_m: number;
  to_depth_m: number;
  lithology: string;
  mn_grade_pct: number;
  fe_grade_pct: number;
  rock_quality: string;
}

export interface DrillholeData {
  has_drillhole: boolean;
  count: number;
  nearest_drillhole?: {
    drillhole_id: string;
    name: string;
    collar_elevation_m: number;
    total_depth_m: number;
    dip_deg: number;
    drilling_method: string;
    core_recovery_pct: number;
    intervals: DrillholeInterval[];
  } | null;
  status: string;
  message?: string;
  recommended_action?: string;
}

interface LocationEvidencePanelProps {
  location: LocationMetadata;
  drillholeData: DrillholeData | null;
  overallProspectivityPct: number;
  explorationReadiness: string;
  onOpenTarget?: (targetId: string) => void;
}

export const LocationEvidencePanel: React.FC<LocationEvidencePanelProps> = ({
  location,
  drillholeData,
  overallProspectivityPct,
  explorationReadiness,
  onOpenTarget
}) => {
  const isDrillReady = explorationReadiness === 'DRILL_READY';

  return (
    <div className="space-y-4">
      {/* ── 1. SELECTED LOCATION OVERVIEW CARD ───────────────────────────────── */}
      <div className="bg-[#080E21] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        {/* Header with Coordinates */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#C5A059]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white font-serif">
                  {location.sector}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {location.district}, {location.state}
              </p>
            </div>
          </div>

          <span 
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              isDrillReady 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' 
                : 'bg-amber-950 text-amber-300 border border-amber-700/60'
            }`}
          >
            {explorationReadiness.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Geographic & Stratigraphic Identifiers */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">COORDINATES</span>
            <span className="text-slate-200 font-bold">
              {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">GEOLOGICAL BASIN</span>
            <span className="text-slate-200 font-bold truncate block" title={location.geological_basin}>
              {location.geological_basin}
            </span>
          </div>
          <div className="col-span-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">MAPPED HOST FORMATION</span>
            <span className="text-[#C5A059] font-bold block truncate" title={location.geological_unit}>
              {location.geological_unit}
            </span>
          </div>
        </div>

        {/* Model Confidence & OOD Domain Metrics */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Model Confidence
            </span>
            <span className="font-mono font-bold text-white">
              {Math.round(location.confidence.score * 100)}%
            </span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.round(location.confidence.score * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
            <span>Applicability Domain:</span>
            <span className={`font-bold ${location.confidence.applicability_domain === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {location.confidence.applicability_domain} ({Math.round(location.confidence.ood_applicability_score * 100)}%)
            </span>
          </div>
        </div>

        {/* Nearest AI Target Alert (If nearby) */}
        {location.nearest_target && location.nearest_target.distance_km <= 20.0 && (
          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-red-400 shrink-0" />
              <div className="text-[11px]">
                <span className="font-bold text-white block">
                  Near Target {location.nearest_target.target_id} ({location.nearest_target.name})
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  Distance: {location.nearest_target.distance_km} km • Prospectivity: {Math.round(location.nearest_target.prospectivity_score * 100)}%
                </span>
              </div>
            </div>

            {onOpenTarget && (
              <button
                onClick={() => onOpenTarget(location.nearest_target!.target_id)}
                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition shrink-0"
              >
                Inspect
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── 2. SUBSURFACE BOREHOLE & DRILLHOLE EVIDENCE (SCIENTIFIC HONESTY) ─── */}
      <div className="bg-[#080E21] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wide">
                Subsurface Core Intercepts
              </h4>
              <p className="text-[10px] font-mono text-slate-400">
                Ground Diamond Core Logs & Assays
              </p>
            </div>
          </div>

          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {drillholeData?.has_drillhole ? 'Observed Core' : 'Surface Only'}
          </span>
        </div>

        {/* CASE A: Real Verified Drillhole Available in Proximity */}
        {drillholeData?.has_drillhole && drillholeData.nearest_drillhole ? (
          <div className="space-y-3">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-white">{drillholeData.nearest_drillhole.drillhole_id}</span>
                <span className="text-slate-400 text-[10px] block">Collar: {drillholeData.nearest_drillhole.collar_elevation_m}m RL • Depth: {drillholeData.nearest_drillhole.total_depth_m}m</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold">
                  {drillholeData.nearest_drillhole.core_recovery_pct}% Recovery
                </span>
              </div>
            </div>

            {/* Vertical Stratigraphic Intervals Strip */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Stratigraphic Intervals:
              </span>
              {drillholeData.nearest_drillhole.intervals.map((iv, i) => {
                const isOre = iv.mn_grade_pct > 20.0;
                return (
                  <div 
                    key={i} 
                    className={`p-2 rounded-lg border text-left transition ${
                      isOre 
                        ? 'bg-amber-950/40 border-[#C5A059] shadow-sm' 
                        : 'bg-slate-900/50 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300 text-[10px]">
                        {iv.from_depth_m.toFixed(1)}m – {iv.to_depth_m.toFixed(1)}m
                      </span>
                      <span className={`font-mono font-bold text-[11px] ${isOre ? 'text-[#C5A059]' : 'text-slate-400'}`}>
                        {iv.mn_grade_pct}% Mn ({iv.fe_grade_pct}% Fe)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                      {iv.lithology}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* CASE B: No Real Drillhole in Proximity — Strictly Avoid Fake Depths */
          <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-800/40 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-amber-300 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>Surface & Near-Surface Exploration Evidence Only</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              No verified diamond core drillholes exist within 15 km of this coordinate. 
              <span className="font-semibold text-white"> Subsurface depths and tonnages cannot be confirmed by satellite data alone.</span>
            </p>
            <div className="pt-2 border-t border-amber-800/30 text-[10px] font-mono text-amber-300/80 flex items-center justify-between">
              <span>Next Field Step:</span>
              <span className="font-bold text-white">In-Situ Ground Geophysics & Drilling</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. EXPLORATION WORKFLOW ACTION BAR ───────────────────────────────── */}
      <div className="pt-1 flex items-center gap-2">
        <button
          onClick={() => {
            alert(`Evidence profile for ${location.sector} (${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E) exported to exploration log.`);
          }}
          className="w-full py-2 px-3 rounded-xl bg-[#0A1128] hover:bg-[#111A38] border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Export Evidence Summary</span>
        </button>
      </div>
    </div>
  );
};
