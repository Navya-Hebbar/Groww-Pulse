import React, { useState } from 'react';
import { Share2, Download, Copy, Check, Sparkles, X, Activity, QrCode } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SocialShareModal({ isOpen, onClose }: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'cyan' | 'emerald' | 'purple'>('cyan');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeGradients = {
    cyan: 'from-cyan-900/60 via-surface-900 to-blue-900/40 border-cyan-500/40 text-cyan-400',
    emerald: 'from-emerald-900/60 via-surface-900 to-teal-900/40 border-emerald-500/40 text-emerald-400',
    purple: 'from-purple-900/60 via-surface-900 to-pink-900/40 border-purple-500/40 text-purple-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-surface-850 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Share Market Insights</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Card Canvas Preview */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs text-gray-400">Select Style Theme:</span>
            {(['cyan', 'emerald', 'purple'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTheme(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                  selectedTheme === t
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-surface-800 text-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Renderable Glass Card */}
          <div
            className={`p-6 rounded-2xl border bg-gradient-to-br ${themeGradients[selectedTheme]} shadow-2xl relative overflow-hidden space-y-4`}
          >
            {/* Watermark / Logo */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span className="font-black text-white text-sm tracking-wider">GROWW PULSE</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-gray-300 uppercase tracking-widest font-mono">
                AI INSIGHT CARD
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="text-xs text-gray-300 uppercase tracking-wider font-semibold">
                Daily Watchlist Intelligence
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                Market Pulse: <span className="text-emerald-400">+2.45% Bullish Momentum</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                "Top gainers TCS (+2.4%) and RELIANCE (+1.5%) leading institutional buying stream."
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
              <div>
                <div className="text-[10px] text-gray-400">WIN RATE</div>
                <div className="text-sm font-bold text-white">84%</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400">STRESS SCORE</div>
                <div className="text-sm font-bold text-emerald-400">LOW (18/100)</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400">AI CALL</div>
                <div className="text-sm font-bold text-cyan-300">STRONG ACCUMULATE</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-850 hover:bg-surface-800 text-white font-semibold text-xs border border-white/10 transition-all"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {copied ? 'Link Copied!' : 'Copy Share Link'}
            </button>

            <button
              onClick={() => alert('Card exported as PNG image!')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg transition-all"
            >
              <Download size={16} />
              Download Image Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
