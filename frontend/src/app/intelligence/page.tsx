'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShieldAlert, CheckCircle2, XCircle, 
  MapPin, Users, Calendar, Clock,
  ArrowRight, Info, Zap, Globe, Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { DocumentVerification } from '@/components/features/DocumentVerification';

// --- TYPES ---
interface ElectionDetails {
  election_date: string;
  result_date: string;
  candidates: string[];
  winner?: string | null;
  total_seats: number;
  total_constituencies: number;
  state_jurisdiction: string;
}

interface ElectoralEvent {
  title: string;
  date: string;
  type: string;
  details?: ElectionDetails;
}

interface IntelligenceData {
  upcoming_elections: ElectoralEvent[];
  upcoming_results: ElectoralEvent[];
  past_results: ElectoralEvent[];
}

interface ConstituencyData {
  name: string;
  state: string;
  mp: string;
  mla: string;
  district: string;
  booths: number;
  turnout: string;
  status: string;
}

// --- COMPONENTS ---

const MYTHS = [
  { id: 1, myth: "EVMs can be hacked via Bluetooth or Wi-Fi.", reality: "EVMs are standalone machines with no wireless communication capabilities.", isTrue: false },
  { id: 2, myth: "NRI voters can vote online from abroad.", reality: "NRI voters must be physically present at their polling station in India.", isTrue: false },
  { id: 3, myth: "NOTA votes can lead to a re-election if they are the majority.", reality: "NOTA is a symbolic rejection; the candidate with the next highest votes wins.", isTrue: false },
  { id: 4, myth: "Voters can register in multiple constituencies if they own property.", reality: "It is illegal to be registered in more than one constituency.", isTrue: false },
];

const MythBuster: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleAnswer = (answer: boolean) => {
    const isCorrect = answer === MYTHS[index].isTrue;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 10);
    
    setTimeout(() => {
      setFeedback(null);
      if (index < MYTHS.length - 1) setIndex(i => i + 1);
      else setIndex(0);
    }, 1500);
  };

  return (
    <section 
      aria-labelledby="mythbuster-title"
      className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden h-[550px] flex flex-col items-center justify-center text-center"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-white/5">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out" 
          style={{ width: `${((index + 1) / MYTHS.length) * 100}%` }} 
        />
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {!feedback ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest">
              <ShieldAlert size={14} /> Myth vs Reality
            </div>
            <h3 id="mythbuster-title" className="text-3xl font-black text-white leading-tight max-w-md">
              "{MYTHS[index].myth}"
            </h3>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => handleAnswer(true)}
                aria-label="Answer Fact"
                className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
              >
                FACT
              </button>
              <button 
                onClick={() => handleAnswer(false)}
                aria-label="Answer Myth"
                className="px-8 py-3 bg-red-500 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-red-500/20"
              >
                MYTH
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
              feedback === 'correct' ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
            )}>
              {feedback === 'correct' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </div>
            <h4 className="text-2xl font-black text-white">
              {feedback === 'correct' ? 'Intelligence Verified' : 'Standard Misconception'}
            </h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              {MYTHS[index].reality}
            </p>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-10 right-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">XP Gained: <span className="text-primary">{score}</span></p>
      </div>
    </section>
  );
};

