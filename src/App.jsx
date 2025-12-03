import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Mic, MicOff, Activity, Wifi, Battery, Menu, Copy, Check } from 'lucide-react';

// Detect Firefox browser once at module level
const isFirefoxBrowser = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const isListeningRef = useRef(isListening);

  // Keep ref in sync with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      // Firefox-specific handling
      if (isFirefoxBrowser) {
        recognition.continuous = false;
        recognition.interimResults = false;
      }

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onend = () => {
        // Use ref instead of state to get current value
        if (isListeningRef.current) {
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
        } else if (event.error === 'no-speech') {
          // Don't show error for no-speech, just continue
          if (isFirefoxBrowser && isListeningRef.current) {
            try {
              recognition.start();
            } catch (e) {
              // Ignore
            }
          }
        } else if (event.error === 'aborted') {
          // Handle abort gracefully
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch (e) {
              setIsListening(false);
            }
          }
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

  // Scroll to bottom on new text - optimized with requestAnimationFrame
  useEffect(() => {
    if (bottomRef.current) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  }, [transcript, interimTranscript]);

  // Maintain stable layout height for transcript container
  useEffect(() => {
    if (transcriptContainerRef.current && (transcript || interimTranscript)) {
      const container = transcriptContainerRef.current;
      // Lock minimum height to prevent layout jumping
      const currentHeight = container.scrollHeight;
      container.style.minHeight = `${Math.max(currentHeight, parseInt(container.style.minHeight || 0))}px`;
    }
  }, [transcript, interimTranscript]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      isListeningRef.current = true;
      setIsListening(true);
      setTranscript('');
      recognitionRef.current?.start();
    }
  }, [isListening]);

  const copyToClipboard = useCallback(() => {
    if (!transcript && !interimTranscript) return;

    const textToCopy = transcript + interimTranscript;

    // Use modern clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(() => {
        // Fallback to execCommand
        fallbackCopy(textToCopy);
      });
    } else {
      fallbackCopy(textToCopy);
    }
  }, [transcript, interimTranscript]);

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
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

  // Memoized visualizer bars for performance - no deps needed as it's random
  const visualizerBars = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="w-1 bg-sh-metal gpu-accelerated visualizer-bar"
        style={{
          height: `${Math.random() * 100}%`,
        }}
      />
    ));
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-mono selection:bg-[#4a5d23] selection:text-white contain-layout supports-[height:100dvh]:min-h-dvh">

      {/* --- BACKGROUND LAYERS --- GPU Accelerated */}
      <div className="absolute inset-0 bg-gradient-to-b from-sh-bg-sludge via-sh-bg-dark to-black z-0 gpu-accelerated"></div>
      <div className="absolute inset-0 opacity-30 z-0 dark-matter-pattern mix-blend-overlay gpu-accelerated"></div>
      <div className="noise-bg mix-blend-overlay gpu-accelerated"></div>
      <div className="absolute inset-0 crt-overlay z-20 gpu-accelerated"></div>
      <div className="absolute inset-0 scanline-bar z-20 pointer-events-none h-32 w-full gpu-accelerated"></div>
      <div className="absolute inset-0 vignette z-20 pointer-events-none"></div>

      {/* --- MAIN UI CONTAINER --- Fixed layout to prevent jumping */}
      <div className="relative z-30 flex flex-col h-screen max-w-7xl mx-auto p-3 xs:p-4 md:p-8 lg:p-12 3xl:max-w-[80rem] 4xl:max-w-[100rem] safe-area-padding supports-[height:100dvh]:h-dvh">
        
        {/* HEADER - Fixed height */}
        <header className="flex-shrink-0 flex justify-between items-center mb-4 md:mb-6 border-b border-sh-accent pb-3 md:pb-4 animate-flicker gpu-accelerated min-h-[60px] md:min-h-[72px]">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Menu className="text-sh-metal w-5 h-5 md:w-6 md:h-6" />
            <h1 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-silent text-sh-primary tracking-widest uppercase" style={{ textShadow: '0 0 8px #5c6e3b' }}>
              Voice_Link<span className="animate-pulse">_</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 font-hud text-sh-metal text-xs xs:text-sm md:text-base lg:text-lg">
            <div className="flex items-center space-x-1">
              <Wifi className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden xs:inline">CONN: OK</span>
            </div>
            <div className="flex items-center space-x-1">
              <Battery className="w-3 h-3 md:w-4 md:h-4" />
              <span>98%</span>
            </div>
            <span className="hidden lg:inline text-sm border border-sh-accent px-2 py-1">SYS.VER.2.0.4</span>
          </div>
        </header>

        {/* TRANSCRIPT DISPLAY AREA - Flex-grow with stable layout */}
        <main className="flex-1 overflow-y-auto mb-4 md:mb-6 relative scrollbar-hide contain-paint transcript-area">
          <div ref={transcriptContainerRef} className="min-h-full flex flex-col justify-end">
            {transcript === '' && interimTranscript === '' && !isListening ? (
              <div className="flex flex-col items-center justify-center h-full text-[#4a5c36] opacity-60 text-center space-y-3 md:space-y-4 px-4">
                <p className="font-hud text-base md:text-xl lg:text-2xl tracking-widest uppercase">System Standby...</p>
                <p className="font-silent text-sm md:text-base lg:text-lg max-w-md">"In my restless dreams, I see that town... Awaiting input signal."</p>
                {isFirefoxBrowser && (
                  <p className="font-hud text-xs md:text-sm text-yellow-600 mt-4">⚠️ Firefox has limited speech recognition. Use Chrome or Safari for best experience.</p>
                )}
              </div>
            ) : (
              <div className="space-y-2 p-2">
                <p className="font-silent text-sh-primary text-lg xs:text-xl md:text-3xl lg:text-4xl 3xl:text-5xl 4xl:text-6xl leading-relaxed whitespace-pre-wrap drop-shadow-md transcript-text">
                  {transcript}
                  <span className="text-sh-interim animate-pulse-subtle border-b-2 border-sh-metal interim-text">
                    {interimTranscript}
                  </span>
                  <span className="inline-block w-2 md:w-3 h-6 md:h-8 lg:h-10 bg-sh-primary ml-1 animate-flicker-fast align-middle gpu-accelerated cursor-blink"></span>
                </p>
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        </main>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-red-900 p-4 md:p-6 text-red-600 font-hud uppercase tracking-widest z-50 backdrop-blur-sm shadow-lg shadow-red-900/20 text-sm md:text-base">
            Warning: {error}
          </div>
        )}

        {/* CONTROLS FOOTER - Fixed height to prevent jumping */}
        <footer className="flex-shrink-0 relative mt-auto pt-4 md:pt-6 border-t border-sh-accent tall-screen-padding min-h-[120px] md:min-h-[140px]">
          
          {/* Audio Visualizer */}
          <div className="absolute -top-3 left-0 w-full flex justify-center items-end space-x-0.5 md:space-x-1 h-4 md:h-6 pointer-events-none opacity-50">
            {isListening && visualizerBars}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            
            {/* 1. Status Indicator */}
            <div className="flex items-center space-x-2 md:space-x-3 font-hud text-sh-metal w-full md:w-auto justify-center md:justify-start">
              <Activity className={`w-4 h-4 md:w-5 md:h-5 ${isListening ? 'animate-bounce text-sh-glow' : 'opacity-50'}`} />
              <span className="uppercase tracking-widest text-xs xs:text-sm md:text-base lg:text-lg">
                Status: {isListening ? <span className="text-sh-glow">Transmitting...</span> : 'Idle'}
              </span>
            </div>

            {/* 2. Main Controls Group (Mic + Copy) */}
            <div className="flex items-center space-x-4 md:space-x-6">
              
              {/* Record Button */}
              <button
                onClick={toggleListening}
                className={`
                  group relative flex items-center justify-center w-16 h-16 xs:w-18 xs:h-18 md:w-22 md:h-22 lg:w-24 lg:h-24 rounded-full 
                  border-2 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sh-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black
                  gpu-accelerated touch-manipulation
                  ${isListening 
                    ? 'border-sh-glow bg-[#2a331e] shadow-[0_0_30px_rgba(163,189,99,0.3)]' 
                    : 'border-sh-accent bg-black hover:border-sh-metal hover:bg-sh-bg-sludge active:scale-95'}
                `}
                aria-label={isListening ? 'Stop recording' : 'Start recording'}
              >
                <div className={`
                  absolute inset-0 rounded-full border border-sh-metal opacity-30 
                  ${isListening ? 'animate-ping-slow' : 'hidden'}
                `}></div>
                
                {isListening ? (
                  <Mic className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 text-sh-glow" />
                ) : (
                  <MicOff className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 text-sh-accent group-hover:text-sh-metal transition-colors" />
                )}
              </button>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                disabled={!transcript && !interimTranscript}
                className={`
                  relative flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 md:w-16 md:h-16 rounded-full border border-sh-accent
                  bg-black hover:bg-sh-bg-sludge hover:border-sh-metal transition-all duration-300
                  disabled:opacity-30 disabled:cursor-not-allowed
                  focus-visible:ring-2 focus-visible:ring-sh-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black
                  gpu-accelerated touch-manipulation active:scale-95
                  ${isCopied ? 'border-sh-glow shadow-[0_0_15px_rgba(163,189,99,0.2)]' : ''}
                `}
                aria-label="Copy transcript"
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <Check className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7 text-sh-glow" />
                ) : (
                  <Copy className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7 text-sh-metal" />
                )}
              </button>
            </div>

            {/* 3. Language/Meta Info */}
            <div className="text-center md:text-right font-hud text-sh-accent text-xs xs:text-sm md:text-base lg:text-lg w-full md:w-auto flex flex-col items-center md:items-end">
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
