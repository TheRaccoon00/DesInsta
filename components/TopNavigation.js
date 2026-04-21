import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TopNavigation({ onNavigate, onLock, formatTimeRemaining }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Text style={styles.logoText}>DésInsta</Text>
            <Text style={styles.timerText}>{formatTimeRemaining && formatTimeRemaining()}</Text>
        </View>

        <View style={styles.navRow}>
            <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('https://www.instagram.com/')}>
                <Feather name="home" size={24} color="#1c1c1e" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('https://www.instagram.com/direct/')}>
                <Feather name="message-circle" size={24} color="#1c1c1e" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('https://www.instagram.com/create/style/')}>
                <Feather name="plus-square" size={24} color="#1c1c1e" />
            </TouchableOpacity>

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
    borderBottomColor: '#e5e5e5',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  timerText: {
    fontSize: 12,
    color: '#8e8e93',
    fontWeight: '500',
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // available in newer react-native
  },
  navItem: {
    padding: 6,
  },
  lockItem: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  }
});
