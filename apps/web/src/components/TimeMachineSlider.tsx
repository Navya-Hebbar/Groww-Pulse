import React from 'react';
import { History, Clock, Sparkles } from 'lucide-react';

export type TimeMachinePreset = 'real' | '2h' | '24h' | '7d';

interface TimeMachineSliderProps {
  activePreset: TimeMachinePreset;
  onPresetChange: (preset: TimeMachinePreset) => void;
}

export const TimeMachineSlider: React.FC<TimeMachineSliderProps> = ({
  activePreset,
  onPresetChange,
}) => {
  const presets: Array<{ id: TimeMachinePreset; label: string; sub: string }> = [
    { id: 'real', label: 'Actual Last Seen', sub: 'Saved session baseline' },
    { id: '2h', label: '2 Hours Ago', sub: 'Simulated short gap' },
    { id: '24h', label: 'Yesterday', sub: 'Overnight comparison' },
    { id: '7d', label: '1 Week Ago', sub: 'Long-term trend delta' },
  ];

  return (
    <div className="bg-surface-900/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <History className="w-4 h-4" />
        </div>
        <div>
          <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> HACKATHON TIME MACHINE
          </span>
          <p className="text-sm font-semibold text-white">Compare Baseline Simulator</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        {presets.map((p) => {
          const isActive = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPresetChange(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex flex-col items-center justify-center whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-surface-800/60 text-gray-400 border border-white/5 hover:bg-surface-700/60 hover:text-gray-200'
              }`}
            >
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="w-3 h-3" /> {p.label}
              </span>
              <span className="text-[9px] opacity-70 font-mono">{p.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
