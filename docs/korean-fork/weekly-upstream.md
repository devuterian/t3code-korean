# Weekly upstream run (Korean fork)

A scheduled T3 Code task runs this once a week on 마리리's main Mac. Follow it
top to bottom. Talk to 마리리 in Korean (casual 반말, short), but write UI copy
in One UI 해요체 (see Copy below). Read `~/.agents/AGENTS.md` rules too: report
progress, no `rm` (move to Trash), confirm before deleting big things.

Paths: repo `/Users/marie/.t3/projects/t3code-korean`, Windows checkout
`C:\Users\marie\src\t3code-korean-v3` on `ssh DESKTOP-BCUC43S` (PowerShell).
Node 26 on the Mac: `source ~/.nvm/nvm.sh; nvm use 26.12.1; export PATH="$PWD/node_modules/.bin:$PATH"`.
In zsh, write `"${TAG}:path"`, never `$TAG:path` (`:a`, `:r` are modifiers).

## 0. Before starting

- `date`. If an After Effects render (`aerender`), Blender render, or another
  heavy job runs (`pgrep -l aerender blender`), do not start. Say so and stop.
- Free space: Mac internal over 15 GB, Windows `C:` over 8 GB. Otherwise stop
  and report.
- `ssh -o ConnectTimeout=10 DESKTOP-BCUC43S 'echo ok'`. If Windows is off,
  finish steps 1-6, skip the release, and report that Windows was offline.
- `ssh -o ConnectTimeout=10 instance-20260703-0538 'echo ok'` (Linux arm64
  build host, OCI). If it is down, release without the Linux archive and say so.
- Track progress: `ID=$(eta start "T3 Code 한국어판 주간 업스트림" --steps "업스트림 머지,충돌 해결,설치·검사,번역,맥 빌드,윈도우 빌드,안드로이드 빌드,리눅스 arm64 빌드,GitHub 릴리즈,폰 서버 교체,PR 후보")`,
  `eta step $ID N`, and always `eta done`/`eta fail` at the end.

## 1. Find the new upstream nightly

```sh
cd /Users/marie/.t3/projects/t3code-korean
git status --porcelain            # must be empty; if not, stop and report
git fetch origin
TAG=$(gh release list -R pingdotgg/t3code --limit 20 --json tagName,isPrerelease \
  -q '[.[] | select(.tagName|test("-nightly\\."))][0].tagName')
PREV=$(git tag -l 'v*-nightly.*' --merged HEAD | sort -V | tail -1)
```

If `TAG == PREV`, there is nothing new: skip to step 10 (PR candidates).
Otherwise `git fetch upstream "refs/tags/${TAG}:refs/tags/${TAG}" --no-tags`.

## 2. Merge

Work on the current fork branch (`git branch --show-current`, `korean-v5` at the
time of writing). `git merge --no-ff --no-commit "${TAG}"`.

If there are conflicts, list them (`git diff --name-only --diff-filter=U`) and
resolve them with Sonnet subagents, about 40 files each, using
[merge-brief.md](merge-brief.md). Then delete what the agents marked `DELETE`
(`git rm`), check that no conflict markers remain, `git add` the resolved files
and commit `Merge upstream ${TAG} into the Korean fork`.

## 3. Install and typecheck

