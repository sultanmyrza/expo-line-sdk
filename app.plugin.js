/**
 * Expo config plugins are executed by Node during `expo prebuild`.
 * Node will not load TypeScript by default, so we provide a JS entrypoint.
 *
 * Resolution order (Expo): `app.plugin.js` in package root, then `main`.
 * See https://docs.expo.dev/config-plugins/mods/
 */
const { withInfoPlist } = require('expo/config-plugins');
 
/** @type {import('expo/config-plugins').ConfigPlugin} */
const withLineUrlScheme = (config) => {
  return withInfoPlist(config, (config) => {
    const scheme = 'line3rdp.$(PRODUCT_BUNDLE_IDENTIFIER)';
 
    config.modResults.CFBundleURLTypes = config.modResults.CFBundleURLTypes ?? [];
 
    const alreadyExists = config.modResults.CFBundleURLTypes.some(
      (entry) => Array.isArray(entry?.CFBundleURLSchemes) && entry.CFBundleURLSchemes.includes(scheme)
    );
 
    if (!alreadyExists) {
      config.modResults.CFBundleURLTypes.push({
        CFBundleURLSchemes: [scheme],
      });
    }
 
    return config;
  });
};
 
module.exports = withLineUrlScheme;

