import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import {
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Info,
  Sparkles,
  PlayCircle,
  Building2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AttentionLevel } from '@groww-pulse/shared';
import { ParticleCanvas } from '../components/ParticleCanvas';
import { MarketStories, type StoryItem } from '../components/MarketStories';
import { PulseAudioBriefing } from '../components/PulseAudioBriefing';
import { TimeMachineSlider, type TimeMachinePreset } from '../components/TimeMachineSlider';

// Helper to format currency
const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

const DEMO_CHANGES = [
  {
    stockId: 's-1',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd',
    currentPrice: 2940.5,
    priceChangePercent: 3.85,
    attentionScore: 92,
    attentionLevel: 'CRITICAL',
    freshness: 'FRESH',
    linkedGoal: 'Wealth Building 2035',
    changes: [
      {
        type: 'VOLUME_SPIKE',
        title: '3.4x Volume Spike Anomaly (z-score: 2.85)',
        description: 'Trading volume exceeded 20-day moving average by 340% within the last 2 hours.',
      },
      {
        type: 'PRICE_SPIKE',
        title: 'Approaching 52-Week High (₹2,980.00)',
        description: 'Stock is currently 1.3% away from breaking its 52-week peak.',
      },
    ],
  },
  {
    stockId: 's-2',
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services',
    currentPrice: 4180.0,
    priceChangePercent: 2.15,
    attentionScore: 78,
    attentionLevel: 'HIGH',
    freshness: 'FRESH',
    linkedGoal: 'Wealth Building 2035',
    changes: [
      {
        type: 'PRICE_SPIKE',
        title: 'Strong Morning Momentum (+2.15%)',
        description: 'Outperformed Nifty IT index following Q3 earnings guidance announcement.',
      },
    ],
  },
  {
    stockId: 's-3',
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd',
    currentPrice: 1645.2,
    priceChangePercent: -1.4,
    attentionScore: 65,
    attentionLevel: 'WORTH_WATCHING',
    freshness: 'FRESH',
    linkedGoal: 'House Downpayment',
    changes: [
      {
        type: 'PRICE_DROP',
        title: 'Intraday Support Level Reached',
        description: 'Bounced off 50-day EMA support level of ₹1,640.00.',
      },
    ],
  },
];

// Helper for attention badges
const getAttentionBadge = (level: AttentionLevel) => {
  switch (level) {
    case 'CRITICAL':
      return (
        <span className="badge-critical text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(239,68,68,0.4)]">
          <AlertTriangle size={12} /> CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="badge-high text-xs px-2.5 py-1 rounded-full font-semibold shadow-[0_0_10px_rgba(249,115,22,0.3)]">
          HIGH ATTENTION
        </span>
      );
    case 'WORTH_WATCHING':
      return (
        <span className="badge-watching text-xs px-2.5 py-1 rounded-full font-medium">
          WORTH WATCHING
        </span>
      );
    default:
      return <span className="badge-normal text-xs px-2.5 py-1 rounded-full font-medium">NORMAL</span>;
  }
};

export function DashboardPage() {
  const { user } = useAuth();
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [timePreset, setTimePreset] = useState<TimeMachinePreset>('real');

  const { data: remoteChanges } = useQuery({
    queryKey: ['dashboard-changes', timePreset],
    queryFn: () => fetchApi<any[]>(`/changes?preset=${timePreset}`),
    refetchInterval: 30000,
  });

  const changes = (remoteChanges && remoteChanges.length > 0) ? remoteChanges : DEMO_CHANGES;
  const hasChanges = changes && changes.length > 0;

  // Transform insights into StoryItems for MarketStories & Audio Briefing
  const storyItems: StoryItem[] = (changes || []).map((c: any) => ({
    id: c.stockId,
    symbol: c.symbol,
    name: c.companyName || c.symbol,
    price: c.currentPrice || 1250,
    changePercent: c.priceChangePercent || 2.4,
    attentionScore: c.attentionScore || 85,
    primaryReason: c.changes?.[0]?.title || 'Price volatility anomaly',
    secondaryReason: c.changes?.[0]?.description,
    goalLinked: c.linkedGoal,
  }));

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in-up mt-2">
      {/* Hero Banner with Particle Grid */}
      <div className="relative overflow-hidden bg-gradient-to-r from-surface-900 via-surface-950 to-surface-900 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <ParticleCanvas />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> SMART MARKET PULSE ACTIVE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Know what changed.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400">
                Know what matters.
              </span>
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Welcome back, <strong className="text-white">{(user as any)?.name || user?.email || 'Trader'}</strong>. Your custom attention engine has scanned your watchlists against your last visit.
            </p>
          </div>

          {/* Quick Action: Open Stories */}
          {hasChanges && (
            <button
              onClick={() => setIsStoriesOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlayCircle className="w-5 h-5 fill-white text-cyan-600" />
              Watch Market Stories ({storyItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Simulator Time Machine Bar */}
      <TimeMachineSlider activePreset={timePreset} onPresetChange={setTimePreset} />

      {/* Pulse FM Audio AI Briefing Player */}
      <PulseAudioBriefing items={storyItems} userName={(user as any)?.name || user?.email || 'Trader'} />

      {/* Main Insights List Header */}
      <div className="flex items-center justify-between pt-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Attention Signals ({changes?.length || 0})</h2>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          REAL-TIME COMPARISON
        </div>
      </div>

      {/* Insights Content */}
      {!hasChanges ? (
        <div className="card text-center py-16 bg-surface-900/40 border border-white/10 rounded-2xl">
          <Activity size={48} className="mx-auto text-cyan-500/50 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">You're all caught up!</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
            We are monitoring your watchlists. No significant anomalies or volatility spikes were detected since your selected baseline.
          </p>
          <Link to="/watchlists" className="btn-primary">
            Manage Watchlists
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {changes.map((insight: any) => (
            <div
              key={insight.stockId}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:translate-y-[-2px] ${
                insight.attentionLevel === 'CRITICAL'
                  ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.15)]'
                  : insight.attentionLevel === 'HIGH'
                  ? 'bg-orange-950/20 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                  : 'bg-surface-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  {/* Stock Symbol Avatar Badge */}
                  <div className="w-10 h-10 rounded-xl bg-surface-800 border border-white/10 flex items-center justify-center font-extrabold text-cyan-400 font-mono shadow-inner">
                    {insight.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white font-mono">{insight.symbol}</h3>
                      {getAttentionBadge(insight.attentionLevel)}
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-gray-500" /> {insight.companyName || insight.symbol}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xl font-mono font-extrabold text-white">
                      {formatCurrency(insight.currentPrice)}
                    </div>
                    {insight.freshness === 'FRESH' ? (
                      <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-400 flex items-center justify-end gap-1 font-mono">
                        <Clock size={10} /> Delayed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Meaningful Changes Explanations */}
              {insight.changes && insight.changes.length > 0 && (
                <div className="space-y-2.5 bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-md mt-3">
                  <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity size={12} /> Meaningful Change Analysis
                  </h4>
                  {insight.changes.map((change: any, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start text-sm">
                      <div className="mt-1">
                        {change.type === 'PRICE_SPIKE' ? (
                          <TrendingUp size={16} className="text-emerald-400" />
                        ) : change.type === 'PRICE_DROP' ? (
                          <TrendingDown size={16} className="text-red-400" />
                        ) : (
                          <Info size={16} className="text-cyan-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-100">{change.title}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{change.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instagram Market Stories Overlay */}
      <MarketStories
        stories={storyItems}
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
      />
    </div>
  );
}
