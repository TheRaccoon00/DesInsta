import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppSettings } from '../hooks/useAppSettings';

export default function SettingsScreen() {
  const router = useRouter();
  const { platforms, updatePlatformSettings, loading } = useAppSettings();

  const handleToggleBlock = (id: string, key: string, value: boolean) => {
    updatePlatformSettings(id, { [key]: value });
  };

  const handleTimeChange = (id: string, minutes: string) => {
    const ms = parseInt(minutes || '0') * 60 * 1000;
    updatePlatformSettings(id, { timeLimitMs: ms });
  };

  const getLabels = (platform: any) => {
    const bId = platform.blueprintId;
    const labels = {
      explore: 'Block Explore/Search',
      reels: 'Block Reels/Shorts',
      exploreDesc: 'Remove discoverability triggers.',
      reelsDesc: 'Disable infinite video feeds.'
    };

    if (bId === 'facebook') {
      labels.explore = 'Block Suggested Posts';
      labels.reels = 'Block Facebook Reels';
    } else if (bId === 'youtube') {
      labels.explore = 'Block Home Feed';
      labels.reels = 'Block YouTube Shorts';
    } else if (bId === 'linkedin') {
      labels.explore = 'Block News Feed';
    } else if (bId === 'twitter' || bId === 'x') {
      labels.explore = 'Block "For You" Feed';
    } else if (bId === 'reddit') {
      labels.explore = 'Block Popular/All';
    }

    return labels;
  };

  if (loading) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.guideSection}>
          <TouchableOpacity
            style={styles.guideButton}
            onPress={() => router.push('/block-real-apps' as any)}
          >
            <View style={styles.guideButtonContent}>
              <Feather name="smartphone" size={22} color="#1c1c1e" />
              <View style={styles.guideButtonTextContainer}>
                <Text style={styles.guideButtonTitle}>Block Native Apps</Text>
                <Text style={styles.guideButtonDesc}>Setup guide to lock real apps</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {(Object.entries(platforms) as [string, any][]).map(([id, platform]) => {
          const labels = getLabels(platform);
          return (
            <View key={id} style={styles.section}>
              <Text style={styles.sectionTitle}>{platform.name}</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Daily Time Limit (mins)</Text>
                  <Text style={styles.settingDesc}>Limit your usage for this app.</Text>
                </View>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  defaultValue={String(Math.floor(platform.timeLimitMs / 60000))}
                  onChangeText={(val) => handleTimeChange(id, val)}
                />
              </View>

              {platform.native && (
                <>
                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>{labels.explore}</Text>
                      <Text style={styles.settingDesc}>{labels.exploreDesc}</Text>
                    </View>
                    <Switch
                      value={platform.blockExplore}
                      onValueChange={(val) => handleToggleBlock(id, 'blockExplore', val)}
                      trackColor={{ false: '#E9E9EB', true: '#34C759' }}
                    />
                  </View>

                  {platform.blueprintId !== 'linkedin' && platform.blueprintId !== 'twitter' && platform.blueprintId !== 'reddit' && (
                    <View style={styles.settingRow}>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>{labels.reels}</Text>
                        <Text style={styles.settingDesc}>{labels.reelsDesc}</Text>
                      </View>
                      <Switch
                        value={platform.blockReels}
                        onValueChange={(val) => handleToggleBlock(id, 'blockReels', val)}
                        trackColor={{ false: '#E9E9EB', true: '#34C759' }}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })}

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About</Text>
          <Text style={styles.aboutText}>Developed by Clément Foissard using AI</Text>
          <Text style={styles.versionText}>UseIntent v1.1.0 (Build 2)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1c1c1e',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
    color: '#8E8E93',
  },
  timeInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9E9EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  guideSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9FB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  guideButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideButtonTextContainer: {
    marginLeft: 16,
  },
  guideButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  guideButtonDesc: {
    fontSize: 13,
    color: '#8E8E93',
  },
  aboutSection: {
    marginTop: 40,
    marginBottom: 60,
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#1c1c1e',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 0,
  },
});
