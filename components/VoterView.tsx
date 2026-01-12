
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { getAIAnalysis } from '../services/geminiService';
import { Candidate, User } from '../types';
import VoteCard from './VoteCard';
import ResultsChart from './ResultsChart';

interface VoterViewProps {
  user: User;
  onRefresh: () => void;
}

const VoterView: React.FC<VoterViewProps> = ({ user, onRefresh }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setCandidates(storageService.getCandidates());
  }, []);

  const handleVote = (candidateId: number) => {
    if (storageService.castVote(user.id, candidateId)) {
      onRefresh();
    }
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await getAIAnalysis(candidates);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="text-center py-10">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Your Voice, <span className="text-indigo-600">Your Future.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Welcome to the E-Day secure voting portal. Securely cast your vote for the candidate that represents your vision.
        </p>
      </section>

      {user.hasVoted ? (
        <div className="space-y-10">
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-emerald-900">Vote Successfully Recorded</h2>
            <p className="text-emerald-700 mt-2">Thank you for participating in E-Day. View the current live standings below.</p>
          </div>
          
          <ResultsChart candidates={candidates} />

          {/* AI Analysis Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-8 border border-indigo-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">AI Election Analyst</h3>
                  <p className="text-sm text-slate-500">Intelligent insights powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={runAIAnalysis}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-white text-indigo-600 border border-indigo-100 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Get Live Analysis</span>
                )}
              </button>
            </div>

            {aiAnalysis ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-slate-700 leading-relaxed border border-white/40 prose prose-slate max-w-none">
                {aiAnalysis.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 italic">
                Click the button above to generate an intelligent summary of the current election trends.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {candidates.map(candidate => (
            <VoteCard
              key={candidate.id}
              candidate={candidate}
              onVote={handleVote}
              disabled={user.hasVoted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoterView;
