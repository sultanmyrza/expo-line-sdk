import { registerWebModule, NativeModule } from 'expo';

import { ExpoLineSdkModuleEvents } from './ExpoLineSdk.types';

class ExpoLineSdkModule extends NativeModule<ExpoLineSdkModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoLineSdkModule);
