import ExpoLineSdk, { LoginOption } from 'expo-line-sdk';
import type { StoredAccessToken, UserProfile } from 'expo-line-sdk';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { accentColor, secondaryBackgroundColor, textColor } from '../theme';
import UserInfoWidget from '../widget/UserInfoWidget';

const SCOPES = ['profile', 'openid', 'email'] as const;

function errorString(error: unknown): string {
  const err = error as { code?: string; message?: string };
  if (err?.code || err?.message) {
    return [err.code, err.message].filter(Boolean).join(': ');
  }
  return String(error);
}

export default function HomePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<StoredAccessToken | null>(null);
  const [isOnlyWebLogin, setIsOnlyWebLogin] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<Set<string>>(new Set(['profile']));

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await ExpoLineSdk.instance.currentAccessToken();
        if (token != null) {
          const profile = await ExpoLineSdk.instance.getProfile();
          setAccessToken(token);
          setUserProfile(profile);
        }
      } catch (e) {
        if (__DEV__) {
          console.log(errorString(e));
        }
      }
    };

    restoreSession();
  }, []);

  const toggleScope = (scope: string) => {
    setSelectedScopes((current) => {
      const next = new Set(current);
      if (next.has(scope)) {
        next.delete(scope);
      } else {
        next.add(scope);
      }
      return next;
    });
  };

  const signIn = async () => {
    try {
      const option = new LoginOption(isOnlyWebLogin, 'normal', { requestCode: 8192 });
      const result = await ExpoLineSdk.instance.login({
        scopes: Array.from(selectedScopes),
        option,
      });
      const token = await ExpoLineSdk.instance.currentAccessToken();
      setUserProfile(result.userProfile);
      setUserEmail(result.accessToken.email);
      setAccessToken(token);
    } catch (e) {
      Alert.alert('Error', errorString(e));
    }
  };

  const signOut = async () => {
    try {
      await ExpoLineSdk.instance.logout();
      setUserProfile(null);
      setUserEmail(null);
      setAccessToken(null);
    } catch (e) {
      if (__DEV__) {
        console.log(errorString(e));
      }
    }
  };

  if (userProfile == null || accessToken == null) {
    return (
      <View style={styles.signedOut}>
        <View style={styles.card}>
          <Text style={styles.scopesLabel}>Scopes:</Text>
          <View style={styles.chips}>
            {SCOPES.map((scope) => {
              const selected = selectedScopes.has(scope);
              return (
                <Pressable
                  key={scope}
                  onPress={() => toggleScope(scope)}
                  style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {scope}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setIsOnlyWebLogin((value) => !value)}>
            <View style={[styles.checkbox, isOnlyWebLogin && styles.checkboxChecked]}>
              {isOnlyWebLogin ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.checkboxLabel}>only Web Login</Text>
          </Pressable>
        </View>
        <View style={styles.signInWrap}>
          <TouchableOpacity style={styles.button} onPress={signIn} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <UserInfoWidget
      userProfile={userProfile}
      userEmail={userEmail}
      accessToken={accessToken}
      onSignOutPressed={signOut}
    />
  );
}

const styles = StyleSheet.create({
  signedOut: {
    flex: 1,
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  scopesLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipIdle: {
    backgroundColor: secondaryBackgroundColor,
  },
  chipSelected: {
    backgroundColor: accentColor,
  },
  chipText: {
    color: '#333',
  },
  chipTextSelected: {
    color: textColor,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: accentColor,
    borderRadius: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: accentColor,
  },
  checkmark: {
    color: textColor,
    fontSize: 14,
    lineHeight: 16,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  signInWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: accentColor,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: textColor,
    fontSize: 16,
    fontWeight: '600',
  },
});
