
import React from 'react';
import { Candidate, Language } from '../types';

interface VoteCardProps {
  candidate: Candidate;
  onVote: (id: number) => void;
  disabled: boolean;
}

const VoteCard: React.FC<VoteCardProps> = ({ candidate, onVote, disabled }) => {
  const languageColor = candidate.language === Language.TSWANA ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${languageColor}`}>
            {candidate.language}
          </span>
          <h3 className="text-xl font-bold mt-2 text-slate-800">{candidate.name}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-inner">
           <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        {candidate.bio}
      </p>

      <button
        onClick={() => onVote(candidate.id)}
        disabled={disabled}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          disabled 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200'
        }`}
      >
        {disabled ? 'Already Voted' : 'Vote for Candidate'}
      </button>
    </div>
  );
};

export default VoteCard;
