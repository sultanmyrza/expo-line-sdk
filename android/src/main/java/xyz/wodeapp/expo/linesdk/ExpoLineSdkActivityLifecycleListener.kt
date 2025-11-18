package xyz.wodeapp.expo.linesdk

import android.app.Activity
import android.content.Intent
import expo.modules.core.interfaces.ReactActivityLifecycleListener

/**
 * Activity lifecycle listener that handles LINE SDK login activity results.
 * This mirrors the behavior in FlutterLineSdkPlugin's activity result handling.
 * 
 * Note: onActivityResult might need to be handled differently depending on Expo modules API.
 * If this doesn't work, we may need to use onNewIntent or a different mechanism.
 */
class ExpoLineSdkActivityLifecycleListener : ReactActivityLifecycleListener {
    
    /**
     * Handles activity results from LINE SDK login flow.
     * This method may not be directly available in ReactActivityLifecycleListener.
     * If not available, we'll need to use an alternative approach.
     */
    fun onActivityResult(
        activity: Activity,
        requestCode: Int,
        resultCode: Int,
        intent: Intent?
    ): Boolean {
        // Forward activity result to LineSdkWrapper for handling
        return ExpoLineSdkModule.lineSdkWrapper.handleActivityResult(
            requestCode,
            resultCode,
            intent
        )
    }
}

