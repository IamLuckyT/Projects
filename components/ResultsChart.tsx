
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Candidate, Language } from '../types';

interface ResultsChartProps {
  candidates: Candidate[];
}

const ResultsChart: React.FC<ResultsChartProps> = ({ candidates }) => {
  const data = candidates.map(c => ({
    name: c.name,
    votes: c.votes,
    language: c.language
  }));

  const COLORS = {
    [Language.TSWANA]: '#10b981',
    [Language.ZULU]: '#f59e0b'
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-slate-800">Current Standings</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="votes" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.language]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold mb-2 text-slate-800">Vote Distribution</h3>
        <div className="h-48 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="votes"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.language]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="text-2xl font-black text-slate-800">{totalVotes}</span>
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Total</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-6">
           <div className="flex items-center space-x-2">
             <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
             <span className="text-sm font-medium text-slate-600">Tswana</span>
           </div>
           <div className="flex items-center space-x-2">
             <div className="w-3 h-3 rounded-full bg-amber-500"></div>
             <span className="text-sm font-medium text-slate-600">Zulu</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsChart;
