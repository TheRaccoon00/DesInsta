import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@desinsta_settings';

export const PLATFORMS = {
  instagram: {
    name: 'Instagram',
    url: 'https://www.instagram.com',
    domain: 'instagram.com',
  },
  tiktok: {
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    domain: 'tiktok.com',
  }
};

const DEFAULT_SETTINGS = {
  instagram: {
    timeLimitMs: 15 * 60 * 1000, // 15 mins
    blockExplore: true,
    blockReels: true,
  },
  tiktok: {
    timeLimitMs: 15 * 60 * 1000, // 15 mins
    blockExplore: true,
    blockReels: true,
  }
};

export function useAppSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(data) });
      } else {
        await saveSettings(DEFAULT_SETTINGS);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const updatePlatformSettings = async (platformId, partialSettings) => {
    const updated = {
      ...settings,
      [platformId]: {
        ...settings[platformId],
        ...partialSettings
      }
    };
    await saveSettings(updated);
  };

  return { settings, loading, updatePlatformSettings, PLATFORMS };
}
