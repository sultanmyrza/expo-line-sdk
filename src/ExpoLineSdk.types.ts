import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoLineSdkModuleEvents = {
  // LINE SDK doesn't use events, but keeping empty interface for compatibility
};

export type ChangeEventPayload = {
  value: string;
};

export type ExpoLineSdkViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

// Setup parameters
export type SetupParams = {
  channelId: string;
  universalLink?: string;
};

// Login option parameters
export type LoginOption = {
  onlyWebLogin?: boolean;
  botPrompt?: string;
  requestCode?: number;
  idTokenNonce?: string;
};

// Login parameters
export type LoginParams = {
  scopes?: string[];
  option?: LoginOption;
};

// Access Token
export type AccessToken = {
  value: string;
  expiresIn: number;
  idTokenRaw?: string;
  idToken?: Record<string, any>;
  scopes: string[];
  tokenType: string;
  email?: string;
};

// Stored Access Token
export type StoredAccessToken = {
  value: string;
  expiresIn: number;
};

// User Profile
export type UserProfile = {
  userId: string;
  displayName: string;
  statusMessage?: string;
  pictureUrl?: string;
  pictureUrlLarge?: string;
  pictureUrlSmall?: string;
};

// Login Result
export type LoginResult = {
  accessToken: AccessToken;
  userProfile?: UserProfile;
  scopes: string[];
  isFriendshipStatusChanged?: boolean;
  idTokenNonce?: string;
};

// Access Token Verify Result
export type AccessTokenVerifyResult = {
  channelId: string;
  scopes: string[];
  expiresIn: number;
};

// Bot Friendship Status
export type BotFriendshipStatus = {
  isFriend: boolean;
};
