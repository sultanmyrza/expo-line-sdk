import * as React from 'react';

import { ExpoLineSdkViewProps } from './ExpoLineSdk.types';

export default function ExpoLineSdkView(props: ExpoLineSdkViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
