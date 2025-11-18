package xyz.wodeapp.expo.linesdk

import android.content.Context
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

/**
 * Package class that registers lifecycle listeners for the Expo LINE SDK module.
 * This mirrors the behavior in FlutterLineSdkPlugin's ActivityAware implementation.
 */
class ExpoLineSdkPackage : Package {
    override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
        return listOf(ExpoLineSdkActivityLifecycleListener())
    }
}

