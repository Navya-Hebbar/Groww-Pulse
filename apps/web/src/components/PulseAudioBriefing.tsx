import React, { useState, useEffect } from 'react';
import { Play, Pause, Radio, Sparkles } from 'lucide-react';
import type { StoryItem } from './MarketStories';

interface PulseAudioBriefingProps {
  items: StoryItem[];
  userName?: string;
}

export const PulseAudioBriefing: React.FC<PulseAudioBriefingProps> = ({ items, userName = 'Trader' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const generateScript = () => {
    if (!items || items.length === 0) {
      return `Hello ${userName}. Your watchlist is calm. No critical anomalies or price alerts were triggered since your last check.`;
    }

    const topItems = items.slice(0, 3);
    const itemSummaries = topItems
      .map(
        (item) =>
          `${item.name} (${item.symbol}) scored an attention level of ${item.attentionScore}. ${item.primaryReason}.`
      )
      .join(' ');

    return `Welcome back ${userName}. Here is your 60-second Groww Pulse market briefing. ${itemSummaries} That concludes your executive summary.`;
  };

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const text = generateScript();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-surface-900/90 via-surface-800/80 to-surface-900/90 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(0,229,255,0.15)] backdrop-blur-md flex items-center justify-between gap-4">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Left Info Section */}
      <div className="flex items-center gap-3.5 z-10">
        <div className="relative p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Radio className={`w-6 h-6 ${isPlaying ? 'animate-pulse text-cyan-300' : ''}`} />
          {isPlaying && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> PULSE FM BRIEFING
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-gray-300">
              AUDIO AI
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white">60-Second Hands-Free Audio Summary</h3>
          <p className="text-xs text-gray-400 hidden sm:block">
            Listen to key market changes since your last visit
          </p>
        </div>
      </div>

      {/* Right Controls Section */}
      <div className="flex items-center gap-3 z-10">
        {isPlaying && (
          <div className="flex items-center gap-1 h-6 px-2">
            <div className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_100ms] h-4" />
            <div className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_300ms] h-6" />
            <div className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms] h-3" />
            <div className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_400ms] h-5" />
          </div>
        )}

        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 shadow-lg ${
            isPlaying
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" /> Stop Audio
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-cyan-300" /> Play Briefing
            </>
          )}
        </button>
      </div>
    </div>
  );
};
