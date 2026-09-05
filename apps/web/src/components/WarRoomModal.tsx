import { useState } from 'react';
import { TrendingUp, TrendingDown, X, Sliders, BarChart3, Activity, ArrowRight } from 'lucide-react';

interface WarRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WarRoomModal({ isOpen, onClose }: WarRoomModalProps) {
  const [activeTab, setActiveTab] = useState<'heatmap' | 'anomalies' | 'whatif'>('heatmap');
  
  // What-If Macro Simulation States
  const [rateHike, setRateHike] = useState(0.25); // bps
  const [crudeOil, setCrudeOil] = useState(10); // % change
  const [usdInr, setUsdInr] = useState(1.5); // % change

  if (!isOpen) return null;

  // Sector heatmap demo data
  const sectorData = [
    { sector: 'IT Services', change: '+2.8%', momentum: 'Bullish', weight: '24%', color: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' },
    { sector: 'Banking & Financials', change: '+1.9%', momentum: 'Bullish', weight: '31%', color: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' },
    { sector: 'Energy & Oil', change: '-0.7%', momentum: 'Bearish', weight: '18%', color: 'bg-rose-950/40 text-rose-300 border-rose-500/30' },
    { sector: 'FMCG & Retail', change: '+0.4%', momentum: 'Neutral', weight: '12%', color: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60' },
    { sector: 'Pharma & Biotech', change: '+1.2%', momentum: 'Bullish', weight: '8%', color: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' },
    { sector: 'Auto & Ancillary', change: '-1.4%', momentum: 'Bearish', weight: '7%', color: 'bg-rose-950/40 text-rose-300 border-rose-500/30' },
  ];

  // Anomaly scanner data
  const anomalies = [
    { symbol: 'TCS', type: 'Volume Surge', description: '3.4x average 10-day volume detected at market open', severity: 'High', impact: 'Bullish' },
    { symbol: 'RELIANCE', type: 'RSI Divergence', description: 'RSI bullish divergence on 15m chart with institutional accumulation', severity: 'Medium', impact: 'Bullish' },
    { symbol: 'WIPRO', type: 'Block Deal', description: '₹450 Cr block deal registered at ₹524 per share', severity: 'High', impact: 'Neutral' },
    { symbol: 'HDFCBANK', type: 'Option Chain Spike', description: 'Unusual call option OI buildup at ₹1,650 strike', severity: 'High', impact: 'Bullish' },
  ];

  // Calculate estimated macro impact
  const estimatedPortfolioImpact = ((rateHike * -1.8) + (crudeOil * -0.4) + (usdInr * 0.8)).toFixed(2);
  const isImpactPositive = parseFloat(estimatedPortfolioImpact) >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[720px] max-h-[95vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">Market Radar & Macro Simulator</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Sector capital flows, real-time anomalies & macro scenario planning</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs & Benchmark Bar */}
        <div className="px-6 py-3 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[
              { id: 'heatmap', label: 'Sector Capital Flows', icon: BarChart3 },
              { id: 'anomalies', label: 'Market Anomaly Signals', icon: Activity },
              { id: 'whatif', label: 'Macro Stress Simulator', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>NIFTY 50: <strong className="text-emerald-400">24,850.15 (+0.75%)</strong></span>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-900">
          
          {/* TAB 1: SECTOR HEATMAP */}
          {activeTab === 'heatmap' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Real-time Sector Capital Allocations
                </h3>
                <span className="text-xs text-zinc-400">Live data feed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sectorData.map((s) => (
                  <div
                    key={s.sector}
                    className={`p-4 rounded-xl border ${s.color} transition-all hover:border-zinc-700 flex flex-col justify-between h-34`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">{s.sector}</h4>
                        <span className="text-xs text-zinc-400">Portfolio Weight: {s.weight}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-zinc-900/80 border border-zinc-700/60">
                        {s.momentum}
                      </span>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div>
                        <div className="text-xl font-bold font-mono text-white">{s.change}</div>
                        <div className="text-[11px] text-zinc-400">Net Institutional Flow</div>
                      </div>
                      {s.change.startsWith('+') ? (
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
                <div>
                  <strong className="text-white">Capital Rotation Note:</strong> Institutional flows are rotating into IT & Financials ahead of quarterly earnings updates.
                </div>
                <span className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer flex items-center gap-1">
                  View Depth <ArrowRight size={14} />
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: ANOMALY RADAR */}
          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Detected Market Anomalies
                </h3>
                <span className="text-xs text-emerald-400 font-mono">4 Signals Active</span>
              </div>

              <div className="space-y-2.5">
                {anomalies.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-emerald-400 text-sm font-mono">
                        {item.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{item.symbol}</span>
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WHAT-IF MACRO SIMULATOR */}
          {activeTab === 'whatif' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Macro Scenario Simulator</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Adjust macroeconomic variables to model estimated impact on your portfolio allocation.</p>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Estimated Impact</div>
                  <div className={`text-2xl font-bold font-mono ${isImpactPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isImpactPositive ? `+${estimatedPortfolioImpact}%` : `${estimatedPortfolioImpact}%`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Control 1 */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <div className="flex justify-between text-xs font-medium text-zinc-300">
                    <span>RBI Benchmark Interest Rate</span>
                    <span className="text-emerald-400 font-mono">{rateHike > 0 ? `+${rateHike}%` : `${rateHike}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1.5"
                    step="0.25"
                    value={rateHike}
                    onChange={(e) => setRateHike(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-zinc-400">Models banking valuation & credit growth effect.</p>
                </div>

                {/* Control 2 */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <div className="flex justify-between text-xs font-medium text-zinc-300">
                    <span>Crude Oil Price Variation</span>
                    <span className="text-emerald-400 font-mono">+{crudeOil}%</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="30"
                    step="5"
                    value={crudeOil}
                    onChange={(e) => setCrudeOil(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-zinc-400">Models energy cost & inflation pressure.</p>
                </div>

                {/* Control 3 */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <div className="flex justify-between text-xs font-medium text-zinc-300">
                    <span>USD / INR Exchange Delta</span>
                    <span className="text-emerald-400 font-mono">+{usdInr}%</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={usdInr}
                    onChange={(e) => setUsdInr(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-zinc-400">Models export realization & currency movement.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                <strong className="text-white">Stress Test Takeaway:</strong> Under your selected parameters, allocation in export-oriented sectors acts as a natural offset against rate fluctuations.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
