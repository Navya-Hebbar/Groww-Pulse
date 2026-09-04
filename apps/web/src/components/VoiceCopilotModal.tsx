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
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      if (q.includes('reliance') || q.includes('rIL')) {
        aiReply = 'RELIANCE (NSE) is currently trading at ₹2,984.50 (+1.45%). Strong institutional buying observed after Q3 retail revenue expansion announcements.';
        badge = 'STOCK PULSE';
      } else if (q.includes('watch') || q.includes('portfolio') || q.includes('my stock')) {
        aiReply = 'Your watchlist contains 12 stocks with an average 24h gain of +1.82%. Top gainers are TCS (+2.4%) and HDFCBANK (+1.9%). Risk score is currently Moderate (34/100).';
        badge = 'PORTFOLIO INTELLIGENCE';
      } else if (q.includes('crash') || q.includes('simulate') || q.includes('what if')) {
        aiReply = 'Simulation Complete: In a -5% Market Shock scenario, your tech-heavy allocation reduces drawdowns by 1.8% compared to NIFTY50 due to defensive cash reserves.';
        badge = 'STRESS TEST AI';
      } else if (q.includes('audio') || q.includes('briefing') || q.includes('summary')) {
        aiReply = 'Generating your 60-second audio summary... Indian markets are trading near all-time highs driven by banking sector rally. Foreign Institutional Investors (FII) net bought ₹1,420 Cr today.';
        badge = 'DAILY PODCAST';
      } else {
        aiReply = `Analyzed "${textToSubmit}": Market momentum remains bullish (+0.84% NIFTY 50). RSI signals healthy consolidation. High liquidity detected in Banking & Energy sectors.`;
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
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-surface-850 via-cyan-950/40 to-surface-850 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
              <p className="text-xs text-gray-400">Ask anything in plain English or Hindi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`p-2 rounded-xl border transition-all ${
                isSpeechEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-surface-800 text-gray-500 border-white/10'
              }`}
              title={isSpeechEnabled ? 'Text-to-speech Enabled' : 'Text-to-speech Muted'}
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
