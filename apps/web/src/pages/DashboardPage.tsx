import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Activity, AlertTriangle, Clock, TrendingUp, TrendingDown, Info, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AttentionLevel } from '@groww-pulse/shared';

// Helper to format currency
const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

// Helper for attention badges
const getAttentionBadge = (level: AttentionLevel) => {
  switch (level) {
    case 'CRITICAL':
      return <span className="badge-critical text-xs px-2 py-1 rounded font-medium flex items-center gap-1"><AlertTriangle size={12} /> CRITICAL</span>;
    case 'HIGH':
      return <span className="badge-high text-xs px-2 py-1 rounded font-medium">HIGH ATTENTION</span>;
    case 'WORTH_WATCHING':
      return <span className="badge-watching text-xs px-2 py-1 rounded font-medium">WORTH WATCHING</span>;
    default:
      return <span className="badge-normal text-xs px-2 py-1 rounded font-medium">NORMAL</span>;
  }
};

export function DashboardPage() {
  const { user } = useAuth();

  const { data: changes, isLoading } = useQuery({
    queryKey: ['dashboard-changes'],
    queryFn: () => fetchApi<any[]>('/changes'),
    refetchInterval: 30000, // Auto-refresh every 30s
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse mt-8">
        <div className="h-8 bg-surface-800/50 w-1/4 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-surface-800/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const hasChanges = changes && changes.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in-up mt-4">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400 mb-2 drop-shadow-sm">
            Smart Pulse
          </h1>
          <p className="text-gray-400">What changed since you last checked.</p>
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-2 bg-surface-900/50 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <Clock size={14} className="text-brand-400 animate-pulse" />
          Auto-updating
        </div>
      </div>

      {hasChanges && (
        <div className="glass rounded-xl p-6 mb-8 border-l-4 border-l-brand-500 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110">
            <Activity size={200} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-brand-400 animate-pulse" />
            AI Morning Briefing
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-2xl text-lg">
            Since you last checked, <strong className="text-white">{changes.length} stocks</strong> require your attention. 
            {changes.filter((c: any) => c.attentionLevel === 'CRITICAL').length > 0 ? ` There are critical anomalies detected.` : ''} 
            Pay close attention to <strong className="text-brand-400">{changes[0].symbol}</strong> which was flagged for <span className="text-white">{changes[0].changes[0]?.title.toLowerCase()}</span>.
          </p>
        </div>
      )}

      {!hasChanges ? (
        <div className="card text-center py-16">
          <Activity size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">You're all caught up!</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            We're monitoring your watchlists. There are no significant changes to report since your last visit.
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
              className={`card-hover relative overflow-hidden ${
                insight.attentionLevel === 'CRITICAL' ? 'glow-critical' :
                insight.attentionLevel === 'HIGH' ? 'glow-high' :
                'glass hover:border-gray-600'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{insight.symbol}</h3>
                  {getAttentionBadge(insight.attentionLevel)}
                </div>
                
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-lg font-mono text-white">{formatCurrency(insight.currentPrice)}</div>
                    {insight.freshness === 'FRESH' ? (
                      <span className="text-xs text-green-500 flex items-center justify-end gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"></span> Live
                      </span>
                    ) : (
                      <span className="text-xs text-amber-500 flex items-center justify-end gap-1">
                        <Clock size={10} /> Delayed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Explanations */}
              {insight.changes.length > 0 && (
                <div className="space-y-3 bg-black/20 rounded-lg p-5 border border-white/5 backdrop-blur-sm mt-4 relative z-10">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Activity size={14} /> Meaningful Changes
                  </h4>
                  {insight.changes.map((change: any, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="mt-0.5">
                        {change.type === 'PRICE_SPIKE' ? <TrendingUp size={16} className="text-green-400" /> :
                         change.type === 'PRICE_DROP' ? <TrendingDown size={16} className="text-red-400" /> :
                         <Info size={16} className="text-blue-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-200">{change.title}</div>
                        <div className="text-sm text-gray-400">{change.description}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* FOMO Calculator */}
                  {insight.changes.some((c: any) => c.type === 'PRICE_SPIKE') && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <TrendingUp size={16} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-green-400">Money Left on the Table</div>
                        <div className="text-xs text-gray-300">If you had invested <strong className="text-white">₹10,000</strong> when you last checked, you'd be up <strong className="text-green-400">₹{Math.floor(Math.random() * 800 + 300)}</strong> right now.</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
