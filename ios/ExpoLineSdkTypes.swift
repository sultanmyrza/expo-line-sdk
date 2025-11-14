import ExpoModulesCore

// Internal structs for parameter validation and type safety
internal struct LoginParams: Record {
  @Field
  var scopes: [String]?

  @Field
  var option: LoginOption?
}

internal struct LoginOption: Record {
  @Field
  var onlyWebLogin: Bool?

  @Field
  var botPrompt: String?

  @Field
  var requestCode: Int?

  @Field
  var idTokenNonce: String?
}
