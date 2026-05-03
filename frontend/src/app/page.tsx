'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Shield, Cpu, 
  BookOpen, Gamepad2, LayoutDashboard, 
  MessageSquare, Globe, CheckCircle, 
  FileText, Info
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main role="main" id="main-content">
        {/* HERO SECTION - The "Wow" Factor */}
        <section id="home" className="relative pt-40 pb-24 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary mb-8" role="status">
                <Sparkles size={14} aria-hidden="true" /> Democracy Intelligence Platform
              </div>
              <h1 id="hero-heading" className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                Empowering Every <br />
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Digital Citizen.</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                ElectraLearn is an advanced educational ecosystem designed to bridge the gap between complex election procedures and citizen engagement through AI and interactive simulations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/learn" 
                  aria-label="Explore Learning Path: Get started with electoral education"
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:scale-105 focus:ring-4 focus:ring-primary/50 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                  Explore Learning Path <ArrowRight size={20} aria-hidden="true" />
                </Link>
                <Link 
                  href="/chat" 
                  aria-label="Consult Electra AI: Ask questions to our specialized election assistant"
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 focus:ring-4 focus:ring-white/20 transition-all"
                >
                  Consult Electra AI
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROJECT PURPOSE - The "Why" */}
        <section className="py-24 relative" aria-labelledby="mission-heading">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <article>
                <div className="w-16 h-16 bg-primary/20 rounded-[2rem] flex items-center justify-center text-primary mb-8" aria-hidden="true">
                  <Shield size={32} />
                </div>
                <h2 id="mission-heading" className="text-4xl font-black text-white mb-6">Our Mission: <br />Democratic Clarity.</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  In an era of information overload, understanding how democracy functions is more critical than ever. ElectraLearn provides a verified, non-partisan platform where citizens can learn about their rights, roles, and responsibilities without the noise.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Combat Misinformation",
                    "Foster Youth Engagement",
                    "Simplify Legal Jargon",
                    "Verify Civic Data"
                  ].map((goal, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                      <CheckCircle size={18} className="text-emerald-500" aria-hidden="true" /> {goal}
                    </div>
                  ))}
                </div>
              </article>
              <div className="grid grid-cols-2 gap-4" role="complementary" aria-label="Impact Statistics">
                <div className="space-y-4 pt-12">
                  <div className="h-48 bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-end">
                    <p className="text-2xl font-bold text-white">945M</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Potential Reach</p>
                  </div>
                  <div className="h-64 bg-primary/20 border border-primary/30 rounded-[2rem] p-6 flex flex-col justify-end">
                    <p className="text-2xl font-bold text-white">100%</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Verified Sources</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 bg-slate-900 border border-white/5 rounded-[2rem] p-6 flex flex-col justify-end">
                    <Globe size={40} className="text-blue-500 mb-auto" aria-hidden="true" />
                    <p className="text-2xl font-bold text-white">Global</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Standards</p>
                  </div>
                  <div className="h-48 bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-end">
                    <Cpu size={40} className="text-purple-500 mb-auto" aria-hidden="true" />
                    <p className="text-2xl font-bold text-white">AI-Driven</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Personalization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - The Ecosystem */}
        <section className="py-24 bg-slate-900/10 border-y border-white/5" aria-labelledby="ecosystem-heading">
          <div className="container mx-auto px-6 text-center">
            <h2 id="ecosystem-heading" className="text-5xl font-black text-white mb-16">Platform <span className="text-gradient">Ecosystem.</span></h2>
            <nav className="grid grid-cols-1 md:grid-cols-4 gap-8" aria-label="Main ecosystem features">
              {[
                { title: 'Learn', icon: BookOpen, href: '/learn', desc: 'Interactive lifecycle visualization and documentation.' },
                { title: 'Simulate', icon: Gamepad2, href: '/simulation', desc: 'Real-world scenarios with branching consequences.' },
                { title: 'Consult', icon: MessageSquare, href: '/chat', desc: 'AI-powered Q&A for deep election knowledge.' },
                { title: 'Analyze', icon: LayoutDashboard, href: '/dashboard', desc: 'Live turnout trends and demographic data.' }
              ].map((feature, i) => (
                <Link 
                  key={i} 
                  href={feature.href} 
                  aria-label={`Navigate to ${feature.title}: ${feature.desc}`}
                  className="group p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-primary/5 hover:border-primary/20 focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                >
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all mx-auto mb-6" aria-hidden="true">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* DOCUMENTATION OVERVIEW */}
        <section className="py-24" aria-labelledby="docs-heading">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-white/10 rounded-[3.5rem] p-12 md:p-20 overflow-hidden relative">
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                <article>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-6" role="status">
                    <FileText size={14} aria-hidden="true" /> Official Documentation
                  </div>
                  <h2 id="docs-heading" className="text-4xl font-black text-white mb-8">Verified Knowledge <br />at your fingertips.</h2>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                    ElectraLearn serves as a gateway to official election laws, constitutional mandates, and operational guidelines. All our modules are cross-verified with the latest electoral standards.
                  </p>
                  <a 
                    href="https://www.eci.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Browse All Official Election Commission of India Documentation (opens in new tab)"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold hover:scale-105 focus:ring-4 focus:ring-white/50 transition-all outline-none"
                  >
                    Browse All Docs <ArrowRight size={20} aria-hidden="true" />
                  </a>
                </article>
                <div className="space-y-6" role="list" aria-label="Official resource links">
                  {[
                    { title: "Voter Portal", desc: "Official portal for voter registration and verification.", url: "https://voters.eci.gov.in/" },
                    { title: "Candidate Corner", desc: "Understanding the legal requirements and candidate data.", url: "https://www.eci.gov.in/elections/candidate-corner/" },
                    { title: "MCC Guidelines", desc: "The official Model Code of Conduct documents.", url: "https://www.eci.gov.in/mcc/" },
                    { title: "EVM & VVPAT", desc: "Official resources on voting technology security.", url: "https://www.eci.gov.in/evm-vvpat" }
                  ].map((doc, i) => (
                    <a 
                      key={i} 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      role="listitem"
                      aria-label={`${doc.title}: ${doc.desc} (opens in new tab)`}
                      className="flex gap-6 p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-primary/30 hover:bg-primary/5 focus:ring-2 focus:ring-primary/20 transition-all group outline-none"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary flex-shrink-0 transition-all" aria-hidden="true">
                        <Info size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{doc.title}</h4>
                        <p className="text-sm text-slate-500">{doc.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>

  );
}
