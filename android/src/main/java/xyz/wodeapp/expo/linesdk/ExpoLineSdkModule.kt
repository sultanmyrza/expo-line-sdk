package xyz.wodeapp.expo.linesdk

import android.app.Activity
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.text.orEmpty

class ExpoLineSdkModule : Module() {
    companion object {
        // Shared instance so lifecycle listener can access it
        val lineSdkWrapper = LineSdkWrapper()
        private const val DEFAULT_ACTIVITY_RESULT_REQUEST_CODE = 8192
    }

    private fun onMethodCall(call: MethodCall, result: Promise) {
        when (call.method) {
            "toBeta" -> run {
                val channelId = call.argument<String>("channelId").orEmpty()
                val openDiscoveryIdDocumentUrl = call.argument<String>("openDiscoveryIdDocumentUrl").orEmpty()
                val apiServerBaseUrl = call.argument<String>("apiServerBaseUrl").orEmpty()
                val webLoginPageUrl = call.argument<String>("webLoginPageUrl").orEmpty()
                lineSdkWrapper.setupBetaConfig(
                    channelId,
                    openDiscoveryIdDocumentUrl,
                    apiServerBaseUrl,
                    webLoginPageUrl
                )
                result.resolve(null)
            }

            "setup" -> {
                withActivity(result) { activity ->
                    val channelId = call.argument<String>("channelId").orEmpty()
                    lineSdkWrapper.setupSdk(activity, channelId)
                    result.resolve(null)
                }
            }

            "login" -> {
                withActivity(result) { activity ->
                    val scopes = call.argument<List<String>>("scopes").orEmpty()
                    val isWebLogin = call.argument<Boolean>("onlyWebLogin") ?: false
                    val botPrompt = call.argument<String>("botPrompt") ?: "normal"
                    val idTokenNonce = call.argument<String>("idTokenNonce")
                    val loginRequestCode = call.argument<Int>("loginRequestCode")
                        ?: DEFAULT_ACTIVITY_RESULT_REQUEST_CODE
                    lineSdkWrapper.login(
                        loginRequestCode,
                        activity,
                        scopes = scopes,
                        onlyWebLogin = isWebLogin,
                        botPromptString = botPrompt,
                        idTokenNonce = idTokenNonce,
                        result = result
                    )
                }
            }

            "getProfile" -> lineSdkWrapper.getProfile(result)
            "currentAccessToken" -> lineSdkWrapper.getCurrentAccessToken(result)
            "refreshToken" -> lineSdkWrapper.refreshToken(result)
            "verifyAccessToken" -> lineSdkWrapper.verifyAccessToken(result)
            "getBotFriendshipStatus" -> lineSdkWrapper.getBotFriendshipStatus(result)
            "logout" -> lineSdkWrapper.logout(result)
            else -> result.notImplemented()
        }
    }

    private fun withActivity(result: Promise, block: (Activity) -> Unit) {
        val activity = appContext.currentActivity
        if (activity == null) {
            result.reject(
                "no_activity_found",
                "There is no valid Activity found to present LINE SDK Login screen.",
                null
            )
            return
        }
        block(activity)
    }

    override fun definition() = ModuleDefinition {
        Name("ExpoLineSdk")

        AsyncFunction("toBeta") { argument: Map<String, Any>?, result: Promise ->
            onMethodCall(MethodCall("toBeta", argument), result)
        }

        AsyncFunction("setup") { argument: Map<String, Any>?, result: Promise ->
            onMethodCall(MethodCall("setup", argument), result)
        }

        AsyncFunction("login") { argument: Map<String, Any>?, result: Promise ->
            onMethodCall(MethodCall("login", argument), result)
        }

        AsyncFunction("getProfile") { result: Promise ->
            onMethodCall(MethodCall("getProfile", null), result)
        }

        AsyncFunction("currentAccessToken") { result: Promise ->
            onMethodCall(MethodCall("currentAccessToken", null), result)
        }

        AsyncFunction("refreshToken") { result: Promise ->
            onMethodCall(MethodCall("refreshToken", null), result)
        }

        AsyncFunction("verifyAccessToken") { result: Promise ->
            onMethodCall(MethodCall("verifyAccessToken", null), result)
        }

        AsyncFunction("getBotFriendshipStatus") { result: Promise ->
            onMethodCall(MethodCall("getBotFriendshipStatus", null), result)
        }

        AsyncFunction("logout") { result: Promise ->
            onMethodCall(MethodCall("logout", null), result)
        }
    }
}

// Mimics Flutter's MethodCall interface
private class MethodCall(val method: String, private val arguments: Map<String, Any>?) {
    @Suppress("UNCHECKED_CAST")
    fun <T> argument(key: String): T? {
        return arguments?.get(key) as? T
    }
}

// Extension to mimic Flutter's Result.notImplemented()
private fun Promise.notImplemented() {
    this.reject("method_not_implemented", "Method is not implemented", null)
}