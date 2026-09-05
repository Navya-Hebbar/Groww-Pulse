import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { Save, Settings2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const DEFAULT_PREFERENCES = {
  priceMovementEnabled: true,
  volumeAnomalyEnabled: true,
  corporateEventsEnabled: true,
  week52EventsEnabled: true,
  newsEnabled: true,
  minimumAttentionScore: 10,
};

export function SettingsPage() {
  const queryClient = useQueryClient();

  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const { data } = useQuery({
    queryKey: ['preferences'],
    queryFn: () => fetchApi<any>('/preferences'),
  });

  useEffect(() => {
    if (data) {
      setPreferences({
        priceMovementEnabled: data.priceMovementEnabled ?? true,
        volumeAnomalyEnabled: data.volumeAnomalyEnabled ?? true,
        corporateEventsEnabled: data.corporateEventsEnabled ?? true,
        week52EventsEnabled: data.week52EventsEnabled ?? true,
        newsEnabled: data.newsEnabled ?? true,
        minimumAttentionScore: data.minimumAttentionScore ?? 10,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (newPrefs: any) => fetchApi('/preferences', { method: 'PUT', body: JSON.stringify(newPrefs) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-changes'] });
      alert('Preferences saved successfully!');
    },
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updateMutation.mutate(preferences);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in-up">
      {/* Visual Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,229,255,0.15)] bg-surface-900 group">
        <img
          src="/assets/settings_hero.jpg"
          alt="Signal Settings Banner"
          className="w-full h-44 sm:h-52 object-cover object-center opacity-45 group-hover:scale-105 transition-transform duration-700 absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-transparent" />
        
        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-center space-y-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md w-fit">
            <Sparkles className="w-3.5 h-3.5" /> PULSE SIGNAL ENGINE RULES
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Signal Preferences & Thresholds</h1>
          <p className="text-sm text-gray-300 max-w-xl">
            Control which change signals influence your Attention Score algorithms and filter out noise.
          </p>
        </div>
      </div>

      <div className="bg-surface-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Settings2 className="text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Signal Detection Rules</h2>
        </div>

        <div className="space-y-6">
          {/* Price Movement */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Price Volatility Spikes</h4>
              <p className="text-xs text-gray-400">Flag statistical price standard deviation anomalies.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.priceMovementEnabled}
                onChange={() => handleToggle('priceMovementEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* Volume Anomaly */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Volume Surge Anomalies</h4>
              <p className="text-xs text-gray-400">Flag volume spikes exceeding 20-day moving average.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.volumeAnomalyEnabled}
                onChange={() => handleToggle('volumeAnomalyEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* News & Events */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">News & Corporate Catalyst Events</h4>
              <p className="text-xs text-gray-400">Include earnings guidance and news triggers in scoring.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.newsEnabled}
                onChange={() => handleToggle('newsEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-white font-semibold mb-1">Noise Filter Threshold</h4>
            <p className="text-xs text-gray-400 mb-4">
              Minimum Attention Score to display stock updates. Current cutoff:{' '}
              <span className="text-cyan-400 font-mono font-bold">{preferences.minimumAttentionScore}</span>
            </p>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={preferences.minimumAttentionScore}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, minimumAttentionScore: Number(e.target.value) }))
              }
              className="w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-2">
              <span>Show All (0)</span>
              <span>Moderate (&gt;25)</span>
              <span>Critical Only (50)</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-semibold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            <Save size={16} />
            {updateMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
