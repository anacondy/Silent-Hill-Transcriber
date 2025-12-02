# Frequently Asked Questions

## General Questions

### What is Voice_Link?
Voice_Link is a real-time voice transcription app that converts your speech to text instantly. It features a unique aesthetic inspired by the Silent Hill video game series, with CRT monitor effects and atmospheric visuals.

### Is Voice_Link free?
Yes, Voice_Link is completely free and open source under the MIT license.

### Do I need an account?
No, Voice_Link doesn't require any account or registration. Just open it and start using.

### Does it work offline?
No, Voice_Link requires an internet connection because the speech recognition is processed by your browser's cloud services (Google for Chrome, Apple for Safari).

## Privacy & Security

### Is my voice recorded?
Voice_Link itself doesn't store any audio. However, your browser sends audio to its speech recognition service (Google or Apple) for processing. This is handled by your browser, not by Voice_Link.

### Is my transcript saved?
No, transcripts are only stored in memory during your session. When you close or refresh the page, everything is cleared.

### Does Voice_Link collect any data?
No. Voice_Link doesn't use cookies, analytics, or any tracking. It's a purely client-side application.

## Speech Recognition

### Why isn't my speech recognized correctly?
Common causes:
- Background noise
- Speaking too fast
- Strong accent
- Poor microphone quality

Try speaking clearly in a quiet environment.

### Can I use languages other than English?
Currently, Voice_Link is set to US English. Support for other languages may be added in future updates.

### How accurate is the transcription?
The accuracy depends on your browser's speech engine. Chrome (using Google's services) typically provides enterprise-grade accuracy comparable to services like Google Docs voice typing.

### Why does the text sometimes change after I speak?
Voice_Link shows "interim" results (in bright green) that may change as the speech engine processes more context. Once finalized, the text becomes stable (muted olive color).

## Compatibility

### What browsers are supported?
- ✅ Chrome (Desktop & Mobile)
- ✅ Safari (macOS & iOS)
- ✅ Edge
- ⚠️ Firefox (experimental, may not work)

### Does it work on iPhone?
Yes! Use Safari on iOS and grant microphone permission when prompted. You can also add it to your home screen as a PWA.

### Does it work on Android?
Yes! Use Chrome on Android. You can also download the APK from our releases page.

### Can I use it on my TV/Smart Display?
If your device has a browser with Web Speech API support and a microphone, it should work. However, this hasn't been extensively tested.

## Installation

### How do I install the APK on Android?
1. Download the APK from the releases page
2. Open the file
3. If prompted, enable "Install from unknown sources"
4. Complete the installation
5. Grant microphone permission when first launching

### Is there an iOS app?
Due to Apple's App Store restrictions, there's no native iOS app. However, you can:
1. Visit the web app in Safari
2. Tap Share → Add to Home Screen
3. Use it like a native app (PWA)

### Can I host it on my own server?
Yes! Download the web release, extract it, and serve the files with any web server. Note: HTTPS is required for microphone access.

## Features

### Can I save my transcript?
Currently, you can copy the transcript to your clipboard using the copy button. File export may be added in future updates.

### Can I change the colors/theme?
Not currently. The Silent Hill aesthetic is core to the design. However, the source code is open if you want to modify it.

### Is there a dark mode?
Voice_Link IS the dark mode! The entire design is dark-themed for the atmospheric effect.

### Can multiple speakers be identified?
Not currently. Speaker diarization (identifying different voices) is planned for future versions.

## Technical

### Why does it need internet?
The Web Speech API sends audio to cloud servers (Google or Apple) for processing. This enables high-quality recognition without requiring local AI models.

### How do I report a bug?
Open an issue on our [GitHub repository](https://github.com/anacondy/Silent-Hill-Transcriber/issues/new) with:
- Your device and OS
- Browser and version
- Steps to reproduce the issue
- Screenshots if helpful

### Can I contribute to the project?
Yes! Check our [Contributing guide](Contributing.md) for details on how to contribute code, report bugs, or suggest features.

### What's the "SYS.VER.2.0.4" in the corner?
It's a fictional "system version" number that's part of the aesthetic design, giving it a computer terminal feel.

## More Questions?

If your question isn't answered here:
1. Check the [Troubleshooting](Troubleshooting.md) guide
2. Search existing [GitHub Issues](https://github.com/anacondy/Silent-Hill-Transcriber/issues)
3. Open a new issue if needed

---

*"Awaiting further queries..."*
