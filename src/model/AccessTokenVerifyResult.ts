//
//  AccessTokenVerifyResult.ts
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
 * Response to LineSDK.verifyAccessToken().
 */
export class AccessTokenVerifyResult {
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
   * The channel ID bound to the access token.
   */
  get channelId(): string {
    return this._data['client_id'];
  }

  /**
   * The valid scopes bound to this access token.
   */
  get scopes(): string[] {
    const scope = this._data['scope'] || '';
    return scope ? scope.split(' ') : [];
  }

  /**
   * Number of seconds until the access token expires.
   * Counting from when the server received the request.
   */
  get expiresIn(): number {
    return this._data['expires_in'];
  }
}

