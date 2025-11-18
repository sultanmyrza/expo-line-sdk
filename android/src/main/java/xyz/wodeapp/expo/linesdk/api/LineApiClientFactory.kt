package xyz.wodeapp.expo.linesdk.api

import android.content.Context
import android.net.Uri
import com.linecorp.linesdk.api.LineApiClient
import com.linecorp.linesdk.api.LineApiClientBuilder

object LineApiClientFactory {
    fun createLineApiClient(
        context: Context,
        channelId: String,
        apiServerBaseUrl: String
    ): LineApiClient {
        return LineApiClientBuilder(context, channelId)
            .apiBaseUri(Uri.parse(apiServerBaseUrl))
            .build()
    }
}
