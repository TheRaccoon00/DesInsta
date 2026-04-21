import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppSettings } from '../hooks/useAppSettings';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updatePlatformSettings, PLATFORMS } = useAppSettings();

  const handleToggleBlock = (platformId, key, value) => {
    updatePlatformSettings(platformId, { [key]: value });
  };

  const handleTimeChange = (platformId, minutes) => {
    const ms = parseInt(minutes || '0') * 60 * 1000;
    updatePlatformSettings(platformId, { timeLimitMs: ms });
  };

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
        {Object.keys(PLATFORMS).map(platformId => {
          const platformSettings = settings[platformId];
          if (!platformSettings) return null;

          return (
            <View key={platformId} style={styles.section}>
              <Text style={styles.sectionTitle}>{PLATFORMS[platformId].name}</Text>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Daily Time Limit (mins)</Text>
                  <Text style={styles.settingDesc}>Limit your usage for this app.</Text>
                </View>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  defaultValue={String(Math.floor(platformSettings.timeLimitMs / 60000))}
                  onChangeText={(val) => handleTimeChange(platformId, val)}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Block Explore/Search</Text>
                  <Text style={styles.settingDesc}>Remove discoverability triggers.</Text>
                </View>
                <Switch
                  value={platformSettings.blockExplore}
                  onValueChange={(val) => handleToggleBlock(platformId, 'blockExplore', val)}
                  trackColor={{ false: '#E9E9EB', true: '#34C759' }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Block Reels/Shorts</Text>
                  <Text style={styles.settingDesc}>Disable infinite video feeds.</Text>
                </View>
                <Switch
                  value={platformSettings.blockReels}
                  onValueChange={(val) => handleToggleBlock(platformId, 'blockReels', val)}
                  trackColor={{ false: '#E9E9EB', true: '#34C759' }}
                />
              </View>
            </View>
          );
        })}
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
});
