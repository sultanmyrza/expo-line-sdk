import { NativeModule, requireNativeModule } from "expo";

import {
  ExpoLineSdkModuleEvents,
  LoginParams,
  LoginResult,
  StoredAccessToken,
  UserProfile,
  AccessToken,
  AccessTokenVerifyResult,
  BotFriendshipStatus,
  SetupParams,
} from "./ExpoLineSdk.types";

declare class ExpoLineSdkModule extends NativeModule<ExpoLineSdkModuleEvents> {
  /**
   * Sets up the SDK with a channelId and optional universalLink.
   * This method should be called once and only once, before any other methods.
   */
  setup(params: SetupParams): Promise<void>;

  /**
   * Logs the user into LINE with the specified scopes and option.
   * By default, uses only "profile" as its required scope.
   */
  login(params?: LoginParams): Promise<LoginResult>;

  /**
   * Logs out the current user by revoking the related tokens.
   */
  logout(): Promise<void>;

  /**
   * Gets the current access token in use.
   * Returns null if the user isn't logged in.
   */
  getCurrentAccessToken(): Promise<StoredAccessToken | null>;

  /**
   * Gets the user's profile.
   * Using this method requires the "profile" scope.
   */
  getProfile(): Promise<UserProfile>;

  /**
   * Refreshes the access token.
   * The refreshed access token will be automatically stored.
   */
  refreshToken(): Promise<AccessToken>;

  /**
   * Checks whether the stored access token is valid against the LINE authentication server.
   */
  verifyAccessToken(): Promise<AccessTokenVerifyResult>;

  /**
   * Gets the friendship status between the user and the official account linked to your LINE Login channel.
   * Using this method requires the "profile" scope.
   */
  getBotFriendshipStatus(): Promise<BotFriendshipStatus>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoLineSdkModule>("ExpoLineSdk");
