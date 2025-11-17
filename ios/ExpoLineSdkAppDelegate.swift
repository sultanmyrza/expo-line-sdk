import ExpoModulesCore
import UIKit

import LineSDK

// AppDelegate subscriber that forwards LINE login callbacks to the LineSDK `LoginManager`,
// mirroring the behavior in `FlutterLineSdkPlugin.application(_:open:options:)` and
// `FlutterLineSdkPlugin.application(_:continue:restorationHandler:)`.
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


