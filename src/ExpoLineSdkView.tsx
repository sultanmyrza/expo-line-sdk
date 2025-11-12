import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoLineSdkViewProps } from './ExpoLineSdk.types';

const NativeView: React.ComponentType<ExpoLineSdkViewProps> =
  requireNativeView('ExpoLineSdk');

export default function ExpoLineSdkView(props: ExpoLineSdkViewProps) {
  return <NativeView {...props} />;
}
