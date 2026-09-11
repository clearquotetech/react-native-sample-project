import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClearQuoteSDK } from '../ClearQuoteSDK';
import type { RootStackParamList } from '../types/navigationTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Initialize'>;

export default function InitializeScreen({ navigation }: Readonly<Props>) {
  const [sdkKey, setSdkKey] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [sdkVersion] = useState(() => {
    try {
      return ClearQuoteSDK.getSDKVersion();
    } catch {
      return null;
    }
  });

  const initializeSDK = async () => {
    Keyboard.dismiss();

    if (!sdkKey.trim()) {
      Alert.alert('Error', 'Please enter SDK Key');
      return;
    }

    setIsInitializing(true);
    try {
      const result = await ClearQuoteSDK.initSDK(sdkKey);
      if (result.code === 200) {
        navigation.replace('Inspection');
      } else {
        Alert.alert('SDK Init Result', result.message);
      }
    } catch (e: any) {
      Alert.alert('Init Failed', e.message || 'Unknown error');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>ClearQuoteSDK</Text>
      <Text style={styles.title}>React Native Demo App</Text>
      </View>

      <View style={styles.content}>
      <Text style={styles.text}>ClearQuote SDK Key</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Enter SDK Key"
        placeholderTextColor="black"
        value={sdkKey}
        onChangeText={setSdkKey}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable
        style={({ pressed }) => [
          styles.startButton,
          pressed && styles.startButtonPressed,
          isInitializing && styles.startButtonDisabled,
        ]}
        onPress={initializeSDK}
        disabled={isInitializing}
      >
        <Text style={styles.startButtonText}>Initialize SDK</Text>
      </Pressable>
      </View>

      {sdkVersion != null && (
        <Text style={styles.version}>SDK Version - {sdkVersion}</Text>
      )}

      {isInitializing && Platform.OS === 'android' && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#2AB6B6" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  text: {
    paddingVertical: 12,
    fontSize: 16,
    marginHorizontal: 16,
  },
  titleContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  startButtonPressed: {
    opacity: 0.8,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 24,
  },
});
