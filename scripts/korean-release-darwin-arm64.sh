#!/usr/bin/env bash
# Build the Korean fork's macOS arm64 CLI archive (t3-<version>-darwin-arm64.tar.gz
# plus a SHA256SUMS line) on this arm64 Mac. It never uploads anything.
#
#   scripts/korean-release-darwin-arm64.sh 0.1.8-ko.1 [output-dir] [--merge-sums <SHA256SUMS>]
#
# Installers (`t3 update`, the SSH runner in packages/ssh/src/tunnel.ts) fetch ONE
# SHA256SUMS from the release and grep the line for their archive, so a release
# must carry a single file listing every archive. --merge-sums copies the lines
# of an existing SHA256SUMS (for example the Linux one from
# korean-release-linux-arm64.sh) into the output SHA256SUMS next to this
# archive; upload only that merged file.
#
# Signing: upstream (build-cli-archive.ts) codesigns the executable, the native
# addons and t3-resource-monitor with T3CODE_CLI_MAC_SIGN_IDENTITY (Developer
# ID, hardened runtime, notarized when APPLE_API_KEY* are set) and falls back to
# ad hoc. The fork has no Developer ID, so it signs with the same self-signed
# identity as the desktop app (~/.config/marierie/codesign.env) and sets no
# APPLE_API_KEY*, which skips notarization. Never ad hoc.
#
# Node single-executables are supported on macOS arm64 only, so this refuses to
# run on any other machine. Needs node, pnpm (versions from package.json) and
# cargo on PATH.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="$REPO_ROOT/node_modules/.bin:$PATH:/opt/homebrew/bin:$HOME/.cargo/bin"

