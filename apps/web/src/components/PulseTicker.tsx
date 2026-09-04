import { Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';

const pulseMessages = [
  { text: 'RELIANCE: Unusual volume detected at 09:15 AM', icon: <Activity size={14} className="text-brand-400" /> },
  { text: 'HDFCBANK: Approaching 52-week high', icon: <TrendingUp size={14} className="text-green-400" /> },
  { text: 'TCS: Q3 Earnings Call scheduled for tomorrow', icon: <Zap size={14} className="text-amber-400" /> },
  { text: 'INFY: High volatility observed in last hour', icon: <AlertCircle size={14} className="text-orange-400" /> },
  { text: 'Global Markets: Tech sector showing strong momentum', icon: <Activity size={14} className="text-blue-400" /> },
];

export function PulseTicker() {
  return (
    <div className="w-full bg-surface-900/60 backdrop-blur-lg border-b border-white/10 overflow-hidden py-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-50 sticky top-0">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {[...pulseMessages, ...pulseMessages].map((msg, idx) => (
          <span key={idx} className="flex items-center gap-2 mx-8 text-sm font-medium text-gray-300">
            {msg.icon}
            {msg.text}
          </span>
        ))}
      </div>
    </div>
  );
}
