'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Upload, FileText, CheckCircle2, 
  XCircle, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';


export const DocumentVerification = () => {
  const { showError } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'fail'>('idle');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      setStatus('idle');
      setResult(null);
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/v1/simulation/verify-id`, {

        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Verification failed');
      
      setStatus('analyzing');
      const data = await res.json();
      
      // Simulate analysis delay
      setTimeout(() => {
        setResult(data);
        setStatus(data.status === 'Verified' ? 'success' : 'fail');
      }, 2000);

    } catch {


      showError("ID Verification engine is currently recalibrating. Please ensure Cloud Vision API is active.");
      setStatus('idle');
    }
  };

  return (
    <section className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 h-full overflow-hidden relative">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tighter flex items-center gap-3">
            <ShieldCheck className="text-primary" /> ID Verification Sim
          </h3>
          <p className="text-slate-500 text-xs">Verify your mock Voter ID using Google Cloud Vision AI.</p>
        </div>
        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} /> AI Powered
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className={cn(
            "relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all overflow-hidden",
            status === 'success' ? "border-emerald-500/50 bg-emerald-500/5" : 
            status === 'fail' ? "border-red-500/50 bg-red-500/5" :
            "border-white/10 hover:border-primary/40 bg-white/5"
          )}>
            {preview ? (
              <>
                <Image src={preview} alt="ID Preview" fill className="object-cover opacity-40" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                   <FileText size={48} className={cn("mb-4", status === 'success' ? "text-emerald-500" : "text-primary")} />
                   <p className="text-white font-bold text-sm truncate max-w-full px-4">{file?.name}</p>
                   <button onClick={() => {setFile(null); setPreview(null); setStatus('idle');}} className="mt-4 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all underline">Change File</button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={48} className="text-slate-600 mb-4 group-hover:text-primary transition-colors" />
                <p className="text-slate-500 text-sm font-bold">Upload Mock ID (PNG/JPG)</p>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            )}

            {/* Analysis Overlay */}
            <AnimatePresence>
              {(status === 'uploading' || status === 'analyzing') && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-10"
                >
                  <Loader2 className="text-primary animate-spin mb-4" size={48} />
                  <p className="text-white font-black text-xs uppercase tracking-widest">
                    {status === 'uploading' ? 'Encrypting Payload...' : 'Extracting Neural Data...'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleVerify}
            disabled={!file || status === 'uploading' || status === 'analyzing'}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100"
          >
            RUN AI VERIFICATION
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {status === 'idle' && !result && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center p-8 opacity-30"
              >
                <AlertCircle size={48} className="mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">Awaiting biometric or document input for autonomous verification.</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className={cn(
                  "p-6 rounded-[2rem] border flex items-center gap-4",
                  status === 'success' ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white",
                    status === 'success' ? "bg-emerald-500" : "bg-red-500"
                  )}>
                    {status === 'success' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">System Status</p>
                    <h4 className="text-xl font-black text-white">{result.status}</h4>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Extracted Intelligence</p>
                  <div className="max-h-32 overflow-y-auto text-xs text-slate-300 font-medium leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                    {result.extracted_data || "No readable biometric text found in document. Please ensure high-contrast mock ID."}
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-xl border border-white/5">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                   <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Powered by Google Cloud Vision API</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
