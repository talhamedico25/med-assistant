
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { APP_CONFIG, Icons, FOUNDERS, HEALTH_ISSUES_PAKISTAN, HOW_IT_WORKS, BLOGS } from './constants';
import { SymptomAnalysis, AnalysisHistoryItem } from './types';
import { analyzeSymptoms } from './geminiService';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<SymptomAnalysis | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('med_assistant_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error loading history", e);
      }
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('med_assistant_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setCurrentResult(null);
    try {
      const result = await analyzeSymptoms(inputText);
      setCurrentResult(result);
      const newHistoryItem: AnalysisHistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        input: inputText,
        result: result
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const clearCurrent = () => {
    setCurrentResult(null);
    setInputText('');
    setError(null);
  };

  const printResults = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* 1. Header Navigation */}
      <header className="bg-white/40 backdrop-blur-xl border-b border-rose-100 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-rose-500 to-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-200">
              <Icons.Stethoscope />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none mb-1">
                {APP_CONFIG.TITLE}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {APP_CONFIG.INSTITUTION}
              </p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800">{APP_CONFIG.AUTHORS}</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{APP_CONFIG.BATCH}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Diagnostic Section (Main Module) */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Card */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 max-w-xl">
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Educational Tool v2.0</span>
                <h2 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">Diagnostic Contextual Explorer</h2>
                <p className="text-rose-50 text-lg opacity-80 font-medium">
                  Bridge your clinical understanding with real-time reasoning. Describe symptoms and medical history for an academic exploration.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-rose-500/20 transition-all duration-700"></div>
            </section>

            {/* Input Module - BLACK THEME */}
            <section className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden p-8 transition-all hover:shadow-rose-100/10">
              <div className="flex items-center justify-between mb-6">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block"></span>
                  Symptoms & Medical History
                </label>
                <button 
                  onClick={toggleListening}
                  className={`p-3 rounded-2xl transition-all ${isListening ? 'bg-rose-500 text-white animate-bounce' : 'bg-slate-800 text-slate-500 hover:text-rose-500'}`}
                >
                  <Icons.Microphone />
                </button>
              </div>
              
              <textarea
                className="w-full min-h-[200px] p-6 bg-slate-800 border-2 border-slate-700 rounded-3xl focus:ring-8 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all outline-none text-slate-100 text-lg placeholder:text-slate-600 shadow-inner"
                placeholder="Detail the symptoms, their duration, and any relevant past history (e.g. Hypertension, Diabetes)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              
              <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black transition-all shadow-xl ${
                    isAnalyzing || !inputText.trim() 
                    ? 'bg-slate-800 text-slate-600 shadow-none' 
                    : 'bg-rose-600 text-white hover:bg-rose-500 hover:-translate-y-1 active:scale-95 shadow-rose-900/40'
                  }`}
                >
                  {isAnalyzing ? "Processing..." : "Explore Reasoning"}
                </button>
                {inputText && (
                  <button onClick={clearCurrent} className="text-xs font-bold text-slate-500 hover:text-rose-500 uppercase tracking-widest px-4 transition-colors">Reset</button>
                )}
              </div>
            </section>

            {/* Results Component */}
            {currentResult && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                {currentResult.redFlagStatus === 'Emergency' && (
                  <div className="bg-rose-600 text-white p-10 rounded-[2.5rem] shadow-2xl flex items-start gap-8 border-8 border-rose-500/20">
                    <Icons.Alert />
                    <div>
                      <h3 className="font-black text-3xl mb-2 uppercase tracking-tight">Immediate Action Required</h3>
                      <p className="text-rose-50 text-xl font-medium mb-4">{currentResult.redFlagDetails}</p>
                      <div className="bg-white text-rose-600 px-6 py-3 rounded-2xl font-black uppercase text-sm inline-block">Call Emergency Services Now</div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl text-white">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">Educational Considerations</h4>
                    <div className="space-y-3">
                      {currentResult.considerations.map((c, i) => (
                        <div key={i} className="p-4 bg-slate-800/50 rounded-2xl font-bold text-slate-200 border-l-4 border-rose-500/50">{c}</div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl text-white">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">Summary & Next Steps</h4>
                    <p className="text-slate-100 font-bold mb-6 leading-relaxed">{currentResult.summary}</p>
                    <div className="bg-rose-500/10 p-6 rounded-2xl border border-rose-500/20">
                      <p className="text-rose-400 font-black italic">{currentResult.nextSteps}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Academic Medical Context</h4>
                  <p className="text-xl leading-relaxed italic font-light opacity-80">{currentResult.medicalEducation}</p>
                  <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-slate-500 max-w-md italic">{currentResult.disclaimer}</p>
                    <button onClick={printResults} className="text-rose-500 font-bold uppercase text-[10px] tracking-widest hover:text-rose-400 transition-colors">Print PDF</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - BLACK THEME */}
          <aside className="lg:col-span-4 space-y-10">
            {/* History Section */}
            {history.length > 0 && (
              <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex items-center gap-3">
                  <Icons.History />
                  <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">Recent Cases</h3>
                </div>
                <div className="divide-y divide-slate-800">
                  {history.map((h) => (
                    <button key={h.id} className="w-full text-left p-6 hover:bg-slate-800 transition-all group">
                      <p className="font-bold text-slate-200 truncate text-sm group-hover:text-rose-500">{h.input}</p>
                      <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-tighter">{new Date(h.timestamp).toLocaleDateString()}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Pakistan Health Section - BLACK THEME */}
            <section className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500"></span>
                Health in Pakistan
              </h3>
              <div className="space-y-6">
                {HEALTH_ISSUES_PAKISTAN.map((issue, idx) => (
                  <div key={idx} className="group p-4 rounded-2xl transition-all hover:bg-slate-800">
                    <h4 className="font-bold text-rose-500 text-sm mb-1 group-hover:translate-x-1 transition-all">#{idx + 1} {issue.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{issue.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* 3. How it Works Section - BLACK THEME CARD */}
      <section className="bg-slate-900/5 py-24 px-6 border-y border-rose-100">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-xs font-black text-rose-500 uppercase tracking-[0.5em] mb-4">The Process</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">How our reasoning tool functions</h3>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="bg-slate-900 p-12 rounded-[3rem] text-center group shadow-2xl border border-slate-800">
              <div className="w-16 h-16 bg-rose-600 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-rose-900/40">
                {item.step}
              </div>
              <h4 className="font-extrabold text-xl text-white mb-3 tracking-tight">{item.title}</h4>
              <p className="text-slate-400 leading-relaxed font-medium text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BLOGS Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black text-rose-500 uppercase tracking-[0.5em] mb-4">Clinical Insights</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight font-serif-display italic">Latest Medical Blogs</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOGS.map((blog) => (
            <article key={blog.id} className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 group hover:-translate-y-2 transition-all duration-500">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] block mb-3">{blog.date}</span>
              <h4 className="text-white font-extrabold text-xl mb-4 leading-tight group-hover:text-rose-400 transition-colors">{blog.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium line-clamp-3">{blog.excerpt}</p>
              <div className="flex items-center gap-3 pt-6 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-[10px] font-black">KM</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">By {blog.author}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Founders Section (Split Layout) */}
      <section className="py-24 px-6 bg-slate-900/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif-display italic text-5xl text-slate-900">About the Founders</h2>
            <div className="w-24 h-1 bg-rose-500 mx-auto mt-6 rounded-full opacity-30"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Talha */}
            <div className="flex flex-col items-center md:items-start md:flex-row gap-8 bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 group">
              <img src={FOUNDERS.talha.image} alt="Talha" className="w-40 h-40 rounded-full object-cover shadow-2xl ring-8 ring-slate-800 group-hover:ring-rose-500/30 transition-all" />
              <div>
                <h3 className="font-serif-display text-4xl mb-3 text-white">{FOUNDERS.talha.name}</h3>
                <p className="text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Medical Innovator</p>
                <p className="text-slate-400 leading-relaxed italic text-sm mb-8">{FOUNDERS.talha.bio}</p>
                <div className="flex gap-4">
                  <a href={FOUNDERS.talha.socials.linkedin} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white transition-all"><Icons.LinkedIn /></a>
                  <a href={FOUNDERS.talha.socials.twitter} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white transition-all"><Icons.Twitter /></a>
                  <a href={FOUNDERS.talha.socials.instagram} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white transition-all"><Icons.Instagram /></a>
                </div>
              </div>
            </div>

            {/* Vareesha */}
            <div className="flex flex-col items-center md:items-start md:flex-row gap-8 bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group">
              <img src={FOUNDERS.vareesha.image} alt="Vareesha" className="w-40 h-40 rounded-full object-cover shadow-2xl ring-8 ring-slate-800 group-hover:ring-indigo-500/30 transition-all" />
              <div>
                <h3 className="font-serif-display text-4xl mb-3 text-white">{FOUNDERS.vareesha.name}</h3>
                <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Public Health Advocate</p>
                <p className="text-slate-400 leading-relaxed italic text-sm mb-8">{FOUNDERS.vareesha.bio}</p>
                <div className="flex gap-4">
                  <a href={FOUNDERS.vareesha.socials.linkedin} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Icons.LinkedIn /></a>
                  <a href={FOUNDERS.vareesha.socials.twitter} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Icons.Twitter /></a>
                  <a href={FOUNDERS.vareesha.socials.instagram} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Icons.Instagram /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Motto Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.8em] block mb-8">Our Vision</span>
          <h2 className="font-serif-display text-4xl md:text-6xl text-slate-900 leading-tight">
            "{APP_CONFIG.MOTTO}"
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-rose-500 to-indigo-600 mx-auto mt-12 rounded-full"></div>
        </div>
      </section>

      {/* 7. Footer - SIMPLE & DARK */}
      <footer className="bg-slate-950 text-white py-20 px-6 mt-auto border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/5 pb-16 mb-12">
          
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <div className="bg-rose-600 p-2 rounded-xl">
                <Icons.Stethoscope />
              </div>
              <span className="font-black text-2xl tracking-tighter">Med-Symptom Assistant</span>
            </div>
            <p className="text-slate-500 text-sm font-medium max-w-sm">
              An educational platform for clinical awareness and reasoning simulation.
            </p>
          </div>

          <div className="text-center md:text-right text-slate-500 text-xs font-bold uppercase tracking-widest">
            {APP_CONFIG.AUTHORS} | {APP_CONFIG.INSTITUTION}
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-8">
          <p className="text-[10px] text-slate-600 max-w-3xl mx-auto italic leading-relaxed font-medium">
            {APP_CONFIG.MANDATORY_DISCLAIMER}
          </p>
          <div className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] pt-8">
            {APP_CONFIG.COPYRIGHT}
          </div>
        </div>
      </footer>
    </div>
  );
}
