package xyz.wodeapp.expo.linesdk.util

import xyz.wodeapp.expo.linesdk.BuildConfig


inline fun runIfDebugBuild(action: () -> Unit) {
    if (BuildConfig.DEBUG) action()
}
