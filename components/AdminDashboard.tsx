
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Candidate, User, Language } from '../types';
import ResultsChart from './ResultsChart';
import SourceCodeView from './SourceCodeView';

const AdminDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'code'>('stats');
  
  const [newName, setNewName] = useState('');
  const [newLang, setNewLang] = useState<Language>(Language.TSWANA);
  const [newBio, setNewBio] = useState('');

  const refreshData = () => {
    setCandidates(storageService.getCandidates());
    setUsers(storageService.getUsers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const participationRate = users.length > 0 ? (users.filter(u => u.hasVoted).length / users.length * 100).toFixed(1) : 0;

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all votes? Users will be able to vote again.')) {
      storageService.resetVotes();
      refreshData();
    }
  };

  const handleClearUsers = () => {
    if (confirm('Are you sure you want to clear all registered users? This cannot be undone.')) {
      storageService.clearUsers();
      refreshData();
    }
  };

  const handleDeleteCandidate = (id: number) => {
    if (confirm('Delete this candidate? All their votes will be lost.')) {
      storageService.deleteCandidate(id);
      refreshData();
    }
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBio) return;
    storageService.addCandidate(newName, newLang, newBio);
    setNewName('');
    setNewBio('');
    setShowAddForm(false);
    refreshData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Admin Control Center</h2>
          <p className="text-slate-500">Manage the election lifecycle and candidate roster.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg font-bold text-sm hover:bg-amber-100 transition-colors"
          >
            Reset Votes
          </button>
          <button 
            onClick={handleClearUsers}
            className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg font-bold text-sm hover:bg-rose-100 transition-colors"
          >
            Purge Users
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'stats' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Live Stats & Candidates
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Voter Registry
        </button>
        <button 
          onClick={() => setActiveTab('code')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'code' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Backend Source Code
        </button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Registered Voters</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{users.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Votes Cast</p>
              <p className="text-3xl font-black text-indigo-600 mt-1">{totalVotes}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Participation Rate</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{participationRate}%</p>
            </div>
          </div>

          <ResultsChart candidates={candidates} />

          {/* Candidate Management */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Candidate Roster</h3>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all"
              >
                {showAddForm ? 'Cancel' : 'Add Candidate'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddCandidate} className="p-6 bg-slate-50 border-b border-slate-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    placeholder="Full Name"
                    required
                  />
                  <select 
                    value={newLang}
                    onChange={e => setNewLang(e.target.value as Language)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  >
                    <option value={Language.TSWANA}>Tswana</option>
                    <option value={Language.ZULU}>Zulu</option>
                  </select>
                </div>
                <textarea 
                  value={newBio}
                  onChange={e => setNewBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  placeholder="Biography/Platform"
                  required
                />
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold">Save Candidate</button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Language</th>
                    <th className="px-6 py-4">Votes</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                      <td className="px-6 py-4">{c.language}</td>
                      <td className="px-6 py-4 font-black text-indigo-600">{c.votes}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteCandidate(c.id)} className="text-rose-500 font-bold text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Voter Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Database ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 font-medium">{u.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${u.hasVoted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {u.hasVoted ? 'Voted' : 'Not Voted'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[10px] text-slate-400">{u.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">Traditional Backend Implementation</h3>
            <p className="opacity-90 text-sm">Below is the modular source code to rebuild this system using Python (Flask), MySQL, HTML, and CSS. This matches the logic of the React app currently running.</p>
          </div>
          <SourceCodeView />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
