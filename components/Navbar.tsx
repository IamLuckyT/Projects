
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: 'voter' | 'admin' | 'results') => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('voter')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              E-Day Voting
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:flex items-center space-x-6 mr-4">
                  <button 
                    onClick={() => onNavigate('results')}
                    className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Results
                  </button>
                  {user.isAdmin && (
                    <button 
                      onClick={() => onNavigate('admin')}
                      className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                    >
                      Admin
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{user.username}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{user.isAdmin ? 'Administrator' : 'Voter'}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-all font-medium text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
