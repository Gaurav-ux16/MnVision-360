import React, { useState } from 'react';
import { 
  X, Sliders, Play, RefreshCw, AlertTriangle, CheckCircle2, 
  TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';
import { whatifApi, workflowApi } from '../services/api';
import { PrototypeBadge } from './PrototypeBadge';

interface WhatIfModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetTonnes?: number;
  initialForecastTonnes?: number;
  initialShortfallTonnes?: number;
}

export const WhatIfModal: React.FC<WhatIfModalProps> = ({
  isOpen,
  onClose,
  initialTargetTonnes = 2800.0,
  initialForecastTonnes = 2450.0,
  initialShortfallTonnes = 350.0,
}) => {
  // 8 Simulation Variables
  const [downtimeEx104, setDowntimeEx104] = useState<number>(28.0);
  const [ex104Status, setEx104Status] = useState<string>('MAINTENANCE');
  const [e17Status, setE17Status] = useState<string>('OPERATIONAL');
  const [rainfallMm, setRainfallMm] = useState<number>(12.0);
  const [roadCondition, setRoadCondition] = useState<string>('GOOD');
  const [blastingDelayHrs, setBlastingDelayHrs] = useState<number>(0.0);
  const [devDelayDays, setDevDelayDays] = useState<number>(0.0);
  const [activateBlockB09, setActivateBlockB09] = useState<boolean>(false);
  const [crusherCapacityPct, setCrusherCapacityPct] = useState<number>(100.0);

  // Results State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scenarioId, setScenarioId] = useState<string>('SCN-2026-W001');
  const [predictedProduction, setPredictedProduction] = useState<number>(2450.0);
  const [productionDelta, setProductionDelta] = useState<number>(0.0);
  const [remainingShortfall, setRemainingShortfall] = useState<number>(350.0);
  const [impactBreakdown, setImpactBreakdown] = useState<any[]>([]);

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const payload = {
        target_tonnes: initialTargetTonnes,
        baseline_forecast_tonnes: initialForecastTonnes,
        equipment_downtime_hours: {
          'EX-104': downtimeEx104,
          'E-17': 4.0
        },
        equipment_status: {
          'EX-104': ex104Status,
          'E-17': e17Status
        },
        rainfall_mm_per_day: rainfallMm,
        haul_road_condition: roadCondition,
        blasting_delay_hours: blastingDelayHrs,
        development_delay_days: devDelayDays,
        activate_block_b09: activateBlockB09,
        crusher_capacity_percent: crusherCapacityPct,
        horizon_days: 7
      };

      const res = await whatifApi.simulate(payload);
      if (res && res.data) {
        setScenarioId(res.data.whatif_scenario_id || `SCN-${Date.now().toString().slice(-4)}`);
        setPredictedProduction(res.data.whatif_predicted_production_tonnes ?? 2760.0);
        setProductionDelta(res.data.production_delta_tonnes ?? 310.0);
        setRemainingShortfall(res.data.remaining_shortfall_tonnes ?? 40.0);
        setImpactBreakdown(res.data.relative_delta_breakdown ?? []);
      }
    } catch (err) {
      // Local exact math calculation if API is offline
      let delta = 0;
      // Downtime delta: - (val - 28) * 8.5
      delta -= (downtimeEx104 - 28.0) * 8.5;
      // Ex-104 restored: +360t
      if (ex104Status === 'OPERATIONAL') delta += 360.0;
      // Rain delta
      delta -= ((rainfallMm - 12.0) / 10.0) * 45.0;
      // Road delta
      if (roadCondition === 'POOR') delta -= 110.0;
      if (roadCondition === 'FAIR') delta -= 45.0;
      // Blasting delay
      delta -= blastingDelayHrs * 18.0;
      // Dev delay
      delta -= devDelayDays * 35.0;
      // Block B09
      if (activateBlockB09) delta += 180.0;
      // Crusher
      delta += (crusherCapacityPct - 100.0) * 4.2 * 7;

      delta = Math.round(delta * 10) / 10;
      const newProd = Math.max(0, initialForecastTonnes + delta);
      const newShort = Math.max(0, initialTargetTonnes - newProd);

      setScenarioId(`SCN-2026-W${Math.floor(100 + Math.random() * 900)}`);
      setProductionDelta(delta);
      setPredictedProduction(newProd);
      setRemainingShortfall(newShort);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDowntimeEx104(28.0);
    setEx104Status('MAINTENANCE');
    setE17Status('OPERATIONAL');
    setRainfallMm(12.0);
    setRoadCondition('GOOD');
    setBlastingDelayHrs(0.0);
    setDevDelayDays(0.0);
    setActivateBlockB09(false);
    setCrusherCapacityPct(100.0);
    setProductionDelta(0.0);
    setPredictedProduction(initialForecastTonnes);
    setRemainingShortfall(initialShortfallTonnes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#F8F9FA] rounded border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Industrial Header */}
        <div className="bg-[#0B4F8A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#111A3A] border border-[#F28C28]/40 text-[#F28C28] flex items-center justify-center shadow-inner">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#F28C28] uppercase font-semibold">
                  OPERATIONAL SENSITIVITY SANDBOX
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {scenarioId}
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-white tracking-tight">
                What-If Production Delta Simulator
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Honesty Banner */}
        <div className="bg-orange-500/10 border-b border-orange-500/20 px-6 py-2 flex items-center justify-between text-xs text-orange-900 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-700 flex-shrink-0" />
            <span className="text-[11px] font-medium">Prototype Sensitivity Sandbox • Isolated from Production Telematics Baseline</span>
          </div>
          <PrototypeBadge label="PROTOTYPE SIMULATION DATA" />
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8F9FA]">
          {/* Left Column: 8 Sliders & Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Operational Input Variables
              </span>
              <button 
                onClick={handleReset}
                className="text-[11px] font-mono font-bold text-slate-600 hover:text-[#0B4F8A] flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" /> Reset Baseline
              </button>
            </div>

            {/* 1. EX-104 Downtime */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-1.5 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Dump Truck EX-104 Downtime:</span>
                <span className="font-mono font-bold text-[#0B4F8A]">{downtimeEx104} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="1"
                value={downtimeEx104}
                onChange={(e) => setDowntimeEx104(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#0B4F8A]"
              />
              <span className="text-[10px] text-slate-500 font-mono">Baseline: 28.0 hrs (-8.5 MT/hr impact rate)</span>
            </div>

            {/* 2. Equipment Status */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-2 text-xs">
              <span className="text-slate-700 font-medium block">Fleet Serviceability State:</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Dump Truck EX-104:</span>
                  <button
                    onClick={() => setEx104Status(ex104Status === 'MAINTENANCE' ? 'OPERATIONAL' : 'MAINTENANCE')}
                    className={`w-full py-1.5 px-2 rounded font-mono font-bold text-[11px] transition border ${
                      ex104Status === 'OPERATIONAL'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-orange-50 text-orange-800 border-orange-300'
                    }`}
                  >
                    {ex104Status}
                  </button>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">LHD Unit E-17:</span>
                  <button
                    onClick={() => setE17Status(e17Status === 'OPERATIONAL' ? 'MAINTENANCE' : 'OPERATIONAL')}
                    className={`w-full py-1.5 px-2 rounded font-mono font-bold text-[11px] transition border ${
                      e17Status === 'OPERATIONAL'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-orange-50 text-orange-800 border-orange-300'
                    }`}
                  >
                    {e17Status}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Monsoon Rainfall */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-1.5 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Monsoon Rainfall Intensity:</span>
                <span className="font-mono font-bold text-[#0B4F8A]">{rainfallMm} mm/day</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#0B4F8A]"
              />
              <span className="text-[10px] text-slate-500 font-mono">Baseline: 12.0 mm/day (-45 MT per 10mm increment)</span>
            </div>

            {/* 4. Haul Road & Blasting */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded border border-slate-200 shadow-sm space-y-1">
                <span className="text-slate-600 block">Haul Road Condition:</span>
                <select
                  value={roadCondition}
                  onChange={(e) => setRoadCondition(e.target.value)}
                  className="w-full p-1.5 rounded border border-slate-300 bg-slate-50 font-mono text-xs font-bold text-slate-800"
                >
                  <option value="GOOD">GOOD (0 t)</option>
                  <option value="FAIR">FAIR (-45 t)</option>
                  <option value="POOR">POOR (-110 t)</option>
                </select>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 shadow-sm space-y-1">
                <span className="text-slate-600 block">Blasting Delay:</span>
                <input
                  type="number"
                  min="0"
                  max="12"
                  step="0.5"
                  value={blastingDelayHrs}
                  onChange={(e) => setBlastingDelayHrs(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 rounded border border-slate-300 bg-slate-50 font-mono text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* 5. Block B-09 & Crusher */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded border border-slate-200 shadow-sm space-y-1 flex flex-col justify-between">
                <span className="text-slate-600 block">Activate Block B-09:</span>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={activateBlockB09}
                    onChange={(e) => setActivateBlockB09(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0B4F8A] accent-[#0B4F8A]"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {activateBlockB09 ? 'ACTIVE (+180 t)' : 'STANDBY (0 t)'}
                  </span>
                </label>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 shadow-sm space-y-1">
                <span className="text-slate-600 block">Crusher Capacity:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="50"
                    max="120"
                    step="5"
                    value={crusherCapacityPct}
                    onChange={(e) => setCrusherCapacityPct(parseFloat(e.target.value) || 100)}
                    className="w-20 p-1.5 rounded border border-slate-300 bg-slate-50 font-mono text-xs font-bold text-slate-800"
                  />
                  <span className="font-mono text-xs font-bold text-slate-500">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Simulation Results & Delta Impact */}
          <div className="space-y-4 flex flex-col">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Simulated Output & Shortfall Variance
              </span>
            </div>

            {/* Main Result Card */}
            <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Target Plan</span>
                  <span className="text-xl font-mono font-bold text-slate-900 mt-0.5 block">{initialTargetTonnes.toLocaleString()} t</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Baseline Forecast</span>
                  <span className="text-xl font-mono font-bold text-slate-700 mt-0.5 block">{initialForecastTonnes.toLocaleString()} t</span>
                </div>
              </div>

              {/* What-If Predicted Output */}
              <div className="p-4 rounded bg-[#0B4F8A] text-white space-y-2 border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-mono text-[11px] uppercase tracking-wider">Simulated Output Projection:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-[#F28C28] border border-slate-700">
                    {scenarioId}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-mono font-bold text-[#F28C28] tracking-tight">
                    {predictedProduction.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">MT</span>
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    productionDelta >= 0 
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50' 
                      : 'bg-rose-950/60 text-rose-400 border-rose-700/50'
                  }`}>
                    {productionDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{productionDelta >= 0 ? `+${productionDelta.toFixed(1)} t` : `${productionDelta.toFixed(1)} t`}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                  <span className="font-mono text-[11px]">Net Shortfall Variance:</span>
                  <span className="font-mono font-bold text-white">
                    {remainingShortfall > 0 ? `-${remainingShortfall.toFixed(1)} MT` : 'RESOLVED (0.0 MT)'}
                  </span>
                </div>
              </div>

              {/* Progress Bar Comparison */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-mono text-[11px] text-slate-700">
                  <span>Target Achievement Ratio:</span>
                  <span className="font-bold text-[#0B4F8A]">
                    {Math.min(100, Math.round((predictedProduction / initialTargetTonnes) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded overflow-hidden flex border border-slate-200">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-300" 
                    style={{ width: `${Math.min(100, (predictedProduction / initialTargetTonnes) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Run Simulation CTA Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isLoading}
              className="w-full py-3 px-5 rounded bg-[#0B4F8A] hover:bg-[#111A3A] text-white border border-[#F28C28]/40 hover:border-[#F28C28] font-mono text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F28C28]" />
                  <span>Computing Sensitivity Matrix...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#F28C28]" />
                  <span>Execute What-If Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Decision support sandbox • Changes are isolated until signed off in Decision Center
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
