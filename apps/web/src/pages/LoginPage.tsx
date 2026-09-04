import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Activity } from 'lucide-react';

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
    setEmail('demo@growwpulse.dev');
    setPassword('demo1234');
    loginMutation.mutate({ email: 'demo@growwpulse.dev', password: 'demo1234' });
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 text-brand-500">
            <Activity size={48} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Groww Pulse</h1>
          <p className="text-gray-400">Sign in to your intelligent watchlist</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full btn-primary flex justify-center py-2.5 mt-2"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
            
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full btn-secondary flex justify-center py-2.5"
            >
              Use Demo Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
