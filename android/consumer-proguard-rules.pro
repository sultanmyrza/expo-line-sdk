-keep class xyz.wodeapp.expo.linesdk.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

## gson
-dontwarn sun.misc.**
-keep class xyz.wodeapp.expo.linesdk.model.** { *; }
-keepclassmembers class xyz.wodeapp.expo.linesdk.model.** { <fields>; }
-keepclassmembers class com.linecorp.linesdk.** { <fields>; }
-keep class * implements com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Prevent R8 from leaving Data object members always null
-keepclassmembers class * {
  @com.google.gson.annotations.SerializedName <fields>;
}

# LINE SDK factories placed in LINE packages for package-private builder access (mirrors flutter_line_sdk)
-keep class com.linecorp.linesdk.auth.LineAuthenticationConfigFactory { *; }
-keep class com.linecorp.linesdk.api.LineApiClientFactory { *; }
