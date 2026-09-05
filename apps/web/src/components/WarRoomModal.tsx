import React, { useState } from 'react';
import { ShieldAlert, Zap, Flame, TrendingUp, TrendingDown, RefreshCw, X, Sliders, Layers, BarChart3, Radio } from 'lucide-react';

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
    { sector: 'IT Services', change: '+2.8%', momentum: 'BULLISH', weight: '24%', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { sector: 'Banking & Financials', change: '+1.9%', momentum: 'BULLISH', weight: '31%', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { sector: 'Energy & Oil', change: '-0.7%', momentum: 'BEARISH', weight: '18%', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
    { sector: 'FMCG & Retail', change: '+0.4%', momentum: 'NEUTRAL', weight: '12%', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
    { sector: 'Pharma & Biotech', change: '+1.2%', momentum: 'BULLISH', weight: '8%', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { sector: 'Auto & Ancillary', change: '-1.4%', momentum: 'BEARISH', weight: '7%', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
  ];

  // Anomaly scanner data
  const anomalies = [
    { symbol: 'TCS', type: 'VOLUME SURGE', description: '3.4x average 10-day volume detected at market open', severity: 'HIGH', impact: 'BULLISH' },
    { symbol: 'RELIANCE', type: 'RSI DIVERGENCE', description: 'RSI bullish divergence on 15m chart with institutional accumulation', severity: 'MEDIUM', impact: 'BULLISH' },
    { symbol: 'WIPRO', type: 'BLOCK DEAL', description: '₹450 Cr block deal registered at ₹524 per share', severity: 'HIGH', impact: 'NEUTRAL' },
    { symbol: 'HDFCBANK', type: 'OPTION CHAIN SPIKE', description: 'Unusual call option OI buildup at ₹1,650 strike', severity: 'HIGH', impact: 'BULLISH' },
  ];

  // Calculate estimated macro impact
  const estimatedPortfolioImpact = ((rateHike * -1.8) + (crudeOil * -0.4) + (usdInr * 0.8)).toFixed(2);
  const isImpactPositive = parseFloat(estimatedPortfolioImpact) >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fadeIn">
      <div className="bg-surface-900 border border-cyan-500/40 rounded-2xl w-full max-w-5xl shadow-[0_0_60px_rgba(0,229,255,0.3)] overflow-hidden flex flex-col h-[750px] max-h-[95vh]">
        {/* War Room Visual Header Banner */}
        <div className="relative px-6 py-5 border-b border-cyan-500/30 flex items-center justify-between overflow-hidden bg-surface-950">
          <img
            src="/assets/war_room_hero.jpg"
            alt="War Room Emergency Radar"
            className="w-full h-full object-cover object-center opacity-35 absolute inset-0 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] backdrop-blur-md">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">GROWW PULSE WAR ROOM</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse tracking-wider">
                  HIGH FREQUENCY FEED
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">Institutional anomaly detection & macro shock simulator</p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="px-6 py-3 bg-surface-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[
              { id: 'heatmap', label: 'Sector Capital Flow Heatmap', icon: BarChart3 },
              { id: 'anomalies', label: 'AI Anomaly Radar (4 Active)', icon: Zap },
              { id: 'whatif', label: 'What-If Macro Simulator', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>NIFTY 50: <strong>24,850.15 (+0.75%)</strong></span>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-surface-950/50">
          {/* TAB 1: SECTOR HEATMAP */}
          {activeTab === 'heatmap' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Real-time Sector Capital Allocations
                </h3>
                <span className="text-xs text-cyan-400">Updated every 500ms</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sectorData.map((s) => (
                  <div
                    key={s.sector}
                    className={`p-4 rounded-xl border ${s.color} backdrop-blur-md transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between h-36`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">{s.sector}</h4>
                        <span className="text-xs opacity-80">Portfolio Weight: {s.weight}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-black/40 border border-current">
                        {s.momentum}
                      </span>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <div className="text-2xl font-black">{s.change}</div>
                        <div className="text-[10px] opacity-75">Net Institutional Inflow</div>
                      </div>
                      {s.change.startsWith('+') ? (
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-surface-850/80 border border-white/10 text-xs text-gray-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span><strong>Hot Market Take:</strong> Institutional capital rotating from Energy into IT & Financials ahead of upcoming earnings season.</span>
                </div>
                <span className="text-cyan-400 hover:underline cursor-pointer">View full depth &rarr;</span>
              </div>
            </div>
          )}

          {/* TAB 2: ANOMALY RADAR */}
          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  AI Real-Time Anomaly Signals
                </h3>
                <span className="text-xs text-red-400 font-mono">RADAR ACTIVE</span>
              </div>

              <div className="space-y-3">
                {anomalies.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface-850/90 border border-white/10 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400 text-lg">
                        {item.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{item.symbol}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.impact} SIGNAL
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WHAT-IF MACRO SIMULATOR */}
          {activeTab === 'whatif' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-surface-850 to-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Macro-Economic Stress Testing Engine</h3>
                  <p className="text-xs text-gray-400">Adjust macroeconomic variables below to simulate real-time portfolio impact.</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Estimated Portfolio Impact</div>
                  <div className={`text-2xl font-black ${isImpactPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isImpactPositive ? `+${estimatedPortfolioImpact}%` : `${estimatedPortfolioImpact}%`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Control 1 */}
                <div className="p-4 rounded-xl bg-surface-850/80 border border-white/10 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-200">
                    <span>RBI Rate Hike / Cut</span>
                    <span className="text-cyan-400">{rateHike > 0 ? `+${rateHike}%` : `${rateHike}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1.5"
                    step="0.25"
                    value={rateHike}
                    onChange={(e) => setRateHike(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-400">Impacts Banking valuation & debt servicing cost.</p>
                </div>

                {/* Control 2 */}
                <div className="p-4 rounded-xl bg-surface-850/80 border border-white/10 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-200">
                    <span>Crude Oil Price Shock</span>
                    <span className="text-cyan-400">+{crudeOil}%</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="30"
                    step="5"
                    value={crudeOil}
                    onChange={(e) => setCrudeOil(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-400">Impacts Inflation & Energy margins.</p>
                </div>

                {/* Control 3 */}
                <div className="p-4 rounded-xl bg-surface-850/80 border border-white/10 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-200">
                    <span>USD / INR Exchange Move</span>
                    <span className="text-cyan-400">+{usdInr}%</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={usdInr}
                    onChange={(e) => setUsdInr(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-400">Impacts IT exports & import costs.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 leading-relaxed">
                <strong>AI Stress Test Conclusion:</strong> Under current macro parameters, your high allocation to Indian IT exporters acts as a natural hedge against USD appreciation, mitigating 65% of potential rate-hike headwinds.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
