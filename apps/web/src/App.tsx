import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen bg-surface-900 flex items-center justify-center text-brand-500">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Placeholder Dashboard
function DashboardPage() {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <div className="text-center animate-fade-in p-8 card max-w-lg w-full">
        <div className="text-4xl font-bold text-white mb-2">Groww Pulse</div>
        <p className="text-gray-400 mb-6">Welcome, {user?.email}</p>
        
        <p className="text-brand-400 mb-6 font-medium">✓ Phase 2 (Authentication) complete</p>
        
        <button onClick={logout} className="btn-secondary">
          Sign out
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
