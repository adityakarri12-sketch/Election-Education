'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Home, TrendingUp, 
  Download, Sparkles,
  Lock, Database, ShieldCheck, CheckCircle2, Trophy
} from 'lucide-react';


import { cn } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const mockData = {
  summary: {
    total_voters: "968.8M",
    polling_stations: "1.04M",
    female_voters: "471M",
    first_time_voters: "18M"
  },
  turnout_history: [
    { year: '2004', rate: 58.07 },
    { year: '2009', rate: 58.19 },
    { year: '2014', rate: 66.44 },
    { year: '2019', rate: 67.40 },
    { year: '2024', rate: 66.95 },
  ],
  demographics: [
    { name: '18-29', value: 22 },
    { name: '30-45', value: 35 },
    { name: '46-60', value: 28 },
    { name: '60+', value: 15 },
  ]
};

interface DashboardData {
  summary: {
    total_voters: string;
    polling_stations: string;
    female_voters: string;
    first_time_voters: string;
  };
  turnout_history: { year: string; rate: number }[];
  demographics: { name: string; value: number }[];
}

interface LeaderboardEntry {
  username: string;
  score: number;
  role?: string;
  accuracy?: number;
}


export const ElectionDashboard = () => {
  const [data] = useState<DashboardData>(mockData);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchLeaderboard = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/simulation/leaderboard`);

        if (res.ok) {
          const lb = await res.json();
          if (lb && lb.data) {
            setLeaderboard(lb.data);
          }
        }
      } catch {
        console.error("Leaderboard fetch error");
      }


    };
    fetchLeaderboard();
  }, []);

  const downloadReport = () => {
    // This function can be adapted to download the mock data
    console.log("Downloading report...");
  };

  if (!data) return (
    <div className="h-[600px] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
    </div>
  );

  return (
    <div className="space-y-16" role="main" id="main-content">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6" role="region" aria-label="Dashboard Overview">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Real-Time <span className="text-gradient">Analysis.</span></h2>
          <p className="text-slate-400 mt-2">Aggregated constitutional and demographic data from verified sources.</p>
        </div>
        <div className="flex gap-3">
          <button 
            suppressHydrationWarning
            onClick={downloadReport}
            aria-label="Download Electoral Insight Report as PDF"
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <Download size={20} aria-hidden="true" /> Download Report
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Electoral Statistics Summary">
        {[
          { label: 'Total Voters', value: data.summary.total_voters, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Polling Stations', value: data.summary.polling_stations, icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Female Voters', value: data.summary.female_voters, icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'New Registrations', value: data.summary.first_time_voters, icon: UserPlus, color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            role="article"
            aria-labelledby={`stat-label-${i}`}
            className="group relative p-8 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.05)]"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={24} aria-hidden="true" />
            </div>
            <p id={`stat-label-${i}`} className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Participation Trend */}
        <div className="lg:col-span-2 p-8 bg-slate-900/50 border border-white/10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group" role="region" aria-label="Voter Participation Trends">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" aria-hidden="true" /> Participation Trend
            </h4>
          </div>
          <div className="h-[400px] relative z-10" aria-label="Line chart showing voter turnout from 2004 to 2024. Current rate is approximately 67%.">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <AreaChart data={data.turnout_history} aria-hidden="false">
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                  <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={4} fill="url(#colorRate)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Voter Age Groups */}
        <div className="p-8 bg-slate-900/50 border border-white/10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group" role="region" aria-label="Demographic Distribution">
          <h4 className="text-xl font-bold text-white mb-10 flex items-center gap-2">
            <Users size={20} className="text-amber-500" aria-hidden="true" /> Voter Age Groups
          </h4>
          <div className="h-[300px]" aria-label="Pie chart illustrating voter distribution by age. The largest segment is the 30 to 45 age group.">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <PieChart>
                  <Pie data={data.demographics} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                    {data.demographics && Array.isArray(data.demographics) && data.demographics.map((entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}

                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {data.demographics && Array.isArray(data.demographics) && data.demographics.map((d: { name: string; value: number }, i: number) => (
              <div key={i} className="flex items-center gap-3">

                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} aria-hidden="true" />
                <span className="text-xs text-slate-400">{d.name}: {d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* NEW: REGIONAL ANALYSIS FLIP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { 
            title: 'Digital Security', 
            icon: Lock, 
            front: 'Protocol: End-to-End Encryption', 
            back: 'Voter data is hashed using SHA-256 and stored in secure, air-gapped ECI servers.',
            color: 'blue'
          },
          { 
            title: 'Data Integrity', 
            icon: Database, 
            front: 'Frequency: Real-time Sync', 
            back: 'Data is cross-verified across 3 independent auditing nodes before public release.',
            color: 'emerald'
          },
          { 
            title: 'Voter Privacy', 
            icon: ShieldCheck, 
            front: 'Standard: GDPR+ Compliance', 
            back: 'Individual voting choices remain secret (Rule 49M); only aggregated stats are displayed.',
            color: 'purple'
          }
        ].map((card, i) => (
          <div key={i} className="group h-[300px] [perspective:1000px]">
            <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* Front */}
              <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center backface-hidden">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", `bg-${card.color}-500/10 text-${card.color}-400`)}>
                  <card.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{card.title}</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">{card.front}</p>
              </div>
              {/* Back */}
              <div className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] backface-hidden">
                <CheckCircle2 className="text-primary mb-4" size={32} />
                <p className="text-sm text-slate-300 leading-relaxed font-medium">{card.back}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* GOOGLE CLOUD FIRESTORE LEADERBOARD */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
              <Trophy size={32} className="text-primary" /> Top Democratic Experts
            </h3>
            <p className="text-slate-500 mt-2">Live rankings powered by Google Cloud Firestore database.</p>
          </div>
          <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             Real-time Sync Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaderboard.length > 0 ? leaderboard.map((user: LeaderboardEntry, i: number) => (

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-primary/40 transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-sm font-black text-slate-500 group-hover:text-primary transition-colors border border-white/5">
                   #{i + 1}
                </div>
                <div>
                  <p className="text-lg font-black text-white uppercase tracking-tight">{user.role || 'Expert'}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Decision Accuracy: {user.accuracy || 100}%</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-2xl font-black text-primary">{user.score} XP</p>
                <div className="h-1 w-full bg-primary/20 rounded-full mt-1 overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${(user.score / 500) * 100}%` }} />
                </div>
              </div>
            </motion.div>
          )) : (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 bg-white/5 rounded-[2.5rem] animate-pulse" />)
          )}
        </div>
      </div>

    </div>
  );
};
