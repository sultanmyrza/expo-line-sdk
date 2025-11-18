package xyz.wodeapp.expo.linesdk.auth

import android.net.Uri
import com.linecorp.linesdk.auth.LineAuthenticationConfig

object LineAuthenticationConfigFactory {
    fun createConfig(
        channelId: String,
        openIdDocumentUrl: String,
        apiServerBaseUrl: String,
        webLoginPageUrl: String,
        isLineAppAuthDisabled: Boolean
    ): LineAuthenticationConfig {
        val configBuilder = LineAuthenticationConfig.Builder(channelId)

        if (isLineAppAuthDisabled) {
            configBuilder.disableLineAppAuthentication()
        }

        return configBuilder.build()
        
//        NOTE: openidDiscoveryDocumentUrl, apiBaseUrl, webLoginPageUrl are deprecated

//        val configBuilder = LineAuthenticationConfig.Builder(channelId)
//            .openidDiscoveryDocumentUrl(Uri.parse(openIdDocumentUrl))
//            .apiBaseUrl(Uri.parse(apiServerBaseUrl))
//            .webLoginPageUrl(Uri.parse(webLoginPageUrl))
//
//        if (isLineAppAuthDisabled) {
//            configBuilder.disableLineAppAuthentication()
//        }
//
//        return configBuilder.build()
    }
}
