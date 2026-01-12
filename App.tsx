
import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { User } from './types';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import VoterView from './components/VoterView';
import AdminDashboard from './components/AdminDashboard';
import ResultsChart from './components/ResultsChart';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'voter' | 'admin' | 'results'>('voter');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    storageService.init();
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.isAdmin) setCurrentView('admin');
    }
  }, []);

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setUser(null);
    setCurrentView('voter');
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentView(authenticatedUser.isAdmin ? 'admin' : 'voter');
  };

  const forceRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={setCurrentView}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        ) : (
          <div key={refreshKey}>
            {currentView === 'admin' && user.isAdmin ? (
              <AdminDashboard />
            ) : currentView === 'results' ? (
              <div className="space-y-8 animate-in fade-in">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-slate-800">Global Results</h2>
                  <p className="text-slate-500">Live data from across the E-Day platform</p>
                </div>
                <ResultsChart candidates={storageService.getCandidates()} />
              </div>
            ) : (
              <VoterView user={user} onRefresh={forceRefresh} />
            )}
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-slate-400 text-sm font-medium">
            © 2024 E-Day Online Voting System. Secure. Anonymous. Transparent.
          </p>
          <div className="flex justify-center space-x-6">
            <span className="text-slate-300 text-xs font-bold uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span> System Online
            </span>
            <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">
              End-to-End Encrypted
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
