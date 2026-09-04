import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, LayoutDashboard, List, Target, Settings, LogOut } from 'lucide-react';

export function Navigation() {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Pulse', icon: LayoutDashboard },
    { path: '/watchlists', label: 'Watchlists', icon: List },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-64 bg-surface-850 border-r border-gray-800 min-h-screen p-4 flex flex-col hidden md:flex fixed top-0 left-0">
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="text-brand-500">
          <Activity size={28} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Groww Pulse</span>
      </div>

      <div className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-brand-900/20 text-brand-400 font-medium' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-surface-800'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-800 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-400 hover:text-red-400 hover:bg-surface-800 w-full text-left"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </div>
    </nav>
  );
}

import { PulseTicker } from './PulseTicker';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-900 relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent to-surface-900 pointer-events-none" />

      <div className="z-10 w-64 fixed top-0 left-0 h-full hidden md:block">
        <Navigation />
      </div>
      <main className="flex-1 md:ml-64 relative z-10 flex flex-col min-h-screen">
        <PulseTicker />
        <div className="flex-1 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
