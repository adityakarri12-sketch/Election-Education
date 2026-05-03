'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Footer } from '@/components/layout/Footer';
import { Activity, BarChart3, Gauge } from 'lucide-react';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const ElectionDashboard = dynamic(
  () => import('@/components/features/ElectionDashboard').then(mod => mod.ElectionDashboard),
  { ssr: false }
);

const TestingEvaluation = dynamic(
  () => import('@/components/features/TestingEvaluation').then(mod => mod.TestingEvaluation),
  { ssr: false }
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'testing'>('analytics');

  return (
    <div className="min-h-screen bg-slate-950">
      
      <main id="main-content" className="pt-40 pb-24">
        {/* HEADER */}
        <div className="container mx-auto px-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-8"
          >
            <Activity size={14} className="animate-pulse" /> Platform Governance & Intelligence
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8">
            <div className="max-w-3xl">
              <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">
                {activeTab === 'analytics' ? 'The Democratic ' : 'System '}
                <span className="text-gradient">{activeTab === 'analytics' ? 'Pulse.' : 'Evaluation.'}</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed">
                {activeTab === 'analytics' 
                  ? 'Explore high-fidelity visualizations of democratic participation and demographic shifts.'
                  : 'Monitor real-time platform stability, AI intelligence indices, and autonomous cluster reliability.'}
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0 h-fit">
              <button 
                suppressHydrationWarning
                onClick={() => setActiveTab('analytics')}
                className={cn(
                  "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  activeTab === 'analytics' ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                )}
              >
                <BarChart3 size={16} /> Analytics
              </button>
              <button 
                suppressHydrationWarning
                onClick={() => setActiveTab('testing')}
                className={cn(
                  "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  activeTab === 'testing' ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                )}
              >
                <Gauge size={16} /> Testing
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <section className="container mx-auto px-6">
          <div className="transition-all duration-500">
            {activeTab === 'analytics' ? <ElectionDashboard /> : <TestingEvaluation />}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
