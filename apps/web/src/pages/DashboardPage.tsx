import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Activity, AlertTriangle, Clock, TrendingUp, TrendingDown, Info } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-surface-800 w-1/4 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-surface-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const hasChanges = changes && changes.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Pulse</h1>
          <p className="text-gray-400">What changed since you last checked.</p>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Clock size={14} />
          Auto-updating
        </div>
      </div>

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
              className={`card transition-colors ${
                insight.attentionLevel === 'CRITICAL' ? 'border-red-900/50 bg-red-950/10' :
                insight.attentionLevel === 'HIGH' ? 'border-orange-900/50 bg-orange-950/10' :
                'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
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
                <div className="space-y-2 bg-surface-900/50 rounded-lg p-4 border border-gray-800/50">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Meaningful Changes</h4>
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
