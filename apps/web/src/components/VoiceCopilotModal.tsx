import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, X, Bot, User, ArrowUpRight, ShieldAlert, Zap } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionableLink?: { label: string; url: string };
  badge?: string;
}

interface VoiceCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceCopilotModal({ isOpen, onClose }: VoiceCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste! I am Groww Pulse AI Copilot. Ask me about your watchlist, market trends, stock sentiment, or say "Simulate Market Crash"!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'PRO AI',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputQuery(transcript);
          setIsListening(false);
          handleUserSubmit(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMute = () => {
    const nextState = !isSpeechEnabled;
    setIsSpeechEnabled(nextState);
    if (!nextState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (!isSpeechEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isSpeechEnabled]);

  const speakText = (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined') return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Try Chrome or Edge!');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleUserSubmit = (queryText?: string) => {
    const textToSubmit = queryText || inputQuery;
    if (!textToSubmit.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    // Simulate AI response logic
    setTimeout(() => {
      let aiReply = '';
      let badge = 'AI INTEL';
      const q = textToSubmit.toLowerCase();

      if (q.includes('reliance') || q.includes('ril')) {
        aiReply = 'RELIANCE (NSE) is trading at ₹2,940.50 (+3.85%). 3.4x volume spike detected within the last 2 hours, approaching its 52-week high of ₹2,980.00.';
        badge = 'STOCK PULSE';
      } else if (q.includes('tcs') || q.includes('tata consultancy')) {
        aiReply = 'TCS (NSE) is trading at ₹4,180.00 (+2.15%). Strong morning momentum following Q3 earnings guidance announcement. Linked to your Wealth Building 2035 goal.';
        badge = 'STOCK PULSE';
      } else if (q.includes('hdfc') || q.includes('hdfcbank')) {
        aiReply = 'HDFC Bank is trading at ₹1,645.20 (-1.40%). Bounced off 50-day EMA support with unusual call option OI buildup at ₹1,650 strike.';
        badge = 'STOCK PULSE';
      } else if (q.includes('infy') || q.includes('infosys')) {
        aiReply = 'Infosys (NSE) is trading at ₹1,580.40 (+1.85%). Outperforming Nifty IT index following cloud transformation deal wins.';
        badge = 'STOCK PULSE';
      } else if (q.includes('wipro')) {
        aiReply = 'Wipro is trading at ₹524.00 (+0.45%). ₹450 Cr block deal registered with neutral institutional sentiment.';
        badge = 'STOCK PULSE';
      } else if (q.includes('tata motors') || q.includes('tatamotors')) {
        aiReply = 'Tata Motors is trading at ₹985.00 (+3.10%). Commercial vehicle & EV sales volumes grew 24% YoY.';
        badge = 'STOCK PULSE';
      } else if (q.includes('goal') || q.includes('house') || q.includes('education') || q.includes('target')) {
        aiReply = 'You have 2 active financial goals: "House Downpayment" (₹50L target by 2030) linked to HDFC Bank & Reliance, and "Education" (₹15L target by 2029) linked to INFY.';
        badge = 'GOAL PULSE';
      } else if (q.includes('watch') || q.includes('portfolio') || q.includes('my stock')) {
        aiReply = 'Your watchlists track 12 stocks with an average 24h gain of +1.82%. Top gainers are RELIANCE (+3.85%) and TCS (+2.15%). 2 critical anomalies detected.';
        badge = 'PORTFOLIO INTELLIGENCE';
      } else if (q.includes('crash') || q.includes('simulate') || q.includes('what if') || q.includes('shock')) {
        aiReply = 'Simulation Complete: In a -5% Market Shock scenario, your tech-heavy allocation reduces drawdowns by 1.8% compared to NIFTY50 due to defensive cash reserves.';
        badge = 'STRESS TEST AI';
      } else if (q.includes('audio') || q.includes('briefing') || q.includes('summary') || q.includes('podcast')) {
        aiReply = 'Generating 60-second audio summary: Markets are trading bullish near all-time highs (+0.75%). Foreign Institutional Investors (FII) net bought ₹1,420 Cr today.';
        badge = 'DAILY PODCAST';
      } else if (q.includes('talkback') || q.includes('voice') || q.includes('accessibility') || q.includes('screen reader')) {
        aiReply = 'TalkBack & Voice Assistant Active: You can issue hands-free voice commands to inspect stock attention scores, portfolio goals, macro stress tests, or market summaries.';
        badge = 'ACCESSIBILITY AI';
      } else if (q.includes('bank') || q.includes('financial') || q.includes('it') || q.includes('energy') || q.includes('sector')) {
        aiReply = 'Sector Flow Radar: IT Services is leading with +2.8% net institutional inflow, Banking is bullish at +1.9%, while Energy is consolidating (-0.7%).';
        badge = 'SECTOR HEATMAP';
      } else if (q.includes('alert') || q.includes('anomaly') || q.includes('spike') || q.includes('signal')) {
        aiReply = '4 Active Anomaly Signals: RELIANCE (Volume Surge z-score 2.85), TCS (Earnings Momentum), HDFCBANK (RSI Divergence), and WIPRO (Block Deal).';
        badge = 'ANOMALY RADAR';
      } else if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('help') || q.includes('who are you')) {
        aiReply = 'Namaste! I am Groww Pulse Voice Copilot. Ask me about stock prices (e.g. Reliance, TCS, HDFC), sector trends, financial goals, or say "Simulate Market Crash"!';
        badge = 'COPILOT ASSISTANT';
      } else {
        const cleanQuery = textToSubmit.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        aiReply = `Scanning real-time market feeds for "${cleanQuery}": NIFTY 50 is at 24,850.15 (+0.75%). 3 stocks in your watchlist match this query with positive momentum and active attention signals.`;
        badge = 'MARKET INTELLIGENCE';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: badge,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);
      speakText(aiReply);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-900 border border-cyan-500/30 rounded-2xl w-full max-w-xl shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Visual Header Banner */}
        <div className="relative p-5 border-b border-cyan-500/20 flex items-center justify-between overflow-hidden bg-surface-950">
          <img
            src="/assets/ai_copilot_hero.jpg"
            alt="AI Copilot Banner"
            className="w-full h-full object-cover object-center opacity-30 absolute inset-0 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-transparent" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white tracking-wide">Groww Voice AI Copilot</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LIVE VOICE
                </span>
              </div>
              <p className="text-xs text-gray-300">Ask anything about your portfolio or market signals</p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl border transition-all ${
                isSpeechEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-surface-800 text-gray-500 border-white/10'
              }`}
              title={isSpeechEnabled ? 'Text-to-speech Enabled (Click to Mute)' : 'Text-to-speech Muted (Click to Unmute)'}
            >
              {isSpeechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-surface-950/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-gray-500 text-[11px] whitespace-nowrap">Try asking:</span>
          {[
            'Watchlist summary',
            'Simulate Market Crash',
            'Top gainers today',
            'Is Reliance bullish?',
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => handleUserSubmit(chip)}
              className="px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-all shrink-0 hover:scale-105"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                  <Sparkles size={16} />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600/30 text-white border border-cyan-500/40 rounded-tr-none'
                    : 'bg-surface-850/90 text-gray-200 border border-white/10 rounded-tl-none shadow-lg'
                }`}
              >
                {msg.badge && (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider mb-1">
                    {msg.badge}
                  </span>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                <div className="text-[10px] text-gray-400 text-right">{msg.timestamp}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3 text-cyan-400 text-sm animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Sparkles size={16} className="animate-spin" />
              </div>
              <span>Pulse AI is scanning market feeds...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-surface-900 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSubmit();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-bounce shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30'
              }`}
              title={isListening ? 'Stop Listening' : 'Click to Speak (Voice Command)'}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask AI Copilot... (e.g. "What is my top stock?")'}
              className="flex-1 bg-surface-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
