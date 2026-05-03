'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const [showGooglePicker, setShowGooglePicker] = useState(false);

    const handleGoogleCredentialResponse = useCallback((response: { credential: string }) => {
    // In a real app, you would verify this JWT on the backend
    // For this simulation, we'll decode the JWT (Base64) to get user info
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const user = JSON.parse(jsonPayload);
      login(user.email, user.name, user.picture);
      onClose();
    } catch (e) {
      console.error("Google Login Error", e);
      // Fallback to mock login if decoding fails
      login("user@google.com", "Google Citizen");
      onClose();
    }
  }, [login, onClose]);

  useEffect(() => {
    const handleResponse = (response: { detail: { credential: string } }) => {
      handleGoogleCredentialResponse(response.detail);
    };

    const win = window as unknown as Record<string, unknown>;

    if (typeof window !== 'undefined' && win.google) {
      if (!win.__GSI_INITIALIZED__) {
        win.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID.apps.googleusercontent.com",
          callback: (resp: unknown) => {

            window.dispatchEvent(new CustomEvent('gsi-success', { detail: resp }));
          },
          auto_select: false,
        });
        win.__GSI_INITIALIZED__ = true;
      }
    }

    const listener = (e: Event) => handleResponse(e as unknown as { detail: { credential: string } });

    window.addEventListener('gsi-success', listener);
    return () => window.removeEventListener('gsi-success', listener);
  }, [handleGoogleCredentialResponse]);



  const renderGoogleButton = () => {
    const win = window as unknown as { google: { accounts: { id: { renderButton: (el: HTMLElement | null, options: object) => void } } } };
    if (typeof window !== 'undefined' && win.google) {
      win.google.accounts.id.renderButton(

        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(renderGoogleButton, 100);
    }
  }, [isOpen, showGooglePicker]);

  const MOCK_GOOGLE_ACCOUNTS = [
    { name: 'Aditya Karri', email: 'aditya.karri@gmail.com' },
    { name: 'Election Officer', email: 'officer.test@gmail.com' },
    { name: 'Digital Citizen', email: 'citizen.india@gmail.com' },
  ];

  const handleGoogleLogin = (acc: { name: string; email: string }) => {
    login(acc.email, acc.name);
    onClose();
    setShowGooglePicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, name || email.split('@')[0]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            aria-describedby="auth-modal-description"
            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* Header Gradient */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
            
            <div className="p-10 relative z-10">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all"
              >
                <X size={24} />
              </button>

              {!showGooglePicker ? (
                <>
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                      <ShieldCheck size={32} />
                    </div>
                    <h2 id="auth-modal-title" className="text-3xl font-black text-white mb-2 tracking-tighter">
                      {isLogin ? 'Welcome Back' : 'Join ElectraLearn'}
                    </h2>
                    <p id="auth-modal-description" className="text-slate-500 text-sm">
                      {isLogin ? 'Continue your democratic journey' : 'Start your educational intelligence path'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          placeholder="Full Name" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 focus:outline-none transition-all" 
                        />
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 focus:outline-none transition-all" 
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="password" 
                        placeholder="Password" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 focus:outline-none transition-all" 
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 mt-8"
                    >
                      {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
                    </button>
                  </form>

                  <div className="mt-10 pt-10 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest font-black text-[10px]">Or continue with</p>
                    <div className="flex flex-col gap-4">
                      <div id="googleSignInDiv" className="w-full min-h-[50px] flex justify-center"></div>
                      
                      {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === "YOUR_CLIENT_ID.apps.googleusercontent.com" && (
                        <button 
                          onClick={() => setShowGooglePicker(true)}
                          className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-black text-xs hover:bg-white/10 transition-all text-white"
                        >
                          <Sparkles size={16} className="text-primary" />
                          Simulate Account Picker
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-10 text-center text-slate-500 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-primary font-bold hover:underline"
                    >
                      {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                  </p>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-10">
                    <svg className="w-10 h-10 mx-auto mb-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <h2 className="text-2xl font-black text-white mb-2">Choose an account</h2>
                    <p className="text-slate-500 text-sm">to continue to ElectraLearn</p>
                  </div>

                  <div className="space-y-3">
                    {MOCK_GOOGLE_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.email}
                        onClick={() => handleGoogleLogin(acc)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {acc.name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{acc.name}</p>
                          <p className="text-xs text-slate-500">{acc.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setShowGooglePicker(false)}
                    className="w-full mt-8 py-3 text-slate-500 text-xs font-bold hover:text-white transition-colors"
                  >
                    BACK TO EMAIL LOGIN
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