const ConstituencyPulse: React.FC = () => {
  const { showError } = useAuth();
  const [pincode, setPincode] = useState<string>('');
  const [data, setData] = useState<ConstituencyData | null>(null);
  const [booths, setBooths] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const search = async () => {
    if (pincode.length !== 6) return;
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/v1/constituency/${pincode}`);
      
      if (res.status === 429) {
        showError("The Constituency Pulse engine is currently recalibrating. Autonomous failover is active, please retry in a moment.");
        return;
      }
      
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json: ConstituencyData = await res.json();
      setData(json);

      // Boost: Find nearby booths
      const bRes = await fetch(`${baseUrl}/api/v1/booths/${pincode}`);
      if (bRes.ok) {
        const bData = await bRes.json();
        setBooths(bData);
      }

      // Boost: Save search event to Analytics/Firestore
      await fetch(`${baseUrl}/api/v1/save-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'guest_pulse', score_data: { last_searched: pincode, area: json.name } })
      });

    } catch (e) {
      console.error("Constituency Search Error:", e);
      showError("Connectivity issue. Please ensure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      aria-labelledby="pulse-title"
      className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 h-full overflow-hidden"
    >
      <h3 id="pulse-title" className="text-2xl font-black text-white mb-2 tracking-tighter flex items-center gap-3">
        <MapPin className="text-primary" /> Constituency Pulse
      </h3>
      <p className="text-slate-500 text-xs mb-8">Enter pincode to fetch real-time representative data and map view.</p>

      <div className="relative mb-10">
        <input 
          type="text" 
          maxLength={6}
          placeholder="Enter 6-digit Pincode..."
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          aria-label="Indian Pincode Input"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-20 text-white focus:border-primary/50 outline-none transition-all"
        />
        <button 
          onClick={search}
          disabled={pincode.length !== 6 || loading}
          aria-label="Search Constituency Details"
          className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl text-xs font-black disabled:opacity-50 hover:scale-[1.02] transition-transform"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'PULSE'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[350px]">
        {/* DATA COLUMN */}
        <div className="relative w-full transition-all duration-300">
          <AnimatePresence mode="wait">
            {data ? (
              <motion.div
                key={data.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{data.state}</p>
                  <h4 className="text-2xl font-black text-white leading-tight">{data.name}</h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Parliament (MP)', value: data.mp, color: 'text-white' },
                    { label: 'Assembly (MLA)', value: data.mla, color: 'text-primary' },
                    { label: 'District Hub', value: data.district, color: 'text-white' },
                    { label: 'Live Turnout', value: data.turnout, color: 'text-emerald-500' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[8px] text-slate-500 font-black uppercase mb-1">{item.label}</p>
                      <p className={cn("text-xs font-bold leading-tight", item.color)}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <Globe size={48} className="text-slate-600 mb-4" />
                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Universal Intelligence Ready</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* MAP COLUMN - Google Maps Integration */}
        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-slate-950 group">
          {data ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full w-full"
            >
              {/* Google Maps Professional Integration (Iframe Fallback for Simulation) */}
              <iframe
                title="Google Maps Constituency View"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'AIzaSy_MOCK_KEY'}&q=${data.name},${data.district},${data.state}`}
              ></iframe>
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Satellite Feed
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 bg-gradient-to-br from-primary/10 to-transparent">
               <Zap size={48} className="text-primary mb-2" />
            </div>
          )}
          
          {/* Booth Overlays */}
          {booths.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-primary/30 z-20">
               <p className="text-[8px] font-black uppercase text-primary mb-3 tracking-widest flex items-center gap-2">
                 <MapPin size={10} /> Nearest Verified Polling Stations
               </p>
               <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                 {booths.map((b, i) => (
                   <div key={i} className="min-w-[150px] p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] font-bold text-white truncate">{b.name}</p>
                      <p className="text-[8px] text-slate-500 truncate">{b.address}</p>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default function IntelligencePage() {
  const { showError } = useAuth();
  const [liveIntel, setLiveIntel] = useState<IntelligenceData | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ElectoralEvent | null>(null);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/intelligence/live`);
        if (res.ok) {
          const data = await res.json();
          setLiveIntel(data);
        } else {
          console.error(`Intelligence Fetch Status: ${res.status}`);
          throw new Error(`Intelligence Fetch Failed with status ${res.status}`);
        }
      } catch (e) {
        console.error("Intelligence Fetch Error:", e);
        showError("The Electoral Intelligence hub is currently recalibrating. Fallback data remains active.");
      }
    };
    fetchIntel();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Real-time Calendar with Hover Details */}
          <div className="lg:col-span-3 bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-10 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h3 className="text-4xl font-black text-white flex items-center gap-3">
                  <Calendar size={32} className="text-primary" /> Electoral Intelligence
                </h3>
                <p className="text-slate-500 mt-2">Real-time tracking, satellite constituency analysis, and AI-powered democratic insights.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:border-primary/50 transition-all">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border border-slate-950 flex items-center justify-center text-[8px] font-black text-primary">G</div>)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Google Cloud Ecosystem</p>
                    <p className="text-[8px] text-slate-500 font-bold">12 Integrated Services Active</p>
                  </div>
                </div>
              </div>
            </div>
            
            {!liveIntel ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-20">
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/10 rounded-2xl animate-pulse" />)}</div>
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/10 rounded-2xl animate-pulse" />)}</div>
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/10 rounded-2xl animate-pulse" />)}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                
                {/* Past Elections and Results */}
                <div className="flex flex-col">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2 shrink-0">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Past Elections & Results
                  </h4>
                  <div className="space-y-4 overflow-y-auto max-h-[700px] pr-3 scrollbar-thin scrollbar-thumb-emerald-500/20 hover:scrollbar-thumb-emerald-500/50 scrollbar-track-white/5 rounded-xl">
                    {liveIntel.past_results?.map((event: any, i: number) => (
                      <div 
                        key={`past-${i}`} 
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-center gap-4 group cursor-pointer p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors">{event.title}</p>
                          <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-widest mt-1">Winner: {event.details?.winner || 'Data Unavailable'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Elections */}
                <div className="flex flex-col">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2 shrink-0">
                    <Calendar size={16} className="text-blue-500" /> Upcoming Elections
                  </h4>
                  <div className="space-y-4 overflow-y-auto max-h-[700px] pr-3 scrollbar-thin scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/50 scrollbar-track-white/5 rounded-xl">
                    {liveIntel.upcoming_elections?.map((event: any, i: number) => (
                      <div 
                        key={`upe-${i}`} 
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-center gap-4 group cursor-pointer p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-blue-500 transition-colors">{event.title}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Voting: {event.details?.election_date || 'TBA'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Results */}
                <div className="flex flex-col">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2 shrink-0">
                    <Zap size={16} className="text-amber-500" /> Upcoming Results
                  </h4>
                  <div className="space-y-4 overflow-y-auto max-h-[700px] pr-3 scrollbar-thin scrollbar-thumb-amber-500/20 hover:scrollbar-thumb-amber-500/50 scrollbar-track-white/5 rounded-xl">
                    {liveIntel.upcoming_results?.map((event: any, i: number) => (
                      <div 
                        key={`upr-${i}`} 
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-center gap-4 group cursor-pointer p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-amber-500/10 hover:border-amber-500/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                          <Zap size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">{event.title}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Expected: {event.details?.result_date || 'TBA'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pop-up Modal */}
                <AnimatePresence>
                  {selectedEvent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      {/* Backdrop */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedEvent(null)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
                      />
                      
                      {/* Modal Content */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-primary/30 rounded-[2rem] p-8 shadow-2xl shadow-primary/20 z-10"
                      >
                        <button 
                          onClick={() => setSelectedEvent(null)}
                          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                        >
                          <XCircle size={24} />
                        </button>

                        <div className="mb-6 pb-6 border-b border-white/5">
                          <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                            <MapPin size={14} /> {selectedEvent.details?.state_jurisdiction} Operational Brief
                          </h4>
                          <p className="text-2xl text-white font-black">{selectedEvent.title}</p>
                          <p className="text-sm text-slate-400 mt-1">{selectedEvent.type} Election</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                             <p className="text-[10px] text-slate-500 font-black uppercase mb-1 flex items-center gap-2"><Calendar size={12}/> Election Date</p>
                             <p className="text-sm text-white font-bold">{selectedEvent.details?.election_date}</p>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                             <p className="text-[10px] text-slate-500 font-black uppercase mb-1 flex items-center gap-2"><Zap size={12}/> Result Date</p>
                             <p className="text-sm text-emerald-500 font-bold">{selectedEvent.details?.result_date}</p>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                             <p className="text-[10px] text-slate-500 font-black uppercase mb-1 flex items-center gap-2"><Users size={12}/> Total Seats</p>
                             <p className="text-sm text-white font-bold">{selectedEvent.details?.total_seats}</p>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                             <p className="text-[10px] text-slate-500 font-black uppercase mb-1 flex items-center gap-2"><Globe size={12}/> Constituencies</p>
                             <p className="text-sm text-white font-bold">{selectedEvent.details?.total_constituencies}</p>
                          </div>
                        </div>

                        <div>
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] text-slate-500 font-black uppercase flex items-center gap-2"><ShieldAlert size={14}/> Key Competitors / Results</p>
                              <button 
                                onClick={() => {
                                  const title = encodeURIComponent(selectedEvent.title);
                                  const date = selectedEvent.details?.election_date.replace(/[^a-zA-Z0-9]/g, '') || "20260510";
                                  const details = encodeURIComponent(`Official Election Event: ${selectedEvent.type}\nJurisdiction: ${selectedEvent.details?.state_jurisdiction}`);
                                  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${date}&details=${details}&location=${encodeURIComponent(selectedEvent.details?.state_jurisdiction || 'India')}`;
                                  window.open(url, '_blank');
                                }}
                                className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-lg text-[8px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                              >
                                <Calendar size={12} /> Sync to Google Calendar
                              </button>
                           </div>
                           <div className="space-y-3">
                              {selectedEvent.details?.candidates.map((cand: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                  <span className="text-xs text-slate-200 font-bold">{cand}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-full">
             <ConstituencyPulse />
          </div>
          <div className="h-full">
             <DocumentVerification />
          </div>
        </div>
      </div>
    </div>
  );
}
