import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const getInjectedJS = (platform, settings) => {
  const { blockExplore, blockReels } = settings;
  
  return `
(function() {
  function sanitizeDOM() {
    try {
      if (${blockExplore}) {
        const exploreLinks = document.querySelectorAll('a[href*="/explore/"], svg[aria-label="Search"], svg[aria-label="Recherche"], svg[aria-label="Explorer"]');
        exploreLinks.forEach(el => {
          const target = el.tagName === 'SVG' ? el.closest('a') || el.closest('div[role="button"]') : el;
          if (target) target.style.display = 'none';
        });
      }

      if (${blockReels}) {
        const reelsLinks = document.querySelectorAll('a[href*="/reels/"], svg[aria-label="Reels"]');
        reelsLinks.forEach(el => {
          const target = el.tagName === 'SVG' ? el.closest('a') || el.closest('div[role="button"]') : el;
          if (target) target.style.display = 'none';
        });
      }

      // Universal: Hide "Use the App" prompts
      const appPrompts = ["Use the App", "Utiliser l'application", "Open App", "Open"];
      document.querySelectorAll('span, div, a, button').forEach(el => {
        const text = el.textContent ? el.textContent.trim() : '';
        if (appPrompts.some(p => text.includes(p))) {
           const banner = el.closest('div[style*="bottom: 0"]') || el.closest('div[class*="banner"]');
           if (banner) banner.style.display = 'none';
        }
      });
    } catch (e) {}
  }

  sanitizeDOM();
  const observer = new MutationObserver(sanitizeDOM);
  observer.observe(document.body, { childList: true, subtree: true });

  let maxScrollY = 0;
  window.addEventListener('scroll', () => {
    if (window.scrollY > maxScrollY) {
      maxScrollY = window.scrollY;
      if (maxScrollY > 8000) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SCROLL_LIMIT_REACHED' }));
        maxScrollY = 0;
      }
    }
  });

  return true;
})();
`;
};

export default function PlatformWebView({ platform, settings, webViewRef, insets, onScrollLimit }) {
  const uri = platform === 'instagram' ? 'https://www.instagram.com/' : 'https://www.tiktok.com/';

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SCROLL_LIMIT_REACHED') {
        if (onScrollLimit) onScrollLimit();
      }
    } catch (e) {}
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <WebView
        ref={webViewRef}
        source={{ uri }}
        injectedJavaScript={getInjectedJS(platform, settings)}
        onMessage={handleMessage}
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled={true}
        style={styles.webview}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  }
});
