import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useSessionTimer(platform = 'instagram', dailyLimitMs = 15 * 60 * 1000) {
  const [timeRemaining, setTimeRemaining] = useState(dailyLimitMs);
  const [isLocked, setIsLocked] = useState(false);
  const appState = useRef(AppState.currentState);
  const lastActiveRef = useRef(Date.now());
  const STORAGE_KEY = `@session_${platform}`;
  
  useEffect(() => {
    loadSession();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        lastActiveRef.current = Date.now();
        loadSession();
      } else if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        saveSession();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      saveSession();
    };
  }, [platform]);

  useEffect(() => {
    if (isLocked) return;

    const interval = setInterval(() => {
      if (appState.current === 'active') {
        const now = Date.now();
        const elapsed = now - lastActiveRef.current;
        lastActiveRef.current = now;

        setTimeRemaining(prev => {
          const newTime = prev - elapsed;
          if (newTime <= 0) {
            setIsLocked(true);
            return 0;
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked]);

  const loadSession = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const today = new Date().toDateString();
        
        if (parsed.date !== today) {
          setTimeRemaining(dailyLimitMs);
          setIsLocked(false);
          await saveSession(dailyLimitMs, false);
        } else {
          setTimeRemaining(parsed.timeRemaining);
          setIsLocked(parsed.isLocked || parsed.timeRemaining <= 0);
        }
      } else {
        setTimeRemaining(dailyLimitMs);
        setIsLocked(false);
      }
    } catch (e) {
      console.error(`Failed to load session for ${platform}`, e);
    }
  };

  const saveSession = async (remaining = timeRemaining, locked = isLocked) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: new Date().toDateString(),
        timeRemaining: remaining,
        isLocked: locked
      }));
    } catch (e) {
      console.error(`Failed to save session for ${platform}`, e);
    }
  };

  const lockNow = async () => {
    setTimeRemaining(0);
    setIsLocked(true);
    await saveSession(0, true);
  };

  const formatTimeRemaining = () => {
    const totalSeconds = Math.max(0, Math.floor(timeRemaining / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return { timeRemaining, isLocked, lockNow, formatTimeRemaining };
}
