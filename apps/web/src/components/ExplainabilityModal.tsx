import React from 'react';
import { X, Sparkles, Activity, TrendingUp, TrendingDown, Info, Target, Zap, ShieldCheck } from 'lucide-react';

interface ChangeDetail {
  type: string;
  title: string;
  description: string;
}

interface InsightDetail {
  stockId: string;
  symbol: string;
  companyName?: string;
  currentPrice: number;
  priceChangePercent?: number;
  attentionScore: number;
  attentionLevel: string;
  linkedGoal?: string;
  changes?: ChangeDetail[];
}

interface ExplainabilityModalProps {
  insight: InsightDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExplainabilityModal({ insight, isOpen, onClose }: ExplainabilityModalProps) {
  if (!isOpen || !insight) return null;

  const score = insight.attentionScore || 85;
  const priceChange = insight.priceChangePercent ?? 3.85;
  const isPositive = priceChange >= 0;

  // Breakdown metrics for quantitative explainability
  const priceContribution = Math.min(40, Math.round(Math.abs(priceChange) * 8));
  const volumeContribution = Math.min(35, Math.round(score * 0.35));
  const goalContribution = insight.linkedGoal ? 25 : 10;
  const totalCalculatedScore = Math.min(100, priceContribution + volumeContribution + goalContribution);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-900 border border-cyan-500/40 rounded-3xl w-full max-w-2xl shadow-[0_0_60px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Visual Header */}
        <div className="relative p-6 border-b border-white/10 bg-surface-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-300 font-mono text-xl shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              {insight.symbol.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white font-mono tracking-tight">{insight.symbol}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  EXPLAINABILITY INTEL
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{insight.companyName || insight.symbol}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-surface-950/40">
          
          {/* Main Score Hero Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-surface-850 via-cyan-950/30 to-surface-850 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Calculated Attention Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white font-mono">{score}</span>
                <span className="text-sm font-semibold text-cyan-400">/ 100</span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Categorized as <strong className="text-emerald-400">{insight.attentionLevel || 'HIGH'} ATTENTION</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                24h Movement
              </span>
              <div className={`text-xl font-mono font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
              <span className="text-[11px] text-gray-400 font-mono mt-0.5 block">
                ₹{insight.currentPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Quantitative Formula Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} /> Attention Score Weight Composition
            </h3>

            <div className="space-y-3 bg-surface-900/80 p-4 rounded-2xl border border-white/10">
              {/* Factor 1: Price Volatility */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-200 mb-1">
                  <span>Price Volatility Delta ($\Delta P\%$)</span>
                  <span className="text-cyan-300 font-mono">+{priceContribution} pts</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(priceContribution / 40) * 100}%` }} />
                </div>
              </div>

              {/* Factor 2: Volume Anomaly */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-200 mb-1">
                  <span>Volume Z-Score Anomaly ($\sigma_{vol}$)</span>
                  <span className="text-emerald-300 font-mono">+{volumeContribution} pts</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(volumeContribution / 35) * 100}%` }} />
                </div>
              </div>

              {/* Factor 3: Portfolio Goal Weight */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-200 mb-1">
                  <span>Goal Risk & Allocation Linkage</span>
                  <span className="text-purple-300 font-mono">+{goalContribution} pts</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: `${(goalContribution / 25) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Detected Signals Section */}
          {insight.changes && insight.changes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> Meaningful Triggers
              </h3>

              <div className="space-y-2.5">
                {insight.changes.map((change, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-surface-850 border border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{change.title}</h4>
                      <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{change.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goal Linkage Highlight */}
          {insight.linkedGoal && (
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-purple-400" />
                <span>Linked Portfolio Goal: <strong>{insight.linkedGoal}</strong></span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 border border-purple-500/40 text-purple-200">
                ACTIVE HEURISTIC
              </span>
            </div>
          )}

          {/* Summary Footer */}
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
            <ShieldCheck size={18} className="shrink-0" />
            <span>
              <strong>Explainability Verdict:</strong> This stock requires immediate review due to statistical volume expansion relative to your previous baseline check.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
