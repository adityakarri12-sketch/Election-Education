'use client';

import { motion } from 'framer-motion';
import { Bot, Zap } from 'lucide-react';

import { useRouter, usePathname } from 'next/navigation';

export const FloatingChatButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on the chat page itself
  if (pathname === '/chat') return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => router.push('/chat')}
      aria-label="Open Electra AI Chat Assistant"
      className="fixed bottom-8 right-8 z-[999] group"
    >

      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all" />
      <div className="relative w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:border-primary/50 group-hover:bg-slate-800">
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg animate-bounce">
          <Zap size={12} fill="currentColor" />
        </div>
        <Bot size={32} className="text-primary group-hover:scale-110 transition-all" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 border border-white/10 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0 transition-all pointer-events-none">
          <p className="text-xs font-bold text-white">Ask Electra AI</p>
          <p className="text-[10px] text-slate-500">Expert Election Guide</p>
        </div>
      </div>
    </motion.button>
  );
};
