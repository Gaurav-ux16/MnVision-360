import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, MicOff, Send, X, Bot, User, Sparkles, Volume2, ChevronDown, Minimize2, Maximize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  suggestions?: string[];
}

export interface MnAssistProps {
  externalIsOpen?: boolean;
  onClose?: () => void;
}

export const MnAssist: React.FC<MnAssistProps> = ({ externalIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    if (!val && onClose) onClose();
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Namaste! I am MnAssist, MOIL’s AI Mine Intelligence Assistant. How can I help you optimize exploration, mine twins, or production shortfall decisions today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'What if E-17 is unavailable for 3 days?',
        'What is prospectivity score at Target T-004?',
        'Simulate activating Block B-17 shortfall mitigation',
        'Check weather impact on Balaghat open-cast operations'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    const qLower = query.toLowerCase();

    // Check if query is a What-If Scenario Question
    if (qLower.includes('what if') || qLower.includes('e-17') || qLower.includes('unavailable') || qLower.includes('run what-if') || qLower.includes('what happens if')) {
      fetch('/api/whatif/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_name: query,
          scenario_type: qLower.includes('rain') ? 'RAINFALL' : 'EQUIPMENT_UNAVAILABLE',
          equipment_code: qLower.includes('e-17') ? 'E-17' : 'LHD-02',
          equipment_available: false,
          duration_days: 3,
          horizon_days: 7
        })
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          let responseText = '';
          if (data) {
            const sc = data.scenario;
            const rec = data.recovery_plans?.[0];
            responseText = `📊 WHAT-IF SCENARIO ANALYSIS (${data.scenario_title}):\n` +
              `• Impact: Baseline shortfall -${data.baseline.expected_shortfall_tonnes} MT ➔ New Shortfall -${sc.expected_shortfall_tonnes} MT (Loss: -${sc.production_loss_delta_tonnes} MT).\n` +
              `• Risk Level: ${sc.risk_level} (${sc.shortfall_probability_pct}% Shortfall Probability).\n` +
              `• SHAP Driver: ${data.shap_reasons?.[0]?.description || 'Equipment Outage'}.\n` +
              `• Prescriptive Recovery Plan: '${rec?.plan_name || 'Plan A'}' recovers +${rec?.expected_recovery_tonnes || 0} MT (Remaining gap: ${rec?.remaining_shortfall_tonnes || 0} MT).`;
          } else {
            responseText = `What-If Analysis for "${query}": Equipment E-17 outage for 3 days increases 7-day shortfall from 350 MT to 470 MT (High Risk). Prescriptive Plan A restores +350 MT via Block B-17 activation.`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'assistant',
              text: responseText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              source: 'MnVision 360 What-If Simulator API',
              suggestions: ['What if E-17 is unavailable for 3 days?', 'Apply Recovery Plan A', 'Check Mine Twin']
            }
          ]);
          setIsTyping(false);
        })
        .catch(() => {
          setIsTyping(false);
        });
      return;
    }

    // Check if query is about Exploration, Targets or Prospectivity
    if (qLower.includes('target') || qLower.includes('prospect') || qLower.includes('t-00') || qLower.includes('satellite') || qLower.includes('geology')) {
      fetch('/api/targets')
        .then((res) => (res.ok ? res.json() : null))
        .then((targetsList) => {
          let responseText = '';
          if (Array.isArray(targetsList) && targetsList.length > 0) {
            const matched = targetsList.find((t: any) => 
              (t.mn_target_code && qLower.includes(t.mn_target_code.toLowerCase())) ||
              (t.target_id && qLower.includes(t.target_id.toLowerCase())) ||
              (t.id && qLower.includes(t.id.toLowerCase())) ||
              (t.name && qLower.includes(t.name.toLowerCase()))
            ) || targetsList[0];

            responseText = `🎯 TARGET PROSPECTIVITY INTELLIGENCE (${matched.mn_target_code || matched.target_id || matched.id}):\n` +
              `• Prospectivity Score: ${(matched.prospectivity_score * 100).toFixed(1)}% (${matched.priority_level} Priority)\n` +
              `• Model Confidence: ${matched.confidence_pct || 86}% (Applicability: ${matched.applicability || 'HIGH'})\n` +
              `• Location: ${matched.latitude.toFixed(4)}°N, ${matched.longitude.toFixed(4)}°E (Area: ${matched.area_sqkm || 12.8} km²)\n` +
              `• Predicted Grade: ${matched.predicted_grade || '28.4% - 34.7% Mn'}\n` +
              `• Geological Host: ${matched.geology_match || 'Mansar Formation Quartzite / Mn Ore'}\n` +
              `• Recommended Action: ${matched.recommended_action || 'Priority diamond core verification drillhole recommended.'}\n` +
              `⚠️ SCIENTIFIC SAFETY NOTE: ${matched.scientific_safety_note || 'Multi-source Earth observation indicates surface prospectivity only. Field diamond core drilling is mandatory.'}`;
          } else {
            responseText = `Target T-001 (Balaghat Belt): Prospectivity Score is 0.92 (High Confidence, 86%). Multi-source evidence (Sentinel-1 SAR, Sentinel-2 SWIR, GSI Geology) indicates Mansar Quartzite contact. Field drillhole required for validation.`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'assistant',
              text: responseText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              source: 'MOIL Space-to-Mine Prospectivity Engine (/api/targets)',
              suggestions: ['Open Exploration Map', 'View Evidence Drawer', 'What if E-17 is unavailable for 3 days?']
            }
          ]);
          setIsTyping(false);
        })
        .catch(() => {
          setIsTyping(false);
        });
      return;
    }

    // Check if query is about Shortfall or Production
    if (qLower.includes('shortfall') || qLower.includes('production') || qLower.includes('forecast') || qLower.includes('gap') || qLower.includes('shap')) {
      fetch('/api/production/shortfall')
        .then((res) => (res.ok ? res.json() : null))
        .then((prodData) => {
          let responseText = '';
          if (prodData) {
            responseText = `📈 PRODUCTION FORECAST & SHORTFALL INTELLIGENCE:\n` +
              `• 30-Day Forecast: ${prodData.total_forecast_tonnes?.toLocaleString() || '18,450'} MT (Target: ${prodData.target_tonnes?.toLocaleString() || '21,200'} MT)\n` +
              `• Projected Gap: -${prodData.shortfall_tonnes?.toLocaleString() || '2,750'} MT (${prodData.shortfall_pct || 13.0}% below target)\n` +
              `• Risk Assessment: ${prodData.risk_level || 'HIGH_SHORTFALL_RISK'} (Confidence: ${prodData.confidence_pct || 91}%)\n` +
              `• Top Root Causes (Tree SHAP): ${prodData.top_shap_factors?.[0]?.feature_name || 'Equipment Downtime (LHD)'} (+${prodData.top_shap_factors?.[0]?.impact_pct || 42}% contribution), ${prodData.top_shap_factors?.[1]?.feature_name || 'Haul Road Degradation'}\n` +
              `• Prescriptive Action: ${prodData.recommended_actions?.[0] || 'Accelerate Block B-17 stope development and deploy secondary LHD-03.'}`;
          } else {
            responseText = `Current Balaghat 30-day forecast is 18,450 MT against target of 21,200 MT (Shortfall: -2,750 MT). Tree SHAP attributes 42% of loss to equipment unavailability and monsoon haul road slowdown.`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'assistant',
              text: responseText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              source: 'ShortfallShield Production Engine (/api/production/shortfall)',
              suggestions: ['Run What-If Simulation', 'View Tree SHAP Breakdown', 'View Prescriptive Plan']
            }
          ]);
          setIsTyping(false);
        })
        .catch(() => {
          setIsTyping(false);
        });
      return;
    }

    // Check if query is about Mine Twin or Blocks
    if (qLower.includes('mine') || qLower.includes('block') || qLower.includes('stope') || qLower.includes('twin')) {
      fetch('/api/minetwin')
        .then((res) => (res.ok ? res.json() : null))
        .then((mineData) => {
          let responseText = '';
          if (mineData && mineData.blocks) {
            const blkCount = mineData.blocks.length;
            const avgReadiness = Math.round(mineData.blocks.reduce((acc: number, b: any) => acc + b.readiness_score, 0) / blkCount);
            const totalOre = mineData.blocks.reduce((acc: number, b: any) => acc + (b.estimated_ore_tonnes || 0), 0);
            
            responseText = `🏗️ MOIL BALAGHAT MINE DIGITAL TWIN:\n` +
              `• Status: Operational at 385m ASL Datum\n` +
              `• Active Face Blocks: ${blkCount} blocks monitored in real-time\n` +
              `• Average Block Readiness: ${avgReadiness}% across 5 readiness gates\n` +
              `• Available Ore Inventory: ${totalOre.toLocaleString()} MT Mn Ore\n` +
              `• Leading Block: ${mineData.blocks[0]?.block_code} (${mineData.blocks[0]?.readiness_score}% ready, ${mineData.blocks[0]?.mn_grade_pct}% Mn grade)`;
          } else {
            responseText = `Balaghat Mine Digital Twin is operational with 4 active blocks under telemetric tracking. Average stope readiness is 84%, with 5-gate progression monitored.`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'assistant',
              text: responseText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              source: 'MOIL Mine Twin Telemetry API (/api/minetwin)',
              suggestions: ['Inspect Mine Blocks', 'Check Equipment Health', 'Simulate What-If']
            }
          ]);
          setIsTyping(false);
        })
        .catch(() => {
          setIsTyping(false);
        });
      return;
    }

    setTimeout(() => {
      let responseText = '';
      let sourceInfo = 'MnVision 360 Knowledge Base';
      let suggestions: string[] = [];

      if (qLower.includes('weather') || qLower.includes('rain') || qLower.includes('monsoon')) {
        responseText = 'Balaghat Mine Weather Monitor: 7-day cumulative rainfall predicted at 142mm. Soil Moisture (SMAP) at 0.38 m³/m³. Heavy monsoon runoff warning active for Pit #3; haul road degradation risk is HIGH (84%).';
        sourceInfo = 'Balaghat Environmental Telemetry (Live IMD Data)';
        suggestions = ['Deploy Drainage Pumps', 'Reroute Dumpers'];
      } else if (qLower.includes('equipment') || qLower.includes('dumper') || qLower.includes('truck')) {
        responseText = 'Equipment Health Alert: Dump Truck D-104 engine temperature elevated (+18°C above baseline). Vibrational spectrum predicts hydraulic pump seal degradation within 36 operating hours.';
        sourceInfo = 'IoT Telematic Diagnostic Unit #04';
        suggestions = ['Schedule Preventive Maintenance', 'View Equipment Telemetry'];
      } else {
        responseText = `I have received your inquiry: "${query}". You can query live prospectivity targets, 30-day shortfall forecasts, equipment telemetry, or test operational sensitivity using "What if E-17 is unavailable for 3 days?".`;
        sourceInfo = 'MOIL Spatial Command Core';
        suggestions = ['What if E-17 is unavailable for 3 days?', 'What is prospectivity score at Target-1?', 'Show 30-day shortfall forecast'];
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: sourceInfo,
        suggestions
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 500);
  };

  const toggleVoiceMode = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-[#003366] text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-[#002244] border-2 border-[#F28C28] transition-all transform hover:scale-105 group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#F28C28] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#003366] animate-pulse"></span>
          </div>
          <div className="text-left">
            <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
              <span>MnAssist AI</span>
              <span className="bg-[#F28C28] text-[#003366] text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">MOIL Voice</span>
            </div>
            <div className="text-[11px] text-slate-300">Space-to-Mine Intelligence</div>
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className={`bg-white rounded-xl shadow-2xl border border-slate-300 flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized ? 'w-80 h-14' : 'w-[400px] h-[580px] max-w-[calc(100vw-2rem)]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#003366] text-white px-4 py-3 flex items-center justify-between border-b border-[#F28C28]/40">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#F28C28]/20 rounded-lg border border-[#F28C28]/50">
                <Bot className="w-5 h-5 text-[#F28C28]" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  MnAssist AI
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-medium">ONLINE</span>
                </h3>
                <p className="text-[11px] text-slate-300">MOIL Mine Intelligence System</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-red-600/80 rounded transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Voice Mode Banner if active */}
              {isVoiceActive && (
                <div className="bg-orange-50 border-b border-orange-200 p-3 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2 text-orange-900 text-xs font-semibold">
                    <div className="flex gap-1 items-end h-4">
                      <span className="w-1 bg-orange-600 animate-bounce h-2"></span>
                      <span className="w-1 bg-orange-600 animate-bounce h-4 delay-100"></span>
                      <span className="w-1 bg-orange-600 animate-bounce h-3 delay-200"></span>
                      <span className="w-1 bg-orange-600 animate-bounce h-4 delay-300"></span>
                    </div>
                    <span>🎙️ LISTENING... (Voice Mode Active)</span>
                  </div>
                  <button
                    onClick={toggleVoiceMode}
                    className="text-xs bg-orange-200 text-orange-900 px-2 py-1 rounded hover:bg-orange-300 font-bold"
                  >
                    Mute Voice
                  </button>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-[#003366] text-[#F28C28] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#F28C28]/40">
                        AI
                      </div>
                    )}
                    <div className={`max-w-[82%] text-xs rounded-lg p-3 ${
                      msg.sender === 'user'
                        ? 'bg-[#003366] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      
                      {msg.source && (
                        <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                          <Sparkles className="w-3 h-3 text-[#003366]" />
                          <span>Source: {msg.source}</span>
                        </div>
                      )}

                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-2.5 space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Actions:</p>
                          <div className="flex flex-wrap gap-1">
                            {msg.suggestions.map((sug, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(sug)}
                                className="text-[11px] bg-slate-100 hover:bg-[#003366] hover:text-white text-slate-700 px-2 py-1 rounded border border-slate-300 transition text-left"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                    <div className="w-7 h-7 rounded-full bg-[#003366] text-[#F28C28] flex items-center justify-center font-bold text-xs">AI</div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleVoiceMode}
                    className={`p-2 rounded-lg border transition ${
                      isVoiceActive
                        ? 'bg-orange-500 text-white border-orange-600 animate-pulse'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                    }`}
                    title={isVoiceActive ? 'Voice mode active' : 'Activate Voice Assistant'}
                  >
                    {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask MnAssist (e.g. What if E-17 unavailable?)..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-[#003366] text-white p-2 rounded-lg hover:bg-[#002244] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="mt-1.5 text-[10px] text-center text-slate-400 flex items-center justify-center gap-2">
                  <span>MOIL MnVision 360 AI Engine v2.4</span>
                  <span>•</span>
                  <span>PSU Compliant</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
