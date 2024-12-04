import { NativeModule, requireNativeModule } from 'expo';

import { ExpoLineSdkModuleEvents } from './ExpoLineSdk.types';

declare class ExpoLineSdkModule extends NativeModule<ExpoLineSdkModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoLineSdkModule>('ExpoLineSdk');
