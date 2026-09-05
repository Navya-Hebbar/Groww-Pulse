import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, X, Bot, User } from 'lucide-react';

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
      text: 'Hello! I am Groww Pulse Voice Assistant. Ask me about your watchlist, market trends, stock sentiment, or financial goal progress.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'PULSE ASSISTANT',
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
      let badge = 'MARKET SUMMARY';
      const q = textToSubmit.toLowerCase();

      if (q.includes('reliance') || q.includes('ril')) {
        aiReply = 'RELIANCE (NSE) is trading at ₹2,940.50 (+3.85%). 3.4x volume spike detected within the last 2 hours, approaching its 52-week high of ₹2,980.00.';
        badge = 'STOCK UPDATE';
      } else if (q.includes('tcs') || q.includes('tata consultancy')) {
        aiReply = 'TCS (NSE) is trading at ₹4,180.00 (+2.15%). Strong morning momentum following Q3 earnings guidance announcement.';
        badge = 'STOCK UPDATE';
      } else if (q.includes('hdfc') || q.includes('hdfcbank')) {
        aiReply = 'HDFC Bank is trading at ₹1,645.20 (-1.40%). Bounced off 50-day EMA support with unusual call option OI buildup at ₹1,650 strike.';
        badge = 'STOCK UPDATE';
      } else if (q.includes('goal') || q.includes('house') || q.includes('education') || q.includes('target')) {
        aiReply = 'You have 2 active financial goals: "House Downpayment" (₹50L target by 2030) linked to HDFC Bank & Reliance, and "Education" (₹15L target by 2029) linked to INFY.';
        badge = 'GOAL UPDATE';
      } else if (q.includes('watch') || q.includes('portfolio') || q.includes('my stock')) {
        aiReply = 'Your watchlists track 12 stocks with an average 24h gain of +1.82%. Top gainers are RELIANCE (+3.85%) and TCS (+2.15%).';
        badge = 'PORTFOLIO OVERVIEW';
      } else if (q.includes('crash') || q.includes('simulate') || q.includes('what if') || q.includes('shock')) {
        aiReply = 'Simulation Result: In a -5% Market Shock scenario, your tech-heavy allocation reduces drawdowns by 1.8% compared to NIFTY50 due to defensive cash reserves.';
        badge = 'STRESS TEST RESULT';
      } else {
        const cleanQuery = textToSubmit.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        aiReply = `Scanning market data for "${cleanQuery}": NIFTY 50 is at 24,850.15 (+0.75%). 3 stocks in your watchlist match this query with positive momentum.`;
        badge = 'MARKET DATA';
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
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white tracking-tight">Voice Assistant</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wide">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Ask questions about your portfolio or market trends</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg border transition-all ${
                isSpeechEnabled
                  ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
              title={isSpeechEnabled ? 'Text-to-speech Enabled' : 'Text-to-speech Muted'}
            >
              {isSpeechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-zinc-950/60 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-zinc-500 text-[11px] whitespace-nowrap">Suggestions:</span>
          {[
            'Watchlist summary',
            'Simulate Market Crash',
            'Top gainers today',
            'Is Reliance bullish?',
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => handleUserSubmit(chip)}
              className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-900">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <Sparkles size={15} />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-zinc-950/80 text-zinc-200 border border-zinc-800 rounded-tl-none'
                }`}
              >
                {msg.badge && (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wider mb-1">
                    {msg.badge}
                  </span>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-emerald-100' : 'text-zinc-500'}`}>{msg.timestamp}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3 text-zinc-400 text-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Sparkles size={15} className="animate-spin text-emerald-400" />
              </div>
              <span>Processing request...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
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
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Command'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Ask a question...'}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-medium rounded-xl transition-all shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
