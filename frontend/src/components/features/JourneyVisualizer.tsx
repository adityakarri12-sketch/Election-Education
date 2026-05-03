'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Vote, BarChart3, ShieldCheck, Info, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

const stages = [
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: UserPlus,
    color: 'bg-blue-500',
    description: 'The foundation of your civic voice. Verify eligibility and join the electoral roll.',
    details: [
      { point: 'Check age & residency requirements', insight: 'You must be 18 on the qualifying date (Jan 1st, April 1st, July 1st, or Oct 1st).' },
      { point: 'Submit Form 6 (Online or In-person)', insight: 'Available on the NVSP portal or via the Voter Helpline App.' },
      { point: 'Receive your EPIC card', insight: 'The Elector Photo Identity Card is delivered via speed post after verification.' }
    ]
  },
  {
    id: 'nomination',
    title: 'Candidate Nomination',
    icon: Search,
    color: 'bg-purple-500',
    description: 'Interested leaders file their candidacy and declare assets/background.',
    details: [
      { point: 'Scrutiny of nomination papers', insight: 'Returning Officer verifies the legal validity of all filed documents.' },
      { point: 'Security deposit payment', insight: 'General candidates deposit ₹25,000; SC/ST candidates deposit ₹12,500.' },
      { point: 'Withdrawal period', insight: 'Candidates have a 2-day window to withdraw their nomination after scrutiny.' }
    ]
  },
  {
    id: 'campaign',
    title: 'Model Code of Conduct',
    icon: ShieldCheck,
    color: 'bg-amber-500',
    description: 'Ensuring fair play. Candidates campaign within strict ethical guidelines.',
    details: [
      { point: 'Public meetings & rallies', insight: 'Permission must be obtained from local authorities via the SUVIDHA portal.' },
      { point: 'No use of govt resources', insight: 'Ministers cannot combine official visits with electioneering work.' },
      { point: 'Silence period (48 hours)', insight: 'All campaigning must stop 48 hours before the conclusion of the poll.' }
    ]
  },
  {
    id: 'voting',
    title: 'Election Day',
    icon: Vote,
    color: 'bg-emerald-500',
    description: 'The moment of truth. Cast your ballot at the assigned polling booth.',
    details: [
      { point: 'Verification of ID card', insight: 'First Polling Officer checks your name in the marked copy of the electoral roll.' },
      { point: 'Indelible ink application', insight: 'Applied on the left forefinger as a marker of participation.' },
      { point: 'Electronic Voting (EVM)', insight: 'Voters press the blue button next to their candidate of choice.' }
    ]
  },
  {
    id: 'counting',
    title: 'Counting & Results',
    icon: BarChart3,
    color: 'bg-indigo-500',
    description: 'Transparent counting of every vote to determine the winner.',
    details: [
      { point: 'Secure transport of EVMs', insight: 'EVMs are sealed and stored in strong rooms under 24/7 CCTV & armed guard.' },
      { point: 'Counting under supervision', insight: 'Done in the presence of counting agents appointed by candidates.' },
      { point: 'Official declaration', insight: 'Form 21C is issued to the winning candidate by the Returning Officer.' }
    ]
  }
];

export const JourneyVisualizer = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [hoveredDetail, setHoveredDetail] = useState<number | null>(null);

  return (
    <div className="py-12 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Stepper Navigation */}
          <div className="lg:w-1/3 space-y-3">
            {stages.map((stage, i) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(i)}
                suppressHydrationWarning
                className={cn(
                  "w-full text-left p-6 rounded-[2rem] transition-all border flex items-center gap-4 group relative overflow-hidden",
                  activeStage === i 
                    ? "bg-white/5 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]" 
                    : "bg-transparent border-transparent opacity-40 hover:opacity-100 hover:bg-white/5"
                )}
              >
                {activeStage === i && (
                  <motion.div layoutId="stage-glow" className={cn("absolute inset-0 opacity-10", stage.color)} />
                )}
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all relative z-10",
                  activeStage === i ? stage.color : "bg-slate-800"
                )}>
                  <stage.icon size={24} />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Stage 0{i + 1}</p>
                  <h3 className="font-bold text-white group-hover:text-primary transition-colors">{stage.title}</h3>
                </div>
              </button>
            ))}
          </div>

          {/* Display Area */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 md:p-14 h-full relative overflow-hidden backdrop-blur-xl shadow-2xl"
              >
                {/* Decorative background glow */}
                <div className={cn(
                  "absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-10",
                  stages[activeStage].color
                )} />
                
                <div className="relative z-10">
                  <div className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl",
                    stages[activeStage].color
                  )}>
                    {React.createElement(stages[activeStage].icon, { size: 40 })}
                  </div>
                  
                  <h2 className="text-4xl font-black text-white mb-6 tracking-tight">{stages[activeStage].title}</h2>
                  <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg">
                    {stages[activeStage].description}
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                      <Sparkles size={14} /> Hover items for Procedural Insight
                    </div>
                    <div className="grid gap-3">
                      {stages[activeStage].details.map((detail, j) => (
                        <div 
                          key={j} 
                          className="relative"
                          onMouseEnter={() => setHoveredDetail(j)}
                          onMouseLeave={() => setHoveredDetail(null)}
                        >
                          <div className={cn(
                            "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-help",
                            hoveredDetail === j 
                              ? "bg-white/10 border-primary/50 shadow-lg translate-x-2" 
                              : "bg-white/5 border-white/5"
                          )}>
                            <div className={cn("w-2 h-2 rounded-full", stages[activeStage].color)} />
                            <span className="text-slate-200 font-medium text-sm md:text-base">{detail.point}</span>
                          </div>

                          <AnimatePresence>
                            {hoveredDetail === j && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                className="absolute left-0 right-0 -top-2 -translate-y-full z-50 p-6 bg-slate-950 border border-primary/30 rounded-2xl shadow-2xl"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Info size={14} className="text-primary" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Technical Insight</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{detail.insight}</p>
                                <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-slate-950 border-r border-b border-primary/30 rotate-45" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
