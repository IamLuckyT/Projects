
import React, { useState } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { storageService } from '../services/storageService';
import { User } from '../types';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isLogin) {
      // Admin Check
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const admin: User = { id: 'admin-0', username: ADMIN_USERNAME, hasVoted: false, isAdmin: true };
        storageService.setCurrentUser(admin);
        onAuthSuccess(admin);
        return;
      }

      // User Check
      const users = storageService.getUsers();
      const user = users.find(u => u.username === username && u.id === btoa(password));
      if (user) {
        storageService.setCurrentUser(user);
        onAuthSuccess(user);
      } else {
        setError('Invalid username or password');
      }
    } else {
      // Register
      const users = storageService.getUsers();
      if (users.some(u => u.username === username)) {
        setError('Username already taken');
        return;
      }

      const newUser: User = {
        id: btoa(password), // simple mock ID
        username,
        hasVoted: false,
        isAdmin: false
      };
      storageService.saveUser(newUser);
      storageService.setCurrentUser(newUser);
      onAuthSuccess(newUser);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden">
        <div className="p-8 text-center bg-indigo-600 text-white">
          <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="opacity-80">{isLogin ? 'Login to cast your secure vote' : 'Join E-Day and make your voice heard'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            {isLogin ? 'Sign In' : 'Register Now'}
          </button>

          <div className="text-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
