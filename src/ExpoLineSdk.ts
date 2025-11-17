//
//  ExpoLineSdk.ts
//
//  Copyright (c) 2019-present, LY Corporation. All rights reserved.
//
//  You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
//  copy and distribute this software in source code or binary form for use
//  in connection with the web services and APIs provided by LY Corporation.
//
//  As with any software that integrates with the LY Corporation platform, your use of this software
//  is subject to the LINE Developers Agreement [http://terms2.line.me/LINE_Developers_Agreement].
//  This copyright notice shall be included in all copies or substantial portions of the software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import {
  LoginParams,
  SetupParams,
} from './ExpoLineSdk.types';

import {
  LoginResult,
  StoredAccessToken,
  UserProfile,
  AccessToken,
  AccessTokenVerifyResult,
  BotFriendshipStatus,
} from './model';

import ExpoLineSdkModule from './ExpoLineSdkModule';

/**
 * A general manager class for LINE SDK login features.
 *
 * Don't create your own instance of this class. Instead, call [ExpoLineSDK.instance] to get a shared
 * singleton on which you can call other methods.
 */
class ExpoLineSDK {
  /**
   * The shared singleton object of `ExpoLineSDK`.
   *
   * Always use this instance (rather than a self-created instance) to interact with the login
   * process of the LINE SDK.
   */
  static readonly instance = new ExpoLineSDK();

  private constructor() {}

  /**
   * Sets up the SDK with a channelId and optional universalLink.
   *
   * This method should be called once and only once, before any other methods in [ExpoLineSDK].
   * Find your channelId in the [LINE Developers Console](https://developers.line.biz/console).
   *
   * If you need to navigate from LINE back to your app via a universal link, you must also:
   * 1. Specify the link URL in the LINE Developers Console
   * 2. Prepare your server and domain to handle the URL
   * 3. Pass the URL in universalLink.
   *
   * For more about this, see the section "Universal Links support" in
   * [Setting up your project](https://developers.line.biz/en/docs/ios-sdk/swift/setting-up-project/).
   * If you don't pass a universalLink in this method, LINE SDK will use the traditional URL
   * scheme to open your app when logging in through LINE.
   */
  async setup(params: SetupParams): Promise<void> {
    await ExpoLineSdkModule.setup(params);
  }

  /**
   * Logs the user into LINE with the specified scopes and option, by either opening the
   * LINE client for an existing logged in user, or a web view if the LINE client isn't installed
   * on the user's device.
   *
   * By default, the login process uses only "profile" as its required scope. If you need
   * more scopes, put the ones you want (in addition to the default "profile") in scopes as a
   * list.
   *
   * If scopes contains "profile", the user profile is returned in the result as
   * [LoginResult.userProfile]. If "profile" is not included, the value of [LoginResult.userProfile]
   * will be undefined.
   *
   * An access token is issued if the user authorizes your app. This token, along with a refresh
   * token, is automatically stored in a secure place in your app for later use. You don't need to
   * refresh the access token manually. Any following API calls will try to refresh the access
   * token when necessary. However, you can refresh the access token manually with [refreshToken()].
   *
   * You can control some other login behaviors, like whether to use a web page for login, or how
   * to ask the user to add your LINE Official Account as a friend. To do so, create a [LoginOption]
   * object and pass it to the option parameter.
   *
   * This method redirects calls to the LINE SDK for the relevant native platform (iOS or Android).
   * If an error happens in the native platform, an error is thrown.
   *
   * The LINE SDK implementation differs between iOS and Android, which means error codes and messages
   * can also be different. For platform-specific error information, see
   * [LineSDKError](https://developers.line.biz/en/reference/ios-sdk-swift/Enums/LineSDKError.html)
   * (iOS) and
   * [LineApiError](https://developers.line.biz/en/reference/android-sdk/reference/com/linecorp/linesdk/LineApiError.html)
   * (Android).
   */
  async login(params?: LoginParams): Promise<LoginResult> {
    const loginParams: LoginParams = {
      scopes: params?.scopes ?? ['profile'],
      option: params?.option,
    };
    return await ExpoLineSdkModule.login(loginParams).then(
      (value: any) => new LoginResult(this._decodeJson(value))
    );
  }

  /**
   * Logs out the current user by revoking the related tokens.
   */
  async logout(): Promise<void> {
    await ExpoLineSdkModule.logout();
  }

  /**
   * Gets the current access token in use.
   *
   * This returns a Promise<StoredAccessToken>, with the access token value contained in the
   * result [StoredAccessToken.value]. If the user isn't logged in, it returns a null value as
   * the Promise result.
   *
   * A valid [StoredAccessToken] object doesn't necessarily mean the access token itself is valid.
   * It may have expired or been revoked by the user from another device or LINE client.
   */
  async currentAccessToken(): Promise<StoredAccessToken | null> {
    const result = await ExpoLineSdkModule.currentAccessToken();
    if (result == null) return null;
    return new StoredAccessToken(this._decodeJson(result));
  }

  /**
   * Gets the user's profile.
   *
   * Using this method requires the "profile" scope.
   */
  async getProfile(): Promise<UserProfile> {
    return await ExpoLineSdkModule.getProfile().then(
      (value: any) => new UserProfile(this._decodeJson(value))
    );
  }

  /**
   * Refreshes the access token.
   *
   * If the token refresh process finishes successfully, the refreshed access token will be
   * automatically stored in the user's device. You can wait for the result of this method or get
   * the refreshed token with [currentAccessToken()].
   *
   * You don't need to refresh the access token manually. Any API call will attempt to refresh the
   * access token when necessary.
   */
  async refreshToken(): Promise<AccessToken> {
    return await ExpoLineSdkModule.refreshToken().then(
      (value: any) => new AccessToken(this._decodeJson(value))
    );
  }

  /**
   * Checks whether the stored access token is valid against the LINE authentication server.
   */
  async verifyAccessToken(): Promise<AccessTokenVerifyResult> {
    return await ExpoLineSdkModule.verifyAccessToken().then(
      (value: any) => new AccessTokenVerifyResult(this._decodeJson(value))
    );
  }

  /**
   * Gets the friendship status between the user and the official account linked to your LINE Login
   * channel.
   *
   * Using this method requires the "profile" scope.
   */
  async getBotFriendshipStatus(): Promise<BotFriendshipStatus> {
    return await ExpoLineSdkModule.getBotFriendshipStatus().then(
      (value: any) => new BotFriendshipStatus(this._decodeJson(value))
    );
  }

  /**
   * Decodes a JSON string or object into an object.
   * Returns an empty object if the source is null or undefined.
   */
  private _decodeJson(source: any): any {
    if (source != null) {
      if (typeof source === 'string') {
        return JSON.parse(source);
      } else {
        // Already an object, return as-is
        return source;
      }
    } else {
      return {};
    }
  }
}

export default ExpoLineSDK;
