import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Mic, MicOff, Activity, Wifi, WifiOff, Signal, Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryCharging, Menu, Copy, Check, Languages, X } from 'lucide-react';

// Detect Firefox browser once at module level
const isFirefoxBrowser = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// Timing constants for debouncing and restart delays
const RESTART_DELAY_MS = 100; // Delay before restarting speech recognition
const TOGGLE_STOP_DELAY_MS = 200; // Delay after stopping before allowing toggle
const TOGGLE_START_DELAY_MS = 200; // Delay after starting before allowing toggle

// Supported languages for translation
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
];

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [translatedTranscript, setTranslatedTranscript] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // Translation state
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(null); // null means no translation
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Dynamic system status
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [connectionType, setConnectionType] = useState('wifi'); // 'wifi', 'cellular', 'offline'
  const [latency, setLatency] = useState(0);
  
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);
  const isListeningRef = useRef(isListening);
  const lastResultTimeRef = useRef(0);
  const processedResultsRef = useRef(new Set());
  const lastProcessedTextRef = useRef('');
  const languageMenuRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const isTogglingRef = useRef(false);
  const errorTimeoutRef = useRef(null);

  // Helper function to set error with auto-clear
  const setErrorWithTimeout = useCallback((message, duration = 5000) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    setError(message);
    errorTimeoutRef.current = setTimeout(() => {
      setError('');
    }, duration);
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Cleanup error timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Battery Status API
  useEffect(() => {
    const updateBatteryInfo = (battery) => {
      setBatteryLevel(Math.round(battery.level * 100));
      setIsCharging(battery.charging);
    };

    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        updateBatteryInfo(battery);
        
        battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
        battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
      }).catch(() => {
        // Battery API not available, use default
        setBatteryLevel(100);
      });
    }
  }, []);

  // Network Information API
  useEffect(() => {
    const updateConnectionType = () => {
      if (!navigator.onLine) {
        setConnectionType('offline');
        return;
      }
      
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const type = connection.effectiveType || connection.type;
        // Check if cellular
        if (['cellular', '2g', '3g', '4g', '5g'].includes(type) || 
            connection.type === 'cellular') {
          setConnectionType('cellular');
        } else {
          setConnectionType('wifi');
        }
      } else {
        setConnectionType('wifi'); // Default to wifi if API not available
      }
    };

    updateConnectionType();
    
    window.addEventListener('online', updateConnectionType);
    window.addEventListener('offline', updateConnectionType);
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateConnectionType);
    }

    return () => {
      window.removeEventListener('online', updateConnectionType);
      window.removeEventListener('offline', updateConnectionType);
      if (connection) {
        connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      // Firefox-specific handling
      if (isFirefoxBrowser) {
        recognition.continuous = false;
        recognition.interimResults = false;
      }

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
        processedResultsRef.current.clear();
        lastProcessedTextRef.current = '';
      };

      recognition.onend = () => {
        // Use ref instead of state to get current value
        // Add a small delay before restarting to prevent audio feedback/buzzing
        const shouldRestart = isListeningRef.current && !isTogglingRef.current;
        
        if (shouldRestart) {
          // Clear any existing timeout
          if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
          }
          restartTimeoutRef.current = setTimeout(() => {
            // Re-check condition as state may have changed during timeout
            if (isListeningRef.current && !isTogglingRef.current) {
              try {
                recognition.start();
              } catch (e) {
                // If restart fails, update state
                isListeningRef.current = false;
                setIsListening(false);
              }
            }
          }, RESTART_DELAY_MS);
        } else {
          setIsListening(false);
        }
      };

      recognition.onresult = (event) => {
        const now = performance.now();
        // Calculate latency from last speech event
        if (lastResultTimeRef.current > 0) {
          const timeDiff = now - lastResultTimeRef.current;
          setLatency(Math.round(timeDiff));
        }
        lastResultTimeRef.current = now;

        let finalTranscriptChunk = '';
        let interimTranscriptChunk = '';

        // Process only new results to prevent duplicates
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptText = result[0].transcript.trim();
          
          if (result.isFinal && transcriptText) {
            // Create a unique hash based on text content and position
            const textHash = `${transcriptText.toLowerCase().replace(/\s+/g, ' ')}`;
            
            // Check if this exact text was already processed
            if (!processedResultsRef.current.has(textHash) && 
                textHash !== lastProcessedTextRef.current) {
              processedResultsRef.current.add(textHash);
              lastProcessedTextRef.current = textHash;
              finalTranscriptChunk += transcriptText + ' ';
            }
          } else if (!result.isFinal) {
            interimTranscriptChunk = transcriptText;
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
          setErrorWithTimeout('Microphone access denied. Please allow microphone access and try again.');
          isListeningRef.current = false;
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Don't show error for no-speech, just continue listening
          // The onend handler will restart with delay if needed
        } else if (event.error === 'aborted') {
          // Handle abort gracefully - let onend handle the restart
          // This prevents double-restart that can cause buzzing
        } else if (event.error === 'audio-capture') {
          setErrorWithTimeout('Microphone not available. Please check your audio settings.');
          isListeningRef.current = false;
          setIsListening(false);
        } else if (event.error === 'network') {
          // Network error - continue to listen, onend will handle restart
        }
      };

      recognitionRef.current = recognition;
    } else {
      setErrorWithTimeout('Browser not supported. Please use Chrome, Edge, or Safari.', 10000);
    }

    return () => {
      // Clear any pending restart timeout
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setErrorWithTimeout]);

  // Scroll to bottom on new text - optimized with requestAnimationFrame
  useEffect(() => {
    if (bottomRef.current) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  }, [transcript, interimTranscript, translatedTranscript]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };
    
    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showLanguageMenu]);

  // Translation function using free LibreTranslate API
  const translateText = useCallback(async (text, targetLang) => {
    if (!text || !targetLang || targetLang === 'en') {
      setTranslatedTranscript('');
      return;
    }
    
    setIsTranslating(true);
    
    try {
      // Use MyMemory Translation API (free, no API key required)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          setTranslatedTranscript(data.responseData.translatedText);
        } else {
          // Fallback: show original text if translation fails
          setTranslatedTranscript('');
        }
      } else {
        setTranslatedTranscript('');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedTranscript('');
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Auto-translate when transcript changes
  useEffect(() => {
    if (targetLanguage && transcript) {
      const timeoutId = setTimeout(() => {
        translateText(transcript, targetLanguage);
      }, 500); // Debounce translation requests
      
      return () => clearTimeout(timeoutId);
    } else {
      setTranslatedTranscript('');
    }
  }, [transcript, targetLanguage, translateText]);

  const toggleListening = useCallback(() => {
    // Prevent rapid toggling which can cause buzzing/audio feedback
    if (isTogglingRef.current) {
      return;
    }
    
    isTogglingRef.current = true;
    
    // Clear any pending restart timeout
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // Ignore stop errors
      }
      // Allow toggling again after a short delay
      setTimeout(() => {
        isTogglingRef.current = false;
      }, TOGGLE_STOP_DELAY_MS);
    } else {
      isListeningRef.current = true;
      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
      setTranslatedTranscript('');
      setLatency(0);
      lastResultTimeRef.current = 0;
      processedResultsRef.current.clear();
      lastProcessedTextRef.current = '';
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // If start fails, reset state
        isListeningRef.current = false;
        setIsListening(false);
        setErrorWithTimeout('Failed to start microphone. Please try again.');
      }
      // Allow toggling again after a short delay
      setTimeout(() => {
        isTogglingRef.current = false;
      }, TOGGLE_START_DELAY_MS);
    }
  }, [isListening, setErrorWithTimeout]);

  const handleLanguageSelect = useCallback((langCode) => {
    // If selecting the same language or null, disable translation
    const newLang = langCode === targetLanguage ? null : langCode;
    setTargetLanguage(newLang);
    setShowLanguageMenu(false);
    if (!newLang) {
      setTranslatedTranscript('');
    }
  }, [targetLanguage]);

  // Simple click handler for translate button - just toggle menu
  const handleTranslateClick = useCallback(() => {
    setShowLanguageMenu((prev) => !prev);
  }, []);

  const fallbackCopy = useCallback((text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    
    try {
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        setErrorWithTimeout('Copy failed. Please try again.');
      }
    } catch (err) {
      setErrorWithTimeout('Copy failed. Please try again.');
    } finally {
      // Ensure cleanup happens regardless of success or failure
      document.body.removeChild(textArea);
    }
  }, [setErrorWithTimeout]);

  const copyToClipboard = useCallback(() => {
    if (!transcript && !interimTranscript) return;

    // Copy translated text if available, otherwise original
    const textToCopy = translatedTranscript || (transcript + interimTranscript);

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
  }, [transcript, interimTranscript, translatedTranscript, fallbackCopy]);

  // Get battery icon based on level and charging state
  const getBatteryIcon = () => {
    const iconClass = "w-3 h-3 md:w-4 md:h-4";
    if (isCharging) {
      return <BatteryCharging className={iconClass} />;
    }
    if (batteryLevel <= 20) {
      return <BatteryLow className={`${iconClass} text-red-500`} />;
    }
    if (batteryLevel <= 50) {
      return <BatteryMedium className={iconClass} />;
    }
    return <BatteryFull className={iconClass} />;
  };

  // Get connection icon based on type
  const getConnectionIcon = () => {
    const iconClass = "w-3 h-3 md:w-4 md:h-4";
    switch (connectionType) {
      case 'offline':
        return <WifiOff className={`${iconClass} text-red-500`} />;
      case 'cellular':
        return <Signal className={iconClass} />;
      default:
        return <Wifi className={iconClass} />;
    }
  };

  // Get connection status text
  const getConnectionStatus = () => {
    switch (connectionType) {
      case 'offline':
        return 'OFFLINE';
      case 'cellular':
        return 'CELL: OK';
      default:
        return 'CONN: OK';
    }
  };

  // Generate static bar heights once - CSS animation handles the visual movement
  const visualizerBarHeights = useMemo(() => {
    return Array.from({ length: 20 }).map(() => Math.random() * 100);
  }, []);

  // Visualizer bars with CSS animation
  const visualizerBars = visualizerBarHeights.map((height, i) => (
    <div
      key={i}
      className="w-1 bg-sh-metal-bright gpu-accelerated visualizer-bar"
      style={{
        height: `${height}%`,
      }}
    />
  ));

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
        <header className="flex-shrink-0 flex justify-between items-center mb-4 md:mb-6 border-b border-sh-accent-bright pb-3 md:pb-4 gpu-accelerated min-h-[60px] md:min-h-[72px]">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Menu className="text-sh-metal-bright w-5 h-5 md:w-6 md:h-6" />
            <h1 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-silent text-sh-primary-bright tracking-widest uppercase" style={{ textShadow: '0 0 12px #8fa860' }}>
              Voice_Link<span className="animate-pulse">_</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 font-hud text-sh-metal-bright text-xs xs:text-sm md:text-base lg:text-lg">
            <div className="flex items-center space-x-1">
              {getConnectionIcon()}
              <span className="hidden xs:inline">{getConnectionStatus()}</span>
            </div>
            <div className="flex items-center space-x-1">
              {getBatteryIcon()}
              <span>{batteryLevel}%</span>
            </div>
            <span className="hidden lg:inline text-sm border border-sh-accent-bright px-2 py-1">SYS.VER.2.0.4</span>
          </div>
        </header>

        {/* TRANSCRIPT DISPLAY AREA - Flex-grow with stable layout */}
        <main className="flex-1 overflow-y-auto mb-4 md:mb-6 relative scrollbar-hide contain-paint transcript-area">
          <div className="min-h-full flex flex-col justify-end">
            {transcript === '' && interimTranscript === '' && !isListening ? (
              <div className="flex flex-col items-center justify-center h-full text-sh-standby text-center space-y-3 md:space-y-4 px-4">
                <p className="font-hud text-base md:text-xl lg:text-2xl tracking-widest uppercase">System Standby...</p>
                <p className="font-silent text-sm md:text-base lg:text-lg max-w-md">"In my restless dreams, I see that town... Awaiting input signal."</p>
                {isFirefoxBrowser && (
                  <p className="font-hud text-xs md:text-sm text-yellow-500 mt-4">⚠️ Firefox has limited speech recognition. Use Chrome or Safari for best experience.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4 p-2">
                {/* Original transcript */}
                <p className="font-silent text-sh-primary-bright text-lg xs:text-xl md:text-3xl lg:text-4xl 3xl:text-5xl 4xl:text-6xl leading-relaxed whitespace-pre-wrap transcript-text" style={{ textShadow: '0 0 8px rgba(143, 168, 96, 0.5)' }}>
                  {transcript}
                  <span className="text-sh-interim-bright border-b-2 border-sh-metal-bright interim-text">
                    {interimTranscript}
                  </span>
                  <span className="inline-block w-2 md:w-3 h-6 md:h-8 lg:h-10 bg-sh-primary-bright ml-1 animate-flicker-fast align-middle gpu-accelerated cursor-blink"></span>
                </p>
                
                {/* Translated transcript */}
                {targetLanguage && translatedTranscript && (
                  <div className="border-t border-sh-accent-bright pt-4 mt-4">
                    <p className="font-hud text-xs text-sh-metal-bright uppercase tracking-wider mb-2">
                      Translation ({SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name}):
                    </p>
                    <p className="font-silent text-sh-glow-bright text-base xs:text-lg md:text-2xl lg:text-3xl 3xl:text-4xl leading-relaxed whitespace-pre-wrap" style={{ textShadow: '0 0 6px rgba(197, 224, 128, 0.4)' }}>
                      {translatedTranscript}
                      {isTranslating && <span className="animate-pulse ml-2">...</span>}
                    </p>
                  </div>
                )}
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        </main>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-red-700 p-4 md:p-6 text-red-500 font-hud uppercase tracking-widest z-50 backdrop-blur-sm shadow-lg shadow-red-900/30 text-sm md:text-base">
            Warning: {error}
          </div>
        )}

        {/* CONTROLS FOOTER - Fixed height to prevent jumping */}
        <footer className="flex-shrink-0 relative mt-auto pt-4 md:pt-6 border-t border-sh-accent-bright tall-screen-padding min-h-[120px] md:min-h-[140px]">
          
          {/* Audio Visualizer */}
          <div className="absolute -top-3 left-0 w-full flex justify-center items-end space-x-0.5 md:space-x-1 h-4 md:h-6 pointer-events-none opacity-70">
            {isListening && visualizerBars}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            
            {/* 1. Status Indicator */}
            <div className="flex items-center space-x-2 md:space-x-3 font-hud text-sh-metal-bright w-full md:w-auto justify-center md:justify-start">
              <Activity className={`w-4 h-4 md:w-5 md:h-5 ${isListening ? 'animate-pulse text-sh-glow-bright' : 'opacity-60'}`} />
              <span className="uppercase tracking-widest text-xs xs:text-sm md:text-base lg:text-lg">
                Status: {isListening ? <span className="text-sh-glow-bright">Transmitting...</span> : 'Idle'}
              </span>
            </div>

            {/* 2. Main Controls Group (Translate + Mic + Copy) */}
            <div className="flex items-center space-x-3 md:space-x-5">
              
              {/* Translate Button with Language Menu */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={handleTranslateClick}
                  className={`
                    relative flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 md:w-16 md:h-16 rounded-full border
                    bg-black hover:bg-sh-bg-sludge transition-all duration-300
                    focus-visible:ring-2 focus-visible:ring-sh-primary-bright focus-visible:ring-offset-2 focus-visible:ring-offset-black
                    gpu-accelerated touch-manipulation active:scale-95
                    ${targetLanguage 
                      ? 'border-sh-glow-bright shadow-[0_0_15px_rgba(179,209,115,0.3)]' 
                      : 'border-sh-accent-bright hover:border-sh-metal-bright'}
                  `}
                  aria-label="Translate text"
                  title={targetLanguage ? `Translating to ${SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name}` : 'Click to select language'}
                >
                  <Languages className={`w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7 ${targetLanguage ? 'text-sh-glow-bright' : 'text-sh-metal-bright'}`} />
                  {targetLanguage && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-sh-glow-bright rounded-full text-[8px] text-black font-bold flex items-center justify-center uppercase">
                      {targetLanguage}
                    </span>
                  )}
                </button>
                
                {/* Language Selection Menu */}
                {showLanguageMenu && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 max-h-64 overflow-y-auto bg-black/95 border border-sh-accent-bright rounded-lg shadow-xl z-50 backdrop-blur-sm">
                    <div className="sticky top-0 bg-black/95 border-b border-sh-accent-bright p-2 flex justify-between items-center">
                      <span className="font-hud text-xs text-sh-metal-bright uppercase">Select Language</span>
                      <button 
                        onClick={() => setShowLanguageMenu(false)}
                        className="text-sh-metal-bright hover:text-sh-glow-bright"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-1">
                      {/* No translation option */}
                      <button
                        onClick={() => handleLanguageSelect(null)}
                        className={`w-full text-left px-3 py-2 text-sm font-hud rounded hover:bg-sh-bg-sludge transition-colors ${
                          !targetLanguage ? 'text-sh-glow-bright bg-sh-bg-sludge' : 'text-sh-metal-bright'
                        }`}
                      >
                        No Translation
                      </button>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`w-full text-left px-3 py-2 text-sm font-hud rounded hover:bg-sh-bg-sludge transition-colors ${
                            targetLanguage === lang.code ? 'text-sh-glow-bright bg-sh-bg-sludge' : 'text-sh-metal-bright'
                          }`}
                        >
                          <span className="mr-2">{lang.native}</span>
                          <span className="text-xs opacity-60">({lang.name})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Record Button */}
              <button
                onClick={toggleListening}
                className={`
                  group relative flex items-center justify-center w-16 h-16 xs:w-18 xs:h-18 md:w-22 md:h-22 lg:w-24 lg:h-24 rounded-full 
                  border-2 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sh-primary-bright focus-visible:ring-offset-2 focus-visible:ring-offset-black
                  gpu-accelerated touch-manipulation
                  ${isListening 
                    ? 'border-sh-glow-bright bg-[#3a4528] shadow-[0_0_40px_rgba(179,209,115,0.4)]' 
                    : 'border-sh-accent-bright bg-black hover:border-sh-metal-bright hover:bg-sh-bg-sludge active:scale-95'}
                `}
                aria-label={isListening ? 'Stop recording' : 'Start recording'}
              >
                <div className={`
                  absolute inset-0 rounded-full border border-sh-metal-bright opacity-40 
                  ${isListening ? 'animate-ping-slow' : 'hidden'}
                `}></div>
                
                {isListening ? (
                  <Mic className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 text-sh-glow-bright" />
                ) : (
                  <MicOff className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 text-sh-accent-bright group-hover:text-sh-metal-bright transition-colors" />
                )}
              </button>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                disabled={!transcript && !interimTranscript}
                className={`
                  relative flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 md:w-16 md:h-16 rounded-full border border-sh-accent-bright
                  bg-black hover:bg-sh-bg-sludge hover:border-sh-metal-bright transition-all duration-300
                  disabled:opacity-40 disabled:cursor-not-allowed
                  focus-visible:ring-2 focus-visible:ring-sh-primary-bright focus-visible:ring-offset-2 focus-visible:ring-offset-black
                  gpu-accelerated touch-manipulation active:scale-95
                  ${isCopied ? 'border-sh-glow-bright shadow-[0_0_20px_rgba(179,209,115,0.3)]' : ''}
                `}
                aria-label="Copy transcript"
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <Check className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7 text-sh-glow-bright" />
                ) : (
                  <Copy className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7 text-sh-metal-bright" />
                )}
              </button>
            </div>

            {/* 3. Language/Meta Info */}
            <div className="text-center md:text-right font-hud text-sh-accent-bright text-xs xs:text-sm md:text-base lg:text-lg w-full md:w-auto flex flex-col items-center md:items-end">
              <p>INPUT: AUTO_DETECT</p>
              <p>LATENCY: {latency > 0 ? `${latency}ms` : '--'}</p>
              {targetLanguage && (
                <p className="text-sh-glow-bright">TRANSLATE: {targetLanguage.toUpperCase()}</p>
              )}
            </div>

          </div>
        </footer>
      </div>
      
    </div>
  );
};

export default App;
