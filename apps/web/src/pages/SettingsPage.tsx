import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { Save, Settings2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function SettingsPage() {
  const queryClient = useQueryClient();
  
  const [preferences, setPreferences] = useState({
    priceMovementEnabled: true,
    volumeAnomalyEnabled: true,
    corporateEventsEnabled: true,
    week52EventsEnabled: true,
    newsEnabled: true,
    minimumAttentionScore: 0,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: () => fetchApi<any>('/preferences'),
  });

  useEffect(() => {
    if (data) {
      setPreferences({
        priceMovementEnabled: data.priceMovementEnabled,
        volumeAnomalyEnabled: data.volumeAnomalyEnabled,
        corporateEventsEnabled: data.corporateEventsEnabled,
        week52EventsEnabled: data.week52EventsEnabled,
        newsEnabled: data.newsEnabled,
        minimumAttentionScore: data.minimumAttentionScore,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (newPrefs: any) => fetchApi('/preferences', { method: 'PUT', body: JSON.stringify(newPrefs) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-changes'] }); // Refresh dashboard with new rules
      alert('Preferences saved successfully!');
    },
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updateMutation.mutate(preferences);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pulse Settings</h1>
        <p className="text-gray-400">Tune the intelligence engine to match your trading style.</p>
      </div>

      <div className="card space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <Settings2 className="text-brand-500" />
          <h2 className="text-xl font-medium text-white">Signal Detection</h2>
        </div>

        <div className="space-y-6">
          {/* Price Movement */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Price Movement</h4>
              <p className="text-sm text-gray-500">Detect significant price spikes or drops.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.priceMovementEnabled} onChange={() => handleToggle('priceMovementEnabled')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          {/* Volume Anomaly */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Volume Anomaly</h4>
              <p className="text-sm text-gray-500">Detect unusually high trading volumes.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.volumeAnomalyEnabled} onChange={() => handleToggle('volumeAnomalyEnabled')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          {/* News & Events */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">News & Corporate Events</h4>
              <p className="text-sm text-gray-500">Include major news and corporate earnings in updates.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.newsEnabled} onChange={() => handleToggle('newsEnabled')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <h4 className="text-white font-medium mb-2">Noise Filter (Minimum Attention Score)</h4>
            <p className="text-sm text-gray-500 mb-4">
              Higher values mean you only see critical updates. Lower values show you everything.
              Current threshold: <span className="text-brand-400 font-mono">{preferences.minimumAttentionScore}</span>
            </p>
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="5"
              value={preferences.minimumAttentionScore}
              onChange={(e) => setPreferences(prev => ({ ...prev, minimumAttentionScore: Number(e.target.value) }))}
              className="w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Show Everything (0)</span>
              <span>Only Important (&gt;25)</span>
              <span>Only Critical (50)</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={16} />
            {updateMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
