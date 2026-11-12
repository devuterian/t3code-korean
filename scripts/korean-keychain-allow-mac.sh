#!/usr/bin/env bash
# Let a Korean fork build read Electron's "t3code Safe Storage" keychain item
# without the "wants to use your confidential information" prompt.
#
#   scripts/korean-keychain-allow-mac.sh "/path/to/T3 Code Korean.app" < password
#
# The fork is self-signed, so it has no Team ID and macOS ties keychain access
# to the build's CDHash, which changes with every release. Run this on the Mac
# that will install the release, with the login keychain password on stdin
# (it prompts when stdin is a terminal). The password only goes to `security -i`
# through stdin, never to argv.
set -euo pipefail

APP="${1:-}"
if [[ -z "$APP" || ! -d "$APP" ]]; then
  echo "usage: $0 <path to T3 Code Korean.app>" >&2
  exit 64
fi
KEYCHAIN="${T3CODE_SAFE_STORAGE_KEYCHAIN:-$HOME/Library/Keychains/login.keychain-db}"
SERVICE="t3code Safe Storage"
ACCOUNT="t3code Key"

CDHASH="$(codesign -dv --verbose=4 "$APP" 2>&1 | sed -n 's/^CDHash=//p' | head -n 1)"
if [[ -z "$CDHASH" ]]; then
  echo "error: could not read the CDHash of $APP." >&2
  exit 1
fi

read_partitions() {
  # A full ACL dump validates every listed app and takes minutes, so awk stops
  # at the item and dump-keychain's SIGPIPE is expected.
  (
    set +o pipefail
    security dump-keychain -a "$KEYCHAIN" 2>/dev/null | awk -v svc="\"svce\"<blob>=\"$SERVICE\"" '
      index($0, svc) { found = 1 }
      found && /authorizations \([0-9]+\): partition_id/ { want = 1; next }
      found && want && /description:/ { sub(/^[[:space:]]*description: /, ""); print; exit }
    '
  )
}

current="$(read_partitions)"
if [[ -z "$current" ]]; then
  echo "No \"$SERVICE\" item in $KEYCHAIN yet; the app creates it on first launch."
  exit 0
fi
if [[ ",${current// /}," == *",cdhash:$CDHASH,"* ]]; then
  echo "cdhash:$CDHASH is already allowed."
  exit 0
fi

if [[ -t 0 ]]; then
  read -rs -p "Password for $(basename "$KEYCHAIN"): " password
  echo
else
  IFS= read -r password || true
fi
if [[ -z "$password" ]]; then
  echo "error: no keychain password on stdin." >&2
  exit 1
fi

# `security -i` parses double-quoted arguments with backslash escapes.
quote() {
  local value="${1//\\/\\\\}"
  printf '"%s"' "${value//\"/\\\"}"
}
printf 'set-generic-password-partition-list -s %s -a %s -S %s -k %s %s\n' \
  "$(quote "$SERVICE")" "$(quote "$ACCOUNT")" "$(quote "${current// /},cdhash:$CDHASH")" \
  "$(quote "$password")" "$(quote "$KEYCHAIN")" | security -i >/dev/null
unset password

if [[ ",$(read_partitions | tr -d ' ')," != *",cdhash:$CDHASH,"* ]]; then
  echo "error: cdhash:$CDHASH was not added; check the keychain password." >&2
  exit 1
fi
echo "Allowed cdhash:$CDHASH for \"$SERVICE\"."
