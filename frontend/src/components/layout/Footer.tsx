'use client';

import { 
  Globe, MessageSquare, 
  Cpu, Mail, Zap, Shield
} from 'lucide-react';

import Link from 'next/link';


export const Footer = () => {
  return (
    <footer suppressHydrationWarning className="mt-40 border-t border-white/5 bg-slate-950/50 backdrop-blur-3xl pt-24 pb-12" role="contentinfo" aria-label="Site Footer">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20" aria-hidden="true">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">ElectraLearn.</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Advancing democratic literacy through high-fidelity simulations and AI-powered constitutional intelligence.
            </p>
            <nav className="flex gap-4" aria-label="Social media links">
              {[
                { Icon: Globe, label: 'Official Website' },
                { Icon: Cpu, label: 'Platform Infrastructure' },
                { Icon: MessageSquare, label: 'Community Discussion' },
                { Icon: Mail, label: 'Contact Support' }
              ].map((item, i) => (
                <button 
                  key={i} 
                  aria-label={item.label}
                  suppressHydrationWarning 
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary/40 transition-all border border-white/5 outline-none"
                >
                  <item.Icon size={18} aria-hidden="true" />
                </button>
              ))}
            </nav>
          </div>

          {/* Navigation */}
          <nav aria-labelledby="footer-nav-platform">
            <h4 id="footer-nav-platform" className="text-white font-bold mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" aria-hidden="true" /> Platform
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Learn', path: '/learn' },
                { name: 'Simulator', path: '/simulation' },
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'AI Chat', path: '/chat' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.path} 
                    aria-label={`Go to ${item.name}`}
                    className="text-sm text-slate-500 hover:text-white focus:text-white transition-colors outline-none"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-nav-resources">
            <h4 id="footer-nav-resources" className="text-white font-bold mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" aria-hidden="true" /> Resources
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'ECI Portal', url: 'https://eci.gov.in' },
                { name: 'Legal Guidelines', url: 'https://www.eci.gov.in/election-laws' },
                { name: 'Constitution FAQ', url: 'https://legislative.gov.in/constitution-of-india/' },
                { name: 'Voter Stats', url: 'https://www.eci.gov.in/statistical-reports' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`${item.name} (opens in new tab)`}
                    className="text-sm text-slate-500 hover:text-white focus:text-white transition-colors text-left outline-none"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter / Contact */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <h4 id="newsletter-heading" className="text-white font-bold mb-4">Stay Informed</h4>
              <p className="text-[11px] text-slate-500 mb-6">Receive bi-weekly updates on electoral reforms and platform features.</p>
              <div className="relative">
                <label htmlFor="newsletter-email" className="sr-only">Email Address</label>

                <input 
                  id="newsletter-email"
                  type="email" 
                  placeholder="email@example.com"
                  aria-describedby="newsletter-heading"
                  suppressHydrationWarning
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button 
                  aria-label="Join Newsletter"
                  suppressHydrationWarning 
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary text-white rounded-lg text-[10px] font-bold hover:scale-105 focus:ring-2 focus:ring-white/50 transition-all outline-none"
                >
                  Join
                </button>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            © 2026 ElectraLearn Intelligence. All Rights Reserved.
          </p>
          <nav className="flex gap-8" aria-label="Legal links">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <button 
                key={item} 
                aria-label={item}
                suppressHydrationWarning 
                className="text-[10px] text-slate-600 font-bold uppercase tracking-widest hover:text-slate-400 focus:text-slate-400 transition-colors outline-none"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl" role="status" aria-label="System infrastructure status">
               <div className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                 Powered by <span className="text-white">Google Cloud</span> Ecosystem
               </span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500/60 font-black text-[9px] uppercase tracking-tighter" role="status">
              <Shield size={12} aria-hidden="true" /> SSL Secured & Encrypted
            </div>
          </div>
        </div>
      </div>
    </footer>

  );
};
