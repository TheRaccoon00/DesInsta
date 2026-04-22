import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppSettings } from '../hooks/useAppSettings';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface PlatformSettings {
  name: string;
  iconName: string;
  url: string;
  timeLimitMs: number;
  blockExplore: boolean;
  blockReels: boolean;
  native: boolean;
  blueprintId?: string;
}

export default function HomeHub() {
  const router = useRouter();
  const { platforms, loading, removePlatform } = useAppSettings();

  const handleSelectPlatform = (id: string) => {
    router.push(`/browser/${id}`);
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleAddPlatform = () => {
    router.push('/add-platform');
  };

  const handleDelete = async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await removePlatform(id);
  };

  const renderRightActions = (progress: any, dragX: any, id: string) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <TouchableOpacity 
        onPress={() => handleDelete(id)}
        style={styles.deleteAction}
      >
        <Animated.View style={[styles.deleteActionContent, { transform: [{ translateX: trans }] }]}>
          <Feather name="trash-2" size={24} color="#fff" />
          <Text style={styles.deleteActionText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (loading) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>UseIntent Hub</Text>
          <Text style={styles.subtitleSmall}>Control your feeds. Own your time.</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleAddPlatform} style={styles.headerButton}>
            <Feather name="plus" size={26} color="#1c1c1e" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenSettings} style={styles.headerButton}>
            <Feather name="settings" size={24} color="#1c1c1e" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Choose your platform to browse mindfully.</Text>
        
        {(Object.entries(platforms) as [string, PlatformSettings][]).map(([id, platform]) => (
          <Swipeable
            key={id}
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, id)}
            friction={2}
            rightThreshold={40}
          >
            <TouchableOpacity 
              style={styles.platformCard}
              onPress={() => handleSelectPlatform(id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F2F2F7' }]}>
                <Feather 
                  name={(platform.iconName || 'globe') as any} 
                  size={32} 
                  color="#1c1c1e" 
                />
              </View>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>{platform.name}</Text>
                <Text style={styles.platformDesc}>Controlled browsing with highlights.</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#C7C7CC" />
            </TouchableOpacity>
          </Swipeable>
        ))}

        <View style={styles.infoBox}>
          <Feather name="shield" size={20} color="#8E8E93" style={{ marginRight: 12 }} />
          <Text style={styles.infoText}>
            UseIntent gives you back your time by removing algorithmic triggers and addictive infinite feeds.
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  subtitleSmall: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  headerButton: {
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
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 80, // Match card height approximately or use flex: 1 if container is defined
    borderRadius: 20,
    marginBottom: 16,
    marginLeft: 10,
  },
  deleteActionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
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
