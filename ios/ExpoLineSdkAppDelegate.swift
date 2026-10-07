import ExpoModulesCore
import UIKit

import LineSDK

// AppDelegate subscriber that forwards LINE login callbacks to the LineSDK `LoginManager`,
// mirroring the behavior in `FlutterLineSdkPlugin.application(_:open:options:)` and
// `FlutterLineSdkPlugin.application(_:continue:restorationHandler:)`.
//
// Flutter also registers UIScene handlers (`scene(_:openURLContexts:)` and
// `scene(_:continue:)`) because Flutter 3.38+ delivers universal links through UIScene.
// ExpoAppDelegateSubscriber is UIApplicationDelegate-only, but no scene handlers are needed here:
// with scene support enabled (`expo-build-properties` `ios.enableSceneSupport`, required for
// Xcode 27 on SDK 57), `ExpoAppSceneDelegate` re-feeds scene URL / user-activity events to
// `ExpoAppDelegate`, which calls these subscriber methods.
public class ExpoLineSdkAppDelegate: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    return LoginManager.shared.nonisolatedApplication(
      application,
      open: url,
      options: options
    )
  }

  public func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([Any]) -> Void
  ) -> Bool {
    return LoginManager.shared.nonisolatedApplication(
      application,
      open: userActivity.webpageURL
    )
  }
}


