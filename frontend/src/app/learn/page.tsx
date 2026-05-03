'use client';

import { motion } from 'framer-motion';
import { JourneyVisualizer } from '@/components/features/JourneyVisualizer';
import { MythFactSection } from '@/components/features/MythFactSection';
import { Glossary } from '@/components/features/Glossary';
import { FlipCard } from '@/components/ui/FlipCard';
import { 
  GraduationCap, Book, ShieldAlert, 
  Sparkles, Landmark, Gavel, Fingerprint,
  Award, Users, Globe
} from 'lucide-react';


export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="pt-40 pb-48" role="main" id="main-content">

        {/* CENTERED HEADER SECTION */}
        <div className="container mx-auto px-6 mb-32 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-8"
            role="status"
          >
            <GraduationCap size={14} aria-hidden="true" /> Comprehensive Learning Hub
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none"
          >
            The Masterclass in <br />
            <span className="text-gradient">Modern Democracy.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-16"
          >
            Step beyond the basics. Explore the intricate machinery of democracy with deep-dive insights and interactive technical breakdowns.
          </motion.p>

          {/* New Hero Components: Quick Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" role="region" aria-label="Learning Statistics">
            {[
              { label: 'Learning Modules', value: '12+', icon: Book, color: 'text-blue-400', gradient: 'from-blue-500/10 to-slate-950' },
              { label: 'Citizen Engagement', value: 'Live', icon: Users, color: 'text-emerald-400', gradient: 'from-emerald-500/10 to-slate-950' },
              { label: 'Global Standards', value: 'Verified', icon: Globe, color: 'text-purple-400', gradient: 'from-purple-500/10 to-slate-950' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className={`bg-gradient-to-br ${stat.gradient} border border-white/10 p-6 rounded-3xl flex items-center gap-6 group hover:border-white/20 transition-all`}
                role="article"
              >
                <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`} aria-hidden="true">
                  <stat.icon size={24} />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 1. INTERACTIVE JOURNEY */}
        <section className="container mx-auto px-6 mb-48" aria-labelledby="journey-heading">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4" role="status">
              <Sparkles size={16} aria-hidden="true" /> Process visualization
            </div>
            <h2 id="journey-heading" className="text-5xl font-black text-white mb-6">Election <span className="text-gradient">Journey.</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Hover over checklist items for procedural insights.</p>
          </div>
          <JourneyVisualizer />
        </section>

        {/* 2. CONSTITUTIONAL MANDATE - FLIP CARDS */}
        <section className="py-32 bg-slate-900/20 border-y border-white/5 mb-48" aria-labelledby="mandate-heading">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4" role="status">
                <Landmark size={16} aria-hidden="true" /> Legal framework
              </div>
              <h2 id="mandate-heading" className="text-5xl font-black text-white mb-6">Constitutional <span className="text-gradient">Mandate.</span></h2>
              <p className="text-slate-400 text-lg">Click to flip cards and reveal deep judicial insights.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Constitutional articles">
              {[
                { title: "Article 324", description: "Establishment and powers of the Election Commission.", icon: ShieldAlert, details: ["Mandates the ECI as a permanent autonomous body.", "Covers Superintendence, Direction, and Control of elections.", "Ensures the ECI is free from executive influence.", "Grants power to issue the Model Code of Conduct."] },
                { title: "Article 325", description: "Non-discrimination in Electoral Rolls.", icon: Users, details: ["Prohibits exclusion based on religion, race, caste or sex.", "Mandates one general electoral roll for every constituency.", "Prevents separate electorates based on social identity.", "Upholds the secular fabric of the democratic process."] },
                { title: "Article 326", description: "Universal Adult Suffrage and the right to vote.", icon: Fingerprint, details: ["Sets the minimum voting age at 18 (61st Amendment).", "Prohibits discrimination based on religion or caste.", "Defines 'Citizen' as the primary unit of democracy.", "Mandates one person, one vote principle."] },
                { title: "Article 327", description: "Parliament's power to frame electoral laws.", icon: Gavel, details: ["Empowers Parliament to make laws for seat allocation.", "Governs the Delimitation of constituencies.", "Enables the Representation of the People Act.", "Standardizes electoral procedures nationwide."] },
                { title: "Article 328", description: "State Legislature's power in elections.", icon: Landmark, details: ["Allows States to legislate if Parliament hasn't made a provision.", "Relates specifically to elections to the State Legislature.", "Subordinate to the laws made by the Parliament.", "Ensures state-specific electoral needs can be addressed."] },
                { title: "Article 329", description: "Judicial boundaries and bar to court interference.", icon: Landmark, details: ["Prevents courts from questioning delimitation laws.", "Ensures election processes are not stalled by litigation.", "Specific Election Petitions for handling disputes.", "Maintains the strict electoral calendar timeline."] },
                { title: "Article 102", description: "Disqualifications for Membership of Parliament.", icon: ShieldAlert, details: ["Office of Profit disqualification clause.", "Disqualification due to unsoundness of mind or bankruptcy.", "Loss of citizenship leading to disqualification.", "The 10th Schedule (Anti-Defection Law) relevance."] },
                { title: "Article 191", description: "Disqualifications for State Legislatures.", icon: Gavel, details: ["Mirror provision of Article 102 for State Assemblies.", "Covers Office of Profit and citizenship status.", "Decision on disqualification lies with the Governor.", "Requires consultation with the Election Commission."] }
              ].map((card, i) => (
                <div key={i} role="listitem">
                  <FlipCard 
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    details={card.details}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. MYTHS VS FACTS */}
        <section className="container mx-auto px-6 mb-48" aria-labelledby="myths-heading">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4" role="status">
              <Award size={16} aria-hidden="true" /> Truth verification
            </div>
            <h2 id="myths-heading" className="text-5xl font-black text-white mb-6">Myth <span className="text-gradient">Busting.</span></h2>
            <p className="text-slate-400 text-lg">Debunking misinformation with technical documentation.</p>
          </div>
          <MythFactSection />
        </section>

        {/* 4. CIVIC GLOSSARY */}
        <section className="container mx-auto px-6" aria-labelledby="glossary-heading">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-6" aria-hidden="true">
                <Book size={32} />
              </div>
              <h2 id="glossary-heading" className="text-5xl font-black text-white mb-4">Civic Glossary</h2>
              <p className="text-slate-400 text-lg">Master the language of democracy with our A-Z database.</p>
            </div>
            <Glossary />
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-6 mt-48" aria-label="Next steps">
          <div className="bg-primary p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10">Theory to Practice.</h2>
            <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto relative z-10">Mastered the documentation? Put your knowledge to the test in the simulation environment.</p>
            <a 
              href="/simulation" 
              aria-label="Enter the Election Simulation environment"
              className="inline-block px-10 py-5 bg-white text-primary rounded-[2rem] font-black text-xl hover:scale-105 focus:ring-4 focus:ring-white/50 active:scale-95 transition-all shadow-xl relative z-10 outline-none"
            >
              Enter Simulation
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

