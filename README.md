# expo-line-sdk

> **Pre-release:** APIs may change before 1.0.

An [Expo] module that lets you use LINE's native SDKs for iOS and Android in React Native apps. Its API mirrors [flutter_line_sdk](https://github.com/line/flutter_line_sdk).

```ts
import ExpoLineSdk from 'expo-line-sdk';

async function login() {
  try {
    const result = await ExpoLineSdk.instance.login();
    // user id -> result.userProfile?.userId
    // user name -> result.userProfile?.displayName
    // user avatar -> result.userProfile?.pictureUrl
  } catch (e) {
    console.error(e);
  }
}
```

For more examples, see the [example app](example).

## Prerequisites

- A [development build](https://docs.expo.dev/develop/development-builds/introduction/) (this module doesn't work in Expo Go)
- iOS 16.4 or later
- Android 7.0 (API level 24) or later
- [LINE Login channel linked to your app](https://developers.line.biz/en/docs/line-login/getting-started/)

In the [LINE Developers console][console], open your LINE Login channel's **App settings** tab and enter:

| Platform | Setting | Value |
|-------|-------|---------|
| iOS | iOS bundle ID | Required. `ios.bundleIdentifier` from your `app.json`. |
| iOS | iOS universal link | Optional. See [Universal Links support](https://developers.line.biz/en/docs/ios-sdk/swift/setting-up-project/#universal-link-support). |
| Android | Android package name | Required. `android.package` from your `app.json`. |
| Android | Android package signature | Optional. |

## Installation

```sh
npx expo install expo-line-sdk
```

Add the config plugin to `app.json`:

```json
{
  "expo": {
    "plugins": ["expo-line-sdk"]
  }
}
```

The plugin adds the URL schemes LINE needs to `Info.plist`. Android needs no extra configuration. Rebuild the native app after adding it (`npx expo prebuild --clean`).

## Usage

### Setup

Call `setup` exactly once, before any other method, for example in `index.ts`:

```ts
import ExpoLineSdk from 'expo-line-sdk';

ExpoLineSdk.instance.setup({ channelId: 'YOUR_CHANNEL_ID' });
```

To use a universal link on iOS, pass `setup({ channelId, universalLink })`.

### Login

```ts
const result = await ExpoLineSdk.instance.login();
// result.userProfile?.userId
// result.userProfile?.displayName
```

By default, `login` uses the `['profile']` scope. Pass other [scopes](https://developers.line.biz/en/docs/line-login/web/integrate-line-login/#scopes) as needed:

```ts
const result = await ExpoLineSdk.instance.login({
  scopes: ['profile', 'openid', 'email'],
});
// user email, if the user set it in LINE and granted your request.
const userEmail = result.accessToken.email;
```

> Without the `"profile"` scope, `userProfile` is `null`.

To force web login or show the "add LINE Official Account as a friend" prompt, pass a `LoginOption`:

```ts
import { LoginOption } from 'expo-line-sdk';

await ExpoLineSdk.instance.login({
  option: new LoginOption(/* onlyWebLogin */ true, /* botPrompt */ 'normal'),
});
```

### Logout

```ts
await ExpoLineSdk.instance.logout();
```

### Get user profile

```ts
const profile = await ExpoLineSdk.instance.getProfile();
// profile.userId
// profile.displayName
// profile.pictureUrl
```

### Get current stored access token

```ts
const token = await ExpoLineSdk.instance.currentAccessToken();
// token?.value
```

> Returns `null` if the user isn't logged in. A stored token may still have expired or been revoked.

### Verify access token with LINE server

```ts
const result = await ExpoLineSdk.instance.verifyAccessToken();
// throws if the token is not valid
```

### Refresh current access token

```ts
const token = await ExpoLineSdk.instance.refreshToken();
// token.value
// token.expiresIn
```

You normally don't need this: the SDK refreshes access tokens automatically when needed.

### Get friendship status with your LINE Official Account

```ts
const status = await ExpoLineSdk.instance.getBotFriendshipStatus();
// status.isFriend
```

## Error handling

Failed calls reject with an error that has a `code` and a `message`:

```ts
try {
  await ExpoLineSdk.instance.login();
} catch (e: any) {
  console.log(e.code, e.message);
}
```

[Expo]: https://expo.dev/
[console]: https://developers.line.biz/console/
