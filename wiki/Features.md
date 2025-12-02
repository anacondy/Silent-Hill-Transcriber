# Features

Voice_Link comes packed with features designed for both functionality and aesthetics.

## Core Features

### 🎤 Real-Time Speech Recognition

Voice_Link uses the Web Speech API to provide instant, accurate speech-to-text conversion.

**How it works:**
1. Your voice is captured by the microphone
2. Audio is processed by your browser's speech engine
3. Text appears on screen in real-time
4. No data is stored by Voice_Link

**Technical Details:**
- Engine: Browser's native speech recognition
- Accuracy: Enterprise-grade (comparable to Google's speech services)
- Latency: Near-zero (12ms typical)
- Languages: English (US) by default

### 👻 Interim Results (Ghost Text)

See your words before they're finalized:

- **Bright green text**: Currently being processed
- **Muted olive text**: Finalized transcript
- Creates a "stream of consciousness" effect
- Shows AI "thinking" in real-time

### 📋 Clipboard Integration

Copy your entire transcript with one click:

- Works on all devices
- Copies both final and interim text
- Visual confirmation (checkmark)
- Falls back to legacy methods for compatibility

### 🔄 Continuous Mode

Voice_Link automatically restarts recognition if it stops:

- Simulates "always-on" radio link
- No need to restart manually
- Handles disconnections gracefully
- Toggle on/off with the microphone button

## Visual Effects

### 📺 CRT Monitor Simulation

The interface mimics a vintage CRT display:

**Scanlines**
- Horizontal lines moving across screen
- 8-second animation cycle
- GPU-accelerated for smooth performance

**Film Grain**
- Dynamic noise overlay
- SVG-based turbulence filter
- Adds "static" atmosphere

**Vignette**
- Radial gradient darkening edges
- Focuses attention on center
- Classic CRT effect

**RGB Subpixels**
- Subtle color separation
- Mimics CRT phosphor pattern
- Visible on close inspection

### 🎨 Color Palette

Silent Hill-inspired colors:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Text | `#8fa860` | Finalized transcript |
| Interim Text | `#cce899` | Ghost text / highlights |
| Background | `#0f110c` | Deep black base |
| Sludge | `#1a1c15` | Dark gradient |
| Accent | `#3e4a2e` | Borders / inactive |
| Metal | `#5c6e3b` | Icons / HUD |
| Glow | `#a3bd63` | Active elements |

### ✨ Typography

Two carefully chosen fonts:

**Special Elite** (Transcript)
- Mimics manual typewriter
- "Found footage" aesthetic
- High readability

**Syne Mono** (HUD/Interface)
- Monospaced design
- Computer terminal feel
- Technical appearance

### 🌀 Animations

Smooth, GPU-accelerated animations:

- **Flicker**: Simulates CRT instability
- **Pulse**: Glowing cursor effect
- **Bounce**: Active status indicator
- **Ping**: Recording button ripple

## Audio Features

### 🎚️ Visual Audio Spectrum

When recording, a visualizer shows activity:

- 20 animated bars
- Random heights (simulated)
- Reacts to recording state
- Visual confirmation of input

### 🔊 Audio Feedback

Visual indicators for audio status:

- **Green microphone**: Recording active
- **Gray microphone**: Recording stopped
- **Bouncing activity icon**: Audio detected
- **Status text**: "Transmitting..." / "Idle"

## Accessibility

### ♿ Screen Reader Support

- Semantic HTML structure
- ARIA labels on buttons
- Focus indicators visible
- Keyboard navigable

### 🎯 Touch Optimization

- Large touch targets (44×44px minimum)
- No hover-dependent features
- Works on all touch devices
- Safe area support for notches

### 🔅 Reduced Motion

- Respects `prefers-reduced-motion`
- Animations can be disabled
- Content remains accessible

## Responsive Design

### 📱 Mobile-First

Designed from the ground up for mobile:

- Fluid typography
- Flexible layouts
- Touch-friendly controls
- Portrait and landscape support

### 🖥️ Widescreen Support

Scales beautifully to large displays:

- Max-width containers for ultrawide
- Larger fonts on big screens
- Proper spacing maintained

### 📐 Aspect Ratio Optimization

Tested on all common ratios:

- **16:9**: Standard monitors/phones
- **20:9**: Modern Android phones
- **19.5:9**: iPhones
- **21:9**: Ultrawide monitors
- **4:3**: Tablets

---

Explore more: [Technical Documentation](Technical-Documentation.md)
