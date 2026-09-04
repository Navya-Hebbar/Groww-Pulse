import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { Plus, Trash2, Target, Search, X, Sparkles } from 'lucide-react';

const DEMO_GOALS = [
  {
    id: 'g-1',
    name: 'Wealth Building 2035',
    targetAmount: 5000000,
    targetDate: '2035-12-31',
    stocks: [
      { id: 'gs-1', allocationPercentage: 40, stock: { id: 's-1', symbol: 'RELIANCE', name: 'Reliance Industries Ltd' } },
      { id: 'gs-2', allocationPercentage: 30, stock: { id: 's-2', symbol: 'TCS', name: 'Tata Consultancy Services' } },
    ],
  },
  {
    id: 'g-2',
    name: 'House Downpayment',
    targetAmount: 2000000,
    targetDate: '2028-06-30',
    stocks: [
      { id: 'gs-3', allocationPercentage: 50, stock: { id: 's-3', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' } },
    ],
  },
];

export function GoalsPage() {
  const queryClient = useQueryClient();
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>('g-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [allocation, setAllocation] = useState('20');

  const { data: remoteGoals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => fetchApi<any[]>('/goals'),
  });

  const goals = (remoteGoals && remoteGoals.length > 0) ? remoteGoals : DEMO_GOALS;
  const activeGoalId = selectedGoal || goals[0]?.id;

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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> GOAL-LINKED PORTFOLIO TRACKER
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Financial Goals</h1>
          <p className="text-sm text-gray-400">Link your stocks to financial milestones. Changes to goal-linked stocks boost attention scoring.</p>
        </div>
      </div>

      {/* Create New Goal */}
      <div className="bg-surface-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" /> Create Financial Goal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            placeholder="Goal Name (e.g. Retirement)"
            className="bg-surface-800/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 backdrop-blur-md"
          />
          <input
            type="number"
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(e.target.value)}
            placeholder="Target Amount (₹)"
            className="bg-surface-800/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 backdrop-blur-md"
          />
          <input
            type="date"
            value={newGoalDate}
            onChange={(e) => setNewGoalDate(e.target.value)}
            className="bg-surface-800/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 backdrop-blur-md"
          />
          <button
            onClick={() => {
              if (newGoalName.trim() && newGoalAmount) {
                createMutation.mutate({
                  name: newGoalName,
                  targetAmount: parseFloat(newGoalAmount),
                  targetDate: newGoalDate || undefined,
                });
              }
            }}
            disabled={!newGoalName.trim() || !newGoalAmount || createMutation.isPending}
            className="px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <Plus size={16} /> Create Goal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Your Goals</h3>
          {goals.map((goal) => {
            const isSelected = activeGoalId === goal.id;
            return (
              <div
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] text-white'
                    : 'bg-surface-900/50 border-white/10 hover:border-white/20 text-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-surface-800 border-white/5 text-gray-400'}`}>
                      <Target size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{goal.name}</h3>
                      <p className="text-xs font-mono text-purple-300">Target: ₹{Number(goal.targetAmount).toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete goal?')) deleteMutation.mutate(goal.id);
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

        {/* Goal Linked Stocks */}
        <div className="lg:col-span-2">
          {activeGoalId ? (
            <div className="bg-surface-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6 min-h-[420px]">
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search stocks to link to this goal..."
                      className="w-full bg-surface-800/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 backdrop-blur-md"
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
                  <input
                    type="number"
                    value={allocation}
                    onChange={(e) => setAllocation(e.target.value)}
                    placeholder="Alloc %"
                    className="w-24 bg-surface-800/80 border border-white/10 rounded-2xl px-3 py-3 text-white text-sm text-center focus:outline-none focus:border-purple-500 backdrop-blur-md font-mono"
                  />
                </div>

                {searchQuery.length >= 2 && searchResults && (
                  <div className="absolute top-full mt-2 w-full bg-surface-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-20 backdrop-blur-2xl">
                    {searchResults.map((stock) => (
                      <div key={stock.id} className="flex justify-between items-center p-3.5 hover:bg-white/5 border-b border-white/5 transition-colors">
                        <div>
                          <div className="font-bold text-white font-mono">{stock.symbol}</div>
                          <div className="text-xs text-gray-400">{stock.name}</div>
                        </div>
                        <button
                          onClick={() =>
                            addStockMutation.mutate({
                              goalId: activeGoalId,
                              stockId: stock.id,
                              allocationPercentage: parseFloat(allocation) || 10,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/40 text-xs font-semibold"
                        >
                          Link Stock ({allocation}%)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">
                  Linked Stocks in {goals.find((g) => g.id === activeGoalId)?.name}
                </h4>

                {(() => {
                  const activeGoal = goals.find((g) => g.id === activeGoalId);
                  if (!activeGoal?.stocks?.length) {
                    return (
                      <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                        No stocks linked to this financial goal yet. Search above to link your first stock!
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {activeGoal.stocks.map((gs: any) => (
                        <div key={gs.id} className="flex justify-between items-center p-4 bg-surface-800/40 rounded-2xl border border-white/5 hover:border-white/15 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-mono text-purple-400 font-bold text-xs">
                              {gs.stock.symbol.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-white font-mono">{gs.stock.symbol}</div>
                              <div className="text-xs text-gray-400">{gs.stock.name}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/30">
                              {gs.allocationPercentage || 20}% Alloc
                            </span>
                            <button
                              onClick={() => removeStockMutation.mutate({ goalId: activeGoalId, stockId: gs.stock.id })}
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
            <div className="bg-surface-900/60 border border-white/10 rounded-3xl p-12 text-center text-gray-400 min-h-[420px] flex items-center justify-center">
              Select a financial goal from the left to manage linked stocks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
