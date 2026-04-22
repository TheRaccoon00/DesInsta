import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppSettings } from '../hooks/useAppSettings';

const ICONS = [
  'camera', 'music', 'facebook', 'twitter', 'linkedin', 
  'globe', 'video', 'briefcase', 'shopping-bag', 'message-circle', 
  'mail', 'monitor', 'smartphone', 'smile', 'star', 
  'heart', 'zap', 'anchor', 'coffee', 'play-circle'
];

export default function AddPlatformScreen() {
  const router = useRouter();
  const { addPlatform, BLUEPRINTS } = useAppSettings();
  
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('globe');
  const [isCustom, setIsCustom] = useState(false);

  const handleAddPreset = async (blueprint: any) => {
    await addPlatform({
      ...blueprint,
      native: true // Presets are considered native for blocking
    });
    router.back();
  };

  const handleSaveCustom = async () => {
    if (!name || !url) return;
    
    let sanitizedUrl = url.trim();
    if (!sanitizedUrl.startsWith('http')) {
      sanitizedUrl = `https://${sanitizedUrl}`;
    }

    try {
      const parsedUrl = new URL(sanitizedUrl);
      await addPlatform({
        name: name.trim(),
        url: sanitizedUrl,
        iconName: selectedIcon,
        domain: parsedUrl.hostname || sanitizedUrl,
        native: false
      });
      router.back();
    } catch (e) {
      Alert.alert("Invalid URL", "Please enter a valid URL (e.g. facebook.com)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Feather name="x" size={24} color="#1c1c1e" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Platform</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionLabel}>Suggested</Text>
          <View style={styles.presetsGrid}>
            {(Object.values(BLUEPRINTS) as any[]).map((blueprint) => (
              <TouchableOpacity
                key={blueprint.blueprintId}
                style={styles.presetItem}
                onPress={() => handleAddPreset(blueprint)}
              >
                <View style={styles.presetIcon}>
                  <Feather name={blueprint.iconName as any} size={24} color="#1c1c1e" />
                </View>
                <Text style={styles.presetLabel}>{blueprint.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.customToggle} 
            onPress={() => setIsCustom(!isCustom)}
          >
            <Text style={styles.customToggleText}>
              {isCustom ? "Hide Custom Form" : "Add from URL..."}
            </Text>
            <Feather name={isCustom ? "chevron-up" : "chevron-down"} size={16} color="#007AFF" />
          </TouchableOpacity>

          {isCustom && (
            <View style={styles.customForm}>
              <View style={styles.section}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. My Blog"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com"
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Icon</Text>
                <View style={styles.iconGrid}>
                  {ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconItem,
                        selectedIcon === icon && styles.selectedIconItem
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Feather 
                        name={icon as any} 
                        size={20} 
                        color={selectedIcon === icon ? '#fff' : '#1c1c1e'} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleSaveCustom} 
                disabled={!name || !url}
                style={[styles.saveButton, (!name || !url) && { opacity: 0.5 }]}
              >
                <Text style={styles.saveButtonText}>Add Custom App</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  content: {
    padding: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  presetItem: {
    width: '30%',
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  presetIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1c1c1e',
    textAlign: 'center',
  },
  customToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    gap: 8,
  },
  customToggleText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  customForm: {
    marginTop: 10,
    backgroundColor: '#F9F9FB',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9E9EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1c1c1e',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconItem: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9E9EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconItem: {
    backgroundColor: '#1c1c1e',
    borderColor: '#1c1c1e',
  },
  saveButton: {
    backgroundColor: '#1c1c1e',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
