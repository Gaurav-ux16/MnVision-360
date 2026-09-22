import React, { useState } from 'react';
import { 
  Layers, Eye, ChevronRight, Info, ShieldCheck, Sparkles, 
  Compass, Mountain, Trees, Droplet, Activity, Gauge, MapPin, Database, Award
} from 'lucide-react';

export interface StackTier {
  tier_id: string;
  tier_number: number;
  name: string;
  category: string;
  layer_id: string;
  value_display: string;
  numeric_value: number;
  secondary_numeric?: number;
  unit: string;
  source: string;
  resolution: string;
  provenance_type: 'OBSERVED' | 'MODEL_DERIVED' | 'SYNTHETIC_PROTOTYPE';
  data_quality: string;
  interpretation: string;
  color_accent: string;
}

interface LayerStackVisualizationProps {
  tiers: StackTier[];
  activeTierId: string | null;
  onSelectTier: (tierId: string) => void;
  isLoading?: boolean;
  selectedLocationName?: string;
}

export const LayerStackVisualization: React.FC<LayerStackVisualizationProps> = ({
  tiers,
  activeTierId,
  onSelectTier,
  isLoading = false,
  selectedLocationName
}) => {
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'tier-surface':
        return <Eye className="w-4 h-4 text-sky-400" />;
      case 'tier-vegetation':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'tier-terrain':
        return <Mountain className="w-4 h-4 text-amber-400" />;
      case 'tier-geology':
        return <Compass className="w-4 h-4 text-purple-400" />;
      case 'tier-soil':
        return <Droplet className="w-4 h-4 text-amber-600" />;
      case 'tier-geochemistry':
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'tier-geophysics':
        return <Gauge className="w-4 h-4 text-pink-400" />;
      case 'tier-prospectivity':
        return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const getProvenanceBadge = (type: string) => {
    switch (type) {
      case 'OBSERVED':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5" />
            Observed
          </span>
        );
      case 'MODEL_DERIVED':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-blue-950/80 text-blue-300 border border-blue-700/50 flex items-center gap-0.5">
            <Database className="w-2.5 h-2.5" />
            Modelled
          </span>
        );
      case 'SYNTHETIC_PROTOTYPE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-700/50 flex items-center gap-0.5">
            <Award className="w-2.5 h-2.5" />
            Prototype
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full mx-auto" />
        <p className="text-xs font-mono text-slate-400">Extracting 8-plane vertical evidence stack...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stack Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-white tracking-wide uppercase">
              Vertical Evidence Stack
            </h4>
            <p className="text-[10px] font-mono text-slate-400">
              8-Tier Cross-Section beneath Selected Point
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-300">
          Surface $\rightarrow$ Bedrock
        </span>
      </div>

      {/* Stack Diagram Column */}
      <div className="space-y-2 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-purple-500 before:to-[#C5A059] before:opacity-30">
        {tiers.map((tier, idx) => {
          const isSelected = activeTierId === tier.tier_id || activeTierId === tier.layer_id;
          const isExpanded = expandedTierId === tier.tier_id;

          return (
            <div
              key={tier.tier_id}
              className={`relative rounded-xl transition-all duration-200 border text-left overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/95 border-[#C5A059] shadow-lg shadow-[#C5A059]/10 ring-1 ring-[#C5A059]/40'
                  : 'bg-[#080E21]/90 hover:bg-[#0B142F] border-slate-800/90'
              }`}
            >
              {/* Card Header & Compact Bar */}
              <div 
                className="p-2.5 cursor-pointer flex items-center justify-between gap-3"
                onClick={() => {
                  onSelectTier(tier.tier_id);
                  setExpandedTierId(isExpanded ? null : tier.tier_id);
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Tier Number Indicator */}
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition"
                    style={{
                      backgroundColor: isSelected ? `${tier.color_accent}25` : '#111827',
                      borderColor: tier.color_accent,
                      borderWidth: 1,
                      color: tier.color_accent
                    }}
                  >
                    T{tier.tier_number}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-white truncate">
                        {tier.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span className="font-semibold text-slate-200">{tier.value_display}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {getProvenanceBadge(tier.provenance_type)}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedTierId(isExpanded ? null : tier.tier_id);
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Scientific Details */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 bg-slate-950/60 text-xs space-y-2">
                  <p className="text-[11px] text-slate-300 leading-relaxed italic">
                    "{tier.interpretation}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">DATA SOURCE</span>
                      <span className="text-slate-300 font-medium truncate block">{tier.source}</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">RESOLUTION</span>
                      <span className="text-slate-300 font-medium">{tier.resolution}</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">MEASURED UNIT</span>
                      <span className="text-slate-300 font-medium">{tier.unit}</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">DATA QUALITY</span>
                      <span className={`font-bold ${tier.data_quality === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {tier.data_quality}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Depth Honesty Footnote */}
      <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
        <span>Datum: WGS84 (EPSG:4326)</span>
        <span className="text-amber-400/90 font-medium">Modelled Exploration Profile</span>
      </div>
    </div>
  );
};
