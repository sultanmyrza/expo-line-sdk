import ExpoModulesCore

import LineSDK

public class ExpoLineSdkModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoLineSdk')` in JavaScript.
    Name("ExpoLineSdk")
      
      AsyncFunction("setup") { (arguments: [String: Any]?, result: Promise) in
          guard !LoginManager.shared.isSetupFinished else {
              result.resolve(nil)
              return
          }
          
          guard let args = arguments else {
              result.reject(ExpoError.nilArgument)
              return
          }
          
          guard let channelId = args["channelId"] as? String else {
              result.reject(ExpoError.failedArgumentField("channelId", type: String.self))
              return
          }
          
          let universalLinkURL = (args["universalLink"] as? String)
              .map { URL(string: $0) } ?? nil
          LoginManager.shared.setup(channelID: channelId, universalLinkURL: universalLinkURL)
          result.resolve(nil)
      }

    // Defines constant property on the module.
    Constant("PI") {
      Double.pi
    }

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(ExpoLineSdkView.self) {
      // Defines a setter for the `url` prop.
      Prop("url") { (view: ExpoLineSdkView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
}

// MARK: - Error bridging

public struct ExpoError: Error {
  public let code: String
  public let message: String?
  public let details: Any?

  public init(code: String, message: String?, details: Any?) {
    self.code = code
    self.message = message
    self.details = details
  }
}

extension ExpoError {
  static let nilArgument = ExpoError(
    code: "argument.nil",
    message: "Expect an argument when invoking function, but it is nil.",
    details: nil
  )

  static func failedArgumentField<T>(_ fieldName: String, type: T.Type) -> ExpoError {
    return .init(
      code: "argument.failedField",
      message: "Expect a `\(fieldName)` field with type <\(type)> in the argument, " +
               "but it is missing or type not matched.",
      details: fieldName
    )
  }
}

extension LineSDKError {
  var expoError: ExpoError {
    return ExpoError(
      code: String(errorCode),
      message: errorDescription,
      details: errorUserInfo
    )
  }
}
