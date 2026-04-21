import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TopNavigation({ title = 'DésInsta', onNavigate, onLock, formatTimeRemaining, onBack }) {
  return (
    <SafeAreaView style={styles.safeArea}>
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
                <Feather name="lock" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  timerText: {
    fontSize: 12,
    color: '#8e8e93',
    fontWeight: '600',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    padding: 6,
  },
  lockItem: {
    backgroundColor: '#1c1c1e',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
