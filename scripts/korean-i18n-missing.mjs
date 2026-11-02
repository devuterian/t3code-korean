// Lists UI strings the Korean dictionaries miss: `bun scripts/korean-i18n-missing.mjs [--json out]`.
// `--unwrapped <ref>` instead lists English JSX text in .tsx files changed since <ref>.
// Runs with Bun, which resolves the apps' extensionless TypeScript imports.
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";

const { readdirSync, readFileSync, statSync, writeFileSync } = NodeFS;
const { join, relative } = NodePath;

const ROOT = join(import.meta.dir, "..");

const CALL = /\b(?:t|translate|translateText)\(\s*(["'`])((?:\\.|(?!\1)[^\\])*?)\1\s*[,)]/gs;

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "i18n" || name.startsWith(".")) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(tsx?|mts)$/.test(name) && !/\.(test|spec|browser\.test|stories)\./.test(name)) {
      out.push(path);
    }
  }
  return out;
}

function unescape(raw) {
  return raw.replace(/\\(["'`\\])/g, "$1").replace(/\\n/g, "\n");
}

function collect(srcDir) {
  const keys = new Map();
  for (const file of walk(srcDir, [])) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(CALL)) {
      const [, quote, raw] = match;
      if (quote === "`" && raw.includes("${")) continue;
      const key = unescape(raw);
      if (!/[A-Za-z]{2}/.test(key)) continue;
      const where = relative(ROOT, file);
      const list = keys.get(key) ?? [];
      if (!list.includes(where)) list.push(where);
      keys.set(key, list);
    }
  }
  return keys;
}

const web = await import(join(ROOT, "apps/web/src/i18n/translate.ts"));
const mobile = await import(join(ROOT, "apps/mobile/src/i18n/translate.ts"));

const report = { web: [], mobile: [] };
for (const [app, srcDir, tr] of [
  ["web", "apps/web/src", (s) => web.translate(s, "ko")],
  ["mobile", "apps/mobile/src", (s) => mobile.translate(s, undefined, "ko")],
]) {
  for (const [key, files] of collect(join(ROOT, srcDir))) {
    if (tr(key) === key) report[app].push({ key, files });
  }
  report[app].sort((a, b) => a.files[0].localeCompare(b.files[0]));
}

// --unwrapped <git-ref>: in .tsx files changed since <git-ref> (usually the last
// merged upstream tag), list English JSX text and string props that never reach
// t()/translate(). Heuristic: expect some false positives (code samples, names).
const unwrappedAt = process.argv.indexOf("--unwrapped");
if (unwrappedAt !== -1) {
  const ref = process.argv[unwrappedAt + 1];
  const changed = Bun.spawnSync(
    [
      "git",
      "diff",
      "--name-only",
      "--diff-filter=AM",
      `${ref}..HEAD`,
      "--",
      "apps/web/src/**/*.tsx",
      "apps/mobile/src/**/*.tsx",
    ],
    { cwd: ROOT },
  )
    .stdout.toString()
    .split("\n")
    .filter((f) => f && !/\.(test|browser\.test|stories)\./.test(f));
  const JSX_TEXT = />\s*([A-Z][A-Za-z'’,.?!: -]*[a-z][A-Za-z'’,.?!: -]*)\s*</g;
  const PROP =
    /\b(?:title|label|placeholder|aria-label|description|tooltip|emptyText|confirmLabel|cancelLabel)=\s*"([A-Z][^"]*[a-z][^"]*)"/g;
  let total = 0;
  for (const file of changed) {
    let text;
    try {
      text = readFileSync(join(ROOT, file), "utf8");
    } catch {
      continue;
    }
    const hits = new Set();
    for (const m of text.matchAll(JSX_TEXT)) if (m[1].trim().length > 1) hits.add(m[1].trim());
    for (const m of text.matchAll(PROP)) hits.add(m[1]);
    if (hits.size === 0) continue;
    total += hits.size;
    console.log(`${file}: ${[...hits].map((h) => JSON.stringify(h)).join(", ")}`);
  }
  console.log(`unwrapped candidates: ${total} in ${changed.length} changed .tsx files`);
  process.exit(0);
}

const jsonAt = process.argv.indexOf("--json");
if (jsonAt !== -1 && process.argv[jsonAt + 1]) {
  writeFileSync(process.argv[jsonAt + 1], JSON.stringify(report, null, 2));
}
for (const app of ["web", "mobile"]) {
  console.log(`${app}: ${report[app].length} untranslated`);
  for (const { key, files } of report[app]) console.log(`  ${JSON.stringify(key)}  ${files[0]}`);
}
