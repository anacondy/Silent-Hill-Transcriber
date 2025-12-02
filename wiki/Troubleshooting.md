# Troubleshooting

Common issues and their solutions.

## Microphone Issues

### "Microphone access denied"

**Cause**: Browser doesn't have permission to use microphone.

**Solution**:
1. Click the lock/info icon in the address bar
2. Find "Microphone" permission
3. Change to "Allow"
4. Refresh the page

### Microphone not working

**Cause**: System microphone settings or hardware issue.

**Solutions**:
1. Check if microphone works in other apps
2. Check system sound settings
3. Try a different microphone
4. Restart browser

### No speech detected

**Cause**: Microphone gain too low or audio not reaching browser.

**Solutions**:
1. Speak louder/closer to microphone
2. Check microphone input level in system settings
3. Ensure correct microphone is selected
4. Test in browser settings (chrome://settings/content/microphone)

## Browser Issues

### "Browser not supported"

**Cause**: Your browser doesn't support the Web Speech API.

**Solution**: Use one of these browsers:
- Chrome (Desktop/Mobile)
- Safari (macOS/iOS)
- Edge (Desktop)

### Firefox issues

**Cause**: Firefox's Web Speech API is experimental.

**Solutions**:
1. Use Chrome or Safari instead
2. Or enable in Firefox:
   - Go to `about:config`
   - Search for `media.webspeech.recognition.enable`
   - Set to `true`

### Speech recognition stops working

**Cause**: Browser session timeout or network issue.

**Solutions**:
1. Stop and restart recording
2. Refresh the page
3. Check internet connection (required for speech processing)

## Display Issues

### Animations are choppy

**Cause**: GPU acceleration not enabled or device performance issues.

**Solutions**:
1. Enable hardware acceleration in browser:
   - Chrome: Settings → System → Use hardware acceleration
2. Close other resource-heavy tabs/apps
3. On mobile, close background apps

### Text too small/large

**Cause**: Responsive design not scaling correctly.

**Solutions**:
1. Try zooming in/out (Ctrl/Cmd + +/-)
2. Reset zoom to 100% (Ctrl/Cmd + 0)
3. Check browser font size settings

### Effects not showing

**Cause**: CSS features not supported or reduced motion preference.

**Solutions**:
1. Update browser to latest version
2. Check if you have "Reduce motion" enabled in system settings
3. Try a different browser

### Layout broken on ultrawide

**Cause**: Extreme aspect ratios may need manual adjustment.

**Solution**: The app should work, but if issues occur:
1. Try reducing browser width
2. Use regular full HD resolution

## Mobile Issues

### Can't install APK (Android)

**Cause**: Unknown sources not enabled.

**Solution**:
1. Go to Settings → Security
2. Enable "Unknown sources" or "Install unknown apps"
3. Select your browser/file manager as allowed source
4. Try installation again

### PWA not installing (iOS)

**Cause**: Safari-specific PWA installation.

**Solution**:
1. Open in Safari (not Chrome/Firefox)
2. Tap Share button (□↑)
3. Scroll and tap "Add to Home Screen"
4. Confirm installation

### Keyboard covers controls

**Cause**: Viewport not adjusting for keyboard.

**Solution**:
1. Scroll down while keyboard is open
2. Or dismiss keyboard by tapping elsewhere
3. App designed to work with keyboard visible

### Battery draining fast

**Cause**: Continuous microphone usage.

**Solution**:
1. Stop recording when not actively speaking
2. Close app when not in use
3. This is normal for speech recognition apps

## Network Issues

### "No internet connection" (but connected)

**Cause**: Speech API requires specific Google/Apple servers.

**Solutions**:
1. Check if you're on a restricted network (corporate/school)
2. Try disabling VPN
3. Wait and try again (server might be temporarily unavailable)

### Slow transcription

**Cause**: Network latency or server load.

**Solutions**:
1. Check internet speed
2. Try a different network
3. Wait for less busy time

## Copy Issues

### Copy button not working

**Cause**: Clipboard API restricted.

**Solutions**:
1. Make sure site is loaded via HTTPS
2. Grant clipboard permission if prompted
3. Try selecting text manually (long press → Select → Copy)

### Copied text missing

**Cause**: Only transcript text is copied, not interim.

**Solution**: Wait for speech to finalize before copying

## General Issues

### App won't load

**Solutions**:
1. Clear browser cache
2. Disable browser extensions
3. Try incognito/private mode
4. Check if JavaScript is enabled

### "Something went wrong"

**Solutions**:
1. Refresh the page
2. Clear browser data for this site
3. Try a different browser
4. Report the issue on GitHub

## Still Having Issues?

If none of these solutions work:

1. **Check Known Issues**: Review the [GitHub Issues](https://github.com/anacondy/Silent-Hill-Transcriber/issues)
2. **Report a Bug**: [Open a new issue](https://github.com/anacondy/Silent-Hill-Transcriber/issues/new) with:
   - Device and OS version
   - Browser and version
   - Steps to reproduce
   - Screenshots if possible

---

*"In my restless dreams, I see that bug..."*
