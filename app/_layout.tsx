import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppSettingsProvider } from '../context/AppSettingsContext';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppSettingsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="browser/[platform]" />
          <Stack.Screen name="add-platform" options={{ presentation: 'modal' }} />
        </Stack>
      </AppSettingsProvider>
    </GestureHandlerRootView>
  );
}
