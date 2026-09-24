import React, { useState, useEffect } from 'react';
import { Building2, Layers, CheckCircle2, ShieldAlert, ChevronRight, Activity, Zap, Check, AlertTriangle, X } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { BlockDrawer, MineBlockData } from '../components/BlockDrawer';
import { Link, useNavigate } from 'react-router-dom';
import { workflowApi } from '../services/api';

interface MineBlockState {
  block_code: string;
  development_pct: number;
  access_pct: number;
  drilling_pct: number;
  blasting_pct: number;
  readiness_score: number;
  estimated_ore_tonnes: number;
  mn_grade_pct: number;
  fe_grade_pct?: number;
  status: string;
}

export const MineTwin: React.FC = () => {
  const navigate = useNavigate();
  const [mineState, setMineState] = useState<any>(null);
  const [blocks, setBlocks] = useState<MineBlockState[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<MineBlockData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleProceedToShortfall = async () => {
    try {
      await workflowApi.updateState({
        currentStage: 'shortfall',
        blockIds: ['BLK-BAL-01', 'BLK-BAL-02']
      });
    } catch (e) {
      console.warn('Failed to update workflow state:', e);
    }
    navigate('/production');
  };

  useEffect(() => {
    fetch('/api/minetwin')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setMineState(data);
          if (data.blocks) setBlocks(data.blocks);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getReadinessBadge = (score: number) => {
    if (score >= 85) return 'bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-xs';
    if (score >= 75) return 'bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded text-xs';
    return 'bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-xs';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 font-sans">
      <PrototypeBadge 
        type="banner" 
        isReal={true} 
        message="STAGE 6 & 7: MINE TWIN TELEMETRY & TREE SHAP ROOT-CAUSE ANALYSIS" 
      />

      {/* 11-Stage Workflow Navigator */}
      <WorkflowStepper activeStep={6} />

      {/* Page Title Header */}
      <div className="bg-[#0B4F8A] text-white p-5 rounded border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F28C28] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#F28C28]" />
            <span>MOIL UNDERGROUND MINE DIGITAL TWIN</span>
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
            MineTwin Operational State & Block Readiness Matrix
          </h1>
          <p className="text-xs text-slate-400 font-normal">
            Real-time 5-gate block readiness scoring feeding directly into ShortfallShield production forecasting.
          </p>
        </div>
        <div className="bg-slate-900 px-3.5 py-2.5 rounded border border-slate-700 text-xs font-mono">
          <p className="text-slate-400 text-[10px]">CURRENT ACTIVE MINE</p>
          <p className="text-white font-bold text-xs">Balaghat Mn Mine (-385m RL Datum)</p>
        </div>
      </div>

      {/* Mine Block Model Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#1769AA] font-serif flex items-center gap-2">
            <span>Operational Block Readiness Matrix (Balaghat Pit / Underground Levels)</span>
          </h2>
          <span className="text-xs text-[#1769AA] font-mono bg-[#EBEFFA] px-2.5 py-1 rounded-full border border-[#D0DCF5]">4 Active Face Blocks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EBEFFA] border-b border-[#D0DCF5] text-[#1769AA] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 rounded-l-xl">Block Code</th>
                <th className="py-3.5 px-4">Development</th>
                <th className="py-3.5 px-4">Access</th>
                <th className="py-3.5 px-4">Drilling</th>
                <th className="py-3.5 px-4">Blasting</th>
                <th className="py-3.5 px-4">Readiness Score</th>
                <th className="py-3.5 px-4">Est. Ore Tonnes</th>
                <th className="py-3.5 px-4">Mn Grade (%)</th>
                <th className="py-3.5 px-4">Operational Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {blocks.map((block) => (
                <tr 
                  key={block.block_code} 
                  className="hover:bg-[#F8FAFC] transition cursor-pointer"
                  onClick={() => setSelectedBlock({
                    block_code: block.block_code,
                    development_pct: block.development_pct,
                    access_pct: block.access_pct,
                    drilling_pct: block.drilling_pct,
                    blasting_pct: block.blasting_pct,
                    readiness_score: block.readiness_score,
                    estimated_ore_tonnes: block.estimated_ore_tonnes,
                    mn_grade_pct: block.mn_grade_pct,
                    fe_grade_pct: block.fe_grade_pct || 6.2,
                    status: block.status,
                    level_m: 385,
                    ventilation_status: 'NORMAL (18.4 m³/s)',
                    water_risk: 'LOW (12 L/min seepage)',
                    equipment_available: true
                  })}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1769AA]">
                    {block.block_code}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{block.development_pct}%</td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{block.access_pct}%</td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{block.drilling_pct}%</td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{block.blasting_pct}%</td>
                  <td className="py-3.5 px-4">
                    <span className={getReadinessBadge(block.readiness_score)}>
                      {block.readiness_score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{block.estimated_ore_tonnes.toLocaleString()} MT</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{block.mn_grade_pct}% Mn</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#1769AA]">
                    {block.status}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlock({
                          block_code: block.block_code,
                          development_pct: block.development_pct,
                          access_pct: block.access_pct,
                          drilling_pct: block.drilling_pct,
                          blasting_pct: block.blasting_pct,
                          readiness_score: block.readiness_score,
                          estimated_ore_tonnes: block.estimated_ore_tonnes,
                          mn_grade_pct: block.mn_grade_pct,
                          fe_grade_pct: block.fe_grade_pct || 6.2,
                          status: block.status,
                          level_m: 385,
                          ventilation_status: 'NORMAL (18.4 m³/s)',
                          water_risk: 'LOW (12 L/min seepage)',
                          equipment_available: true
                        });
                      }}
                      className="px-3.5 py-1.5 bg-[#EBEFFA] hover:bg-[#D0DCF5] text-[#1769AA] text-[11px] font-bold rounded-full transition border border-[#D0DCF5] inline-flex items-center gap-1 shadow-sm"
                    >
                      <Layers className="w-3 h-3 text-[#1769AA]" />
                      <span>INSPECT</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Link to ShortfallShield */}
      <div className="pt-2 text-right">
        <button
          onClick={handleProceedToShortfall}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1769AA] hover:bg-[#282D7A] text-white text-xs font-bold rounded-full transition shadow-sm"
        >
          <span>View ShortfallShield Production Forecasts & SHAP Analysis</span>
          <ChevronRight className="w-4 h-4 text-orange-300" />
        </button>
      </div>

      {/* Contextual Mine Block Drawer */}
      <BlockDrawer
        isOpen={Boolean(selectedBlock)}
        onClose={() => setSelectedBlock(null)}
        block={selectedBlock}
        onSimulateWhatIf={(block) => {
          setSelectedBlock(null);
          navigate('/whatif');
        }}
      />
    </div>
  );
};
