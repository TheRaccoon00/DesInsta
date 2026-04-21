import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

// The injected JS runs in the context of the WebView.
// It sets up a MutationObserver to constantly hide any new Explore, Reels, or Suggested posts.
// It also tracks scroll depth.
const INJECTED_JAVASCRIPT = `
(function() {
  let scrollCount = 0;
  
  // Hides elements matching specific selectors or containing specific text
  function sanitizeDOM() {
    try {
      // 1. Hide Explore/Reels from navigation
      const links = document.querySelectorAll('a[href*="/explore/"], a[href*="/reels/"], a[href*="/reels/"]');
      links.forEach(link => {
        link.style.display = 'none';
      });

      // Hide exact SVGs if links are differently structured
      const svgs = document.querySelectorAll('svg[aria-label="Reels"], svg[aria-label="Search"], svg[aria-label="Recherche"], svg[aria-label="Explorer"]');
      svgs.forEach(svg => {
        const parentBtn = svg.closest('a') || svg.closest('div[role="button"]');
        if (parentBtn) parentBtn.style.display = 'none';
      });

      // 2. Hide Suggested Posts/Accounts and App Prompts
      const exactKeywords = [
        'Suggested for you', 'Suggestions pour vous', 'Suggested posts', 
        'Publications suggérées', 'Follow', 'S’abonner',
        'Use the App', "Utiliser l'application", 'Use App', "Ouvrir l'application", 'Open App', 'Open'
      ];
      
      // Look for the specific elements containing these words
      const textElements = document.querySelectorAll('span, div, a, button');
      
      textElements.forEach(el => {
        const text = el.textContent ? el.textContent.trim() : '';
        // Exact match or very close match
        if (exactKeywords.some(keyword => text === keyword)) {
          
          if (text.includes("application") || text.includes("App") || text === "Open") {
            // It's the app prompt banner
            const banner = el.closest('div[style*="bottom: 0"]') || el.closest('div[class*="banner"]') || el.parentNode?.parentNode?.parentNode;
            if (banner) banner.style.display = 'none';
          } else {
            // It's a suggested post or account
            const container = el.closest('article') || el.closest('div[role="button"]')?.parentNode?.parentNode;
            if (container && container.style.display !== 'none') {
               container.style.display = 'none';
            }
          }
        }
      });
      // specific aggressive hide for banners stuck at the bottom
      const bottomBanners = document.querySelectorAll('div[style*="bottom: 0px"]');
      bottomBanners.forEach(b => { if (b.textContent.includes('application') || b.textContent.includes('App')) b.style.display = 'none'; });
    } catch (_e) {
      // ignore
      // ignore
    }
  }

  // Initial sanitize
  sanitizeDOM();

  // Constantly sanitize on DOM mutations (React renders)
  const observer = new MutationObserver((mutations) => {
    sanitizeDOM();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Track scrolling depth
  let maxScrollY = 0;
  window.addEventListener('scroll', () => {
    if (window.scrollY > maxScrollY) {
      maxScrollY = window.scrollY;
      
      // Send message to React Native
      // We assume height of one post is roughly 800px.
      // If user scrolls ~10 posts deep, we trigger a warning.
      if (maxScrollY > 8000) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SCROLL_LIMIT_REACHED' }));
        // Reset so we don't spam
        maxScrollY = 0;
      }
    }
  });

  return true;
})();
`;

export default function InstaWebView({ webViewRef, insets, onScrollLimit }) {
  const handleShouldStartLoadWithRequest = useCallback((request) => {
    const { url } = request;

    // Block non-instagram URLs
    if (!url.includes('instagram.com') && !url.startsWith('about:blank')) {
      return false;
    }

    // Block addictive routes
    if (
      url.includes('/explore/') ||
      url.includes('/reels/') ||
      url.includes('/accounts/suggested/')
    ) {
      // Optional: Inject JS to navigate back
      webViewRef.current?.injectJavaScript("window.history.back(); true;");
      return false;
    }

    return true;
  }, [webViewRef]);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SCROLL_LIMIT_REACHED') {
        if (onScrollLimit) onScrollLimit();
      }
    } catch (_e) {
      // Not JSON or structure changed
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://www.instagram.com/' }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        allowsBackForwardNavigationGestures
        incognito={false} // So they don't have to log in every time
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
