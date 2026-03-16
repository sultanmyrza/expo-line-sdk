import { useState } from 'react';
import ExpoLineSdk from 'expo-line-sdk';
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type APIItem = {
  name: string;
  run: () => Promise<void>;
};

export default function App() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const setState = (data: any, err: any) => {
    if (data != null) {
      setResult(JSON.stringify(data, null, 2));
      setError('');
    } else {
      setResult('');
    }

    if (err != null) {
      setError(`Error Code: ${err.code}\nError Message: ${err.message}`);
      setResult('');
    } else {
      setError('');
    }
  };

  const apis: APIItem[] = [
    {
      name: 'Setup',
      run: async () => {
        try {
          await ExpoLineSdk.instance.setup({ channelId: process.env.LINE_CHANNEL_ID });
          setState({ success: true }, null);
        } catch (e: any) {
          console.log(e);
          setState(null, e);
        }
      },
    },
    {
      name: 'Login',
      run: async () => {
        try {
          const result = await ExpoLineSdk.instance.login({
            scopes: ['profile', 'openid', 'email'],
          });
          setState(result, null);
        } catch (e: any) {
          console.log(e);
          setState(null, e);
        }
      },
    },
    {
      name: 'Logout',
      run: async () => {
        try {
          await ExpoLineSdk.instance.logout();
          setState({ success: true }, null);
        } catch (e: any) {
          console.log(e);
          setState(null, e);
        }
      },
    },
    {
      name: 'Get Profile',
      run: async () => {
        try {
          const result = await ExpoLineSdk.instance.getProfile();
          setState(result, null);
        } catch (e: any) {
          console.log(e);
          setState(null, e);
        }
      },
    },
    {
      name: 'Get Current AccessToken',
      run: async () => {
        try {
          const result = await ExpoLineSdk.instance.currentAccessToken();
          setState(result, null);
        } catch (e: any) {
          console.log(e);
          setState(null, e);
        }
      },
    },
    {
      name: 'Refresh Token',
      run: async () => {
        try {
          const result = await ExpoLineSdk.instance.refreshToken();
          setState(result, null);
        } catch (e: any) {
          console.log(e);
          setState(null, e);
        }
      },
    },
    {
      name: 'Verify Access Token',
      run: async () => {
        try {
          const result = await ExpoLineSdk.instance.verifyAccessToken();
          setState(result, null);
        } catch (e: any) {
          console.log(e);
          setState(null, e);
        }
      },
    },
    {
      name: 'Official Account Friendship Status',
      run: async () => {
        try {
          const result = await ExpoLineSdk.instance.getBotFriendshipStatus();
          setState(result, null);
        } catch (e: any) {
          console.log(e);
          setState(null, e);
        }
      },
    },
  ];

  const isError = error !== '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.resultContainer}>
        <ScrollView style={styles.resultScrollView}>
          <Text style={[styles.resultText, isError && styles.errorText]}>
            {isError ? error : result}
          </Text>
        </ScrollView>
      </View>
      <ScrollView style={styles.apiListContainer}>
        {apis.map((api, index) => (
          <TouchableOpacity
            key={index}
            style={styles.apiItem}
            onPress={api.run}
            activeOpacity={0.7}
          >
            <Text style={styles.apiItemText}>{api.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  resultContainer: {
    height: 200,
    backgroundColor: 'rgba(30, 30, 30, 0.1)',
    padding: 16,
  },
  resultScrollView: {
    flex: 1,
  },
  resultText: {
    color: 'green',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  errorText: {
    color: 'red',
  },
  apiListContainer: {
    flex: 1,
  },
  apiItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  apiItemText: {
    fontSize: 16,
    color: '#000',
  },
});
