# Merge brief (Korean fork)

Brief for subagents resolving conflicts when an upstream nightly
(`pingdotgg/t3code`) is merged into the Korean fork. The merge is already in
progress in `/Users/marie/.t3/projects/t3code-korean`; you get a list of files.

## Sides

- `<<<<<<< HEAD` = the fork (Korean UI copy, fork features, cherry-picked
  upstream PRs).
- `>>>>>>> v…-nightly…` = upstream. Read-only helpers:
  `git show :1:<path>` (base), `:2:<path>` (fork), `:3:<path>` (upstream),
  `git log --oneline <base>..<upstream tag> -- <path>`.

## Rules

1. **Upstream wins on structure.** Take upstream's code, APIs, renames, new
   props and behaviour. Then re-apply the fork's changes on top.
2. **Keep fork translations.** The fork wraps user-visible English in `t("…")`
   (web, `useTranslation`/`t` from the file's existing import) or
   `translate("…")` (mobile `../i18n/translate`). Re-wrap the same strings in
   upstream's new code and keep the import. New upstream strings: wrap them the
   same way if the neighbouring code does; the Korean dictionary is added later,
   do not edit `i18n/ko/*` dictionaries.
3. **Keep fork features** (git-worktree-fast, account pools / Limits accounts,
   Codex updater, PR watch fixes, One UI navigation on Android, etc.) unless
   upstream now ships the same thing. Cherry-picked upstream PRs are tagged
   `(upstream #NNNN)` in fork commit messages; if upstream's version of that PR
   landed, take upstream's version and drop the fork copy.
4. **Deleted upstream (`UD`)**: if upstream deleted or moved a file the fork only
   translated, answer `DELETE` for it and, when you can find where the code
   moved (`git log --diff-filter=D --stat`, grep the upstream tree), re-apply the
   fork's `t()`/`translate()` wrapping and fork features in the new location.
   Do not run `git rm` yourself.
5. Leave no conflict markers. Keep formatting close to upstream (oxfmt style).
6. Do not run `git add`, `git checkout`, `git restore`, `git rm`, commits,
   installs, or repo-wide typecheck/tests. Edit files only.

## Report

One line per file: `path — RESOLVED` (plus a few words if a fork feature was
dropped or adapted) or `path — DELETE` (plus where the code moved). List
anything you were unsure about at the end.
