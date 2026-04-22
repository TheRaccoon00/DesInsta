import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@onlyfeed_settings';

export const BLUEPRINTS = {
  instagram: {
    id: 'instagram', // ID will be assigned on addition
    blueprintId: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com',
    domain: 'instagram.com',
    iconName: 'instagram',
    timeLimitMs: 15 * 60 * 1000,
    blockExplore: true,
    blockReels: true,
    native: true
  },
  tiktok: {
    blueprintId: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    domain: 'tiktok.com',
    iconName: 'music',
    timeLimitMs: 15 * 60 * 1000,
    blockExplore: true,
    blockReels: true,
    native: true
  },
  facebook: {
    blueprintId: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com',
    domain: 'facebook.com',
    iconName: 'facebook',
    timeLimitMs: 15 * 60 * 1000,
    blockExplore: true,
    blockReels: true,
    native: true
  },
  youtube: {
    blueprintId: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    domain: 'youtube.com',
    iconName: 'play-circle',
    timeLimitMs: 15 * 60 * 1000,
    blockExplore: true, // Block Home
    blockReels: true,   // Block Shorts
    native: true
  },
  linkedin: {
    blueprintId: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com',
    domain: 'linkedin.com',
    iconName: 'linkedin',
    timeLimitMs: 15 * 60 * 1000,
    blockExplore: true, // Block Feed
    native: true
  },
  twitter: {
    blueprintId: 'twitter',
    name: 'X / Twitter',
    url: 'https://www.twitter.com',
    domain: 'twitter.com',
    iconName: 'twitter',
    timeLimitMs: 15 * 60 * 1000,
    blockExplore: true, // Block "For You"
    native: true
  },
  reddit: {
    blueprintId: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com',
    domain: 'reddit.com',
    iconName: 'smile',
    timeLimitMs: 15 * 60 * 1000,
    blockExplore: true, // Block Popular/All
    native: true
  }
};

export const DEFAULT_PLATFORMS = {
  instagram: {
    ...BLUEPRINTS.instagram,
    id: 'instagram',
  },
  tiktok: {
    ...BLUEPRINTS.tiktok,
    id: 'tiktok',
  }
};

const AppSettingsContext = createContext();

export function AppSettingsProvider({ children }) {
  const [platforms, setPlatforms] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setPlatforms(JSON.parse(data));
      } else {
        setPlatforms(DEFAULT_PLATFORMS);
        await saveSettings(DEFAULT_PLATFORMS);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newPlatforms) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlatforms));
      setPlatforms(newPlatforms);
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const addPlatform = async (platform) => {
    const id = Date.now().toString();
    const updated = {
      ...platforms,
      [id]: {
        ...platform,
        id,
        timeLimitMs: platform.timeLimitMs || 15 * 60 * 1000,
        blockExplore: platform.blockExplore ?? true,
        blockReels: platform.blockReels ?? true,
        native: platform.native ?? false,
        blueprintId: platform.blueprintId || null
      }
    };
    await saveSettings(updated);
  };

  const removePlatform = async (id) => {
    const updated = { ...platforms };
    delete updated[id];
    await saveSettings(updated);
  };

  const updatePlatformSettings = async (id, partialSettings) => {
    const updated = {
      ...platforms,
      [id]: {
        ...platforms[id],
        ...partialSettings
      }
    };
    await saveSettings(updated);
  };

  return (
    <AppSettingsContext.Provider value={{ platforms, loading, addPlatform, removePlatform, updatePlatformSettings, BLUEPRINTS }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettingsContext() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettingsContext must be used within an AppSettingsProvider');
  }
  return context;
}
