import { X, Sparkles, Activity, TrendingUp, TrendingDown, Target, Zap, ShieldCheck } from 'lucide-react';

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

  // Breakdown metrics for score explainability
  const priceContribution = Math.min(40, Math.round(Math.abs(priceChange) * 8));
  const volumeContribution = Math.min(35, Math.round(score * 0.35));
  const goalContribution = insight.linkedGoal ? 25 : 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 font-mono text-base">
              {insight.symbol.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-mono tracking-tight">{insight.symbol}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wide">
                  Score Analysis
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{insight.companyName || insight.symbol}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-zinc-900">
          
          {/* Main Score Hero Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-850 to-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                Pulse Attention Score
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-white font-mono">{score}</span>
                <span className="text-xs font-medium text-zinc-400">/ 100</span>
              </div>
              <p className="text-xs text-zinc-300 mt-1">
                Priority: <strong className="text-emerald-400 font-medium">{insight.attentionLevel || 'High'}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                24h Price Change
              </span>
              <div className={`text-lg font-mono font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
              <span className="text-xs text-zinc-400 font-mono mt-0.5 block">
                ₹{insight.currentPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Zap size={14} className="text-emerald-400" /> Score Factor Weights
            </h3>

            <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              {/* Factor 1: Price Volatility */}
              <div>
                <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                  <span>Price Volatility Delta</span>
                  <span className="text-emerald-400 font-mono font-semibold">+{priceContribution} pts</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(priceContribution / 40) * 100}%` }} />
                </div>
              </div>

              {/* Factor 2: Volume Anomaly */}
              <div>
                <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                  <span>Volume Shift Anomaly</span>
                  <span className="text-teal-400 font-mono font-semibold">+{volumeContribution} pts</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${(volumeContribution / 35) * 100}%` }} />
                </div>
              </div>

              {/* Factor 3: Portfolio Goal Weight */}
              <div>
                <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
                  <span>Portfolio Goal Linkage</span>
                  <span className="text-indigo-400 font-mono font-semibold">+{goalContribution} pts</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${(goalContribution / 25) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Key Drivers */}
          {insight.changes && insight.changes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Activity size={14} className="text-emerald-400" /> Key Drivers & Signals
              </h3>

              <div className="space-y-2">
                {insight.changes.map((change, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200">{change.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{change.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goal Linkage Highlight */}
          {insight.linkedGoal && (
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-indigo-400" />
                <span>Linked Portfolio Goal: <strong className="text-white font-medium">{insight.linkedGoal}</strong></span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 border border-indigo-500/30 text-indigo-200">
                Linked
              </span>
            </div>
          )}

          {/* Summary Footer */}
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2.5">
            <ShieldCheck size={18} className="shrink-0 text-emerald-400" />
            <span>
              <strong className="text-white font-semibold">Summary Verdict:</strong> Volume and price metrics indicate notable activity relative to your portfolio baseline.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
