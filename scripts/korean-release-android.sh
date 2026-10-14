#!/usr/bin/env bash
# Build the Korean fork's Android arm64 release APK locally. It never uploads.
#
#   scripts/korean-release-android.sh 0.0.46-ko.6 [output-dir]
#
# Needs JDK 17 and an Android SDK (Homebrew: openjdk@17, android-commandlinetools;
# then sdkmanager "platforms;android-37.0" "build-tools;37.0.0" "ndk;27.1.12297006"
# "cmake;3.22.1"). The APK is signed with the pinned public debug key in
# apps/mobile/signing (see apps/mobile/plugins/withAndroidKoreanReleaseSigning.cjs);
# phones already running a Korean build only accept updates signed by it.
set -euo pipefail

EXPECTED_SIGNER_SHA256="fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MOBILE_DIR="$REPO_ROOT/apps/mobile"

VERSION="${1:-}"
if [[ ! "$VERSION" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)-ko\.([0-9]+)$ ]]; then
  echo "usage: $0 <version like 0.0.46-ko.6> [output-dir]" >&2
  exit 64
fi
# Monotonic across releases: 0.0.46-ko.6 -> 46006, 0.1.0-ko.1 -> 1000001. Must
# stay above every installed build (ko.1-ko.4 shipped versionCode 1). Base 10
# so a leading zero is not read as octal.
MAJOR=$((10#${BASH_REMATCH[1]}))
MINOR=$((10#${BASH_REMATCH[2]}))
PATCH=$((10#${BASH_REMATCH[3]}))
KO=$((10#${BASH_REMATCH[4]}))
if ((MINOR >= 100 || PATCH >= 1000 || KO >= 1000)); then
  echo "error: $VERSION does not fit the versionCode scheme (minor < 100, patch < 1000, ko < 1000)." >&2
  exit 64
fi
VERSION_CODE=$((MAJOR * 100000000 + MINOR * 1000000 + PATCH * 1000 + KO))
# Google Play and Android cap versionCode at 2100000000.
if ((VERSION_CODE > 2100000000)); then
  echo "error: versionCode $VERSION_CODE for $VERSION is above Android's 2100000000 limit." >&2
  exit 64
fi
OUTPUT_DIR="${2:-$REPO_ROOT/release-ko${VERSION##*-ko.}}"
APK_OUT="$OUTPUT_DIR/T3-Code-Korean-$VERSION-android-arm64.apk"
if [[ -e "$APK_OUT" ]]; then
  echo "error: $APK_OUT already exists; pick another output dir." >&2
  exit 1
fi

export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home}"
export ANDROID_HOME="${ANDROID_HOME:-/opt/homebrew/share/android-commandlinetools}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
BUILD_TOOLS="$ANDROID_HOME/build-tools/37.0.0"
for tool in "$JAVA_HOME/bin/java" "$BUILD_TOOLS/apksigner" "$BUILD_TOOLS/aapt2"; do
  [[ -x "$tool" ]] || { echo "error: missing $tool" >&2; exit 1; }
done
export PATH="$JAVA_HOME/bin:$MOBILE_DIR/node_modules/.bin:$REPO_ROOT/node_modules/.bin:$PATH"

export APP_VARIANT=production
export EXPO_NO_GIT_STATUS=1
export T3CODE_KO_APP_VERSION="$VERSION"
export T3CODE_KO_ANDROID_VERSION_CODE="$VERSION_CODE"
# The fork updates through GitHub releases. Upstream's Expo OTA channel ships
# upstream's JavaScript, so it stays off.
export T3CODE_MOBILE_UPDATES_ENABLED=0
GOOGLE_SERVICES="${T3CODE_KO_GOOGLE_SERVICES_FILE:-$HOME/.config/t3code-korean/google-services.json}"
if [[ -r "$GOOGLE_SERVICES" ]]; then
  export T3CODE_ANDROID_GOOGLE_SERVICES_FILE="$GOOGLE_SERVICES"
else
  echo "warning: $GOOGLE_SERVICES not found; building without Firebase push." >&2
  export T3CODE_ANDROID_GOOGLE_SERVICES_FILE=""
fi

echo "==> expo prebuild ($VERSION, versionCode $VERSION_CODE)"
(cd "$MOBILE_DIR" && expo prebuild --clean --platform android --no-install)

echo "==> gradle assembleRelease (arm64-v8a)"
cd "$MOBILE_DIR/android"
# Sized for an 8 GB machine; the daemon is stopped afterwards.
trap './gradlew --stop >/dev/null 2>&1 || true' EXIT
./gradlew assembleRelease \
  -PreactNativeArchitectures=arm64-v8a \
  -Dorg.gradle.jvmargs="-Xmx3g -XX:MaxMetaspaceSize=1g" \
  -Pkotlin.daemon.jvmargs="-Xmx1536m" \
  --max-workers=4

APK_BUILT="$MOBILE_DIR/android/app/build/outputs/apk/release/app-release.apk"
mkdir -p "$OUTPUT_DIR"
cp "$APK_BUILT" "$APK_OUT"

echo "==> verify"
SIGNER=$("$BUILD_TOOLS/apksigner" verify --print-certs "$APK_OUT" | awk -F': ' '/certificate SHA-256 digest/ {print $NF; exit}')
if [[ "$SIGNER" != "$EXPECTED_SIGNER_SHA256" ]]; then
  echo "error: signer $SIGNER does not match the pinned key $EXPECTED_SIGNER_SHA256" >&2
  exit 1
fi
"$BUILD_TOOLS/aapt2" dump badging "$APK_OUT" | sed -n 1p
echo "signer SHA-256: $SIGNER"
echo "done: $APK_OUT"
