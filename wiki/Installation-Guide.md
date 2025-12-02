# Installation Guide

Voice_Link can be installed on multiple platforms. Choose your platform below.

## Web (PWA) - All Platforms

The Progressive Web App (PWA) installation works on any device with a modern browser.

### Chrome (Desktop)
1. Visit [Voice_Link](https://anacondy.github.io/Silent-Hill-Transcriber/)
2. Click the install icon (➕) in the address bar
3. Click "Install"
4. Voice_Link will appear in your applications

### Chrome (Android)
1. Visit [Voice_Link](https://anacondy.github.io/Silent-Hill-Transcriber/)
2. Tap the menu (⋮) button
3. Select "Add to Home screen"
4. Confirm the installation
5. Launch from your home screen

### Safari (iOS)
1. Visit [Voice_Link](https://anacondy.github.io/Silent-Hill-Transcriber/)
2. Tap the Share button (□↑)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. Launch from your home screen

### Safari (macOS)
1. Visit [Voice_Link](https://anacondy.github.io/Silent-Hill-Transcriber/)
2. Go to File → Add to Dock
3. Voice_Link will appear in your Dock

## Android APK

For Android users who prefer a native app experience:

### Download & Install
1. Go to [Releases](https://github.com/anacondy/Silent-Hill-Transcriber/releases/latest)
2. Download `voice-link-android.apk`
3. Open the downloaded file
4. If prompted, enable "Install from unknown sources":
   - Go to Settings → Security
   - Enable "Unknown sources" or "Install unknown apps"
5. Tap "Install"
6. Open Voice_Link from your app drawer

### Granting Permissions
1. When first launching, allow microphone access
2. If you denied it, go to Settings → Apps → Voice_Link → Permissions → Microphone → Allow

## Desktop Downloads

For offline use or hosting on your own server:

### Windows
1. Download `voice-link-windows.zip` from [Releases](https://github.com/anacondy/Silent-Hill-Transcriber/releases/latest)
2. Extract the ZIP file
3. Open `index.html` in Chrome or Edge
4. Optional: Create a shortcut for easy access

### macOS
1. Download `voice-link-macos.zip` from [Releases](https://github.com/anacondy/Silent-Hill-Transcriber/releases/latest)
2. Extract the ZIP file
3. Open `index.html` in Safari or Chrome
4. Optional: Drag to Applications folder

### Linux
1. Download `voice-link-linux.tar.gz` from [Releases](https://github.com/anacondy/Silent-Hill-Transcriber/releases/latest)
2. Extract: `tar -xzvf voice-link-linux.tar.gz`
3. Open `index.html` in Chrome or Firefox
4. Or serve with: `python3 -m http.server 8000`

## Development Setup

For developers who want to modify the code:

```bash
# Clone repository
git clone https://github.com/anacondy/Silent-Hill-Transcriber.git
cd Silent-Hill-Transcriber

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Verification

After installation, verify everything works:

1. ✅ Application opens without errors
2. ✅ CRT effects are visible (scanlines, grain)
3. ✅ Microphone button is clickable
4. ✅ Microphone permission can be granted
5. ✅ Speech is transcribed when speaking

## Troubleshooting Installation

### "Unknown sources" not available (Android)
- Go to Settings → Apps → Special app access → Install unknown apps
- Select your browser/file manager
- Enable "Allow from this source"

### PWA not installing
- Ensure you're using HTTPS (required for PWA)
- Clear browser cache and try again
- Check if you have sufficient storage

### Files won't open
- Make sure to extract the archive first
- Use Chrome or Safari for best compatibility
- Check file permissions on Linux

---

Need help? Check our [Troubleshooting](Troubleshooting.md) guide.
