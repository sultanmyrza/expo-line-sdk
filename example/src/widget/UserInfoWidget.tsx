import type { StoredAccessToken, UserProfile } from 'expo-line-sdk';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { accentColor, textColor } from '../theme';

type Props = {
  userProfile: UserProfile;
  userEmail?: string | null;
  accessToken: StoredAccessToken;
  onSignOutPressed: () => void;
};

export default function UserInfoWidget({ userProfile, userEmail, onSignOutPressed }: Props) {
  const pictureUrl = userProfile.pictureUrl;

  return (
    <View style={styles.container}>
      {pictureUrl ? (
        <Image source={{ uri: pictureUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarPlaceholderText}>?</Text>
        </View>
      )}
      <Text style={styles.displayName}>{userProfile.displayName}</Text>
      {userEmail ? <Text style={styles.detail}>{userEmail}</Text> : null}
      {userProfile.statusMessage ? (
        <Text style={styles.detail}>{userProfile.statusMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={onSignOutPressed} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 16,
  },
  avatar: {
    width: 200,
    height: 200,
  },
  avatarPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 72,
    color: '#666',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '600',
  },
  detail: {
    fontSize: 16,
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
