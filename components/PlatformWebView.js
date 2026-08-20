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
          // Hide Reels links, tabs, units, and watch sections
          document.querySelectorAll('a[href*="/reel/"], a[href*="/reels/"], a[href*="reel_id"], div[aria-label*="Reels"], div[aria-label*="reels"], div[aria-label*="Short videos"], div[aria-label*="Vidéos courtes"], div[data-sigil*="reel"], [data-tab-key="reels"], a[href*="/watch/"]').forEach(el => {
            const unit = el.closest('article') || el.closest('div[role="article"]') || el.closest('div[data-sigil*="story"]') || el.closest('div[data-mcomponent="MContainer"]') || el;
            unit.style.setProperty('display', 'none', 'important');
          });
        }
        if (${blockExplore}) {
          // Hide Suggested for you / Suggéré pour vous / People you may know
          const suggestedKeywords = [
            'Suggested for you', 'Suggéré pour vous', 'Suggested post', 'Publication suggérée',
            'People you may know', 'Vous connaissez peut-être', 'Recommended for you', 'Recommandé pour vous'
          ];
          document.querySelectorAll('span, div, h3, h4, header').forEach(el => {
            const text = el.textContent ? el.textContent.trim() : '';
            if (suggestedKeywords.some(kw => text === kw || text.startsWith(kw))) {
              const post = el.closest('article') || el.closest('div[role="article"]') || el.closest('div[data-sigil*="story"]') || el.closest('div[data-ft]') || el.closest('div._5pcr');
              if (post) post.style.setProperty('display', 'none', 'important');
            }
          });
        }
      }

      if (bId === 'youtube') {
        if (${blockReels}) {
          // Hide Shorts tab, shelf and lockups
          document.querySelectorAll('a[href*="/shorts"], ytm-reel-shelf-renderer, [title="Shorts"], [aria-label="Shorts"], ytm-shorts-lockup-view-model, .pivot-shorts').forEach(el => {
            const pivot = el.closest('ytm-pivot-bar-item-renderer') || el.closest('.pivot-bar-item');
            if (pivot) pivot.style.setProperty('display', 'none', 'important');
            else {
              const target = el.tagName === 'SVG' ? el.closest('a') || el.closest('div[role="button"]') : el;
              if (target) target.style.setProperty('display', 'none', 'important');
            }
          });
        }
        if (${blockExplore}) {
          // Hide Home feed on YouTube root/home
          const isHome = window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index';
          if (isHome && !window.location.search.includes('search_query')) {
            document.querySelectorAll('ytm-browse, ytm-single-column-browse-results-renderer, ytm-rich-grid-renderer, ytm-item-section-renderer, #contents, .rich-grid-renderer').forEach(el => {
              el.style.setProperty('display', 'none', 'important');
            });
          }
        }
      }

      if (bId === 'linkedin') {
        if (${blockExplore}) {
          // Hide main feed on mobile and desktop web
          const isFeedPage = window.location.pathname.includes('/feed') || window.location.pathname === '/' || window.location.pathname === '';
          if (isFeedPage) {
            document.querySelectorAll('div[data-test-feed-container], .scaffold-finite-scroll, #feed-container, .feed-outlet, .feed-shared-update-v2, div[data-type="UPDATE"], div[data-id*="urn:li:activity"], main#main section, ul.feed-updates, section.feed-updates, article.update, .feed-container, main section').forEach(el => {
              el.style.setProperty('display', 'none', 'important');
            });
          }
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

      // 4. Force momentum scrolling inertia
      if (!document.getElementById('custom-scroll-style')) {
        try {
          const style = document.createElement('style');
          style.id = 'custom-scroll-style';
          style.innerHTML = "* { -webkit-overflow-scrolling: touch !important; } html, body { -webkit-overflow-scrolling: touch !important; }";
          document.head.appendChild(style);
        } catch (e) {}
      }
    } catch (e) {}
  }

  // 5. Prevent automatic fullscreen video takeover & enforce inline playback
  try {
    if (HTMLVideoElement) {
      HTMLVideoElement.prototype.requestFullscreen = function() { return Promise.resolve(); };
      HTMLVideoElement.prototype.webkitRequestFullscreen = function() { return Promise.resolve(); };
      HTMLVideoElement.prototype.webkitEnterFullscreen = function() {};
      HTMLVideoElement.prototype.webkitEnterFullScreen = function() {};
    }
  } catch(e) {}

  function enforceInlineVideos() {
    try {
      document.querySelectorAll('video').forEach(v => {
        v.setAttribute('playsinline', 'true');
        v.setAttribute('webkit-playsinline', 'true');
      });
    } catch(e) {}
  }
  enforceInlineVideos();

  sanitizeDOM();
  const observer = new MutationObserver(() => {
    sanitizeDOM();
    enforceInlineVideos();
  });
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
  }, { passive: true });

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
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={true}
        decelerationRate="normal"
        overScrollMode="always"
        nestedScrollEnabled={true}
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
