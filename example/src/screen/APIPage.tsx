import ExpoLineSdk from 'expo-line-sdk';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type APIItem = {
  name: string;
  run: () => Promise<void>;
};

export default function APIPage() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const setPane = (data: Record<string, any> | null | undefined, err: unknown) => {
    if (data != null) {
      setResult(JSON.stringify(data));
      setError('');
    } else {
      setResult('');
    }

    if (err != null) {
      const e = err as { code?: string; message?: string };
      setError(`Error Code: ${e.code}\nError Message: ${e.message}`);
      setResult('');
    } else {
      setError('');
    }
  };

  const apis: APIItem[] = [
    {
      name: 'Get Profile',
      run: async () => {
        try {
          const value = await ExpoLineSdk.instance.getProfile();
          setPane(value.data, null);
        } catch (e) {
          setPane(null, e);
        }
      },
    },
    {
      name: 'Get Current AccessToken',
      run: async () => {
        try {
          const value = await ExpoLineSdk.instance.currentAccessToken();
          setPane(value?.data, null);
        } catch (e) {
          setPane(null, e);
        }
      },
    },
    {
      name: 'Refresh Token',
      run: async () => {
        try {
          const value = await ExpoLineSdk.instance.refreshToken();
          setPane(value.data, null);
        } catch (e) {
          setPane(null, e);
        }
      },
    },
    {
      name: 'Verify Access Token',
      run: async () => {
        try {
          const value = await ExpoLineSdk.instance.verifyAccessToken();
          setPane(value.data, null);
        } catch (e) {
          setPane(null, e);
        }
      },
    },
    {
      name: 'Official Account Friendship Status',
      run: async () => {
        try {
          const value = await ExpoLineSdk.instance.getBotFriendshipStatus();
          setPane(value.data, null);
        } catch (e) {
          setPane(null, e);
        }
      },
    },
  ];

  const isError = error !== '';

  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        <ScrollView>
          <Text style={[styles.resultText, isError && styles.errorText]}>
            {isError ? error : result}
          </Text>
        </ScrollView>
      </View>
      <ScrollView style={styles.list}>
        {apis.map((api) => (
          <TouchableOpacity
            key={api.name}
            style={styles.item}
            onPress={api.run}
            activeOpacity={0.7}>
            <Text style={styles.itemText}>{api.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    height: 200,
    backgroundColor: 'rgba(30, 30, 30, 0.12)',
    padding: 16,
  },
  resultText: {
    color: 'green',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  errorText: {
    color: 'red',
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
});
