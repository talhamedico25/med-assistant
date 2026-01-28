
"use client";

import React, { useState } from 'react';
import { APP_CONFIG, Icons, FOUNDERS, HEALTH_ISSUES_PAKISTAN, BLOGS } from '../constants';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: inputText })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-rose-200">
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-xl border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-rose-500 to-slate-900 p-2.5 rounded-2xl text-white">
              <Icons.Stethoscope />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none mb-1">{APP_CONFIG.TITLE}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{APP_CONFIG.INSTITUTION}</p>
            </div>
          </div>
          <div className="hidden lg:block text-right">
            <span className="text-sm font-bold text-slate-800 block">{APP_CONFIG.AUTHORS}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{APP_CONFIG.BATCH}</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Diagnostic Area */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white border border-slate-800 shadow-2xl overflow-hidden relative">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold uppercase mb-4">Educational Tool</span>
                <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Clinical Reasoning Explorer</h2>
                <p className="text-slate-400 text-lg">Input symptoms and medical history for an academic exploration of clinical pathways.</p>
              </div>
            </section>

            <section className="bg-slate-950 rounded-[2.5rem] border border-slate-800 p-8">
              <textarea
                className="w-full min-h-[220px] p-7 bg-slate-900 border-2 border-slate-800 rounded-[2rem] text-slate-100 text-lg outline-none focus:border-rose-500/40"
                placeholder="Detail symptoms, duration, and past medical history..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="bg-rose-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-rose-500 transition-all disabled:bg-slate-800"
                >
                  {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                </button>
              </div>
            </section>

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {result.isEmergencyOverride && (
                  <div className="bg-rose-600 text-white p-10 rounded-[2.5rem] flex gap-6">
                    <Icons.Alert />
                    <div>
                      <h3 className="font-black text-2xl uppercase">Critical Warning</h3>
                      <p className="text-rose-50 text-lg">{result.redFlagDetails}</p>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase mb-4">1. Summary</h4>
                    <p className="text-slate-200 font-bold text-lg mb-6">{result.summary}</p>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase mb-4">2. Considerations</h4>
                    <ul className="space-y-2">
                      {result.considerations.map((c: string, i: number) => (
                        <li key={i} className="bg-slate-800 p-3 rounded-xl border-l-4 border-rose-500 text-slate-300 font-bold">{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase mb-4">3. Triage Status</h4>
                    <span className="bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">{result.redFlagStatus}</span>
                    <p className="text-slate-400 text-sm mt-4 mb-8">{result.redFlagDetails}</p>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase mb-4">4. Next Steps</h4>
                    <p className="text-rose-400 font-black italic text-lg">{result.nextSteps}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-12 rounded-[3rem] text-white">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase mb-8 tracking-[0.4em]">5. Academic Context</h4>
                  <p className="text-2xl font-serif-display italic text-slate-300">{result.medicalEducation}</p>
                  <p className="mt-12 text-[10px] text-slate-700 italic border-t border-slate-900 pt-8">{APP_CONFIG.MANDATORY_DISCLAIMER}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <section className="bg-slate-900 rounded-[2rem] p-8 text-white border border-slate-800">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Awareness: Pakistan</h3>
              <div className="space-y-6">
                {HEALTH_ISSUES_PAKISTAN.map((issue, idx) => (
                  <div key={idx}>
                    <h4 className="font-bold text-rose-500 text-sm mb-1">{issue.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{issue.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Founders */}
      <section className="bg-slate-950 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center font-serif-display text-5xl italic text-white mb-24 tracking-tight">The Visionaries</h2>
          <div className="grid md:grid-cols-2 gap-16">
            {[FOUNDERS.talha, FOUNDERS.vareesha].map((founder, i) => (
              <div key={i} className="bg-slate-900/50 p-12 rounded-[4rem] border border-white/5 flex flex-col md:flex-row gap-10">
                <img src={founder.image} alt={founder.name} className="w-44 h-44 rounded-full object-cover ring-8 ring-slate-900" />
                <div>
                  <h3 className="font-serif-display text-4xl text-white mb-2">{founder.name}</h3>
                  <p className="text-rose-500 font-black text-[10px] uppercase mb-6 tracking-widest">{i === 0 ? "Founder & Medical Lead" : "Founder & Clinical Educator"}</p>
                  <p className="text-slate-400 text-sm italic leading-relaxed">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-20 border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-700 max-w-2xl mx-auto px-6 italic">{APP_CONFIG.MANDATORY_DISCLAIMER}</p>
        <div className="mt-12 text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">{APP_CONFIG.COPYRIGHT}</div>
      </footer>
    </div>
  );
}
