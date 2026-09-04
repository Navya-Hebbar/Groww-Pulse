import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { Plus, Trash2, Search, X } from 'lucide-react';

export function WatchlistsPage() {
  const queryClient = useQueryClient();
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>(null);

  // Fetch watchlists
  const { data: watchlists, isLoading } = useQuery({
    queryKey: ['watchlists'],
    queryFn: () => fetchApi<any[]>('/watchlists'),
  });

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

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading watchlists...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Watchlists</h1>
          <p className="text-gray-400">Manage your watchlists and track your favorite stocks.</p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            placeholder="New watchlist name"
            className="bg-surface-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={() => {
              if (newWatchlistName.trim()) createMutation.mutate(newWatchlistName);
            }}
            disabled={!newWatchlistName.trim() || createMutation.isPending}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            Create
          </button>
        </div>
      </div>

      {watchlists?.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          You don't have any watchlists yet. Create one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Watchlists Sidebar */}
          <div className="space-y-4">
            {watchlists?.map((watchlist) => (
              <div
                key={watchlist.id}
                onClick={() => setSelectedWatchlist(watchlist.id)}
                className={`card cursor-pointer transition-colors ${
                  selectedWatchlist === watchlist.id ? 'border-brand-500 bg-surface-800' : 'hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-white">{watchlist.name}</h3>
                    <p className="text-sm text-gray-500">{watchlist.stocks?.length || 0} stocks</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure?')) deleteMutation.mutate(watchlist.id);
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Watchlist Details & Search */}
          <div className="lg:col-span-2">
            {selectedWatchlist ? (
              <div className="card space-y-6 min-h-[400px]">
                {/* Search / Add Stock */}
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search stocks to add..."
                      className="w-full bg-surface-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {searchQuery.length >= 2 && searchResults && (
                    <div className="absolute top-full mt-2 w-full bg-surface-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                      {searchResults.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-sm">No stocks found.</div>
                      ) : (
                        searchResults.map((stock) => (
                          <div
                            key={stock.id}
                            className="flex justify-between items-center p-3 hover:bg-surface-700 transition-colors"
                          >
                            <div>
                              <div className="font-medium text-white">{stock.symbol}</div>
                              <div className="text-xs text-gray-400">{stock.name}</div>
                            </div>
                            <button
                              onClick={() => addStockMutation.mutate({ watchlistId: selectedWatchlist, stockId: stock.id })}
                              className="text-brand-400 hover:text-brand-300 text-sm font-medium px-3 py-1 bg-brand-900/30 rounded-md"
                            >
                              Add
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Stocks List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                    Stocks in this watchlist
                  </h4>
                  
                  {(() => {
                    const activeWatchlist = watchlists?.find((w) => w.id === selectedWatchlist);
                    if (!activeWatchlist?.stocks?.length) {
                      return <div className="text-center py-8 text-gray-500">No stocks added yet.</div>;
                    }

                    return (
                      <div className="space-y-2">
                        {activeWatchlist.stocks.map((ws: any) => (
                          <div key={ws.id} className="flex justify-between items-center p-3 bg-surface-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                            <div>
                              <div className="font-medium text-white">{ws.stock.symbol}</div>
                              <div className="text-xs text-gray-400">{ws.stock.name}</div>
                            </div>
                            <button
                              onClick={() => removeStockMutation.mutate({ watchlistId: selectedWatchlist, stockId: ws.stock.id })}
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
              <div className="card min-h-[400px] flex items-center justify-center text-gray-500">
                Select a watchlist to manage its stocks
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
