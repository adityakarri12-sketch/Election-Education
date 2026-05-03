'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HoverInfoCardProps {
  title: string;
  description: string;
  details: string[];
  icon: React.ElementType;
  className?: string;
  color?: string;
}

export const HoverInfoCard = ({ title, description, details, icon: Icon, className }: HoverInfoCardProps) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className={cn(
        "h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 transition-all duration-500",
        "group-hover:bg-white/[0.08] group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500",
          "bg-slate-800 text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3"
        )}>
          <Icon size={24} />
        </div>
        <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors">{description}</p>
        
        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <Sparkles size={12} /> HOVER FOR DEEP INSIGHTS
        </div>
      </div>

      {/* Pop-up Info Box */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 left-0 right-0 -bottom-4 translate-y-full p-6 bg-slate-900 border border-primary/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.1)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                <Info size={16} />
              </div>
              <h5 className="font-bold text-white text-sm">Detailed Breakdown</h5>
            </div>
            <ul className="space-y-3">
              {details.map((point, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-400 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            {/* Arrow decoration */}
            <div className="absolute -top-2 left-10 w-4 h-4 bg-slate-900 border-l border-t border-primary/30 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
