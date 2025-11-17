//
//  AccessToken.ts
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

/**
 * An access token used to access the LINE Platform.
 *
 * Most API calls to the LINE Platform require an access token as evidence of successful
 * authorization. A valid access token is issued after the user grants your app the
 * permissions that your app requests. An access token is bound to permissions (scopes)
 * that define which API endpoints you can access. Choose the permissions for your
 * channel in the LINE Developers site and set them in the login method used in your app.
 *
 * An access token expires after a certain period. expiresIn specifies the amount of time
 * until the token expires, counting from the moment of issue.
 *
 * By default, the LINE SDK stores access tokens in a secure place on the device running
 * your app and obtains authorization when you access the LINE Platform through the
 * framework request methods.
 *
 * Don't try to create an access token yourself. You can get the stored access token with
 * LineSDK.currentAccessToken().
 */
export class AccessToken {
  private _data: Record<string, any>;
  private _idToken?: Record<string, any> | null;

  constructor(data: Record<string, any>) {
    this._data = data;
  }

  /**
   * Raw data of the response in a Map representation.
   */
  get data(): Record<string, any> {
    return this._data;
  }

  /**
   * The value of the access token.
   */
  get value(): string {
    return this._data['access_token'];
  }

  /**
   * Number of seconds until the access token expires,
   * counting from when the server issued the token.
   */
  get expiresIn(): number {
    return this._data['expires_in'];
  }

  /**
   * The raw string value of the ID token bound to the access token. It is a Base64 URL encoded string
   * which follows specification of JSON Web Token (JWT). If you need to access a field value in the
   * ID Token, use the idToken getter.
   *
   * The value exists only if the access token is obtained with the openID
   * permission. Otherwise, null is returned.
   */
  get idTokenRaw(): string | null {
    return this._data['id_token'] || null;
  }

  /**
   * The Record<string, any> representation of the received ID Token.
   * This getter converts the received idTokenRaw to a dictionary format if it exists.
   *
   * If you are not applying an ID Token when login, null is returned.
   */
  get idToken(): Record<string, any> | null {
    // Lazy variable - return cached value if already parsed
    if (this._idToken !== undefined && this._idToken !== null) {
      return this._idToken;
    }
    if (this._idToken === null) {
      return null;
    }

    if (!this.idTokenRaw) {
      this._idToken = null;
      return null;
    }

    const parts = this.idTokenRaw.split('.');
    // Malformed JWT format.
    if (parts.length !== 3) {
      this._idToken = null;
      return null;
    }

    try {
      // Base64 URL decode the payload (second part)
      const normalizedPayload = this.base64UrlNormalize(parts[1]);
      const jsonPayload = this.base64UrlDecode(normalizedPayload);
      const parsed = JSON.parse(jsonPayload);
      this._idToken = parsed;
      return parsed;
    } catch (error) {
      this._idToken = null;
      return null;
    }
  }

  /**
   * The valid scopes bound to this access token.
   */
  get scopes(): string[] {
    const scope = this._data['scope'] || '';
    return scope ? scope.split(' ') : [];
  }

  /**
   * The expected authorization type when this token is used in a request
   * header. Fixed to Bearer for now.
   */
  get tokenType(): string {
    return this._data['token_type'];
  }

  /**
   * The email address set by the user. This value only exists when idToken is
   * valid and the user has set the email address in LINE and agreed to share it
   * with you. Both "openid" and "email" scopes are required to get the user email.
   *
   * If you are not applying an ID Token when login, or the user does not set
   * the email for the LINE account, or the user refuses to grant your access,
   * null is returned.
   */
  get email(): string | null {
    return this.idToken?.['email'] || null;
  }

  /**
   * Normalizes Base64 URL encoded string to standard Base64 format.
   * Replaces URL-safe characters and adds padding if needed.
   */
  private base64UrlNormalize(base64Url: string): string {
    let normalized = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (normalized.length % 4) {
      normalized += '=';
    }
    return normalized;
  }

  /**
   * Decodes Base64 URL encoded string to UTF-8 string.
   */
  private base64UrlDecode(base64: string): string {
    try {
      // Use atob for base64 decoding (available in browser and React Native)
      const binaryString = atob(base64);
      // Convert binary string to UTF-8
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      // Decode UTF-8
      return new TextDecoder().decode(bytes);
    } catch (error) {
      // Fallback for environments without atob
      throw new Error('Failed to decode base64 string');
    }
  }
}

