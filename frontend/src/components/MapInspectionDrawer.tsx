import React from 'react';
import { 
  ShieldCheck, Target, MapPin, BarChart3, Database, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, X, Info, Activity
} from 'lucide-react';

export interface InspectionData {
  latitude: number;
  longitude: number;
  location: {
    state: string;
    district: string;
    sector: string;
  };
  prospectivity: {
    score: number;
    raw_score: number;
    classification: string;
    percentile: number;
  };
  geochemistry: {
    mn_ppm: number;
    mn_wt_pct: number;
    unit: string;
    assay_type: string;
  };
  confidence: {
    score: number;
    data_quality: string;
    ood_applicability_score: number;
    applicability_domain: string;
  };
  evidence_channels: Record<string, number>;
  nearest_target?: {
    target_id: string;
    name: string;
    distance_km: number;
  } | null;
  dataset_provenance: string;
}

interface MapInspectionDrawerProps {
  data: InspectionData | null;
  onClose: () => void;
  onOpenTargetDetail?: (targetId: string) => void;
}

export const MapInspectionDrawer: React.FC<MapInspectionDrawerProps> = ({
  data,
  onClose,
  onOpenTargetDetail
}) => {
  if (!data) return null;

  const {
    latitude,
    longitude,
    location,
    prospectivity,
    geochemistry,
    confidence,
    evidence_channels,
    nearest_target,
    dataset_provenance
  } = data;

  const isHighProspectivity = prospectivity.score >= 70;
  const isModerateProspectivity = prospectivity.score >= 50 && prospectivity.score < 70;

  return (
    <div className="bg-[#083B67] border border-slate-800 rounded-xl shadow-2xl p-5 text-white font-sans space-y-5 relative max-h-[820px] overflow-y-auto select-none">
      {/* Drawer Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        title="Close Inspection Panel"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header Banner */}
      <div className="space-y-1 border-b border-slate-800 pb-3 pr-8">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-[#F28C28] uppercase tracking-wider">
            GIS SPATIAL POINT INSPECTOR
          </span>
        </div>
        <h3 className="text-lg font-serif font-bold text-white tracking-tight leading-tight">
          {location.sector}
        </h3>
        <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span>{location.district}, {location.state}</span>
          <span className="text-slate-600">•</span>
          <span className="text-orange-300 font-bold">{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
        </p>
      </div>

      {/* Primary Prospectivity Score & Classification */}
      <div className="bg-[#0B4F8A] p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">MANGANESE PROSPECTIVITY</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            isHighProspectivity ? 'bg-red-950 text-red-400 border border-red-800' :
            isModerateProspectivity ? 'bg-orange-950 text-orange-300 border border-orange-800' :
            'bg-blue-950 text-cyan-300 border border-blue-800'
          }`}>
            {prospectivity.classification}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <div className="text-3xl font-serif font-extrabold text-white tracking-tight">
              {prospectivity.score.toFixed(1)} <span className="text-sm font-sans text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Prospectivity Percentile: <strong className="text-orange-300">{prospectivity.percentile.toFixed(1)}th %ile</strong>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Mn Geochemistry</span>
            <strong className="text-emerald-400 text-lg">{geochemistry.mn_ppm.toLocaleString()} ppm</strong>
            <span className="text-[10px] text-slate-400 block">({geochemistry.mn_wt_pct}% wt MnO)</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isHighProspectivity ? 'bg-gradient-to-r from-orange-500 to-red-600' :
              isModerateProspectivity ? 'bg-gradient-to-r from-emerald-500 to-orange-400' :
              'bg-gradient-to-r from-blue-600 to-cyan-400'
            }`}
            style={{ width: `${prospectivity.score}%` }}
          />
        </div>
      </div>

      {/* Model Confidence & Applicability Domain */}
      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">MODEL CONFIDENCE</span>
          <strong className="text-cyan-300 text-base">{Math.round(confidence.score * 100)}%</strong>
          <span className="text-[9px] text-slate-500 block">Quality: <strong className="text-white">{confidence.data_quality}</strong></span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">APPLICABILITY DOMAIN</span>
          <strong className="text-emerald-400 text-base">{confidence.applicability_domain}</strong>
          <span className="text-[9px] text-slate-500 block">OOD Score: <strong className="text-orange-300">{confidence.ood_applicability_score}</strong></span>
        </div>
      </div>

      {/* Multi-Source Evidence Channels Breakdown */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-serif font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>MULTI-SOURCE EVIDENCE FUSION</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">6 Channels Fused</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {Object.entries(evidence_channels).map(([channelKey, weightVal]) => {
            const channelLabels: Record<string, string> = {
              sentinel2_swir_spectral: "Sentinel-2 SWIR Spectral",
              sausar_geology_lithology: "Precambrian Bedrock Geology",
              bouguer_gravity_anomaly: "Bouguer Gravity Anomaly",
              gsi_stream_geochemistry: "GSI Stream Geochemistry",
              lineament_intersection_density: "Lineament Fault Density",
              dem_topographic_slope: "DEM Topographic Slope"
            };

            const label = channelLabels[channelKey] || channelKey;
            const percentage = Math.round(weightVal * 100);

            return (
              <div key={channelKey} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300">{label}</span>
                  <span className="font-bold text-white">{percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F28C28] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nearest Target Feature Link */}
      {nearest_target && (
        <div className="p-3 bg-orange-950/30 border border-orange-800/60 rounded-lg flex items-center justify-between text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-[10px] text-orange-300 font-bold uppercase block">NEAREST TARGET ASSOCIATED</span>
            <strong className="text-white text-xs">{nearest_target.name} ({nearest_target.distance_km} km)</strong>
          </div>

          {onOpenTargetDetail && (
            <button
              onClick={() => onOpenTargetDetail(nearest_target.target_id)}
              className="px-2.5 py-1 rounded bg-[#F28C28] text-slate-950 font-bold text-[10px] hover:bg-orange-400 transition flex items-center gap-1"
            >
              <span>Target {nearest_target.target_id}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Scientific Safety & Provenance Metadata */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span>DATA PROVENANCE:</span>
          <span className="text-orange-400 font-bold">{dataset_provenance}</span>
        </div>
        <p className="text-[9px] text-slate-500 leading-normal italic">
          Surface & near-surface observations contribute to manganese prospectivity modelling. Underground mineralization requires certified drilling & ground geophysical validation.
        </p>
      </div>
    </div>
  );
};