USAGE="usage: $0 <version like 0.1.8-ko.1> [output-dir] [--merge-sums <SHA256SUMS>]"
POSITIONAL=()
MERGE_SUMS=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --merge-sums)
      MERGE_SUMS="${2:-}"
      [[ -n "$MERGE_SUMS" ]] || { echo "$USAGE" >&2; exit 64; }
      shift 2
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done
VERSION="${POSITIONAL[0]:-}"
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+-ko\.[0-9]+$ ]] || [[ ${#POSITIONAL[@]} -gt 2 ]]; then
  echo "$USAGE" >&2
  exit 64
fi
if [[ "$(uname -s)" != Darwin || "$(uname -m)" != arm64 ]]; then
  echo "error: the darwin arm64 CLI archive must be built on an arm64 Mac." >&2
  exit 1
fi
OUTPUT_DIR="${POSITIONAL[1]:-$REPO_ROOT/release-$VERSION-darwin}"
if [[ -d "$OUTPUT_DIR" && -n "$(ls -A "$OUTPUT_DIR")" ]]; then
  echo "error: $OUTPUT_DIR already has files; pick another output dir." >&2
  exit 1
fi
if [[ -n "$MERGE_SUMS" && ! -r "$MERGE_SUMS" ]]; then
  echo "error: $MERGE_SUMS is not readable." >&2
  exit 1
fi
for tool in node pnpm cargo; do
  command -v "$tool" >/dev/null || { echo "error: $tool not found on PATH." >&2; exit 1; }
done

# T3 Connect needs the public Clerk/relay ids baked into the web client.
for key in T3CODE_CLERK_PUBLISHABLE_KEY T3CODE_CLERK_JWT_TEMPLATE T3CODE_RELAY_URL; do
  if [[ -z "${!key:-}" ]] && ! grep -qE "^${key}=.+" "$REPO_ROOT/.env" "$REPO_ROOT/.env.local" 2>/dev/null; then
    echo "error: $key is not set; copy .env.example to $REPO_ROOT/.env first." >&2
    exit 1
  fi
done

cd "$REPO_ROOT"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: the working tree has changes; commit them first." >&2
  exit 1
fi

NODE_VERSION="$(node -p 'require(process.argv[1]).engines.node' "$REPO_ROOT/package.json")"
PNPM_VERSION="$(node -p 'require(process.argv[1]).packageManager.split("@")[1]' "$REPO_ROOT/package.json")"
if [[ "$(node -p 'process.versions.node')" != "$NODE_VERSION" ]]; then
  echo "error: node $(node -p 'process.versions.node') found, package.json wants $NODE_VERSION (the executable embeds this node)." >&2
  exit 1
fi
if [[ "$(pnpm --version)" != "$PNPM_VERSION" ]]; then
  echo "error: pnpm $(pnpm --version) found, package.json wants $PNPM_VERSION." >&2
  exit 1
fi

ENV_FILE="${T3CODE_CODESIGN_ENV:-$HOME/.config/marierie/codesign.env}"
if [[ ! -r "$ENV_FILE" ]]; then
  echo "error: signing env $ENV_FILE not found." >&2
  exit 1
fi
# Sourced without export, so the password never reaches the build's children.
# shellcheck disable=SC1090
source "$ENV_FILE"
: "${T3CODE_MAC_SIGN_IDENTITY:?missing in $ENV_FILE}"
: "${T3CODE_MAC_SIGN_KEYCHAIN:?missing in $ENV_FILE}"
: "${T3CODE_MAC_SIGN_KEYCHAIN_PASSWORD:?missing in $ENV_FILE}"

# `security -i` reads the command from stdin, so the password stays out of `ps`.
escape_security_arg() {
  local value="${1//\\/\\\\}"
  printf '"%s"' "${value//\"/\\\"}"
}
printf 'unlock-keychain -p %s %s\n' \
  "$(escape_security_arg "$T3CODE_MAC_SIGN_KEYCHAIN_PASSWORD")" \
  "$(escape_security_arg "$T3CODE_MAC_SIGN_KEYCHAIN")" | security -i
unset T3CODE_MAC_SIGN_KEYCHAIN_PASSWORD T3CODE_MAC_SIGN_P12_PASSWORD
WORK="$(mktemp -d /tmp/t3k-darwin-arm64.XXXXXX)"
# The version bump rewrites package.json files; put them back, trash temp dirs
# (never rm) and lock the keychain again.
cleanup() {
  git -C "$REPO_ROOT" checkout -q -- . || true
  security lock-keychain "$T3CODE_MAC_SIGN_KEYCHAIN" || true
  mv "$WORK" "$HOME/.Trash/$(basename "$WORK")" 2>/dev/null || true
}
trap cleanup EXIT
if ! security list-keychains -d user | grep -q "$T3CODE_MAC_SIGN_KEYCHAIN"; then
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
# No Apple notarization or Developer ID for fork builds.
unset CSC_LINK CSC_KEY_PASSWORD CSC_NAME APPLE_ID APPLE_APP_SPECIFIC_PASSWORD \
  APPLE_TEAM_ID APPLE_API_KEY APPLE_API_KEY_ID APPLE_API_ISSUER
export T3CODE_CLI_MAC_SIGN_IDENTITY="$T3CODE_MAC_SIGN_IDENTITY"

echo "== install"; pnpm install --frozen-lockfile
echo "== version"; node scripts/update-release-package-versions.ts "$VERSION"
echo "== bundle"; vp run build:desktop:bundle
echo "== brand"; node scripts/apply-web-brand-assets.ts production apps/server/dist/client
echo "== resource monitor"
cargo build --locked --release --manifest-path native/resource-monitor/Cargo.toml --target aarch64-apple-darwin
mkdir -p "$WORK/cli-resource-monitor/darwin-arm64"
cp native/resource-monitor/target/aarch64-apple-darwin/release/t3-resource-monitor "$WORK/cli-resource-monitor/darwin-arm64/"
# Outputs of earlier runs go to the trash, never rm.
[[ -e apps/server/dist-exe ]] && mv apps/server/dist-exe "$HOME/.Trash/dist-exe.$(date +%s)"
echo "== build-exe"; T3CODE_TELEMETRY_CHANNEL=dev node apps/server/scripts/cli.ts build-exe --verbose
echo "== archive"
node scripts/build-cli-archive.ts --platform mac --arch arm64 --version "$VERSION" \
  --resource-monitor-dir "$WORK/cli-resource-monitor" --output-dir "$WORK/release-cli"
ARCHIVE="t3-$VERSION-darwin-arm64.tar.gz"
echo "== smoke"
node scripts/smoke-cli-archive.ts --archive "$WORK/release-cli/$ARCHIVE" --expect-version "$VERSION"

mkdir -p "$OUTPUT_DIR"
cp "$WORK/release-cli/$ARCHIVE" "$OUTPUT_DIR/"
(
  cd "$OUTPUT_DIR"
  {
    # Keep other archives' lines, but never a stale line for this one.
    [[ -n "$MERGE_SUMS" ]] && grep -v " \*\{0,1\}$ARCHIVE\$" "$MERGE_SUMS" || true
    shasum -a 256 "$ARCHIVE"
  } >SHA256SUMS
)

echo
cat "$OUTPUT_DIR/SHA256SUMS"
echo "Upload $OUTPUT_DIR/$ARCHIVE and $OUTPUT_DIR/SHA256SUMS to the v$VERSION release."
if [[ -z "$MERGE_SUMS" ]]; then
  echo "note: this SHA256SUMS lists only the darwin archive. The release needs one file with every"
  echo "archive; rerun with --merge-sums <linux SHA256SUMS> or cat both into one before uploading."
fi
