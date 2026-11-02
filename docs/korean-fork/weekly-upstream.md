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
- Track progress: `ID=$(eta start "T3 Code 한국어판 주간 업스트림" --steps "업스트림 머지,충돌 해결,설치·검사,번역,맥 빌드,윈도우 빌드,안드로이드 빌드,GitHub 릴리즈,PR 후보")`,
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

If `TAG == PREV`, there is nothing new: skip to step 9 (PR candidates).
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
bash scripts/korean-release-mac.sh "$VERSION" 2>&1 | tee /tmp/t3k-mac-build.log
```

Smoke test the built app without touching the live install: unzip the
`-mac-arm64.zip` to a temp folder, start
`"T3 Code Korean.app/Contents/MacOS/T3 Code Korean" --user-data-dir=<tmp>`
with `T3CODE_HOME=<tmp>/home`, wait until its log shows the backend ready
(or take a window screenshot), then quit that PID only.

Windows (no push needed yet; ship the commits as a bundle):

```sh
git bundle create /tmp/t3k.bundle "origin/$(git branch --show-current)..HEAD"   # or <last pushed tag>..HEAD
scp /tmp/t3k.bundle DESKTOP-BCUC43S:C:/Users/marie/src/t3k.bundle
ssh DESKTOP-BCUC43S 'cd C:\Users\marie\src\t3code-korean-v3; git fetch ..\t3k.bundle <branch>:<branch>-new; git checkout <branch>-new'
ssh DESKTOP-BCUC43S 'cd C:\Users\marie\src\t3code-korean-v3; $env:PATH="$PWD\node_modules\.bin;$env:USERPROFILE\.cargo\bin;$env:PATH"; $env:CI="true"; vp i; powershell -ExecutionPolicy Bypass -File scripts\korean-release-win.ps1 <VERSION>'
scp "DESKTOP-BCUC43S:C:/Users/marie/src/t3code-korean-v3/release-ko<n>/*" <local dir>
```

Check the copied `.exe` sha512 matches `latest.yml`.

Android (main Mac; Android SDK in `/opt/homebrew/share/android-commandlinetools`,
JDK 17 is Liberica, `google-services.json` in `~/.config/t3code-korean/`):

```sh
export JAVA_HOME=/Library/Java/JavaVirtualMachines/liberica-jdk-17-full.jdk/Contents/Home
bash scripts/korean-release-android.sh "$VERSION" > /tmp/t3k-android-build.log 2>&1
```

It writes `release-ko<n>/T3-Code-Korean-$VERSION-android-arm64.apk`, signed with
the pinned key that installed phones accept. Mac, Windows and Android can build
at the same time (Windows runs on the other PC).

## 8. Release

Push the branch and tag `v$VERSION` to `origin` (never to `upstream`). Create
the release as a draft on `devuterian/t3code-korean`, upload all files (mac:
dmg, dmg.blockmap, zip, zip.blockmap, latest-mac.yml; Windows: exe,
exe.blockmap, latest.yml; Android: the arm64 APK), then publish it as the latest release (not a
pre-release). Notes in Korean 해요체: what changed for users (from upstream's
release notes and our changes), install notes per platform, source branch and
commit. Afterwards download `releases/latest/download/latest-mac.yml` and
`latest.yml` and check they name `$VERSION`.

Phones follow the newest release that has an APK. If the Android build fails,
release Mac and Windows anyway and say so in the report.

## 9. Upstream PR candidates

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
its strings (step 4), and ship it as the next `-ko.<n>` (steps 5-8). A `pending`
PR that was answered `c` is asked again next week; `no` is never asked again.

## 10. Report

Korean, short: upstream tag merged, version released (link), what changed for
users, what was translated, anything skipped or failed, the PR question. Leave
the repo clean, move temporary files to Trash, and `eta done`.
