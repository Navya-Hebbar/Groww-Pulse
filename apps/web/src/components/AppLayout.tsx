import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, LayoutDashboard, List, Target, Settings, LogOut, Radio, Bot, Share2, Sparkles } from 'lucide-react';
import { PulseTicker } from './PulseTicker';
import { VoiceCopilotModal } from './VoiceCopilotModal';
import { WarRoomModal } from './WarRoomModal';
import { SocialShareModal } from './SocialShareModal';

export function Navigation({
  onOpenWarRoom,
  onOpenVoice,
}: {
  onOpenWarRoom: () => void;
  onOpenVoice: () => void;
}) {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Pulse', icon: LayoutDashboard },
    { path: '/watchlists', label: 'Watchlists', icon: List },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-64 bg-surface-850/90 border-r border-white/10 min-h-screen p-4 flex flex-col hidden md:flex fixed top-0 left-0 backdrop-blur-xl z-30">
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="text-cyan-400 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Activity size={24} />
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight">Groww Pulse</span>
      </div>

      <div className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* War Room Nav Button */}
        <button
          onClick={onOpenWarRoom}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10 border border-red-500/20 mt-4 group"
        >
          <div className="flex items-center gap-3">
            <Radio size={18} className="animate-pulse text-red-400" />
            <span className="font-bold text-sm text-white group-hover:text-red-300">War Room</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            LIVE
          </span>
        </button>

        {/* Voice AI Assistant Nav Button */}
        <button
          onClick={onOpenVoice}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20 mt-2 group"
        >
          <div className="flex items-center gap-3">
            <Bot size={18} className="text-cyan-400" />
            <span className="font-bold text-sm text-white group-hover:text-cyan-300">Voice AI Copilot</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            PRO
          </span>
        </button>
      </div>

      <div className="pt-4 border-t border-white/10 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full text-left font-medium"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </nav>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isWarRoomOpen, setIsWarRoomOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Automatically close all modals whenever route changes
  useEffect(() => {
    setIsWarRoomOpen(false);
    setIsVoiceOpen(false);
    setIsShareOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Pulse', icon: LayoutDashboard },
    { path: '/watchlists', label: 'Watchlists', icon: List },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-surface-950 text-gray-100 relative overflow-x-hidden">
      {/* Dark Ambient Glow Backdrops */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <div className="z-30 w-64 fixed top-0 left-0 h-full hidden md:block">
        <Navigation
          onOpenWarRoom={() => setIsWarRoomOpen(true)}
          onOpenVoice={() => setIsVoiceOpen(true)}
        />
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 md:ml-64 relative z-10 flex flex-col min-h-screen min-w-0 w-full">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-900/90 border-b border-white/10 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span className="font-extrabold text-white tracking-tight">Groww Pulse</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsWarRoomOpen(true)}
              className="p-2 rounded-lg text-xs font-bold text-red-400 bg-red-500/10"
              title="War Room"
            >
              <Radio className="w-5 h-5 animate-pulse" />
            </button>
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="p-2 rounded-lg text-xs font-bold text-cyan-400 bg-cyan-500/10"
              title="Voice AI"
            >
              <Bot className="w-5 h-5" />
            </button>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Ticker Bar */}
        <PulseTicker />

        {/* Main Content View Container */}
        <div className="flex-1 pb-16 md:pb-10">{children}</div>

        {/* Floating Action Buttons (FAB) for Voice AI & Share */}
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-3.5 rounded-full bg-surface-850 hover:bg-surface-800 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:scale-110"
            title="Share Insights Card"
          >
            <Share2 size={20} />
          </button>

          <button
            onClick={() => setIsVoiceOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all hover:scale-105 group"
          >
            <Bot size={18} className="animate-pulse" />
            <span>Voice AI Copilot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>

        {/* Modals */}
        <VoiceCopilotModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
        <WarRoomModal isOpen={isWarRoomOpen} onClose={() => setIsWarRoomOpen(false)} />
        <SocialShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      </main>
    </div>
  );
}

