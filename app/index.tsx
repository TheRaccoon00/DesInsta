import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppSettings } from '../hooks/useAppSettings';

export default function HomeHub() {
  const router = useRouter();
  const { PLATFORMS } = useAppSettings();

  const handleSelectPlatform = (id) => {
    router.push(`/browser/${id}`);
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DésInsta Hub</Text>
        <TouchableOpacity onPress={handleOpenSettings} style={styles.settingsButton}>
          <Feather name="settings" size={24} color="#1c1c1e" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Choose your platform to browse mindfully.</Text>
        
        {Object.entries(PLATFORMS).map(([id, platform]) => (
          <TouchableOpacity 
            key={id}
            style={styles.platformCard}
            onPress={() => handleSelectPlatform(id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: id === 'instagram' ? '#FEF2F2' : '#F3F4F6' }]}>
              <Feather 
                name={id === 'instagram' ? 'instagram' : 'music'} 
                size={32} 
                color={id === 'instagram' ? '#E1306C' : '#000000'} 
              />
            </View>
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>{platform.name}</Text>
              <Text style={styles.platformDesc}>Controlled browsing with limits.</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#C7C7CC" />
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Feather name="info" size={20} color="#8E8E93" style={{ marginRight: 12 }} />
          <Text style={styles.infoText}>
            DésInsta helps you regain control over your digital habits by adding barriers to addictive features.
          </Text>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  settingsButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 32,
    fontWeight: '500',
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  platformDesc: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});
