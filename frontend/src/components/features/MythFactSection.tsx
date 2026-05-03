'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, ExternalLink } from 'lucide-react';


export const myths = [
  {
    myth: "Voter ID is the only document required for voting.",
    fact: "While Voter ID (EPIC) is preferred, you can also use other valid documents like Aadhar, Passport, or DL.",
    details: [
      "The ECI permits 12 alternative photo identity documents.",
      "Aadhar Card and MGNREGA Job Card are valid.",
      "Bank/Post Office Passbooks with photos are accepted.",
      "Driving License and Health Insurance Smart Cards work too."
    ],
    source: "ECI Rule 37A"
  },
  {
    myth: "If I don't like any candidate, I shouldn't go to vote.",
    fact: "You should still vote using the 'NOTA' (None of the Above) option to express your dissent.",
    details: [
      "NOTA was introduced in 2013 following an SC judgment.",
      "It allows citizens to register a vote of 'No Confidence'.",
      "While it doesn't affect the winner, it pressures parties.",
      "It serves as a critical feedback loop for political quality."
    ],
    source: "PUCL vs Union of India"
  },
  {
    myth: "My vote doesn't matter in a large constituency.",
    fact: "Many elections have been decided by a single digit margin. Every vote counts.",
    details: [
      "In 2004, a candidate won by only 1 vote in Rajasthan.",
      "Voter turnout directly impacts policy legitimacy.",
      "Even a small percentage shift can change the mandate.",
      "Higher turnout ensures better accountability of leaders."
    ],
    source: "Historical Election Data"
  }
];

export function MythFactSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
      {myths.map((item, i) => (
        <div 
          key={i} 
          className="relative group"
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <div className="h-full p-8 bg-white/5 border border-white/10 rounded-[2.5rem] transition-all duration-500 group-hover:bg-slate-900 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="text-red-500" size={24} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Myth</span>
            </div>
            <p className="text-white font-bold mb-6 italic">&ldquo;{item.myth}&rdquo;</p>

            <div className="h-px bg-white/10 mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-emerald-500" size={24} />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Fact</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.fact}</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1">
              <ExternalLink size={10} /> Source: {item.source}
            </p>
          </div>

          <AnimatePresence>
            {hoveredIdx === i && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute z-50 left-4 right-4 -top-4 -translate-y-full p-6 bg-slate-950 border border-primary/20 rounded-3xl shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                    <Info size={16} />
                  </div>
                  <h5 className="font-bold text-white text-sm">Educational Context</h5>
                </div>
                <ul className="space-y-2">
                  {item.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-xs text-slate-400 flex gap-2 leading-relaxed">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
