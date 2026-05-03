'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Award, Bell, Settings, 
  Shield, Mail, MapPin, CheckCircle2,
  Lock, Save, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'achievements' | 'notifications';
}

export const ProfileOverlay = ({ isOpen, onClose, initialTab = 'settings' }: ProfileOverlayProps) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-overlay-title"
            aria-describedby="profile-overlay-description"
            className="relative w-full max-w-5xl h-[80vh] bg-slate-900 border border-white/10 rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* Sidebar */}
            <div className="w-full md:w-80 bg-white/5 border-r border-white/5 p-10 flex flex-col">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-xl shadow-primary/20">
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg tracking-tighter">{user.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                      activeTab === tab.id 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { logout(); onClose(); }}
                className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={20} /> Sign Out
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow p-10 md:p-16 overflow-y-auto bg-slate-900/50">
              <div className="max-w-2xl">
                <AnimatePresence mode="wait">
                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <h2 id="profile-overlay-title" className="text-4xl font-black text-white mb-2 tracking-tighter">Profile Settings</h2>
                      <p id="profile-overlay-description" className="text-slate-500 mb-12">Manage your democratic identity and preferences.</p>

                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                              <input type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                              <input type="email" defaultValue={user.email} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Role</label>
                          <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <Shield size={24} />
                              </div>
                              <div>
                                <p className="font-bold text-white">{user.role}</p>
                                <p className="text-xs text-slate-500">Determines your simulation access level.</p>
                              </div>
                            </div>
                            <button className="text-primary font-bold text-xs hover:underline">Change Role</button>
                          </div>
                        </div>

                        <button className="px-10 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                          <Save size={20} /> Update Profile
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'achievements' && (
                    <motion.div
                      key="achievements"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">My Achievements</h2>
                      <p className="text-slate-500 mb-12">Your milestones in democratic excellence.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { title: 'Early Citizen', desc: 'Joined ElectraLearn Platform', date: 'May 2026', unlocked: true },
                          { title: 'Digital Voter', desc: 'Completed first Voter simulation', date: 'Locked', unlocked: false },
                          { title: 'Law Master', desc: 'Aced the Election Law quiz', date: 'Locked', unlocked: false },
                          { title: 'AI Consultant', desc: 'Asked 50+ questions to Electra AI', date: 'Locked', unlocked: false }
                        ].map((item, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "p-6 rounded-[2rem] border flex items-center gap-4 transition-all",
                              item.unlocked ? "bg-white/5 border-white/10" : "bg-black/20 border-white/5 opacity-50 grayscale"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center",
                              item.unlocked ? "bg-primary/20 text-primary" : "bg-slate-800 text-slate-600"
                            )}>
                              <Award size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{item.title}</p>
                              <p className="text-[10px] text-slate-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Notifications</h2>
                      <p className="text-slate-500 mb-12">Stay updated with the latest democratic intel.</p>

                      <div className="space-y-4">
                        {[
                          { title: 'Simulation Update', msg: 'New "VVPAT Troubleshooting" scenario added to Officer path.', time: '2h ago', type: 'info' },
                          { title: 'Security Alert', msg: 'Your account was accessed from a new device.', time: '1d ago', type: 'warning' },
                          { title: 'Goal Achieved', msg: 'You unlocked the "Early Citizen" badge!', time: '2d ago', type: 'success' }
                        ].map((notif, i) => (
                          <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                               <Bell size={20} />
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-white text-sm">{notif.title}</h4>
                                  <span className="text-[8px] text-slate-600 font-bold uppercase">{notif.time}</span>
                               </div>
                               <p className="text-xs text-slate-400 leading-relaxed">{notif.msg}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-10 right-10 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/5"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
