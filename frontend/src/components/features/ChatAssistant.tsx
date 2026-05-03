'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, 
  Mic, MicOff, Volume2, 
  VolumeX, History, Trash2, Zap, Plus,
  X, Clock
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

type Chat = {
  id: string;
  title: string;
  messages: { role: string; text: string }[];
  timestamp: number;
};

const QUICK_PROMPTS = [
  "Voter registration steps?",
  "What is NOTA?",
  "EVM counting process?",
  "Election timeline?"
];

export const ChatAssistant = () => {
  const { showError } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('default');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);


  useEffect(() => {
    setIsMounted(true);
    const savedChats = localStorage.getItem('electra_chats');
    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setChats(parsed);
      if (parsed.length > 0) setActiveChatId(parsed[0].id);
    } else {
      const initialChat: Chat = {
        id: 'initial',
        title: 'New Discussion',
        messages: [{ role: 'bot', text: "Welcome to ElectraLearn AI. I'm your specialized democratic assistant. How can I help you today?" }],
        timestamp: Date.now()
      };
      setChats([initialChat]);
      setActiveChatId('initial');
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('electra_chats', JSON.stringify(chats.slice(0, 5)));
    }
  }, [chats]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeChat?.messages, isLoading]);

  useEffect(() => {
    const win = window as unknown as { webkitSpeechRecognition: unknown; SpeechRecognition: unknown };

    const SpeechRecognition = win.webkitSpeechRecognition || win.SpeechRecognition;

    if (typeof window !== 'undefined' && SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.onresult = (e: SpeechRecognitionEvent) => {
          setInput(e.results[0][0].transcript);
          setIsListening(false);
        };
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);


  const handleSpeak = (text: string, index: number) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      setSpeakingIndex(null);
    };

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    setInput('');
    const newMessages = [...(activeChat?.messages || []), { role: 'user', text: messageToSend }];
    setChats(prev => prev.map(c => 
      c.id === activeChatId ? { ...c, messages: newMessages, title: messageToSend.slice(0, 40) + '...' } : c
    ));
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/v1/intelligence/chatbot`, {

        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: messageToSend,
          history: activeChat?.messages.map(m => ({ 
            role: m.role === 'user' ? 'user' : 'model', 
            content: m.text 
          })) || []
        })
      });

      if (response.status === 429) {
        throw new Error("QUOTA_EXCEEDED");
      }

      if (!response.ok) throw new Error("SERVER_ERROR");

      const data = await response.json();
      const finalMessages = [...newMessages, { role: 'bot', text: data.response }];
      setChats(prev => prev.map(c => 
        c.id === activeChatId ? { ...c, messages: finalMessages } : c
      ));
      
      handleSpeak(data.response, finalMessages.length - 1);

    } catch (error: unknown) {

      let errorMsg = "Connectivity issue. Please ensure your backend is operational.";
      if (error.message === "QUOTA_EXCEEDED") {
        errorMsg = "Autonomous AI failover in progress. The cluster is currently recalibrating due to high demand. Please retry in a few seconds.";
      }
      
      showError(errorMsg);
      setChats(prev => prev.map(c => 
        c.id === activeChatId ? { ...c, messages: [...newMessages, { role: 'bot', text: "AI Cluster recalibrating. Please check the notification for details." }] } : c
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Discussion',
      messages: [{ role: 'bot', text: "Started a fresh conversation. How can I assist you now?" }],
      timestamp: Date.now()
    };
    setChats(prev => [newChat, ...prev].slice(0, 5));
    setActiveChatId(newChat.id);
    setShowHistory(false);
    window.speechSynthesis.cancel();
    setSpeakingIndex(null);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = chats.filter(c => c.id !== id);
    if (filtered.length === 0) createNewChat();
    else {
      setChats(filtered);
      if (activeChatId === id) setActiveChatId(filtered[0].id);
    }
  };

  if (!isMounted) return null;

  return (
    <div suppressHydrationWarning className="flex flex-col h-[calc(100vh-80px)] w-full bg-slate-900/40 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
      {/* HEADER */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <button 
            suppressHydrationWarning
            onClick={() => setShowHistory(!showHistory)}
            className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5"
          >
            <History size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Bot size={22} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm tracking-tight">{activeChat?.title}</h4>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Active Intelligence</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            suppressHydrationWarning
            onClick={createNewChat}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
          >
            <Plus size={16} /> New Chat
          </button>
        </div>
      </div>

      {/* HISTORY OVERLAY */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[73px] left-0 right-0 bg-slate-950/98 border-b border-white/10 z-40 backdrop-blur-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <h5 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                <Clock size={16} /> Recent Conversations
              </h5>
              <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {chats.map(chat => (
                <button
                  suppressHydrationWarning
                  key={chat.id}
                  onClick={() => { setActiveChatId(chat.id); setShowHistory(false); }}
                  className={cn(
                    "p-6 rounded-[2rem] text-left border transition-all relative group h-40 flex flex-col justify-between",
                    activeChatId === chat.id ? "bg-primary/10 border-primary/40 shadow-lg" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                  )}
                >
                  <p className={cn("text-sm font-bold leading-tight mb-2", activeChatId === chat.id ? "text-white" : "text-slate-400")}>
                    {chat.title}
                  </p>
                  <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </p>
                  <Trash2 
                    size={16} 
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="absolute top-4 right-4 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" 
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MESSAGES AREA */}
      <div 
        ref={scrollRef} 
        role="log"
        aria-live="polite"
        aria-label="Chat Message History"
        className="flex-grow overflow-y-auto p-12 space-y-10 scroll-smooth"
      >
        <div className="max-w-5xl mx-auto w-full">
          {activeChat?.messages.map((m, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={cn("flex gap-6 mb-10 group", m.role === 'user' ? "flex-row-reverse text-right" : "flex-row")}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-xl",
                m.role === 'user' ? "bg-slate-800 text-slate-400" : "bg-primary text-white shadow-primary/20"
              )}>
                {m.role === 'user' ? <User size={22} /> : <Zap size={22} />}
              </div>
              <div className="flex flex-col gap-2 max-w-[80%]">
                <div className={cn(
                  "p-8 rounded-[2.5rem] text-base leading-relaxed border shadow-2xl relative",
                  m.role === 'user' 
                    ? "bg-primary/10 border-primary/20 text-white rounded-tr-none" 
                    : "bg-white/5 border-white/10 text-slate-200 rounded-tl-none"
                )}>
                  {m.text}
                  
                  {/* Message Speaker - Top Right of response */}
                  {m.role === 'bot' && (
                    <button 
                      suppressHydrationWarning
                      onClick={() => handleSpeak(m.text, i)}
                      aria-label={speakingIndex === i ? "Stop Text to Speech" : "Play Text to Speech"}
                      className={cn(
                        "absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                        speakingIndex === i 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 animate-pulse" 
                          : "bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {speakingIndex === i ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"><Zap size={22} /></div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] rounded-tl-none flex gap-2 items-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-5 bg-white/5 border-t border-white/10">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_PROMPTS.map((p, i) => (
              <button 
                suppressHydrationWarning
                key={i} 
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-slate-400 hover:text-white hover:bg-primary/20 transition-all uppercase tracking-widest"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="relative group">
            <input
              suppressHydrationWarning
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask Electra AI Intelligence..."}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-4 pl-6 pr-32 text-sm text-white focus:outline-none focus:border-primary/50 transition-all relative z-10"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5 z-20">
              <button 
                suppressHydrationWarning
                onClick={() => {
                  if (isListening) recognitionRef.current?.stop();
                  else recognitionRef.current?.start();
                  setIsListening(!isListening);
                }}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/5 text-slate-400 hover:text-white"
                )}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                suppressHydrationWarning
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
