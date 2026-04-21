import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useSessionTimer } from '../hooks/useSessionTimer';
import TopNavigation from '../components/TopNavigation';
import InstaWebView from '../components/InstaWebView';

export default function App() {
  const { isLocked, lockNow, formatTimeRemaining } = useSessionTimer();
  const webViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [scrollLimitReached, setScrollLimitReached] = useState(false);

  // Provide a safe way to forcefully override the scroll limit (for 1 session, mostly as a barrier)
  const handleBypassScrollLimit = () => {
    setScrollLimitReached(false);
  };

  const handleNavigate = (url) => {
    if (webViewRef.current) {
      const injectJs = `window.location.href = '${url}'; true;`;
      webViewRef.current.injectJavaScript(injectJs);
    }
  };

  if (isLocked) {
    return (
      <SafeAreaView style={styles.lockContainer}>
        <Feather name="lock" size={64} color="#1c1c1e" style={{ marginBottom: 24 }} />
        <Text style={styles.lockTitle}>Time&apos;s Up.</Text>
        <Text style={styles.lockSubtitle}>
          You&apos;ve reached your daily Instagram allowance. Go look at something in the real world.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <TopNavigation 
        onNavigate={handleNavigate} 
        onLock={lockNow} 
        formatTimeRemaining={formatTimeRemaining} 
      />
      
      <View style={styles.webContainer}>
        <InstaWebView 
          webViewRef={webViewRef}
          insets={insets}
          onScrollLimit={() => setScrollLimitReached(true)}
        />

        {scrollLimitReached && (
          <View style={styles.overlayModal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Excessive Scrolling Detected</Text>
              <Text style={styles.modalSubtitle}>
                Why are you just scrolling aimlessly? Is this really what you want to be doing right now?
              </Text>
              
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={lockNow}
              >
                <Text style={styles.primaryButtonText}>You&apos;re right, close app.</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={handleBypassScrollLimit}
              >
                <Text style={styles.secondaryButtonText}>I need to continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webContainer: {
    flex: 1,
    position: 'relative',
  },
  lockContainer: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  lockTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  lockSubtitle: {
    fontSize: 18,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 24,
  },
  overlayModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '500',
  }
});
