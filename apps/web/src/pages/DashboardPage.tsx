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
  CheckCircle2,
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
      {/* Visual Hero Banner with Generated Graphic Background */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-surface-900 group">
        <img
          src="/assets/dashboard_hero.jpg"
          alt="Groww Pulse Dashboard Hero"
          className="w-full h-56 sm:h-64 object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700 absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-transparent" />
        <ParticleCanvas />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> SMART ATTENTION ENGINE ACTIVE
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Know what changed.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400">
                Know what matters.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              Welcome back, <strong className="text-white">{(user as any)?.name || user?.email || 'Trader'}</strong>. Your watchlists have been scanned against your last visit baseline.
            </p>
          </div>

          {/* Action Buttons Header */}
          <div className="flex flex-wrap items-center gap-3">
            {hasChanges && (
              <button
                onClick={() => setIsStoriesOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2 transition-all hover:scale-105"
              >
                <PlayCircle className="w-4 h-4 fill-white text-cyan-600" />
                Watch Stories ({storyItems.length})
              </button>
            )}

            <button
              onClick={() => {
                fetchApi('/states/mark-all-seen', { method: 'POST' }).then(() => {
                  window.location.reload();
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 text-xs transition-all flex items-center gap-2 backdrop-blur-md"
              title="Reset stock last-seen baseline to current prices"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark All as Seen</span>
            </button>
          </div>
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

      {/* Insights Pinterest-Style Visual Cards Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {changes.map((insight: any, index: number) => {
            // Assign sector image artwork dynamically
            const sectorImg =
              index % 3 === 0
                ? '/assets/sector_energy.jpg'
                : index % 3 === 1
                ? '/assets/sector_tech.jpg'
                : '/assets/sector_banking.jpg';

            return (
              <div
                key={insight.stockId}
                className="group relative overflow-hidden rounded-3xl bg-surface-900/80 border border-white/10 backdrop-blur-2xl shadow-xl hover:shadow-[0_0_30px_rgba(0,208,156,0.2)] hover:border-emerald-500/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Sector Artwork Card Cover */}
                <div className="relative h-36 w-full overflow-hidden bg-surface-950">
                  <img
                    src={sectorImg}
                    alt={insight.symbol}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />
                  
                  {/* Floating Attention Score Shield Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-black text-white shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Score: {insight.attentionScore || 85}</span>
                  </div>

                  {/* Stock Symbol Pill */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-black text-emerald-300 font-mono shadow-[0_0_15px_rgba(0,208,156,0.3)] backdrop-blur-md">
                      {insight.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white font-mono tracking-tight leading-none">{insight.symbol}</h3>
                      <p className="text-[11px] text-gray-300 truncate max-w-[140px] mt-0.5">{insight.companyName || insight.symbol}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body & Signals */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Price & Change Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Current Price</span>
                      <span className="text-xl font-mono font-black text-white">{formatCurrency(insight.currentPrice)}</span>
                    </div>
                    <div className="text-right">
                      {getAttentionBadge(insight.attentionLevel)}
                      <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-mono mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Baseline
                      </span>
                    </div>
                  </div>

                  {/* Meaningful Change Analysis Pill */}
                  {insight.changes && insight.changes.length > 0 && (
                    <div className="space-y-2 bg-black/40 rounded-2xl p-3.5 border border-white/10 backdrop-blur-md">
                      <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Activity size={12} /> Meaningful Change Signal
                      </h4>
                      {insight.changes.map((change: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start text-xs">
                          <div className="mt-0.5">
                            {change.type === 'PRICE_SPIKE' ? (
                              <TrendingUp size={14} className="text-emerald-400" />
                            ) : change.type === 'PRICE_DROP' ? (
                              <TrendingDown size={14} className="text-red-400" />
                            ) : (
                              <Info size={14} className="text-cyan-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-200">{change.title}</div>
                            <div className="text-[11px] text-gray-400 leading-snug line-clamp-2 mt-0.5">{change.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Linked Goal Tag if available */}
                  {insight.linkedGoal && (
                    <div className="pt-2 flex items-center justify-between text-[11px] text-purple-300 font-semibold bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl">
                      <span>Linked Goal:</span>
                      <span className="font-bold text-white">{insight.linkedGoal}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
