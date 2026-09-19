import { registerWebModule, NativeModule } from "expo";

import {
  ExpoLineSdkModuleEvents,
  LoginParams,
  SetupParams,
} from "./ExpoLineSdk.types";
import {
  AccessToken,
  AccessTokenVerifyResult,
  BotFriendshipStatus,
  LoginResult,
  StoredAccessToken,
  UserProfile,
} from "./model";

class ExpoLineSdkModule extends NativeModule<ExpoLineSdkModuleEvents> {
  async setup(params: SetupParams): Promise<void> {
    throw new Error("LINE SDK is not supported on web platform");
  }

  async login(params?: LoginParams): Promise<LoginResult> {
    throw new Error("LINE SDK is not supported on web platform");
  }

  async logout(): Promise<void> {
    throw new Error("LINE SDK is not supported on web platform");
  }

  async currentAccessToken(): Promise<StoredAccessToken | null> {
    throw new Error("LINE SDK is not supported on web platform");
  }

  async getProfile(): Promise<UserProfile> {
    throw new Error("LINE SDK is not supported on web platform");
  }

  async refreshToken(): Promise<AccessToken> {
    throw new Error("LINE SDK is not supported on web platform");
  }

  async verifyAccessToken(): Promise<AccessTokenVerifyResult> {
    throw new Error("LINE SDK is not supported on web platform");
  }

  async getBotFriendshipStatus(): Promise<BotFriendshipStatus> {
    throw new Error("LINE SDK is not supported on web platform");
  }
}

export default registerWebModule(ExpoLineSdkModule, "ExpoLineSdkModule");
