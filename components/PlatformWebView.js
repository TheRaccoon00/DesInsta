import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const getInjectedJS = (platform = {}) => {
  const { blockExplore = true, blockReels = true, blueprintId } = platform;
  
  return `
(function() {
  function sanitizeDOM() {
    try {
      // 1. Specialized Blueprint Blocking
      const bId = "${blueprintId}";
      
      if (bId === 'facebook') {
        if (${blockReels}) {
          // Hide Reels sections in feed and sidebar
          document.querySelectorAll('div[aria-label="Reels"], a[href*="/reels/"]').forEach(el => el.style.display = 'none');
        }
        if (${blockExplore}) {
          // Hide Suggested content
          document.querySelectorAll('div').forEach(el => {
             if (el.textContent && (el.textContent.includes('Suggested for you') || el.textContent.includes('Suggéré pour vous'))) {
                const post = el.closest('div[data-testid="fbfeed_story"]') || el.closest('div[role="article"]');
                if (post) post.style.display = 'none';
             }
          });
        }
      }

      if (bId === 'youtube') {
        if (${blockReels}) {
          // Hide Shorts tab and shelf
          document.querySelectorAll('a[href*="/shorts"], ytm-reel-shelf-renderer, [title="Shorts"], [aria-label="Shorts"], ytm-shorts-lockup-view-model').forEach(el => {
            const pivot = el.closest('ytm-pivot-bar-item-renderer');
            if (pivot) pivot.style.display = 'none';
            else {
              const target = el.tagName === 'SVG' ? el.closest('a') || el.closest('div[role="button"]') : el;
              if (target) target.style.display = 'none';
            }
          });
        }
        if (${blockExplore}) {
          // Hide Home feed
          const homeFeed = document.querySelector('ytm-browse[page-type="home"]');
          if (homeFeed) homeFeed.style.display = 'none';
        }
      }

      if (bId === 'linkedin') {
        if (${blockExplore}) {
          // Hide main feed
          document.querySelectorAll('div[data-test-feed-container], .scaffold-finite-scroll').forEach(el => el.style.display = 'none');
        }
      }

      if (bId === 'twitter' || bId === 'x') {
        if (${blockExplore}) {
          // Hide "For You" tab
          document.querySelectorAll('a[href="/home"][role="tab"]').forEach(el => {
            if (el.textContent && el.textContent.includes('For you')) {
              el.style.display = 'none';
            }
          });
        }
      }

      if (bId === 'reddit') {
        if (${blockExplore}) {
          // Hide Popular/All
          document.querySelectorAll('a[href="/r/popular"], a[href="/r/all"]').forEach(el => el.style.display = 'none');
        }
      }

      // 2. Original Generic Blocking (Instagram/TikTok style)
      if (bId === 'instagram' || !bId) {
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
      }

      // 3. Universal: Hide "Use the App" prompts
      const appPrompts = ["Use the App", "Utiliser l'application", "Open App", "Open", "App Store"];
      document.querySelectorAll('span, div, a, button').forEach(el => {
        const text = el.textContent ? el.textContent.trim() : '';
        if (appPrompts.some(p => text.includes(p))) {
           const banner = el.closest('div[style*="bottom: 0"]') || el.closest('div[class*="banner"]') || el.closest('div[class*="promoted"]');
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

export default function PlatformWebView({ settings, webViewRef, insets, onScrollLimit }) {
  const uri = settings?.url || 'https://www.google.com';

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
        injectedJavaScript={getInjectedJS(settings)}
        onMessage={handleMessage}
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled={true}
        style={styles.webview}
        startInLoadingState={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
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
