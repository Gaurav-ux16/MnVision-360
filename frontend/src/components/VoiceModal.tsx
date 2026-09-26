import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, ArrowRight, Volume2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandRecognized?: (command: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onCommandRecognized,
}) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [detectedAction, setDetectedAction] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setTranscript('');
      setDetectedAction(null);

      // Check if browser supports Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            handleCommand(text);
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognition.start();
          return () => recognition.stop();
        } catch (e) {
          // Fallback to simulated audio mode
        }
      }
    } else {
      setIsListening(false);
    }
  }, [isOpen]);

  const handleCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();

    if (text.includes('block') || text.includes('unready') || text.includes('stope')) {
      setDetectedAction('Navigating to Mine Workspace -> Filtering Low Readiness Blocks');
      setTimeout(() => {
        navigate('/app/mine');
        onClose();
      }, 1000);
    } else if (text.includes('production') || text.includes('shortfall') || text.includes('forecast') || text.includes('risk')) {
      setDetectedAction('Navigating to Production Continuity -> Loading 30-Day Forecast');
      setTimeout(() => {
        navigate('/app/produce');
        onClose();
      }, 1000);
    } else if (text.includes('target') || text.includes('prospectivity') || text.includes('explore')) {
      setDetectedAction('Navigating to Explore Workspace -> Highlighting Top Target');
      setTimeout(() => {
        navigate('/app/explore');
        onClose();
      }, 1000);
    } else if (text.includes('what-if') || text.includes('scenario') || text.includes('downtime') || text.includes('simulate')) {
      setDetectedAction('Opening What-If Simulation Sandbox');
      setTimeout(() => {
        navigate('/app/decide');
        onClose();
      }, 1000);
    } else if (text.includes('map') || text.includes('gis') || text.includes('satellite') || text.includes('sentinel')) {
      setDetectedAction('Switching to Full-Screen GIS Command Center');
      setTimeout(() => {
        navigate('/app/map');
        onClose();
      }, 1000);
    } else if (text.includes('command') || text.includes('home') || text.includes('center')) {
      setDetectedAction('Navigating to Command Center Overview');
      setTimeout(() => {
        navigate('/app/command');
        onClose();
      }, 1000);
    } else {
      setDetectedAction('Listening for mining intelligence commands...');
    }

    if (onCommandRecognized) {
      onCommandRecognized(rawText);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulsing Mic Visualization */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-blue-400/20 animate-ping duration-1000" />
                <div className="absolute w-24 h-24 rounded-full bg-[#0B4F8A]/15 animate-pulse" />
              </>
            )}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
              isListening ? 'bg-[#0B4F8A] scale-110' : 'bg-slate-700'
            }`}>
              {isListening ? <Mic className="w-9 h-9 text-orange-300 animate-bounce" /> : <MicOff className="w-9 h-9 text-slate-300" />}
            </div>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#0B4F8A] mt-4 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-orange-500" />
            <span>{isListening ? 'Voice Intelligence Active — Speak Now' : 'Voice Input Standby'}</span>
          </span>
        </div>

        {/* Live Transcript Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[70px] flex items-center justify-center text-center">
          {transcript ? (
            <p className="text-base font-bold text-slate-900 italic">
              "{transcript}"
            </p>
          ) : (
            <p className="text-xs text-slate-600 font-medium">
              Say commands like: <span className="font-bold text-slate-800">"Show high-risk blocks"</span>, <span className="font-bold text-slate-800">"Open production risk"</span>, or <span className="font-bold text-slate-800">"Show exploration targets"</span>
            </p>
          )}
        </div>

        {/* Detected Action Indicator */}
        {detectedAction && (
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{detectedAction}</span>
          </div>
        )}

        {/* Instant Spoken Command Pills */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Or Click a Voice Preset Command:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              'Show high-risk blocks',
              'Open Balaghat production risk',
              'Show exploration targets',
              'Run What-If scenario',
              'Open GIS Command Center'
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setTranscript(cmd);
                  handleCommand(cmd);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#0B4F8A] hover:text-white text-slate-700 transition border border-slate-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-orange-500" />
                <span>{cmd}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
