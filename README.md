# expo-line-sdk

Expo Line SDK

# API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/line-sdk/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/line-sdk/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install expo-line-sdk
```

### Configure for Android


No additional setup necessary.


### Configure for iOS

Run `npx pod-install` after installing the npm package.

#### Xcode 27 (Expo SDK 57)

Apps built with the iOS 27 SDK must use the UIKit scene life cycle, or they crash at launch with "UIScene life cycle is required for apps built with this SDK". On Expo SDK 57 (`expo` 57.0.23 or later) opt in with `expo-build-properties`:

```sh
npx expo install expo-build-properties
```

```json
{
  "expo": {
    "plugins": [
      ["expo-build-properties", { "ios": { "enableSceneSupport": true } }]
    ]
  }
}
```

Then run `npx expo prebuild --clean`. LINE login callbacks keep working: Expo's scene delegate forwards URLs to the app delegate subscribers. Expo SDK 58 and later enable scene support by default, so you don't need this there. See [expo/expo#46664](https://github.com/expo/expo/issues/46664#issuecomment-5683396867).

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
