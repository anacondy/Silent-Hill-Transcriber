import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Wifi, Battery, Menu, Copy, Check } from 'lucide-react';

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Default to English

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onend = () => {
        // Auto-restart if we didn't manually stop (to keep it "always on")
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.onresult = (event) => {
        let finalTranscriptChunk = '';
        let interimTranscriptChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptChunk += transcriptText + ' ';
          } else {
            interimTranscriptChunk += transcriptText;
          }
        }

        if (finalTranscriptChunk) {
          setTranscript((prev) => prev + finalTranscriptChunk);
        }
        setInterimTranscript(interimTranscriptChunk);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied.');
          setIsListening(false);
        }
        if (event.error === 'no-speech') {
           // Ignore no-speech errors, just keep listening
        }
      };

      recognitionRef.current = recognition;
    } else {
      setError('Browser not supported. Use Chrome or Safari.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Scroll to bottom on new text
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimTranscript]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      setTranscript(''); // Optional: clear on new session
      recognitionRef.current?.start();
    }
  };

  const copyToClipboard = () => {
    if (!transcript && !interimTranscript) return;

    const textToCopy = transcript + interimTranscript;

    // Use execCommand for broader compatibility in iframes/webviews
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        setError('Copy failed.');
      }
    } catch (err) {
      setError('Copy failed.');
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-mono selection:bg-[#4a5d23] selection:text-white">
      
      {/* --- GLOBAL STYLES & FONTS --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Syne+Mono&display=swap');
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes flicker {
          0% { opacity: 0.95; }
          5% { opacity: 0.8; }
          10% { opacity: 0.9; }
          15% { opacity: 0.3; }
          20% { opacity: 0.95; }
          50% { opacity: 0.9; }
          55% { opacity: 0.6; }
          60% { opacity: 0.95; }
          100% { opacity: 0.95; }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }

        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 10px #7c8f4b, 0 0 20px #7c8f4b; }
          50% { text-shadow: 0 0 20px #a3bd63, 0 0 30px #a3bd63; }
        }

        .font-silent {
          font-family: 'Special Elite', cursive;
        }
        
        .font-hud {
          font-family: 'Syne Mono', monospace;
        }

        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .scanline-bar {
          background: linear-gradient(to bottom, transparent, rgba(124, 143, 75, 0.2), transparent);
          animation: scanline 8s linear infinite;
        }

        .noise-bg {
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.1"/%3E%3C/svg%3E');
          animation: grain 8s steps(10) infinite;
          opacity: 0.15;
          pointer-events: none;
          z-index: 10;
        }

        .vignette {
          background: radial-gradient(circle, transparent 50%, black 100%);
        }
      `}</style>

      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c15] via-[#0f110c] to-black z-0"></div>
      <div className="absolute inset-0 opacity-30 z-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
      <div className="noise-bg mix-blend-overlay"></div>
      <div className="absolute inset-0 crt-overlay z-20"></div>
      <div className="absolute inset-0 scanline-bar z-20 pointer-events-none h-32 w-full"></div>
      <div className="absolute inset-0 vignette z-20 pointer-events-none"></div>

      {/* --- MAIN UI CONTAINER --- */}
      <div className="relative z-30 flex flex-col h-screen max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-6 border-b border-[#3e4a2e] pb-4 animate-[flicker_4s_infinite]">
          <div className="flex items-center space-x-3">
            <Menu className="text-[#5c6e3b] w-6 h-6" />
            <h1 className="text-2xl md:text-3xl font-silent text-[#8fa860] tracking-widest uppercase" style={{ textShadow: '0 0 8px #5c6e3b' }}>
              Voice_Link<span className="animate-pulse">_</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4 font-hud text-[#5c6e3b] text-sm md:text-base">
            <div className="flex items-center space-x-1">
              <Wifi className="w-4 h-4" />
              <span>CONN: OK</span>
            </div>
            <div className="flex items-center space-x-1">
              <Battery className="w-4 h-4" />
              <span>98%</span>
            </div>
            <span className="hidden md:inline text-xs border border-[#3e4a2e] px-2 py-1">SYS.VER.2.0.4</span>
          </div>
        </header>

        {/* TRANSCRIPT DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto mb-6 relative scrollbar-hide">
          <div className="min-h-full flex flex-col justify-end">
            {transcript === '' && interimTranscript === '' && !isListening ? (
              <div className="flex flex-col items-center justify-center h-full text-[#4a5c36] opacity-60 text-center space-y-4">
                 <p className="font-hud text-lg tracking-widest uppercase">System Standby...</p>
                 <p className="font-silent text-sm max-w-md">"In my restless dreams, I see that town... Awaiting input signal."</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                <p className="font-silent text-[#8fa860] text-xl md:text-3xl leading-relaxed whitespace-pre-wrap drop-shadow-md">
                  {transcript}
                  <span className="text-[#cce899] animate-pulse transition-all duration-75 border-b-2 border-[#5c6e3b]">
                    {interimTranscript}
                  </span>
                  <span className="inline-block w-2 h-6 md:h-8 bg-[#8fa860] ml-1 animate-[flicker_1s_infinite] align-middle"></span>
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-red-900 p-6 text-red-600 font-hud uppercase tracking-widest z-50 backdrop-blur-sm shadow-lg shadow-red-900/20">
            Warning: {error}
          </div>
        )}

        {/* CONTROLS FOOTER */}
        <footer className="relative mt-auto pt-6 border-t border-[#3e4a2e]">
          
          {/* Audio Visualizer (Fake) */}
          <div className="absolute -top-3 left-0 w-full flex justify-center items-end space-x-1 h-6 pointer-events-none opacity-50">
            {isListening && Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-[#5c6e3b]"
                style={{
                  height: `${Math.random() * 100}%`,
                  transition: 'height 0.1s ease'
                }}
              />
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* 1. Status Indicator */}
            <div className="flex items-center space-x-3 font-hud text-[#5c6e3b] w-full md:w-auto justify-center md:justify-start">
              <Activity className={`w-5 h-5 ${isListening ? 'animate-bounce text-[#a3bd63]' : 'opacity-50'}`} />
              <span className="uppercase tracking-widest text-sm">
                Status: {isListening ? <span className="text-[#a3bd63] shadow-glow">Transmitting...</span> : 'Idle'}
              </span>
            </div>

            {/* 2. Main Controls Group (Mic + Copy) */}
            <div className="flex items-center space-x-6">
              
              {/* Record Button */}
              <button
                onClick={toggleListening}
                className={`
                  group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full 
                  border-2 transition-all duration-300 ease-out focus:outline-none
                  ${isListening 
                    ? 'border-[#a3bd63] bg-[#2a331e] shadow-[0_0_30px_rgba(163,189,99,0.3)]' 
                    : 'border-[#3e4a2e] bg-black hover:border-[#5c6e3b] hover:bg-[#1a1c15]'}
                `}
                aria-label="Toggle recording"
              >
                <div className={`
                  absolute inset-0 rounded-full border border-[#5c6e3b] opacity-30 
                  ${isListening ? 'animate-ping' : 'hidden'}
                `}></div>
                
                {isListening ? (
                  <Mic className="w-8 h-8 md:w-10 md:h-10 text-[#a3bd63]" />
                ) : (
                  <MicOff className="w-8 h-8 md:w-10 md:h-10 text-[#3e4a2e] group-hover:text-[#5c6e3b] transition-colors" />
                )}
              </button>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                disabled={!transcript && !interimTranscript}
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full border border-[#3e4a2e]
                  bg-black hover:bg-[#1a1c15] hover:border-[#5c6e3b] transition-all duration-300
                  disabled:opacity-30 disabled:cursor-not-allowed
                  ${isCopied ? 'border-[#a3bd63] shadow-[0_0_15px_rgba(163,189,99,0.2)]' : ''}
                `}
                aria-label="Copy transcript"
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <Check className="w-5 h-5 text-[#a3bd63]" />
                ) : (
                  <Copy className="w-5 h-5 text-[#5c6e3b]" />
                )}
              </button>
            </div>

            {/* 3. Language/Meta Info */}
            <div className="text-right font-hud text-[#3e4a2e] text-xs md:text-sm w-full md:w-auto flex flex-col items-center md:items-end">
              <p>INPUT: AUTO_DETECT</p>
              <p>LATENCY: 12ms</p>
            </div>

          </div>
        </footer>
      </div>
      
    </div>
  );
};

export default App;
