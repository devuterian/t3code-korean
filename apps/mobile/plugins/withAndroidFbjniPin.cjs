const fs = require("node:fs");
const path = require("node:path");
const { withProjectBuildGradle } = require("expo/config-plugins");

// react-native-shiki-engine declares `com.facebook.fbjni:fbjni:+`, so Gradle
// resolves the newest fbjni (0.8.x, built with NDK 28). The app packages React
// Native's NDK 27 libc++_shared.so, which lacks `__cxa_init_primary_exception`,
// and release builds crash at launch with "couldn't find DSO to load:
// libfbjni.so". Pin fbjni to the version React Native itself ships with.
const MARKER = "// @generated withAndroidFbjniPin";

function readReactNativeFbjniVersion(projectRoot) {
  const reactNativeRoot = path.dirname(
    require.resolve("react-native/package.json", { paths: [projectRoot] }),
  );
  const catalog = fs.readFileSync(
    path.join(reactNativeRoot, "gradle", "libs.versions.toml"),
    "utf8",
  );
  const match = /^fbjni\s*=\s*"([^"]+)"/m.exec(catalog);
  if (!match) throw new Error("Could not read the fbjni version from React Native's catalog.");
  return match[1];
}

module.exports = function withAndroidFbjniPin(config) {
  return withProjectBuildGradle(config, (nextConfig) => {
    if (nextConfig.modResults.contents.includes(MARKER)) return nextConfig;
    const version = readReactNativeFbjniVersion(nextConfig.modRequest.projectRoot);
    nextConfig.modResults.contents += `
${MARKER}
allprojects {
  configurations.configureEach {
    resolutionStrategy.force "com.facebook.fbjni:fbjni:${version}"
  }
}
`;
    return nextConfig;
  });
};
