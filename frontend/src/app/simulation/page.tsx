'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ElectionSimulation } from '@/components/features/ElectionSimulation';
import { ShieldCheck, Zap, Target, Award, Info } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function SimulationPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { 
      label: 'Role-Based Branching', 
      icon: ShieldCheck, 
      color: 'blue',
      info: 'Simulate unique workflows for Voters, Candidates, and Officers with dedicated logic.'
    },
    { 
      label: 'Real-World Scenarios', 
      icon: Target, 
      color: 'emerald',
      info: 'Every question is derived from ECI handbooks and legal constitutional mandates.'
    },
    { 
      label: 'Democracy Score', 
      icon: Award, 
      color: 'amber',
      info: 'Your decisions are evaluated in real-time, generating a certified proficiency score.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      
      <main className="pt-40 pb-24">
        {/* CENTERED HEADER */}
        <div className="container mx-auto px-6 mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-8"
          >
            <Zap size={14} /> Practical Training Module
          </motion.div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">
            The Democracy <br />
            <span className="text-gradient">Simulator.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            Bridge the gap between theory and practice. Step into real-world electoral roles and test your decision-making under high-pressure democratic scenarios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="relative"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={cn(
                  "flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl transition-all duration-500",
                  hoveredFeature === i ? "bg-white/10 border-primary/40 shadow-[0_0_30px_rgba(59,130,246,0.1)] scale-105" : ""
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500",
                    hoveredFeature === i ? "bg-primary text-white" : "bg-primary/20 text-primary"
                  )}>
                    <feature.icon size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">{feature.label}</span>
                </div>

                <AnimatePresence>
                  {hoveredFeature === i && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute left-0 right-0 -top-4 -translate-y-full z-50 p-6 bg-slate-900 border border-primary/30 rounded-2xl shadow-2xl backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                          <Info size={16} />
                        </div>
                        <h5 className="font-bold text-white text-xs uppercase tracking-widest">Module Insight</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed text-left">{feature.info}</p>
                      <div className="absolute -bottom-1.5 left-10 w-3 h-3 bg-slate-900 border-r border-b border-primary/30 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="h-px bg-white/5 w-full" />
        </div>

        {/* MAIN SIMULATION SECTION */}
        <section className="container mx-auto px-6">
          <ElectionSimulation />
        </section>

        {/* GUIDELINES */}
        <section className="container mx-auto px-6 mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-md">
              <h4 className="text-2xl font-bold text-white mb-6">Simulation Guidelines</h4>
              <div className="space-y-4">
                {[
                  "Read each scenario carefully; some have legal implications.",
                  "Your score reflects your adherence to the Model Code of Conduct.",
                  "Incorrect decisions as an Officer lead to higher penalties.",
                  "Unlock a 'Verified Citizen' badge by scoring over 50 points."
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4 text-slate-400 text-sm leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-black text-white mb-6">Mastered your role?</h3>
              <p className="text-slate-500 mb-8 max-w-md">
                Every decision you make in this simulator is based on real Election Commission guidelines and historical case studies.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