`pnpm install`, then `vp run typecheck`. Fix every error (fork features adapt to
upstream's APIs; upstream wins on structure). For many errors, hand them to one
Opus subagent with the logs. Run tests next to changed files with
`vp test run <files>`, never repo-wide.

## 4. Korean copy

```sh
bun scripts/korean-i18n-missing.mjs --json /tmp/t3k-missing.json   # wrapped, no Korean
bun scripts/korean-i18n-missing.mjs --unwrapped "${PREV}"          # English JSX not wrapped
```

Wrap new user-visible English with `t()`/`translate()` like neighbouring code
and add Korean to a new dictionary file per run
(`apps/web/src/i18n/ko/mergeYYMMDD.ts`, `apps/mobile/src/i18n/ko/mergeYYMMDD.ts`)
registered last in that app's `dictionary.ko.ts`. Remaining "untranslated" keys
that are product names (`Nightly`, `Markdown`, `T3 Connect`, `URL`, …) are fine.

### Copy

All Korean follows the marie-ux-writing skill
(`~/.agents/skills/marie-ux-writing/SKILL.md`): Samsung One UI 해요체, nouns for
titles/statuses, short verbs for buttons, `~해요` for descriptions and errors,
`~할까요?` for confirmations, no 합쇼체, no `~해 주세요`, no `!`. Glossary:
thread 스레드, project 프로젝트, worktree 워크트리, environment 환경,
provider 프로바이더, agent 에이전트, subagent 서브에이전트, diff 변경 사항,
pull request 풀 리퀘스트, archive 보관, settle 정리, snooze 미루기,
composer 입력창, side chat 사이드 채팅. Check with
`git grep -nE "(합니다|습니다|십시오|하시겠|해 주세요)" -- apps/web/src/i18n apps/mobile/src/i18n`
(must print nothing).

## 5. Commit

`git add` the changed paths and commit. The pre-commit hook runs fmt, lint and
knip on staged files; fix what it reports instead of skipping it. Commit
everything for one step at once (partial staging makes knip see a mixed tree).

## 6. Version

Base = upstream tag's `x.y.z` (`v0.1.7-nightly.…` → `0.1.7`). Version =
`<base>-ko.<n>`, where `n` is one more than the highest existing
`v<base>-ko.*` release on `devuterian/t3code-korean`, else 1.

## 7. Build

Mac (signing material in `~/.config/marierie/codesign.env`, keychain
`marierie-t3code-codesign`; `.env` with the public T3 Connect ids is in the
repo root and gitignored):

```sh
bash scripts/korean-release-mac.sh "$VERSION" "$PWD/release-$VERSION" 2>&1 | tee /tmp/t3k-mac-build.log
```

Smoke test the built app without touching the live install: unzip the
`-mac-arm64.zip` to a temp folder, start
`"T3 Code Korean.app/Contents/MacOS/T3 Code Korean" --user-data-dir=<tmp>`
with `T3CODE_HOME=<tmp>/home` and `HOME=<tmp>/fakehome` (the app derives its
Electron profile from the home directory and ignores `--user-data-dir`, so
without `HOME` it hits the running app's single-instance lock and exits at
once). Run it as a background task, wait until
`<tmp>/home/userdata/server-runtime.json` appears and its port answers
`/.well-known/t3/environment` with the new `serverVersion`, then kill that PID
and the backend PID from that file (SIGTERM is ignored; use `kill -9`).

Windows (no push needed yet; ship the commits as a bundle):

```sh
git bundle create /tmp/t3k.bundle "origin/$(git branch --show-current)..HEAD"   # or <last pushed tag>..HEAD
scp /tmp/t3k.bundle DESKTOP-BCUC43S:C:/Users/marie/src/t3k.bundle
ssh DESKTOP-BCUC43S 'cd C:\Users\marie\src\t3code-korean-v3; git fetch ..\t3k.bundle <branch>:<branch>-new; git checkout <branch>-new'
ssh DESKTOP-BCUC43S 'cd C:\Users\marie\src\t3code-korean-v3; $env:PATH="$PWD\node_modules\.bin;$env:USERPROFILE\.cargo\bin;$env:PATH"; $env:CI="true"; vp i; powershell -ExecutionPolicy Bypass -File scripts\korean-release-win.ps1 <VERSION> release-<VERSION>-win'
scp "DESKTOP-BCUC43S:C:/Users/marie/src/t3code-korean-v3/release-<VERSION>-win/<file>" <local dir>   # one file per scp
```

Always pass the `release-<VERSION>` output dirs: the scripts' default `release-ko<n>` dirs collide with older versions that had the same `-ko.<n>`.
Check the copied `.exe` sha512 matches `latest.yml`.

Android (main Mac; Android SDK in `/opt/homebrew/share/android-commandlinetools`,
JDK 17 is Liberica, `google-services.json` in `~/.config/t3code-korean/`):

```sh
export JAVA_HOME=/Library/Java/JavaVirtualMachines/liberica-jdk-17-full.jdk/Contents/Home
bash scripts/korean-release-android.sh "$VERSION" "$PWD/release-$VERSION" > /tmp/t3k-android-build.log 2>&1
```

It writes `release-$VERSION/T3-Code-Korean-$VERSION-android-arm64.apk`, signed with
the pinned key that installed phones accept.

Linux arm64 CLI archive (the server 마리리's Galaxy Z Flip5 runs under Termux
proot Debian; built on the OCI arm64 host in an Ubuntu 24.04 container, because
Linux arm64 single executables cannot be cross-built):

```sh
bash scripts/korean-release-linux-arm64.sh "$VERSION" "$PWD/release-$VERSION-linux" 2>&1 | tee /tmp/t3k-linux-build.log
```

It needs a clean, committed tree (start it before the Mac and Android builds,
which briefly edit tracked files), smoke-tests the archive on the host, and writes
`t3-$VERSION-linux-arm64.tar.gz` plus `SHA256SUMS`. The host keeps its tools and
checkout under `~/build` between runs; do not touch the other services there.

Mac, Windows, Android and Linux can build at the same time (Windows and Linux
run on other machines). Give each build its own output dir: the Mac script
refuses a non-empty one.

## 8. Release

Push the branch and tag `v$VERSION` to `origin` (never to `upstream`). Create
the release as a draft on `devuterian/t3code-korean`, upload all files (mac:
dmg, dmg.blockmap, zip, zip.blockmap, latest-mac.yml; Windows: exe,
exe.blockmap, latest.yml; Android: the arm64 APK; Linux: the arm64 tar.gz and
`SHA256SUMS`), then publish it as the latest release (not a
pre-release). Notes in Korean 해요체: what changed for users (from upstream's
release notes and our changes), install notes per platform, source branch and
commit. Afterwards download `releases/latest/download/latest-mac.yml` and
`latest.yml` and check they name `$VERSION`.

Phones follow the newest release that has an APK. Put the Linux archive name and
its SHA-256 in the release notes and the report: the Z Flip5 server installs it
by hand into `<T3 home>/runtime/versions/<version>`. If the Android build fails,
release Mac and Windows anyway and say so in the report.

## 9. Replace the Z Flip5 server

마리리's Galaxy Z Flip5 runs the Linux arm64 archive as a T3 server (Termux,
proot Debian, `t3 serve --lan`), reached by the Mac app at
`z-flip5.tailbda46.ts.net:3773`. Move it to the release you just published.
`ssh z-flip5` (port 8022, the alias sits above the fleet block in
`~/.ssh/config`) lands in Termux, not in Debian. The Debian root is
`$R=/data/data/com.termux/files/usr/var/lib/proot-distro/containers/debian/rootfs`.

