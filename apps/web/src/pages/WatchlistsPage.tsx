import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { Plus, Trash2, Search, X, Layers, Sparkles } from 'lucide-react';

const DEMO_WATCHLISTS = [
  {
    id: 'w-1',
    name: 'Core Bluechips',
    stocks: [
      { id: 'ws-1', stock: { id: 's-1', symbol: 'RELIANCE', name: 'Reliance Industries Ltd' } },
      { id: 'ws-2', stock: { id: 's-2', symbol: 'TCS', name: 'Tata Consultancy Services' } },
      { id: 'ws-3', stock: { id: 's-3', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' } },
    ],
  },
  {
    id: 'w-2',
    name: 'High Growth Tech',
    stocks: [
      { id: 'ws-4', stock: { id: 's-4', symbol: 'INFY', name: 'Infosys Ltd' } },
      { id: 'ws-5', stock: { id: 's-5', symbol: 'WIPRO', name: 'Wipro Ltd' } },
    ],
  },
  {
    id: 'w-3',
    name: 'EV & Green Energy',
    stocks: [
      { id: 'ws-6', stock: { id: 's-6', symbol: 'TATAMOTORS', name: 'Tata Motors Ltd' } },
    ],
  },
];

export function WatchlistsPage() {
  const queryClient = useQueryClient();
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>('w-1');

  // Fetch watchlists
  const { data: remoteWatchlists } = useQuery({
    queryKey: ['watchlists'],
    queryFn: () => fetchApi<any[]>('/watchlists'),
  });

  const watchlists = (remoteWatchlists && remoteWatchlists.length > 0) ? remoteWatchlists : DEMO_WATCHLISTS;
  const activeWatchlistId = selectedWatchlist || watchlists[0]?.id;

  // Fetch stocks search
  const { data: searchResults } = useQuery({
    queryKey: ['stocks', 'search', searchQuery],
    queryFn: () => fetchApi<any[]>(`/stocks/search?q=${searchQuery}`),
    enabled: searchQuery.length >= 2,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (name: string) => fetchApi('/watchlists', { method: 'POST', body: JSON.stringify({ name }) }),
    onSuccess: () => {
      setNewWatchlistName('');
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/watchlists/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlists'] }),
  });

  const addStockMutation = useMutation({
    mutationFn: ({ watchlistId, stockId }: { watchlistId: string; stockId: string }) =>
      fetchApi(`/watchlists/${watchlistId}/stocks`, { method: 'POST', body: JSON.stringify({ stockId }) }),
    onSuccess: () => {
      setSearchQuery('');
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
    },
  });

  const removeStockMutation = useMutation({
    mutationFn: ({ watchlistId, stockId }: { watchlistId: string; stockId: string }) =>
      fetchApi(`/watchlists/${watchlistId}/stocks/${stockId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlists'] }),
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,229,255,0.15)] bg-surface-900 group">
        <img
          src="/assets/watchlists_hero.jpg"
          alt="Smart Watchlists Banner"
          className="w-full h-44 sm:h-52 object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700 absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-transparent" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> SMART WATCHLIST MANAGER
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Watchlists</h1>
            <p className="text-sm text-gray-300">Organize your portfolio signals across customized market buckets with automated state persistence.</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto relative z-10">
            <input
              type="text"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              placeholder="New watchlist name"
              className="bg-surface-800/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 flex-1 sm:w-64 backdrop-blur-md"
            />
            <button
              onClick={() => {
                if (newWatchlistName.trim()) createMutation.mutate(newWatchlistName);
              }}
              disabled={!newWatchlistName.trim() || createMutation.isPending}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-semibold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              <Plus size={16} />
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlists List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Your Collections</h3>
          {watchlists.map((watchlist) => {
            const isSelected = activeWatchlistId === watchlist.id;
            return (
              <div
                key={watchlist.id}
                onClick={() => setSelectedWatchlist(watchlist.id)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(0,229,255,0.15)] text-white'
                    : 'bg-surface-900/50 border-white/10 hover:border-white/20 text-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-surface-800 border-white/5 text-gray-400'}`}>
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{watchlist.name}</h3>
                      <p className="text-xs text-gray-400">{watchlist.stocks?.length || 0} stocks tracked</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete watchlist?')) deleteMutation.mutate(watchlist.id);
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Watchlist Stock Details & Search */}
        <div className="lg:col-span-2">
          {activeWatchlistId ? (
            <div className="bg-surface-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6 min-h-[420px]">
              {/* Stock Search Input */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stocks to add (e.g. RELIANCE, TCS)..."
                    className="w-full bg-surface-800/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 backdrop-blur-md"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchQuery.length >= 2 && searchResults && (
                  <div className="absolute top-full mt-2 w-full bg-surface-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-20 backdrop-blur-2xl">
                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">No stocks found.</div>
                    ) : (
                      searchResults.map((stock) => (
                        <div
                          key={stock.id}
                          className="flex justify-between items-center p-3.5 hover:bg-white/5 border-b border-white/5 transition-colors"
                        >
                          <div>
                            <div className="font-bold text-white font-mono">{stock.symbol}</div>
                            <div className="text-xs text-gray-400">{stock.name}</div>
                          </div>
                          <button
                            onClick={() => addStockMutation.mutate({ watchlistId: activeWatchlistId, stockId: stock.id })}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/40 text-xs font-semibold"
                          >
                            + Add Stock
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Stocks List in Selected Watchlist */}
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
                  Tracked Stocks in {watchlists.find((w) => w.id === activeWatchlistId)?.name}
                </h4>

                {(() => {
                  const activeWatchlist = watchlists.find((w) => w.id === activeWatchlistId);
                  if (!activeWatchlist?.stocks?.length) {
                    return (
                      <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                        No stocks added to this watchlist yet. Search above to add your first stock!
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {activeWatchlist.stocks.map((ws: any) => (
                        <div
                          key={ws.id}
                          className="flex justify-between items-center p-4 bg-surface-800/40 rounded-2xl border border-white/5 hover:border-white/15 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono text-cyan-400 font-bold text-xs">
                              {ws.stock.symbol.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-white font-mono">{ws.stock.symbol}</div>
                              <div className="text-xs text-gray-400">{ws.stock.name}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeStockMutation.mutate({ watchlistId: activeWatchlistId, stockId: ws.stock.id })}
                            className="text-gray-500 hover:text-red-400 transition-colors p-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="bg-surface-900/60 border border-white/10 rounded-3xl p-12 text-center text-gray-400 min-h-[420px] flex items-center justify-center">
              Select a watchlist from the left to view and manage stocks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
