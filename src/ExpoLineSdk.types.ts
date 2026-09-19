import type { StyleProp, ViewStyle } from "react-native";

import type { LoginOption } from "./model/LoginOption";

export type OnLoadEventPayload = {
  url: string;
};

// LINE SDK doesn't use events; keep an empty event map for NativeModule typing.
export type ExpoLineSdkModuleEvents = Record<string, never>;

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

// Login parameters
export type LoginParams = {
  scopes?: string[];
  option?: LoginOption;
};
