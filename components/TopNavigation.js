import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function TopNavigation({ title = 'UseIntent', onNavigate, onLock, formatTimeRemaining, onBack }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.leftGroup}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#1c1c1e" />
            </TouchableOpacity>
          )}
          <View style={styles.logoContainer}>
              <Text style={styles.logoText}>{title}</Text>
              <Text style={styles.timerText}>{formatTimeRemaining && formatTimeRemaining()}</Text>
          </View>
        </View>

        <View style={styles.navRow}>
            <TouchableOpacity style={[styles.navItem, styles.lockItem]} onPress={onLock}>
                <Feather name="lock" size={16} color="#fff" />
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 6,
    marginRight: 4,
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  timerText: {
    fontSize: 11,
    color: '#8e8e93',
    fontWeight: '600',
    marginTop: -1,
    fontVariant: ['tabular-nums'],
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    padding: 4,
  },
  lockItem: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
