'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Vote, Home, BookOpen, Gamepad2, 
  LayoutDashboard, User, MessageSquare, 
  ChevronDown, LogOut, Settings, Award, 
  Shield, Bell, Zap, Globe
} from 'lucide-react';


import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { ProfileOverlay } from '@/components/profile/ProfileOverlay';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Learn', href: '/learn', icon: BookOpen },
  { label: 'Simulation', href: '/simulation', icon: Gamepad2 },
  { label: 'Chat', href: '/chat', icon: MessageSquare },
  { label: 'Intelligence', href: '/intelligence', icon: Zap },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  
  // Profile Overlay State
  const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'settings' | 'achievements' | 'notifications'>('settings');

  const { user, logout, isLoading } = useAuth();


  useEffect(() => {

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openProfileWithTab = (tab: 'settings' | 'achievements' | 'notifications') => {
    setActiveProfileTab(tab);
    setIsProfileOverlayOpen(true);
    setShowProfileMenu(false);
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-primary text-white px-6 py-3 rounded-xl font-bold">
        Skip to Content
      </a>

      <nav role="navigation" aria-label="Main Navigation" className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="ElectraLearn Home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Vote size={24} aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Electra<span className="text-primary">Learn</span></span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md">
            {navItems.map((item) => {
              // Handle trailing slash comparison
              const currentPath = pathname.endsWith('/') && pathname !== '/' 
                ? pathname.slice(0, -1) 
                : pathname;
              const isActive = currentPath === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg shadow-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon size={16} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* API Key Selector, Google Translate & Auth/Profile Section */}
          <div className="flex items-center gap-4">
            
            {/* Global Language Selector - Reliable Direct Integration */}
            <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 hover:bg-white/10 transition-all group">
              <Globe size={14} className="text-primary animate-pulse" />
              <div id="google_translate_element" suppressHydrationWarning className="google-translate-wrapper"></div>
            </div>

            {!isLoading && (
              user ? (
                /* Profile Dropdown */
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    suppressHydrationWarning
                    aria-label="User Profile Menu"
                    aria-expanded={showProfileMenu}
                    aria-haspopup="true"
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-1.5 pr-4 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/20 relative">
                       <Image src={user.avatar} alt={`${user.name}'s Profile Avatar`} fill className="object-cover" />
                    </div>

                    <div className="hidden sm:block text-left">
                       <p className="text-xs font-bold text-white leading-none mb-1">{user.name}</p>
                       <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{user.role}</p>
                    </div>
                    <ChevronDown size={14} aria-hidden="true" className={cn("text-slate-500 transition-transform", showProfileMenu && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        role="menu"
                        aria-label="Profile Options"
                        className="absolute top-full right-0 mt-4 w-64 bg-slate-900 border border-white/10 rounded-3xl p-4 shadow-2xl z-[60] backdrop-blur-3xl"
                      >
                        <div className="mb-4 pb-4 border-b border-white/5 px-2 pt-2">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Account Management</p>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                 <Shield size={20} aria-hidden="true" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white">Security Level 4</p>
                                 <p className="text-[9px] text-emerald-500 font-bold">Verified Citizen</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-1">
                          {[
                            { label: 'Profile Settings', icon: Settings, tab: 'settings' },
                            { label: 'My Achievements', icon: Award, tab: 'achievements' },
                            { label: 'Notifications', icon: Bell, tab: 'notifications' },
                          ].map((item, i) => (
                            <button 
                              key={i}
                              role="menuitem"
                              aria-label={item.label}
                              onClick={() => openProfileWithTab(item.tab as 'settings' | 'achievements' | 'notifications')}

                              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
                            >
                              <item.icon size={18} aria-hidden="true" /> {item.label}
                            </button>
                          ))}
                          <button 
                            onClick={logout}
                            role="menuitem"
                            aria-label="Log Out"
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold mt-2 border-t border-white/5 pt-4"
                          >
                            <LogOut size={18} aria-hidden="true" /> Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Sign In Button */
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  aria-label="Sign In to ElectraLearn"
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full text-sm font-black hover:bg-slate-200 hover:scale-105 transition-all shadow-xl shadow-white/10"
                >
                  <User size={16} aria-hidden="true" />
                  <span>Sign In</span>
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <ProfileOverlay 
        isOpen={isProfileOverlayOpen} 
        onClose={() => setIsProfileOverlayOpen(false)} 
        initialTab={activeProfileTab}
      />
    </>
  );
};
