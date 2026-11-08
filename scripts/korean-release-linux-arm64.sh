#!/usr/bin/env bash
# Build the Korean fork's Linux arm64 CLI archive (t3-<version>-linux-arm64.tar.gz
# plus SHA256SUMS) on a remote Linux arm64 host. It never uploads anything.
#
#   scripts/korean-release-linux-arm64.sh 0.1.8-ko.1 [output-dir]
#
# Linux arm64 single executables must be built on a Linux arm64 host
# (nodejs/node#67048, see docs/operations/release.md). The build runs in an
# Ubuntu 24.04 container like upstream CI, so the archive bundles Ubuntu's
# libatomic and runs on glibc 2.39 or newer (Termux proot Debian included).
#
# Host: T3K_LINUX_ARM64_HOST (ssh alias, default instance-20260703-0538) with
# docker. Everything lives under ~/build on that host: tools/ (Node, Rust),
# t3code-korean/src (a checkout kept between runs as an install cache).
set -euo pipefail

HOST="${T3K_LINUX_ARM64_HOST:-instance-20260703-0538}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_VERSION="$(node -p 'require(process.argv[1]).engines.node' "$REPO_ROOT/package.json")"
PNPM_VERSION="$(node -p 'require(process.argv[1]).packageManager.split("@")[1]' "$REPO_ROOT/package.json")"

VERSION="${1:-}"
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+-ko\.[0-9]+$ ]]; then
  echo "usage: $0 <version like 0.1.8-ko.1> [output-dir]" >&2
  exit 64
fi
OUTPUT_DIR="${2:-$REPO_ROOT/release-$VERSION-linux}"
if [[ -d "$OUTPUT_DIR" && -n "$(ls -A "$OUTPUT_DIR")" ]]; then
  echo "error: $OUTPUT_DIR already has files; pick another output dir." >&2
  exit 1
fi

# T3 Connect needs the public Clerk/relay ids baked into the web client.
ENV_LINES="$(grep -hE '^(T3CODE_CLERK_PUBLISHABLE_KEY|T3CODE_CLERK_JWT_TEMPLATE|T3CODE_CLERK_CLI_OAUTH_CLIENT_ID|T3CODE_RELAY_URL)=.+' "$REPO_ROOT/.env" 2>/dev/null || true)"
for key in T3CODE_CLERK_PUBLISHABLE_KEY T3CODE_CLERK_JWT_TEMPLATE T3CODE_RELAY_URL; do
  if ! grep -q "^$key=" <<<"$ENV_LINES"; then
    echo "error: $key is missing from $REPO_ROOT/.env." >&2
    exit 1
  fi
done

cd "$REPO_ROOT"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: the working tree has changes; commit them first." >&2
  exit 1
fi
BRANCH="$(git branch --show-current)"
COMMIT="$(git rev-parse HEAD)"
WORK="$(mktemp -d /tmp/t3k-linux-arm64.XXXXXX)"
trap 'mv "$WORK" "$HOME/.Trash/$(basename "$WORK")" 2>/dev/null || true' EXIT

# The host clones the public fork, so only commits not on origin travel.
git bundle create "$WORK/t3k.bundle" "origin/$BRANCH..HEAD" 2>/dev/null ||
  git bundle create "$WORK/t3k.bundle" HEAD
printf '%s\n' "$ENV_LINES" >"$WORK/t3k.env"
ORIGIN_URL="$(git remote get-url origin)"

cat >"$WORK/prepare.sh" <<EOF
set -euo pipefail
T=\$HOME/build/tools; W=\$HOME/build/t3code-korean
mkdir -p "\$T" "\$W"
N=node-v$NODE_VERSION-linux-arm64
if [ ! -x "\$T/\$N/bin/node" ]; then
  cd "\$T"
  curl -fsSL --retry 5 --retry-all-errors -o "\$N.tar.xz" "https://nodejs.org/dist/v$NODE_VERSION/\$N.tar.xz"
  curl -fsSL --retry 5 --retry-all-errors -o SHASUMS256.txt "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt"
  grep " \$N.tar.xz\\\$" SHASUMS256.txt | sha256sum -c -
  tar xf "\$N.tar.xz"
fi
export RUSTUP_HOME=\$T/rustup CARGO_HOME=\$T/cargo
if [ ! -x "\$CARGO_HOME/bin/cargo" ]; then
  curl -fsSL https://sh.rustup.rs | sh -s -- -y --no-modify-path --profile minimal
fi
if ! docker image inspect t3k-build:ubuntu24 >/dev/null 2>&1; then
  mkdir -p "\$HOME/build/docker"
  printf '%s\n' 'FROM ubuntu:24.04' \
    'RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends build-essential git curl ca-certificates python3 libatomic1 patchelf xz-utils unzip file && rm -rf /var/lib/apt/lists/*' \
    >"\$HOME/build/docker/Dockerfile"
  docker build --network host -q -t t3k-build:ubuntu24 "\$HOME/build/docker"
