import { registerRootComponent } from 'expo';
import ExpoLineSdk from 'expo-line-sdk';

import App from './App';

const channelId = process.env.EXPO_PUBLIC_LINE_CHANNEL_ID;
if (!channelId) {
  console.error('EXPO_PUBLIC_LINE_CHANNEL_ID is not set');
} else {
  ExpoLineSdk.instance.setup({ channelId }).then(() => {
    console.log('LineSDK Prepared');
  });
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
