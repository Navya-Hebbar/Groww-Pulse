import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Activity, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (data: any) =>
      fetchApi<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      login(data.token);
      navigate('/');
    },
    onError: (err: any) => {
      setError(err.message || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  const handleDemoLogin = () => {
    const demoEmail = 'demo@growwpulse.dev';
    const demoPass = 'demo1234';
    setEmail(demoEmail);
    setPassword(demoPass);
    loginMutation.mutate(
      { email: demoEmail, password: demoPass },
      {
        onError: () => {
          login('demo-token');
          navigate('/');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Form Column */}
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
              <Zap size={14} className="animate-pulse" />
              <span>Intelligent Market Watchlist</span>
            </div>
            <div className="flex items-center gap-3 text-white mb-2">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.25)]">
                <Activity size={28} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                Groww Pulse
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              Know what changed. Know what matters. Sign in to your personalized attention engine.
            </p>
          </div>

          <div className="card backdrop-blur-2xl border-white/10 shadow-2xl p-6 rounded-2xl bg-surface-900/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-blue-500" />
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-1">
              {error && (
                <div className="bg-red-950/60 border border-red-800/80 text-red-300 p-3 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Account Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                  placeholder="name@example.com"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full btn-primary flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-bold mt-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in to Dashboard'}
              </button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface-900 px-2 text-gray-500 font-medium">Or quick demo</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold py-2.5 px-4 rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <ShieldCheck size={16} />
                <span>One-Click Judge Demo Login</span>
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Visual Hero Card */}
        <div className="hidden lg:block relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-surface-900 group">
          <img
            src="/assets/login_hero.jpg"
            alt="Groww Pulse Trading Dashboard"
            className="w-full h-[520px] object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent flex flex-col justify-end p-8">
            <div className="bg-surface-900/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <TrendingUp size={18} />
                <span>Explainable Attention Score (0-100)</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Automatically detects price spikes, statistical volume anomalies, and 52-week milestones tailored to your financial goals.
              </p>
              <div className="flex items-center justify-between pt-2 text-[11px] text-gray-400 border-t border-white/10">
                <span>✓ Server-side last seen state</span>
                <span>✓ Real-time BullMQ workers</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

