import type { LoginOption } from "./model/LoginOption";

// LINE SDK doesn't use events; keep an empty event map for NativeModule typing.
export type ExpoLineSdkModuleEvents = Record<string, never>;

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
