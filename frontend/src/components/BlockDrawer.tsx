import React from 'react';
import { 
  X, Layers, CheckCircle2, AlertTriangle, ShieldCheck, 
  Wrench, Activity, HardHat, Gauge, Sliders, ArrowRight 
} from 'lucide-react';
import { PrototypeBadge } from './PrototypeBadge';

export interface MineBlockData {
  block_code: string;
  development_pct: number;
  access_pct: number;
  drilling_pct: number;
  blasting_pct: number;
  readiness_score: number;
  estimated_ore_tonnes: number;
  mn_grade_pct: number;
  fe_grade_pct: number;
  status: string;
  level_m?: number;
  ventilation_status?: string;
  water_risk?: string;
  equipment_available?: boolean;
}

interface BlockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  block: MineBlockData | null;
  onSimulateWhatIf?: (block: MineBlockData) => void;
}

export const BlockDrawer: React.FC<BlockDrawerProps> = ({
  isOpen,
  onClose,
  block,
  onSimulateWhatIf,
}) => {
  if (!isOpen || !block) return null;

  const isReady = block.readiness_score >= 80;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl border-l border-slate-300 flex flex-col font-sans animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="bg-[#0B4F8A] text-white p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#1769AA] border border-[#F28C28] text-[#F28C28] font-mono font-bold flex items-center justify-center text-sm shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#F28C28] tracking-wider">
                MINE BLOCK TELEMETRY
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                block.status === 'ACTIVE_PRODUCTION'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-orange-950 text-orange-300 border border-orange-800'
              }`}>
                {block.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-base font-serif font-bold text-white tracking-tight">{block.block_code}</h3>
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

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8F9FA]">
        {/* Prototype Honesty Banner */}
        <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded p-3 text-xs text-slate-800">
          <div className="flex items-center gap-2 font-medium">
            <HardHat className="w-4 h-4 text-[#F28C28] shrink-0" />
            <span>Balaghat Underground Mine • Level -385m RL Sub-Stope</span>
          </div>
          <PrototypeBadge label="PROTOTYPE DATA" />
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs text-center">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Readiness Score</span>
            <span className={`text-2xl font-mono font-bold mt-1 block ${isReady ? 'text-emerald-700' : 'text-orange-700'}`}>
              {block.readiness_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium">5-Gate Progression</span>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs text-center">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Ore Reserve</span>
            <span className="text-2xl font-mono font-bold text-[#0B4F8A] mt-1 block">
              {(block.estimated_ore_tonnes / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-500">t</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Developed Face</span>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs text-center">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Manganese Grade</span>
            <span className="text-2xl font-mono font-bold text-slate-800 mt-1 block">
              {block.mn_grade_pct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium font-mono">{block.fe_grade_pct.toFixed(1)}% Fe Blend</span>
          </div>
        </div>

        {/* Operational Readiness Gate Matrix */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              5-Gate Stope Operational Readiness Matrix
            </h4>
            <span className="text-[10px] font-mono text-slate-400">MineTwin Engine</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Stope Development */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>1. Level Stope Development & Cross-Cut Progress</span>
                <span className="font-mono font-bold text-slate-900">{block.development_pct.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded" 
                  style={{ width: `${block.development_pct}%` }}
                />
              </div>
            </div>

            {/* Haulage Ramp Access */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>2. Haulage Ramp Clearance & Decline Access</span>
                <span className="font-mono font-bold text-slate-900">{block.access_pct.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded" 
                  style={{ width: `${block.access_pct}%` }}
                />
              </div>
            </div>

            {/* Ring Drilling */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>3. Production Ring Longhole Boreholes Complete</span>
                <span className="font-mono font-bold text-slate-900">{block.drilling_pct.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-[#F28C28] rounded" 
                  style={{ width: `${block.drilling_pct}%` }}
                />
              </div>
            </div>

            {/* Blasting Clearance */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>4. Explosive Charge Clearance & Sequencing</span>
                <span className="font-mono font-bold text-slate-900">{block.blasting_pct.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded" 
                  style={{ width: `${block.blasting_pct}%` }}
                />
              </div>
            </div>

            {/* Machinery Availability */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>5. Heavy Machinery Dispatch (LHD & Haul Trucks)</span>
                <span className="font-mono font-bold text-emerald-700">READY</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded" 
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Geotechnical Vitals Card */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs space-y-2 text-xs">
          <div className="font-mono text-[10px] font-bold uppercase text-slate-400">
            GEOTECHNICAL VITALS & SAFETY
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
              <span className="text-slate-500">Rock Mass Rating (RMR):</span>
              <strong className="text-slate-900">68 (Good Rock)</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
              <span className="text-slate-500">Convergence Rate:</span>
              <strong className="text-slate-900">1.2 mm / wk</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
              <span className="text-slate-500">Auxiliary Airflow:</span>
              <strong className="text-emerald-700">18.4 m³/s</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between">
              <span className="text-slate-500">Water Seepage:</span>
              <strong className="text-slate-900">12 L / min</strong>
            </div>
          </div>
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
            if (onSimulateWhatIf) onSimulateWhatIf(block);
          }}
          className="flex-1 px-4 py-2 rounded bg-[#0B4F8A] hover:bg-[#1769AA] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Sliders className="w-3.5 h-3.5 text-[#F28C28]" />
          <span>Simulate Operational What-If</span>
        </button>
      </div>
    </div>
  );
};
