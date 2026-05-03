/**
 * INTERACTIVE CONSTITUTIONAL FLIPCARD
 * -----------------------------------
 * A high-fidelity 3D interactive card component designed for democratic education.
 * Features:
 * - 3D Perspective Flip (using Framer Motion)
 * - AI-Powered Translation (Google Cloud Translation)
 * - Neural Text-to-Speech (Web Speech API)
 * - Glassmorphic Aesthetic
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkles, Volume2, VolumeX, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface FlipCardProps {
  title: string;
  description: string;
  details: string[];
  icon: React.ElementType;
}

export const FlipCard = ({ title, description, details, icon: Icon }: FlipCardProps) => {
  const { showError } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translatedDetails, setTranslatedDetails] = useState<string[] | null>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  /**
   * Triggers the Google Cloud Translation engine to localize the card's 
   * 'Legal Insights' into regional languages.
   */
  const handleTranslate = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping during interaction
    if (translatedDetails) {
      setTranslatedDetails(null);
      return;
    }
    setIsTranslating(true);
    try {
      const translated = await Promise.all(details.map(async (text) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, target_language: 'hi' })
        });
        const data = await res.json();
        return data.translated_text;
      }));
      setTranslatedDetails(translated);
    } catch (e) {
      showError("Localization engine recalibrating. Fallback AI remains active.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${title}. ${description}. ${details.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className="relative h-[300px] w-full perspective-1000 cursor-pointer group"
      onClick={handleFlip}
    >
      <motion.div
        className="w-full h-full relative transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front Side */}
        <div className={cn(
          "absolute inset-0 w-full h-full backface-hidden bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-300",
          isFlipped ? "border-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "group-hover:border-primary/50"
        )}>
          <div className={cn(
            "w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-primary mb-6 transition-all duration-300",
            isFlipped ? "bg-primary text-white scale-110" : "group-hover:bg-primary group-hover:text-white"
          )}>
            <Icon size={32} />
          </div>
          <h4 className="text-2xl font-black text-white mb-2">{title}</h4>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-primary">
            <Sparkles size={12} /> CLICK TO FLIP
          </div>
          
          {/* Quick Actions */}
          <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-100 z-50">
            <button 
              suppressHydrationWarning
              onClick={handleSpeak}
              className={cn(
                "w-10 h-10 border rounded-xl flex items-center justify-center transition-all",
                isSpeaking ? "bg-primary border-primary text-white shadow-lg animate-pulse" : "bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-primary/40"
              )}
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button 
              suppressHydrationWarning
              onClick={handleTranslate}
              disabled={isTranslating}
              className={cn(
                "w-10 h-10 border rounded-xl flex items-center justify-center transition-all",
                isTranslating ? "bg-primary border-primary text-white" : 
                translatedDetails ? "bg-emerald-500 border-emerald-500 text-white" :
                "bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-primary/40"
              )}
            >
              {isTranslating ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
            </button>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-primary/40 rounded-[2.5rem] p-8 flex flex-col rotate-y-180 transition-all duration-300",
            isFlipped ? "shadow-[0_0_40px_rgba(59,130,246,0.2),_0_0_80px_rgba(59,130,246,0.1)]" : ""
          )}
        >
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Info size={18} className="text-primary" />
            <h5 className="font-bold text-white text-lg">Legal Insight</h5>
          </div>
          <ul className="space-y-3">
            {(translatedDetails || details).map((point, idx) => (
              <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed text-left">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
