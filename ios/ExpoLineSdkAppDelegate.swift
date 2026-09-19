import ExpoModulesCore
import UIKit

import LineSDK

// AppDelegate subscriber that forwards LINE login callbacks to the LineSDK `LoginManager`,
// mirroring the behavior in `FlutterLineSdkPlugin.application(_:open:options:)` and
// `FlutterLineSdkPlugin.application(_:continue:restorationHandler:)`.
//
// Flutter also registers UIScene handlers (`scene(_:openURLContexts:)` and
// `scene(_:continue:)`) because Flutter 3.38+ delivers universal links through UIScene.
// ExpoAppDelegateSubscriber is UIApplicationDelegate-only; this SDK has no scene-subscriber
// API, so Expo hosts forward URL / user-activity callbacks through AppDelegate subscribers.
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


