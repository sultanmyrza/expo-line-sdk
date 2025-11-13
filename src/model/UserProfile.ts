//
//  UserProfile.ts
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
 * The user profile used in LineSDK.
 */
export class UserProfile {
  private _data: Record<string, any>;

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
   * The display name of the current authorized user.
   */
  get displayName(): string {
    return this._data['displayName'];
  }

  /**
   * The user ID of the current authorized user.
   */
  get userId(): string {
    return this._data['userId'];
  }

  /**
   * The status message of the current authorized user.
   *
   * Empty or null if the user hasn't set a status message.
   */
  get statusMessage(): string | null {
    return this._data['statusMessage'] || null;
  }

  /**
   * URL of current authorized user's profile image.
   *
   * Empty or null if the user hasn't set a profile image.
   */
  get pictureUrl(): string | null {
    return this._data['pictureUrl'] || null;
  }

  /**
   * URL of current authorized user's large profile image.
   *
   * null if the user hasn't set a profile image.
   */
  get pictureUrlLarge(): string | null {
    const url = this.pictureUrl;
    if (url && url !== '') {
      return `${url}/large`;
    }
    return null;
  }

  /**
   * URL of current authorized user's small profile image.
   *
   * null if the user hasn't set a profile image.
   */
  get pictureUrlSmall(): string | null {
    const url = this.pictureUrl;
    if (url && url !== '') {
      return `${url}/small`;
    }
    return null;
  }
}

