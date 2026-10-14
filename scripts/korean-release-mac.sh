#!/usr/bin/env bash
# Build a signed macOS arm64 release of the Korean fork: dmg, zip, blockmaps and
# latest-mac.yml for devuterian/t3code-korean. It never uploads anything.
#
#   scripts/korean-release-mac.sh 0.0.46-ko.6 [output-dir]
#
# Signing material lives outside the repo in ~/.config/marierie/codesign.env
# (override with T3CODE_CODESIGN_ENV): T3CODE_MAC_SIGN_IDENTITY (SHA-1),
# T3CODE_MAC_SIGN_KEYCHAIN and T3CODE_MAC_SIGN_KEYCHAIN_PASSWORD. The same
# certificate must sign every release, or installed apps stop accepting updates
# and macOS asks for privacy permissions again.
set -euo pipefail

UPDATE_REPOSITORY="devuterian/t3code-korean"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

VERSION="${1:-}"
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+-ko\.[0-9]+$ ]]; then
  echo "usage: $0 <version like 0.0.46-ko.6> [output-dir]" >&2
  exit 64
fi
OUTPUT_DIR="${2:-$REPO_ROOT/release-ko${VERSION##*-ko.}}"
if [[ -d "$OUTPUT_DIR" && -n "$(ls -A "$OUTPUT_DIR")" ]]; then
  echo "error: $OUTPUT_DIR already has files; pick another output dir." >&2
  exit 1
fi

ENV_FILE="${T3CODE_CODESIGN_ENV:-$HOME/.config/marierie/codesign.env}"
if [[ ! -r "$ENV_FILE" ]]; then
  echo "error: signing env $ENV_FILE not found." >&2
  exit 1
fi
# Sourced without export, so passwords never reach the build's child processes.
# shellcheck disable=SC1090
source "$ENV_FILE"
: "${T3CODE_MAC_SIGN_IDENTITY:?missing in $ENV_FILE}"
: "${T3CODE_MAC_SIGN_KEYCHAIN:?missing in $ENV_FILE}"
: "${T3CODE_MAC_SIGN_KEYCHAIN_PASSWORD:?missing in $ENV_FILE}"

# `security -i` reads the command from stdin, so the password never shows up in
# `ps`. Its parser takes double-quoted arguments with backslash escapes.
escape_security_arg() {
  local value="${1//\\/\\\\}"
  printf '"%s"' "${value//\"/\\\"}"
}
printf 'unlock-keychain -p %s %s\n' \
  "$(escape_security_arg "$T3CODE_MAC_SIGN_KEYCHAIN_PASSWORD")" \
  "$(escape_security_arg "$T3CODE_MAC_SIGN_KEYCHAIN")" | security -i
unset T3CODE_MAC_SIGN_KEYCHAIN_PASSWORD T3CODE_MAC_SIGN_P12_PASSWORD
trap 'security lock-keychain "$T3CODE_MAC_SIGN_KEYCHAIN" || true' EXIT
if ! security list-keychains -d user | grep -q "$T3CODE_MAC_SIGN_KEYCHAIN"; then
  # Keep every existing keychain in the search list.
  existing=()
  while IFS= read -r line; do
    line="${line#"${line%%[![:space:]]*}"}"
    existing+=("${line//\"/}")
  done < <(security list-keychains -d user)
  security list-keychains -d user -s "${existing[@]}" "$T3CODE_MAC_SIGN_KEYCHAIN"
fi
if ! security find-identity -p codesigning "$T3CODE_MAC_SIGN_KEYCHAIN" | grep -q "$T3CODE_MAC_SIGN_IDENTITY"; then
  echo "error: identity $T3CODE_MAC_SIGN_IDENTITY not in $T3CODE_MAC_SIGN_KEYCHAIN." >&2
  exit 1
fi

# No Apple notarization or Developer ID discovery for fork builds.
unset T3CODE_DESKTOP_SIGNED CSC_LINK CSC_KEY_PASSWORD CSC_NAME \
  APPLE_ID APPLE_APP_SPECIFIC_PASSWORD APPLE_TEAM_ID APPLE_API_KEY APPLE_API_KEY_ID APPLE_API_ISSUER

export PATH="$REPO_ROOT/node_modules/.bin:$HOME/.cargo/bin:$PATH"
export T3CODE_DESKTOP_UPDATE_REPOSITORY="$UPDATE_REPOSITORY"
export T3CODE_MAC_SIGN_IDENTITY T3CODE_MAC_SIGN_KEYCHAIN

cd "$REPO_ROOT"
node scripts/build-desktop-artifact.ts \
  --platform mac --target dmg --arch arm64 \
  --build-version "$VERSION" --output-dir "$OUTPUT_DIR"

BASE="T3-Code-Korean-${VERSION}-mac-arm64"
FILES=(
  "$BASE.dmg"
  "$BASE.dmg.blockmap"
  "$BASE.zip"
  "$BASE.zip.blockmap"
  "latest-mac.yml"
)
for file in "${FILES[@]}"; do
  if [[ ! -f "$OUTPUT_DIR/$file" ]]; then
    echo "error: expected $OUTPUT_DIR/$file was not produced." >&2
    exit 1
  fi
done
if ! grep -q "url: $BASE.zip" "$OUTPUT_DIR/latest-mac.yml"; then
  echo "error: latest-mac.yml does not reference $BASE.zip." >&2
  exit 1
fi

# Check the zipped app, which is what the updater installs.
CHECK_DIR="$(mktemp -d /tmp/t3-korean-release-check.XXXXXX)"
ditto -x -k "$OUTPUT_DIR/$BASE.zip" "$CHECK_DIR"
APP="$(find "$CHECK_DIR" -maxdepth 1 -name '*.app' | head -n 1)"
codesign --verify --deep --strict "$APP"
REQUIREMENT="$(codesign -d -r- "$APP" 2>&1 | grep '^designated')"
EXPECTED_HASH="$(printf '%s' "$T3CODE_MAC_SIGN_IDENTITY" | tr '[:upper:]' '[:lower:]')"
if [[ "$REQUIREMENT" != *"$EXPECTED_HASH"* ]]; then
  echo "error: unexpected designated requirement: $REQUIREMENT" >&2
  exit 1
fi
if ! grep -q "repo: ${UPDATE_REPOSITORY#*/}" "$APP/Contents/Resources/app-update.yml"; then
  echo "error: app-update.yml does not point at $UPDATE_REPOSITORY." >&2
  exit 1
fi
mv "$CHECK_DIR" "$HOME/.Trash/$(basename "$CHECK_DIR")"

echo
echo "$REQUIREMENT"
echo
echo "Upload these to the v$VERSION release on $UPDATE_REPOSITORY (names unchanged):"
for file in "${FILES[@]}"; do
  echo "  $OUTPUT_DIR/$file"
done
echo
echo "Every ko release must carry all 5 mac files above, even one that also ships an"
echo "APK: installed Macs follow the newest ko release, and one without"
echo "latest-mac.yml and the zip shows them \"update check failed\"."
echo "Create the release as a draft, upload every asset, then publish it."
echo "Pre-release is fine."