fi
cd "\$W"
[ -d src ] || git clone -q --filter=blob:none -b "$BRANCH" "$ORIGIN_URL" src
cd src
git fetch -q origin "$BRANCH"
git checkout -q -- .
git fetch -q ../t3k.bundle "HEAD:refs/heads/t3k-release"
git checkout -q --detach "$COMMIT"
cp ../t3k.env .env
# Outputs of earlier runs go to the trash, never rm.
for old in ../release-cli ../cli-resource-monitor apps/server/dist-exe; do
  [ -e "\$old" ] && gio trash "\$old"
done
true
EOF

cat >"$WORK/build.sh" <<EOF
#!/usr/bin/env bash
# Runs inside t3k-build:ubuntu24 as uid 1000.
set -euo pipefail
B=/home/opc/build; W=\$B/t3code-korean; T=\$B/tools
export HOME=\$B/chome; mkdir -p "\$HOME"
export RUSTUP_HOME=\$T/rustup CARGO_HOME=\$T/cargo npm_config_prefix=\$HOME/.npm-global CI=true
export PATH=\$T/node-v$NODE_VERSION-linux-arm64/bin:\$T/cargo/bin:\$HOME/.npm-global/bin:\$PATH
[ "\$(pnpm --version 2>/dev/null)" = "$PNPM_VERSION" ] || npm i -g "pnpm@$PNPM_VERSION"
cd "\$W/src"
echo "== install"; pnpm install --frozen-lockfile
export PATH=\$PWD/node_modules/.bin:\$PATH
echo "== version"; node scripts/update-release-package-versions.ts "$VERSION"
echo "== bundle"; vp run build:desktop:bundle
echo "== brand"; node scripts/apply-web-brand-assets.ts production apps/server/dist/client
echo "== resource monitor"
cargo build --locked --release --manifest-path native/resource-monitor/Cargo.toml --target aarch64-unknown-linux-gnu
mkdir -p "\$W/cli-resource-monitor/linux-arm64"
cp native/resource-monitor/target/aarch64-unknown-linux-gnu/release/t3-resource-monitor "\$W/cli-resource-monitor/linux-arm64/"
echo "== build-exe"; T3CODE_TELEMETRY_CHANNEL=dev node apps/server/scripts/cli.ts build-exe --verbose
echo "== archive"
node scripts/build-cli-archive.ts --platform linux --arch arm64 --version "$VERSION" \\
  --resource-monitor-dir "\$W/cli-resource-monitor" --output-dir "\$W/release-cli"
echo "== smoke"; node scripts/smoke-cli-archive.ts --archive "\$W/release-cli/t3-$VERSION-linux-arm64.tar.gz" --expect-version "$VERSION"
git checkout -q -- .
EOF

REMOTE_HOME="$(ssh "$HOST" 'echo $HOME')"
if [[ "$REMOTE_HOME" != /home/opc ]]; then
  echo "error: build.sh expects the host home at /home/opc, got $REMOTE_HOME." >&2
  exit 1
fi
ssh "$HOST" 'mkdir -p ~/build/t3code-korean'
scp -q "$WORK/t3k.bundle" "$WORK/t3k.env" "$WORK/build.sh" "$HOST:build/t3code-korean/"
ssh "$HOST" 'bash -s' <"$WORK/prepare.sh"
# Shared host: cap the container and run it at low priority.
ssh "$HOST" "docker run --rm --name t3k-linux-arm64 --network host --user 1000:1000 --cpus 3 --memory 14g \
  -v /home/opc/build:/home/opc/build:z t3k-build:ubuntu24 nice -n 10 bash /home/opc/build/t3code-korean/build.sh"

ARCHIVE="t3-$VERSION-linux-arm64.tar.gz"
mkdir -p "$OUTPUT_DIR"
scp -q "$HOST:build/t3code-korean/release-cli/$ARCHIVE" "$OUTPUT_DIR/"
REMOTE_SUM="$(ssh "$HOST" "sha256sum build/t3code-korean/release-cli/$ARCHIVE" | cut -d' ' -f1)"
(cd "$OUTPUT_DIR" && shasum -a 256 "$ARCHIVE" >SHA256SUMS)
if [[ "$(cut -d' ' -f1 "$OUTPUT_DIR/SHA256SUMS")" != "$REMOTE_SUM" ]]; then
  echo "error: $ARCHIVE changed in transit." >&2
  exit 1
fi
ssh "$HOST" 'gio trash build/t3code-korean/t3k.bundle build/t3code-korean/t3k.env'

echo
cat "$OUTPUT_DIR/SHA256SUMS"
echo "Upload $OUTPUT_DIR/$ARCHIVE and $OUTPUT_DIR/SHA256SUMS to the v$VERSION release."
