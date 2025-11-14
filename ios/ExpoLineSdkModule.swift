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
    
    AsyncFunction("setup") { (channelId: String, universalLink: String?, result: Promise) in
      // Expo handles automatic validation and type-safety; however, to maintain Flutter parity
      // for cross-framework porting, we convert validated Expo parameters to dictionary for internal API consistency
      let arguments: [String: Any] = [ "channelId": channelId, "universalLink": universalLink].compactMapValues { $0 }

      guard let method = LineChannelMethod(rawValue: "setup") else {
        result.reject(ExpoError.methodNotImplemented)
        return
      }
      method.call(arguments: arguments, result: result)
    }

    AsyncFunction("login") { (params: LoginParams?, result: Promise) in
      // Convert validated Expo parameters to dictionary for internal API consistency
      // Expo handles automatic validation and type-safety; we maintain Flutter parity for cross-framework porting
      let arguments: [String: Any] = [
        "scopes": params?.scopes,
        "onlyWebLogin": params?.option?.onlyWebLogin,
        "botPrompt": params?.option?.botPrompt,
        "requestCode": params?.option?.requestCode,
        "idTokenNonce": params?.option?.idTokenNonce
      ].compactMapValues { $0 }

      guard let method = LineChannelMethod(rawValue: "login") else {
        result.reject(ExpoError.methodNotImplemented)
        return
      }
      method.call(arguments: arguments, result: result)
    }

    AsyncFunction("logout") { (result: Promise) in
      guard let method = LineChannelMethod(rawValue: "logout") else {
        result.reject(ExpoError.methodNotImplemented)
        return
      }
      method.call(arguments: nil, result: result)
    }

    AsyncFunction("getProfile") { (result: Promise) in
      guard let method = LineChannelMethod(rawValue: "getProfile") else {
        result.reject(ExpoError.methodNotImplemented)
        return
      }
      method.call(arguments: nil, result: result)
    }

    AsyncFunction("refreshToken") { (result: Promise) in
      guard let method = LineChannelMethod(rawValue: "refreshToken") else {
        result.reject(ExpoError.methodNotImplemented)
        return
      }
      method.call(arguments: nil, result: result)
    }

    AsyncFunction("verifyAccessToken") { (result: Promise) in
      guard let method = LineChannelMethod(rawValue: "verifyAccessToken") else {
        result.reject(ExpoError.methodNotImplemented)
        return
      }
      method.call(arguments: nil, result: result)
    }

    AsyncFunction("getBotFriendshipStatus") { (result: Promise) in
      guard let method = LineChannelMethod(rawValue: "getBotFriendshipStatus") else {
        result.reject(ExpoError.methodNotImplemented)
        return
      }
      method.call(arguments: nil, result: result)
    }

    AsyncFunction("currentAccessToken") { (result: Promise) in
      guard let method = LineChannelMethod(rawValue: "currentAccessToken") else {
        result.reject(ExpoError.methodNotImplemented)
        return
      }
      method.call(arguments: nil, result: result)
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

enum LineChannelMethod: String {
  case setup
  case login
  case logout
  case getProfile
  case refreshToken
  case verifyAccessToken
  case getBotFriendshipStatus
  case currentAccessToken
  
  func call(arguments: [String: Any]?, result: Promise) {
    
    let runner: (_ arguments: [String: Any]?, _ result: Promise) -> Void
    
    switch self {
    case .setup:                  runner = setup
    case .login:                  runner = { arguments, result in
      Task { @MainActor in
        self.login(arguments: arguments, result: result)
      }
    }
    case .logout:                 runner = logout
    case .getProfile:             runner = getProfile
    case .refreshToken:           runner = refreshToken
    case .verifyAccessToken:      runner = verifyAccessToken
    case .getBotFriendshipStatus: runner = getBotFriendshipStatus
    case .currentAccessToken:     runner = currentAccessToken
    }
    
    runner(arguments, result)
  }
}

extension LineChannelMethod {
  
  func setup(arguments: [String: Any]?, result: Promise) {
    
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
  
  @MainActor
  func login(arguments: [String: Any]?, result: Promise) {
    
    guard let args = arguments else {
      result.reject(ExpoError.nilArgument)
      return
    }
    
    let scopes = (args["scopes"] as? [String])?.map { LoginPermission(rawValue: $0) } ?? [.profile]
    
    var parameters = LoginManager.Parameters()
    parameters.onlyWebLogin = (args["onlyWebLogin"] as? Bool) ?? false
    parameters.IDTokenNonce = args["idTokenNonce"] as? String
    
    if let botPrompt = args["botPrompt"] as? String {
      switch botPrompt {
      case "aggressive": parameters.botPromptStyle = .aggressive
      case "normal": parameters.botPromptStyle = .normal
      default: break
      }
    }
    
    LoginManager.shared.login(
      permissions: Set(scopes),
      in: nil,
      parameters: parameters) { r in
        switch r {
        case .success(let value): result.resolve(value)
        case .failure(let error): result.reject(error.expoError)
        }
      }
  }
  
  func logout(arguments: [String: Any]?, result: Promise) {
    LoginManager.shared.logout { r in
      switch r {
      case .success: result.resolve(nil)
      case .failure(let error): result.reject(error.expoError)
      }
    }
  }
  
  func getProfile(arguments: [String: Any]?, result: Promise) {
    API.getProfile { r in
      switch r {
      case .success(let value): result.resolve(value)
      case .failure(let error): result.reject(error.expoError)
      }
    }
  }
  
  func refreshToken(arguments: [String: Any]?, result: Promise) {
    API.Auth.refreshAccessToken { r in
      switch r {
      case .success(let value): result.resolve(value)
      case .failure(let error): result.reject(error.expoError)
      }
    }
  }
  
  func verifyAccessToken(arguments: [String: Any]?, result: Promise) {
    API.Auth.verifyAccessToken { r in
      switch r {
      case .success(let value): result.resolve(value)
      case .failure(let error): result.reject(error.expoError)
      }
    }
  }
  
  func getBotFriendshipStatus(arguments: [String: Any]?, result: Promise) {
    API.getBotFriendshipStatus { r in
      switch r {
      case .success(let value): result.resolve(value)
      case .failure(let error): result.reject(error.expoError)
      }
    }
  }
  
  func currentAccessToken(arguments: [String: Any]?, result: Promise) {
    result.resolve(AccessTokenStore.shared.current)
  }
}

extension LineSDKError {
  var expoError: ExpoError {
    return ExpoError(code: String(errorCode),message: errorDescription, details: errorUserInfo)
  }
}


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
    message: "Expect an argument when invoking function, but it is nil.", details: nil
  )

  static func failedArgumentField<T>(_ fieldName: String, type: T.Type) -> ExpoError {
    return .init(
      code: "argument.failedField",
      message: "Expect a `\(fieldName)` field with type <\(type)> in the argument, " +
      "but it is missing or type not matched.",
      details: fieldName)
  }

  // In Expo module context, method dispatch is handled by AsyncFunction declarations,
  // so this error won't occur. We add it to maintain parity with Flutter implementation
  // and make future ports/refactors easier.
  static let methodNotImplemented = ExpoError(
    code: "method.notImplemented",
    message: "The requested method is not implemented.",
    details: nil
  )
}

