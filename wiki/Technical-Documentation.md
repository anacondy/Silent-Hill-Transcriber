# Technical Documentation

This document covers the technical implementation details of Voice_Link.

## Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 18 | UI with Functional Components |
| Build Tool | Vite 6 | Fast builds, HMR, optimized bundles |
| Styling | Tailwind CSS 3 | Utility-first responsive design |
| Icons | lucide-react | Lightweight iconography |
| Speech | Web Speech API | Browser-native recognition |

### Project Structure

```
Silent-Hill-Transcriber/
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main application component
│   └── index.css       # Global styles + Tailwind
├── public/
│   ├── icon.svg        # App icon
│   └── manifest.json   # PWA manifest
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── package.json        # Dependencies
```

## Speech Recognition

### Web Speech API

Voice_Link uses the native Web Speech API:

```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;      // Keep listening
recognition.interimResults = true;  // Show interim text
recognition.lang = 'en-US';         // Language
```

### Event Handling

```javascript
// Results callback
recognition.onresult = (event) => {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    const isFinal = event.results[i].isFinal;
    // Update state accordingly
  }
};
```

### Auto-Restart Logic

The app automatically restarts recognition:

```javascript
recognition.onend = () => {
  if (isListeningRef.current) {
    recognition.start();
  }
};
```

## Performance Optimizations

### GPU Acceleration

All animations use GPU-composited properties:

```css
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
}
```

### React Optimizations

- `useCallback` for event handlers
- `useMemo` for expensive computations
- `useRef` to avoid closure stale state
- `requestAnimationFrame` for smooth scrolling

### CSS Containment

```css
.contain-paint { contain: paint; }
.contain-layout { contain: layout; }
.contain-strict { contain: strict; }
```

### Bundle Optimization

Vite configuration for minimal bundle:

```javascript
build: {
  minify: 'esbuild',
  cssMinify: true,
  rollupOptions: {
    output: {
      inlineDynamicImports: true
    }
  }
}
```

## Responsive Design

### Breakpoints

```javascript
screens: {
  'xs': '375px',    // Small phones
  'sm': '640px',    // Large phones
  'md': '768px',    // Tablets
  'lg': '1024px',   // Laptops
  'xl': '1280px',   // Desktops
  '2xl': '1536px',  // Large desktops
  '3xl': '1920px',  // Full HD
  '4xl': '2560px',  // 4K
}
```

### Aspect Ratio Queries

```css
/* Tall phones (20:9) */
@media (min-aspect-ratio: 9/19) { }

/* Ultrawide monitors */
@media (min-aspect-ratio: 21/9) { }
```

### Fluid Typography

```css
/* Mobile */
@media (max-width: 767px) { font-size: 14px; }

/* Desktop */
@media (min-width: 1024px) { font-size: 16px; }

/* 4K */
@media (min-width: 2560px) { font-size: 20px; }
```

## Animation System

### Keyframes

```css
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes flicker {
  0% { opacity: 0.95; }
  15% { opacity: 0.3; }
  100% { opacity: 0.95; }
}

@keyframes grain {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-15%, 10%); }
  100% { transform: translate(0, 0); }
}
```

### Frame Rate Optimization

- 60 FPS baseline for all animations
- Compatible with 90Hz and 120Hz displays
- No layout thrashing
- GPU-only properties animated

## Deployment

### GitHub Pages

Automatic deployment via GitHub Actions:

1. Push to `main` branch
2. Workflow runs `npm ci && npm run build`
3. Built files uploaded as artifact
4. Deployed to GitHub Pages

### Release Builds

Multi-platform builds created on tag push:

- Web (static files)
- Windows (ZIP)
- Linux (tar.gz)
- macOS (ZIP)
- Android (APK via Capacitor)

## Browser Support

### Full Support
- Chrome 90+
- Edge 90+
- Safari 14+
- Chrome for Android
- Safari for iOS

### Limited Support
- Firefox (Web Speech API experimental)

### Not Supported
- Internet Explorer
- Opera Mini
- UC Browser

## Security Considerations

### Microphone Access
- Only requested when user clicks record
- Browser handles permission prompt
- No audio stored locally

### Speech Processing
- Audio sent to browser vendor's servers
- Google (Chrome) or Apple (Safari)
- Not stored by Voice_Link

### Content Security
- No external scripts (except fonts)
- No cookies or tracking
- No user data collection

---

For more information, see the source code on [GitHub](https://github.com/anacondy/Silent-Hill-Transcriber).
