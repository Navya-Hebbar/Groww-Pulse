import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Zap, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Target } from 'lucide-react';

export interface StoryItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  attentionScore: number;
  primaryReason: string;
  secondaryReason?: string;
  goalLinked?: string;
  zScore?: number;
  volumeRatio?: number;
}

interface MarketStoriesProps {
  stories: StoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const MarketStories: React.FC<MarketStoriesProps> = ({ stories, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // advance progress every 100ms
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, stories.length, onClose]);

  if (!isOpen || stories.length === 0) return null;

  const current = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-red-600 via-orange-500 to-amber-400';
    if (score >= 50) return 'from-orange-500 via-amber-500 to-yellow-400';
    return 'from-blue-600 via-cyan-500 to-teal-400';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-up">
      {/* Container simulating phone view */}
      <div className="relative w-full max-w-sm h-[640px] bg-surface-900 border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col justify-between p-6">
        
        {/* Story progress bars top */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-100 ease-linear rounded-full"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-5 z-20 p-2 rounded-full bg-black/40 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card Info */}
        <div className="pt-8 z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> MARKET PULSE STORY
            </span>
            <span className="text-xs text-gray-400">
              {currentIndex + 1} of {stories.length}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{current.symbol}</h2>
              <p className="text-sm text-gray-400">{current.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-mono font-bold text-white">₹{current.price.toLocaleString()}</p>
              <div
                className={`inline-flex items-center gap-1 font-mono text-sm font-semibold ${
                  current.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {current.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {current.changePercent >= 0 ? '+' : ''}
                {current.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Middle Visual Highlight */}
        <div className="my-auto z-10 flex flex-col items-center justify-center text-center py-4">
          {/* Attention Score Ring */}
          <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${getScoreGradient(
                current.attentionScore
              )} opacity-30 blur-xl animate-pulse-glow`}
            />
            <div className="relative w-28 h-28 rounded-full border-2 border-white/20 bg-surface-900/90 backdrop-blur-md flex flex-col items-center justify-center shadow-inner">
              <Zap className="w-5 h-5 text-amber-400 mb-0.5" />
              <span className="text-3xl font-extrabold text-white font-mono">{current.attentionScore}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">ATTENTION</span>
            </div>
          </div>

          {/* Key Change Headline */}
          <div className="bg-surface-800/80 border border-white/10 rounded-2xl p-4 w-full backdrop-blur-md text-left shadow-lg">
            <div className="flex items-center gap-2 mb-1.5 text-xs text-amber-400 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> MEANINGFUL CHANGE DETECTED
            </div>
            <p className="text-sm font-medium text-gray-100 leading-snug">{current.primaryReason}</p>
            {current.secondaryReason && (
              <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-white/5">{current.secondaryReason}</p>
            )}
          </div>

          {current.goalLinked && (
            <div className="mt-3 bg-purple-950/40 border border-purple-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-purple-300 w-full">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span>Linked Goal: <strong>{current.goalLinked}</strong></span>
            </div>
          )}
        </div>

        {/* Controls / Touch Zones */}
        <div className="absolute inset-0 flex z-0">
          <div className="w-1/2 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-1/2 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Footer Navigation Buttons */}
        <div className="z-10 flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono text-gray-400">TAP SIDES TO NAVIGATE</span>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