1. `ssh -o ConnectTimeout=10 z-flip5 true`. If it fails, skip this step and
   report "폰 꺼짐/오프라인".
2. On the Mac, download the archive and checksums with gh (github.com's direct
   release URLs returned 504 on 2026-11-08, so the phone does not curl them):
   `gh release download "v$VERSION" -R devuterian/t3code-korean -p "t3-$VERSION-linux-arm64.tar.gz" -p SHA256SUMS -D <tmp>`,
   then `(cd <tmp> && shasum -a 256 -c SHA256SUMS)`.
3. Note the old version (`readlink $R/root/.local/bin/t3`), then
   `scp` both files to `z-flip5:$R/root/t3dl/` (`/root/t3dl` inside Debian).
4. On the phone: `pkill -f "[.]local/bin/t3 serve"`, then in
   `proot-distro login debian -- bash -c '...'`:
   - `cd /root/t3dl && sha256sum -c SHA256SUMS`
   - `cp -a /root/.t3/userdata /root/.t3/userdata.bak-<old>-<YYYYMMDD>`
   - unpack into `/root/.t3/runtime/versions/$VERSION` (the archive's top
     folder `t3-$VERSION-linux-arm64` renamed to `$VERSION`)
   - `ln -sfn /root/.t3/runtime/versions/$VERSION/t3 /root/.local/bin/t3` and
     check `t3 --version`

   Then restart with `sh ~/start-t3.sh` in Termux. Never edit that script: it
   carries the hostname shim (`LD_PRELOAD`) and `PATH` the server needs.

5. After 30 seconds,
   `curl -s http://z-flip5.tailbda46.ts.net:3773/.well-known/t3/environment`
   must show `"label":"z-flip5"` and `"serverVersion":"$VERSION"`. If not,
   point the link back at the old version, restart, and report the failure.
6. Clean up on the phone with Debian's trash-cli, never `rm` (`trash-list`
   and `trash-rm` print /proc permission errors but still do the work):
   trash the files in `/root/t3dl`, keep only the current and the previous
   version under `runtime/versions`, and keep only the two newest
   `userdata.bak-*` copies.
7. Report one line: `폰 서버: <old> → $VERSION`.

## 10. Upstream PR candidates

```sh
gh pr list -R pingdotgg/t3code --state open --limit 300 \
  --json number,title,author,reactionGroups,comments,additions,deletions,isDraft,updatedAt
```

Score = reactions × 3 + comments. Skip drafts, PRs already in
[upstream-prs.json](upstream-prs.json), giant redesigns (over about 3,000 changed
lines), and anything mobile-iOS-only. Read the top ~15 bodies and pick up to 8
that help 마리리 (Mac/Windows/Android desktop use, fixes, performance, small
features). Ask in Korean, numbered, with one line each on what it does and
**(추천)** on the ones worth taking:

```
1. #28727 맥에서 워크트리 만들기 빠르게 (git-worktree-fast) **(추천)**
   - a. 넣기
   - b. 빼기
   - c. 다음에 다시 묻기
```

Record every asked PR in `upstream-prs.json` with `"decision": "pending"` and
commit it. When 마리리 answers, set `yes`/`no`; for `yes`, fetch
`pull/<n>/head` from upstream, cherry-pick or merge the PR's commits, translate
its strings (step 4), and ship it as the next `-ko.<n>` (steps 5-9). A `pending`
PR that was answered `c` is asked again next week; `no` is never asked again.

## 11. Report

Korean, short: upstream tag merged, version released (link), the phone server line
from step 9, what changed for
users, what was translated, anything skipped or failed, the PR question. Leave
the repo clean, move temporary files to Trash, and `eta done`.
