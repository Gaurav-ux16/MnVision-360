import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface PrototypeBadgeProps {
  type?: 'banner' | 'badge' | 'inline';
  isReal?: boolean;
  message?: string;
  label?: string;
}

export const PrototypeBadge: React.FC<PrototypeBadgeProps> = ({
  type = 'badge',
  isReal = false,
  message,
  label
}) => {
  const activeMessage = message || label;
  if (isReal) {
    if (type === 'banner') {
      return (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center justify-between text-xs text-emerald-900 font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">
              {activeMessage || 'REAL GEOSPATIAL ML MODEL INTEGRATED — Balaghat AOI (SRTM DEM, Sentinel-1 SAR, Sentinel-2 Optical, GSI Geology & Geochemistry)'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded uppercase font-extrabold">
            Validated Real Dataset
          </span>
        </div>
      );
    }

    if (type === 'inline') {
      return (
        <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{activeMessage || 'REAL GEOSPATIAL DATA'}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 border border-emerald-400 px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
        REAL GEOSPATIAL DATA
      </span>
    );
  }

  // Fallback for Prototype Simulation Data (Operational Modules)
  const defaultMessage = activeMessage || 'PROTOTYPE SIMULATION DATA — Synthetic MOIL Operational Telemetry';

  if (type === 'banner') {
    return (
      <div className="bg-orange-50 border-b border-orange-200 px-4 py-2 flex items-center justify-between text-xs text-orange-900 font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600 animate-pulse" />
          <span className="font-semibold">⚠ {defaultMessage}</span>
        </div>
        <span className="text-[10px] text-orange-800 bg-orange-100 border border-orange-300 px-2 py-0.5 rounded uppercase font-bold">
          SIH Demonstration Sandbox
        </span>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <span className="text-[11px] text-orange-800 font-semibold flex items-center gap-1">
        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
        <span>{defaultMessage}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-900 border border-orange-300 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
      Prototype Data
    </span>
  );
};
