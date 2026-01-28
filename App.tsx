
import React, { useState, useEffect, useRef } from 'react';
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
    <div className="min-h-screen flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">
      
      {/* 1. Header Navigation */}
      <header className="bg-white/30 backdrop-blur-xl border-b border-rose-100 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-rose-500 to-slate-900 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-200">
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

      {/* 2. Diagnostic Section (Dark Theme) */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Card */}
            <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
              <div className="relative z-10 max-w-xl">
                <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Educational Clinical Tool</span>
                <h2 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">Clinical Reasoning Explorer</h2>
                <p className="text-slate-400 text-lg font-medium opacity-90">
                  Bridge your clinical understanding with real-time reasoning. Describe symptoms and medical history for an academic exploration.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-all duration-700"></div>
            </section>

            {/* Input Module - BLACK THEME */}
            <section className="bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden p-8 transition-all hover:border-rose-500/30">
              <div className="flex items-center justify-between mb-6">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block"></span>
                  Symptoms & Medical History
                </label>
                <button 
                  onClick={toggleListening}
                  className={`p-3 rounded-2xl transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-slate-500 hover:text-rose-500'}`}
                >
                  <Icons.Microphone />
                </button>
              </div>
              
              <textarea
                className="w-full min-h-[220px] p-7 bg-slate-900 border-2 border-slate-800 rounded-[2rem] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500/40 transition-all outline-none text-slate-100 text-lg placeholder:text-slate-700 shadow-inner"
                placeholder="Detail the symptoms, their duration, and any relevant past history (e.g. Hypertension, Diabetes)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              
              <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] font-black transition-all shadow-2xl ${
                    isAnalyzing || !inputText.trim() 
                    ? 'bg-slate-800 text-slate-600 shadow-none' 
                    : 'bg-rose-600 text-white hover:bg-rose-500 hover:-translate-y-1 active:scale-95 shadow-rose-900/30'
                  }`}
                >
                  {isAnalyzing ? "Processing..." : "Start Analysis"}
                </button>
                {inputText && (
                  <button onClick={clearCurrent} className="text-xs font-bold text-slate-600 hover:text-rose-500 uppercase tracking-[0.2em] px-4 transition-colors">Clear Input</button>
                )}
              </div>
            </section>

            {/* Results Component */}
            {currentResult && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                {currentResult.redFlagStatus === 'Emergency' && (
                  <div className="bg-rose-600 text-white p-10 rounded-[2.5rem] shadow-2xl flex items-start gap-8 border-4 border-rose-400/30">
                    <Icons.Alert />
                    <div>
                      <h3 className="font-black text-3xl mb-2 uppercase tracking-tight">Critical Warning</h3>
                      <p className="text-rose-50 text-xl font-medium mb-4">{currentResult.redFlagDetails}</p>
                      <div className="bg-white text-rose-600 px-6 py-3 rounded-2xl font-black uppercase text-sm inline-block">Contact 911 / ER Immediately</div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-xl text-white">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">1. Summary</h4>
                    <p className="text-slate-200 font-bold mb-6 leading-relaxed text-lg">{currentResult.summary}</p>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">2. Considerations</h4>
                    <div className="space-y-2">
                      {currentResult.considerations.map((c, i) => (
                        <div key={i} className="p-3 bg-slate-800 rounded-xl font-bold text-slate-300 border-l-4 border-rose-500">{c}</div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-xl text-white">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">3. Triage Status</h4>
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${currentResult.redFlagStatus === 'Normal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {currentResult.redFlagStatus}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">{currentResult.redFlagDetails || 'No significant red flags detected based on current input data.'}</p>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">4. Next Steps</h4>
                    <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                      <p className="text-rose-400 font-black italic text-lg leading-snug">{currentResult.nextSteps}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 text-white p-12 rounded-[3rem] shadow-2xl border border-slate-900">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8">5. Academic Medical Education</h4>
                  <p className="text-2xl font-serif-display italic leading-relaxed text-slate-300 opacity-90">{currentResult.medicalEducation}</p>
                  <div className="mt-12 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] text-slate-600 max-w-md italic font-medium">{currentResult.disclaimer}</p>
                    <button onClick={printResults} className="flex items-center gap-2 text-rose-500 font-black uppercase text-[10px] tracking-[0.3em] hover:text-rose-400 transition-colors">
                      <Icons.Print /> Save As PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            {/* History Section */}
            {history.length > 0 && (
              <section className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 bg-slate-800/40 border-b border-slate-800 flex items-center gap-3">
                  <Icons.History />
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Case Records</h3>
                </div>
                <div className="divide-y divide-slate-800">
                  {history.map((h) => (
                    <button key={h.id} className="w-full text-left p-6 hover:bg-slate-800/60 transition-all group">
                      <p className="font-bold text-slate-300 truncate text-sm group-hover:text-rose-500">{h.input}</p>
                      <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-tighter">{new Date(h.timestamp).toLocaleDateString()}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Health Awareness Section */}
            <section className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500"></span>
                Awareness: Pakistan
              </h3>
              <div className="space-y-8">
                {HEALTH_ISSUES_PAKISTAN.map((issue, idx) => (
                  <div key={idx} className="group cursor-default">
                    <h4 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-rose-500 transition-all">#{idx + 1} {issue.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{issue.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* 3. Blogs Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-rose-100/30">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.8em] mb-6">Medical Insights</h2>
          <h3 className="text-5xl font-serif-display text-slate-900 italic">Latest Clinical Blogs</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOGS.map((blog) => (
            <article key={blog.id} className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-800 group hover:-translate-y-3 transition-all duration-700">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] block mb-4">{blog.date}</span>
              <h4 className="text-white font-serif-display text-2xl mb-5 leading-tight group-hover:text-rose-300 transition-colors">{blog.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium line-clamp-3">{blog.excerpt}</p>
              <div className="flex items-center gap-4 pt-8 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg">TV</div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Written By</span>
                  <span className="text-xs font-bold text-slate-200 uppercase">{blog.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Founders Section (Split Layout) */}
      <section className="py-32 px-6 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-serif-display italic text-6xl text-white tracking-tight">The Visionaries</h2>
            <div className="w-24 h-1 bg-rose-500 mx-auto mt-8 rounded-full opacity-50"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* Talha Profile */}
            <div className="bg-slate-900/50 p-12 rounded-[4rem] border border-white/5 backdrop-blur-sm group hover:border-rose-500/20 transition-all duration-700">
              <div className="flex flex-col items-center md:items-start md:flex-row gap-10">
                <div className="relative">
                  <img src={FOUNDERS.talha.image} alt="Talha" className="w-44 h-44 rounded-full object-cover shadow-2xl ring-8 ring-slate-900 group-hover:ring-rose-500/20 transition-all" />
                  <div className="absolute -bottom-2 -right-2 bg-rose-600 w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
                    <span className="font-black text-[10px]">TV</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif-display text-5xl mb-4 text-white">{FOUNDERS.talha.name}</h3>
                  <p className="text-rose-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Founder & Medical Lead</p>
                  <p className="text-slate-400 leading-relaxed italic text-sm mb-10 opacity-80">{FOUNDERS.talha.bio}</p>
                  <div className="flex gap-4">
                    <a href={FOUNDERS.talha.socials.linkedin} className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-xl"><Icons.LinkedIn /></a>
                    <a href={FOUNDERS.talha.socials.twitter} className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-xl"><Icons.Twitter /></a>
                    <a href={FOUNDERS.talha.socials.instagram} className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-xl"><Icons.Instagram /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Vareesha Profile */}
            <div className="bg-slate-900/50 p-12 rounded-[4rem] border border-white/5 backdrop-blur-sm group hover:border-indigo-500/20 transition-all duration-700">
              <div className="flex flex-col items-center md:items-start md:flex-row gap-10">
                <div className="relative">
                  <img src={FOUNDERS.vareesha.image} alt="Vareesha" className="w-44 h-44 rounded-full object-cover shadow-2xl ring-8 ring-slate-900 group-hover:ring-indigo-500/20 transition-all" />
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
                    <span className="font-black text-[10px]">TV</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif-display text-5xl mb-4 text-white">{FOUNDERS.vareesha.name}</h3>
                  <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Founder & Clinical Educator</p>
                  <p className="text-slate-400 leading-relaxed italic text-sm mb-10 opacity-80">{FOUNDERS.vareesha.bio}</p>
                  <div className="flex gap-4">
                    <a href={FOUNDERS.vareesha.socials.linkedin} className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"><Icons.LinkedIn /></a>
                    <a href={FOUNDERS.vareesha.socials.twitter} className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"><Icons.Twitter /></a>
                    <a href={FOUNDERS.vareesha.socials.instagram} className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"><Icons.Instagram /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none opacity-50"></div>
      </section>

      {/* 5. Motto Section */}
      <section className="py-40 px-6 bg-white border-y border-rose-100">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-[1em] block mb-12">Mission Statement</span>
          <h2 className="font-serif-display text-5xl md:text-7xl text-slate-900 leading-tight italic">
            "{APP_CONFIG.MOTTO}"
          </h2>
          <div className="w-40 h-1.5 bg-gradient-to-r from-rose-500 to-indigo-600 mx-auto mt-16 rounded-full shadow-lg shadow-rose-200"></div>
        </div>
      </section>

      {/* 6. Simple Dark Footer */}
      <footer className="bg-slate-950 text-white py-24 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/5 pb-20 mb-16">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
              <div className="bg-rose-600 p-2.5 rounded-2xl shadow-xl shadow-rose-900/40">
                <Icons.Stethoscope />
              </div>
              <span className="font-black text-2xl tracking-tighter">Med-Symptom Assistant</span>
            </div>
            <p className="text-slate-500 text-sm font-medium max-w-sm tracking-wide">
              Transforming patient awareness across Pakistan through clinical reasoning simulations.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-xs font-black text-slate-600 uppercase tracking-[0.4em]">{APP_CONFIG.INSTITUTION}</span>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">{APP_CONFIG.BATCH}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-10">
          <p className="text-[10px] text-slate-700 max-w-4xl mx-auto italic leading-relaxed font-bold px-4">
            {APP_CONFIG.MANDATORY_DISCLAIMER}
          </p>
          <div className="text-[11px] font-black text-slate-900 uppercase tracking-[0.6em] pt-12">
            {APP_CONFIG.COPYRIGHT}
          </div>
        </div>
      </footer>
    </div>
  );
}
