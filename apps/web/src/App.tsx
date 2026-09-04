import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

// Placeholder pages — will be replaced in later phases
function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-5xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent mb-4">
          Groww Pulse
        </div>
        <p className="text-gray-400 text-lg mb-2">Know what changed. Know what matters.</p>
        <p className="text-gray-600 text-sm">Phase 1 — Foundation complete ✓</p>
        <div className="mt-8 flex gap-3 justify-center">
          <span className="badge-normal text-xs px-3 py-1 rounded-full">Normal</span>
          <span className="badge-watching text-xs px-3 py-1 rounded-full">Worth Watching</span>
          <span className="badge-high text-xs px-3 py-1 rounded-full">High</span>
          <span className="badge-critical text-xs px-3 py-1 rounded-full">Critical</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
