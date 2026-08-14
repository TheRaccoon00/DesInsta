import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function BlockRealAppsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.title}>Block Real Apps</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Want to prevent yourself from opening the real, addictive native apps? Here is how to configure your phone to only use UseIntent.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Method 1: iOS Screen Time (Recommended)</Text>
          <Text style={styles.step}>1. Go to your iPhone Settings ⚙️</Text>
          <Text style={styles.step}>2. Tap on "Screen Time" &gt; "App Limits"</Text>
          <Text style={styles.step}>3. Tap "Add Limit"</Text>
          <Text style={styles.step}>4. Select the apps you want to block (e.g., Instagram, TikTok, YouTube)</Text>
          <Text style={styles.step}>5. Set the limit to 1 minute.</Text>
          <Text style={styles.step}>6. Make sure "Block at End of Limit" is enabled.</Text>
          <Text style={styles.note}>Now, whenever you try to open the real app, it will be locked, and you can use UseIntent instead!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Method 2: iOS Shortcuts Automation</Text>
          <Text style={styles.step}>1. Open the "Shortcuts" app on your iPhone.</Text>
          <Text style={styles.step}>2. Go to the "Automation" tab and tap "+".</Text>
          <Text style={styles.step}>3. Choose "App" and select the apps you want to block (e.g., Instagram).</Text>
          <Text style={styles.step}>4. Select "Is Opened" and check "Run Immediately". Tap Next.</Text>
          <Text style={styles.step}>5. Select "New Blank Automation".</Text>
          <Text style={styles.step}>6. Add the action "Go to Home Screen".</Text>
          <Text style={styles.note}>Now, whenever you tap on the real app, it will instantly close and return you to the home screen.</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Method 3: Delete the Real Apps</Text>
          <Text style={styles.step}>The most effective way to stop using the real apps is to simply delete them from your phone. UseIntent provides all the core functionality you need without the addictive algorithms.</Text>
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
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  step: {
    fontSize: 15,
    color: '#1c1c1e',
    marginBottom: 12,
    lineHeight: 22,
  },
  note: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 20,
  },
});
