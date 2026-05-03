'use client';

import React from 'react';


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Map, CheckCircle2 } from 'lucide-react';

const data = [
  { name: 'Phase 1', turnout: 68 },
  { name: 'Phase 2', turnout: 72 },
  { name: 'Phase 3', turnout: 65 },
  { name: 'Phase 4', turnout: 78 },
  { name: 'Phase 5', turnout: 70 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

export const SmartDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Turnout', value: '71.2%', icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Registered', value: '945M', icon: Users, color: 'text-purple-500' },
          { label: 'Active Zones', value: '543', icon: Map, color: 'text-amber-500' },
          { label: 'Verified', value: '100%', icon: CheckCircle2, color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-white/5 rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-Time</span>
            </div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 font-bold uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-bold text-white">Voter Turnout Trends</h4>
          <select className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-primary">
            <option>Last 5 Phases</option>
            <option>Last 10 Phases</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
              />
              <Bar dataKey="turnout" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Pie */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
        <h4 className="text-xl font-bold text-white mb-8">Demographic Split</h4>
        <div className="h-[250px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: '18-25', value: 30 },
                  { name: '26-45', value: 45 },
                  { name: '46-60', value: 15 },
                  { name: '60+', value: 10 }
                ]}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-2xl font-black text-white">945M</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Total Voters</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {['18-25', '26-45', '46-60', '60+'].map((cat, i) => (
            <div key={cat} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-400">{cat}</span>
              </div>
              <span className="text-white font-bold">{[30, 45, 15, 10][i]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
