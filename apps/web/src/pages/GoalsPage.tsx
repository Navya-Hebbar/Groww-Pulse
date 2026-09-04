import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { Plus, Trash2, Target, Search, X } from 'lucide-react';

export function GoalsPage() {
  const queryClient = useQueryClient();
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allocation, setAllocation] = useState('10');

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => fetchApi<any[]>('/goals'),
  });

  const { data: searchResults } = useQuery({
    queryKey: ['stocks', 'search', searchQuery],
    queryFn: () => fetchApi<any[]>(`/stocks/search?q=${searchQuery}`),
    enabled: searchQuery.length >= 2,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => fetchApi('/goals', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      setNewGoalName('');
      setNewGoalAmount('');
      setNewGoalDate('');
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchApi(`/goals/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  });

  const addStockMutation = useMutation({
    mutationFn: ({ goalId, stockId, allocationPercentage }: any) =>
      fetchApi(`/goals/${goalId}/stocks`, { method: 'POST', body: JSON.stringify({ stockId, allocationPercentage }) }),
    onSuccess: () => {
      setSearchQuery('');
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const removeStockMutation = useMutation({
    mutationFn: ({ goalId, stockId }: { goalId: string; stockId: string }) =>
      fetchApi(`/goals/${goalId}/stocks/${stockId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  });

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading goals...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Financial Goals</h1>
        <p className="text-gray-400">Link stocks to your goals to prioritize updates for what matters most.</p>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-white mb-4">Create New Goal</h3>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            placeholder="Goal name (e.g., Buy a House)"
            className="flex-1 min-w-[200px] bg-surface-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
          />
          <input
            type="number"
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(e.target.value)}
            placeholder="Target Amount (₹)"
            className="w-40 bg-surface-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
          />
          <input
            type="date"
            value={newGoalDate}
            onChange={(e) => setNewGoalDate(e.target.value)}
            className="w-48 bg-surface-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
          />
          <button
            onClick={() => {
              if (newGoalName && newGoalAmount && newGoalDate) {
                createMutation.mutate({
                  name: newGoalName,
                  targetAmount: Number(newGoalAmount),
                  targetDate: new Date(newGoalDate).toISOString(),
                });
              }
            }}
            disabled={!newGoalName || !newGoalAmount || !newGoalDate || createMutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Create
          </button>
        </div>
      </div>

      {goals?.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <Target size={48} className="mx-auto mb-4 opacity-50" />
          You don't have any goals yet. Start by creating one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {goals?.map((goal) => (
              <div
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`card cursor-pointer transition-colors ${
                  selectedGoal === goal.id ? 'border-brand-500 bg-surface-800' : 'hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-white">{goal.name}</h3>
                    <p className="text-brand-400 font-mono mt-1">₹{goal.targetAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-2">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this goal?')) deleteMutation.mutate(goal.id);
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedGoal ? (
              <div className="card space-y-6 min-h-[400px]">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Link Stocks to this Goal</h3>
                  <p className="text-sm text-gray-400">
                    Stocks linked to a goal get a relevance boost in your Smart Pulse dashboard.
                  </p>
                </div>

                <div className="flex gap-4 items-center relative z-20">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search stocks to link..."
                      className="w-full bg-surface-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        <X size={16} />
                      </button>
                    )}
                    
                    {searchQuery.length >= 2 && searchResults && (
                      <div className="absolute top-full mt-2 w-full bg-surface-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                        {searchResults.length === 0 ? (
                          <div className="p-4 text-center text-gray-400 text-sm">No stocks found.</div>
                        ) : (
                          searchResults.map((stock) => (
                            <div key={stock.id} className="flex justify-between items-center p-3 hover:bg-surface-700 transition-colors border-b border-gray-700/50 last:border-0">
                              <div>
                                <div className="font-medium text-white">{stock.symbol}</div>
                                <div className="text-xs text-gray-400">{stock.name}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Alloc:</span>
                                <input 
                                  type="number" 
                                  min="1" 
                                  max="100" 
                                  value={allocation} 
                                  onChange={(e) => setAllocation(e.target.value)}
                                  className="w-16 bg-surface-900 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                                />
                                <span className="text-xs text-gray-400">%</span>
                                <button
                                  onClick={() => addStockMutation.mutate({ 
                                    goalId: selectedGoal, 
                                    stockId: stock.id, 
                                    allocationPercentage: Number(allocation) 
                                  })}
                                  className="text-brand-400 hover:text-brand-300 text-sm font-medium px-3 py-1 bg-brand-900/30 rounded-md ml-2"
                                >
                                  Link
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                    Linked Stocks
                  </h4>
                  
                  {(() => {
                    const activeGoal = goals?.find((g) => g.id === selectedGoal);
                    if (!activeGoal?.stocks?.length) {
                      return <div className="text-center py-8 text-gray-500">No stocks linked to this goal yet.</div>;
                    }

                    return (
                      <div className="space-y-2 relative z-10">
                        {activeGoal.stocks.map((gs: any) => (
                          <div key={gs.id} className="flex justify-between items-center p-3 bg-surface-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                            <div>
                              <div className="font-medium text-white">{gs.stock.symbol}</div>
                              <div className="text-xs text-gray-400">{gs.stock.name}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-mono text-brand-400 bg-brand-950 px-2 py-1 rounded">
                                {gs.allocationPercentage}%
                              </span>
                              <button
                                onClick={() => removeStockMutation.mutate({ goalId: selectedGoal, stockId: gs.stock.id })}
                                className="text-gray-500 hover:text-red-400 transition-colors p-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="card min-h-[400px] flex items-center justify-center text-gray-500">
                Select a goal to manage its linked stocks
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
