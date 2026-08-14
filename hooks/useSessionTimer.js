import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function useSessionTimer(platform = 'instagram', dailyLimitMs = 15 * 60 * 1000) {
  const [usedTimeMs, setUsedTimeMs] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const usedTimeRef = useRef(0);
  const isLockedRef = useRef(false);
  const appState = useRef(AppState.currentState);
  const lastActiveRef = useRef(Date.now());
  const STORAGE_KEY = `@session_${platform}`;

  // Dynamic remaining time calculation
  const timeRemaining = Math.max(0, dailyLimitMs - usedTimeMs);

  const saveSession = async (used = usedTimeRef.current, locked = isLockedRef.current) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: getTodayString(),
        usedTimeMs: used,
        isLocked: locked,
        dailyLimitMs
      }));
    } catch (e) {
      console.error(`Failed to save session for ${platform}`, e);
    }
  };

  const loadSession = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const today = getTodayString();

      if (data) {
        const parsed = JSON.parse(data);
        const savedDate = parsed.date;

        // Reset if date is different (midnight reset based on local date)
        if (savedDate !== today && savedDate !== new Date().toDateString()) {
          usedTimeRef.current = 0;
          setUsedTimeMs(0);
          isLockedRef.current = false;
          setIsLocked(false);
          await saveSession(0, false);
        } else {
          let currentUsed = 0;
          if (typeof parsed.usedTimeMs === 'number') {
            currentUsed = parsed.usedTimeMs;
          } else if (typeof parsed.timeRemaining === 'number' && typeof parsed.dailyLimitMs === 'number') {
            // Migration for older schema
            currentUsed = Math.max(0, parsed.dailyLimitMs - parsed.timeRemaining);
          }

          usedTimeRef.current = currentUsed;
          setUsedTimeMs(currentUsed);

          const locked = parsed.isLocked || currentUsed >= dailyLimitMs;
          isLockedRef.current = locked;
          setIsLocked(locked);
        }
      } else {
        usedTimeRef.current = 0;
        setUsedTimeMs(0);
        isLockedRef.current = false;
        setIsLocked(false);
      }
    } catch (e) {
      console.error(`Failed to load session for ${platform}`, e);
    }
  };

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

  // Update lock status when limit or used time changes
  useEffect(() => {
    if (usedTimeMs >= dailyLimitMs) {
      setIsLocked(true);
      isLockedRef.current = true;
    } else {
      setIsLocked(false);
      isLockedRef.current = false;
    }
  }, [dailyLimitMs, usedTimeMs]);

  // Timer interval for active session
  useEffect(() => {
    if (isLocked) return;

    lastActiveRef.current = Date.now();

    const interval = setInterval(() => {
      if (appState.current === 'active') {
        const now = Date.now();
        const elapsed = now - lastActiveRef.current;
        lastActiveRef.current = now;

        const newUsed = usedTimeRef.current + elapsed;
        usedTimeRef.current = newUsed;
        setUsedTimeMs(newUsed);

        if (newUsed >= dailyLimitMs) {
          setIsLocked(true);
          isLockedRef.current = true;
          saveSession(newUsed, true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, dailyLimitMs]);

  const lockNow = async () => {
    const lockedUsed = Math.max(usedTimeRef.current, dailyLimitMs);
    usedTimeRef.current = lockedUsed;
    setUsedTimeMs(lockedUsed);
    setIsLocked(true);
    isLockedRef.current = true;
    await saveSession(lockedUsed, true);
  };

  const formatTimeRemaining = () => {
    const totalSeconds = Math.max(0, Math.floor(timeRemaining / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return { timeRemaining, isLocked, lockNow, formatTimeRemaining };
}
