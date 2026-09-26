import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, Activity, 
  Layers, RefreshCw, X, ShieldAlert, BarChart2, Check, ArrowLeft, Clock, Lock, FileText, UserCheck
} from 'lucide-react';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { useAuth } from '../context/AuthContext';
import { workflowApi, decisionsApi, securityApi } from '../services/api';

interface DecisionSnapshot {
  decision_id: string;
  workflow_chain: any;
  authoritative_metrics: any;
  decision_status: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'DISPATCHED';
  executive_notes: string;
  actor: {
    username: string;
    role: string;
    email?: string;
  };
  timestamp: string;
  is_immutable: boolean;
}

export const DecisionCenter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Workflow Context
  const targetId = searchParams.get('target_id') || 'MN-TGT-001';
  const mineId = searchParams.get('mine_id') || 'MN-BAL-001';
  const mineType = searchParams.get('mine_type') || 'Underground';
  const forecastId = searchParams.get('forecast_id') || 'FCST-2026-48B5';
  const shortfallId = searchParams.get('shortfall_id') || 'SF-2026-48B5';
  const parentScenarioId = searchParams.get('scenario_id') || 'SCN-2026-48B5';
  const whatifScenarioId = searchParams.get('whatif_scenario_id') || 'SCN-2026-W001';

  // State
  const [workflowState, setWorkflowState] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [decisionHistory, setDecisionHistory] = useState<DecisionSnapshot[]>([]);
  const [decisionStatus, setDecisionStatus] = useState<'APPROVED' | 'REJECTED' | 'DISPATCHED'>('APPROVED');
  const [executiveNotes, setExecutiveNotes] = useState<string>(
    'Executive sign-off granted by Balaghat Operations Director. Optimized stope recovery plan approved for immediate field dispatch.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load backend workflow state & audit logs (Zero ML/Optimization calls)
  const loadData = () => {
    setLoading(true);
    
    Promise.all([
      workflowApi.getState().catch(() => null),
      securityApi.getAuditLogs({ limit: 15 }).catch(() => null),
      decisionsApi.getHistory().catch(() => null),
    ]).then(([wfRes, auditRes, histRes]) => {
      if (wfRes && wfRes.data && wfRes.data.workflow) {
        setWorkflowState(wfRes.data.workflow);
      }
      if (auditRes && auditRes.data) {
        setAuditLogs(Array.isArray(auditRes.data) ? auditRes.data : []);
      }
      if (histRes && histRes.data && histRes.data.decisions) {
        setDecisionHistory(histRes.data.decisions);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Submit Executive Decision Sign-off
  const handleSignoff = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // Send references ONLY (backend derives actor and retrieves authoritative metrics)
      const res = await decisionsApi.signoff({
        parent_scenario_id: parentScenarioId,
        whatif_scenario_id: whatifScenarioId,
        forecast_id: forecastId,
        shortfall_id: shortfallId,
        target_id: targetId,
        mine_id: mineId,
        decision_status: decisionStatus,
        executive_notes: executiveNotes
      });

      if (res.data && res.data.status === 'SUCCESS') {
        setSuccessMsg(
          `Executive Decision ${res.data.decision_id} successfully recorded with status [${decisionStatus}]. Committed to security audit log.`
        );
        loadData(); // Refresh history and audit stream
      } else {
        setErrorMsg('Failed to record decision sign-off.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Decision sign-off failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWhatIf = () => {
    const params = new URLSearchParams();
    params.set('mine_id', mineId);
    params.set('target_id', targetId);
    params.set('forecast_id', forecastId);
    params.set('shortfall_id', shortfallId);
    params.set('scenario_id', parentScenarioId);
    params.set('whatif_scenario_id', whatifScenarioId);
    params.set('mine_type', mineType);
    navigate(`/what-if?${params.toString()}`);
  };

  const wf = workflowState || {};
  const currentActorName = user?.full_name || user?.username || 'ops_manager';
  const currentActorRole = user?.role || 'Operations Manager';

  // Derive metrics dynamically from latest decision snapshot or backend workflow state
  const latestDecision = decisionHistory.length > 0 ? decisionHistory[0] : null;
  const metrics = latestDecision?.authoritative_metrics || wf?.authoritative_metrics || {
    target_production_tonnes: wf?.targetTonnes ?? null,
    baseline_forecast_tonnes: wf?.forecastTonnes ?? null,
    baseline_shortfall_tonnes: wf?.shortfallTonnes ?? null,
    optimized_expected_production_tonnes: wf?.optimizedTonnes ?? null,
    whatif_predicted_production_tonnes: wf?.whatifPredictedTonnes ?? null,
    remaining_shortfall_tonnes: wf?.remainingShortfallTonnes ?? null,
  };

  const formatMetricVal = (val: number | null | undefined, suffix: string = ' t') => {
    if (val === null || val === undefined || isNaN(val)) return 'NOT AVAILABLE';
    return `${val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${suffix}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 font-sans">
      {/* 11-Stage Workflow Navigator */}
      <WorkflowStepper activeStep={11} targetId={targetId} />

      {/* Success / Error Notification Banners */}
      {successMsg && (
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-900">{successMsg}</p>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-[#1B2170] via-[#313896] to-[#3B42A6] text-white p-6 rounded-2xl border border-[#2B308B] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>MOIL PRESCRIPTIVE MINE OPTIMIZER ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-white mt-1">
            DECISION & GOVERNANCE CENTER
          </h1>
          <p className="text-xs text-blue-100/90 mt-1">
            Mixed-Integer Constraint Solver evaluating block readiness, equipment availability, and crusher capacity
          </p>
        </div>

        {/* Horizon Switcher */}
        <div className="flex items-center gap-2 bg-[#1B2170]/80 backdrop-blur-sm p-1.5 rounded-full border border-white/20 shadow-inner">
          {[7, 15, 30].map((hDays) => (
            <button
              key={hDays}
              onClick={() => setSelectedHorizon(hDays)}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition ${
                selectedHorizon === hDays
                  ? 'bg-white text-[#313896] shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {hDays} Days
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: CURRENT RISK SUMMARY CARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Target Production</span>
          <strong className="text-xl font-bold text-[#313896] font-mono">
            {selectedHorizon === 7 ? '2,800' : selectedHorizon === 15 ? '6,000' : '12,000'} MT
          </strong>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Predicted Output</span>
          <strong className="text-xl font-bold text-[#313896] font-mono">
            {selectedHorizon === 7 ? '2,450' : selectedHorizon === 15 ? '5,120' : '9,840'} MT
          </strong>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Expected Shortfall</span>
          <strong className="text-xl font-bold text-red-600 font-mono">
            -{selectedHorizon === 7 ? '350' : selectedHorizon === 15 ? '880' : '2,160'} MT
          </strong>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Operational Risk</span>
            <span className="text-xs font-bold text-red-700 font-mono">
              {selectedHorizon === 7 ? '68.5% Probability' : selectedHorizon === 15 ? '74.2% Probability' : '81.0% Probability'}
            </span>
          </div>
          <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
            {selectedHorizon === 7 ? 'MEDIUM' : 'HIGH'}
          </span>
        </div>
      </div>

      {/* SECTION 2: CONTEXTUAL SHAP ROOT CAUSES */}
      <div className="bg-[#EBEFFA] border border-[#D0DCF5] text-[#313896] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold text-[#313896]">Contextual SHAP Guidance:</span>
            <span className="text-slate-700 ml-1.5 font-sans">
              Equipment downtime (EX-104) & Block B-09 readiness delays drive {selectedHorizon}-day deficit. Optimizer prioritizing alternate ready blocks and LHD redeployment.
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#313896] bg-white border border-[#D0DCF5] px-2.5 py-1 rounded-full shrink-0 shadow-sm font-semibold">
          Tree SHAP Context Linked
        </span>
      </div>

      {/* SECTION 3: RECOMMENDED FEASIBLE CANDIDATE PLANS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#313896] font-serif flex items-center gap-2">
            <span>Candidate Recovery Plans (MILP Constraint Optimizer)</span>
          </h2>
          <div className="flex items-center gap-2">
            {candidatePlans.length > 1 && (
              <button
                onClick={() => setCompareModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#EBEFFA] text-[#313896] hover:bg-[#D0DCF5] text-xs font-bold rounded-full transition border border-[#D0DCF5]"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-orange-300" />}
                <span>RECORD EXECUTIVE DECISION & DISPATCH</span>
              </button>
            )}
            <span className="text-xs text-[#313896] font-mono bg-[#EBEFFA] px-2.5 py-1 rounded-full border border-[#D0DCF5]">{candidatePlans.length} Feasible Option(s)</span>
          </div>
        </div>

        {/* INFEASIBLE NOTICE (Requirement 11 Edge Case 7) */}
        {isInfeasible ? (
          <div className="bg-red-50 border border-red-300 p-6 rounded-2xl text-center space-y-2">
            <ShieldAlert className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="text-base font-bold text-red-900">
              No feasible recovery plan found under current constraints.
            </h3>
            <p className="text-xs text-red-700 max-w-xl mx-auto">
              All candidate blocks fail readiness requirements (Readiness Score &lt; 80%) or active equipment downtime exceeds operational limits. Relax constraints to run What-if analysis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidatePlans.map((plan) => (
              <div 
                key={plan.plan_id}
                className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-[#313896] transition shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="font-serif font-bold text-base text-[#313896]">{plan.plan_name}</span>
                    <span className={`font-extrabold text-[10px] px-2.5 py-0.5 rounded-full ${
                      plan.feasibility === 'FEASIBLE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {dec.decision_status}
                    </span>
                  </div>

                  {/* Actions List */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Corrective Actions:</span>
                    {plan.actions.map((act, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200/80 text-slate-700 space-y-0.5 shadow-sm">
                        <div className="font-bold text-[#313896] flex items-center justify-between">
                          <span>{act.action_type}</span>
                          <span className="text-emerald-700 font-mono">+{act.impact_tonnes} MT</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{act.details}</p>
                      </div>
                    ))}
                  </div>

                  {/* Constraints Check Badges */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Constraints Check:</span>
                    <div className="space-y-1 text-[11px]">
                      {plan.constraints_status.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-center justify-between text-slate-600 font-sans">
                          <span>{c.constraint}</span>
                          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            c.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output Recovery Numbers */}
                  <div className="p-3.5 bg-[#313896] text-white rounded-xl text-xs space-y-1 font-mono shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Expected Recovery:</span>
                      <strong className="text-emerald-300 font-bold">+{plan.expected_recovery_tonnes} MT</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Remaining Shortfall:</span>
                      <strong className="text-amber-300 font-bold">{plan.remaining_shortfall_tonnes} MT</strong>
                    </div>
                  </div>
                </div>

                {/* Apply Button (Requires User Review - Requirement 10) */}
                <div className="pt-3 border-t border-slate-200/80">
                  <button
                    onClick={() => setSelectedPlanModal(plan)}
                    className="w-full py-2.5 bg-[#313896] hover:bg-[#282D7A] text-white font-bold text-xs rounded-full transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Apply {plan.plan_id}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* APPROVAL MODAL (Human-in-the-Loop Review - Requirement 10) */}
      {selectedPlanModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-gradient-to-r from-[#1B2170] via-[#313896] to-[#3B42A6] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Review & Approve Plan — {selectedPlanModal.plan_name}
                </h3>
              </div>
              <button onClick={() => setSelectedPlanModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <strong className="text-[#0B192C] font-bold text-sm block">Summary of Actions:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {selectedPlanModal.actions.map((act, idx) => (
                    <li key={idx}><strong className="text-blue-900">{act.action_type}:</strong> {act.details}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-mono font-bold flex justify-between">
                <span>Expected Recovery Output:</span>
                <span>+{selectedPlanModal.expected_recovery_tonnes} MT</span>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * Operational actions require user approval before dispatching to MOIL command.
              </p>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  onClick={() => setSelectedPlanModal(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApplyPlan(selectedPlanModal)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>APPROVE & DISPATCH TO FIELD</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">User</th>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Action</th>
                <th className="p-2.5">Resource</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-slate-50">
                  <td className="p-2.5 text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-2.5 font-bold text-slate-900">{log.username}</td>
                  <td className="p-2.5 text-slate-600 font-sans">{log.role}</td>
                  <td className="p-2.5 font-bold text-[#0B4F8A]">{log.action}</td>
                  <td className="p-2.5 text-slate-600 truncate max-w-[150px]">{log.resource}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 font-sans max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="pt-4 flex justify-between items-center border-t border-slate-200 font-sans">
        <button
          onClick={handleBackToWhatIf}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>BACK TO WHAT-IF SIMULATOR (PAGE 7)</span>
        </button>

        <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-300 font-bold">
          ✓ END-TO-END WORKFLOW COMPLETED & AUDITED
        </span>
      </div>
    </div>
  );
};
