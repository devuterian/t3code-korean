// Lists Korean catalog entries that still need work: `node scripts/korean-i18n-missing.mjs [--json out]`.
// An entry needs work when ko.json still holds the English text (new key from `gt generate`) or
// uses 합쇼체. Product names and pure variable strings that stay English are skipped.
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";

const ROOT = NodePath.join(import.meta.dirname, "..");
const APPS = ["web", "mobile", "desktop"];
const FORMAL = /(합니다|습니다|십시오|하시겠|해 주세요|주십시오|습니까|십니까)/;
const KEEP_ENGLISH = new Set([
  "CPU",
  "Conventional Commits",
  "Dev",
  "Face ID",
  "Git URL",
  "HTML",
  "Linux/WSL",
  "Nightly",
  "PAIRCODE",
  "PDF",
  "PID",
  "T3 Connect",
  "Tailscale HTTPS",
  "URL",
  "zen",
]);

const text = (value) =>
  typeof value === "string"
    ? value
    : Array.isArray(value)
      ? value.map(text).join(" ")
      : value && typeof value === "object"
        ? Object.values(value).map(text).join(" ")
        : "";

// Units, abbreviations and GT's JSX markers read the same in Korean.
const NEUTRAL_WORDS = new Set(["KB", "MB", "GB", "ms", "PR", "vs", "span"]);
// Strips ICU arguments so "{label}: {value}" count as having no words.
const words = (value) =>
  (
    text(value)
      .replace(/\{[^{}]*\}/g, "")
      .replace(/_gt_value_\d+/g, "")
      .match(/[A-Za-z]{2,}/g) ?? []
  ).filter((word) => !NEUTRAL_WORDS.has(word));

const report = {};
for (const app of APPS) {
  const dir = NodePath.join(ROOT, "apps", app, "src/i18n/translations");
  const en = JSON.parse(NodeFS.readFileSync(NodePath.join(dir, "en.json"), "utf8"));
  const ko = JSON.parse(NodeFS.readFileSync(NodePath.join(dir, "ko.json"), "utf8"));
  report[app] = [];
  for (const [key, source] of Object.entries(en)) {
    const value = ko[key];
    const untranslated =
      JSON.stringify(value) === JSON.stringify(source) &&
      !KEEP_ENGLISH.has(text(source)) &&
      words(source).length > 0;
    if (untranslated || FORMAL.test(text(value))) {
      report[app].push({ key, en: source, ko: untranslated ? null : value });
    }
  }
}

const jsonIndex = process.argv.indexOf("--json");
if (jsonIndex !== -1) {
  NodeFS.writeFileSync(process.argv[jsonIndex + 1], `${JSON.stringify(report, null, 2)}\n`);
}
for (const app of APPS) {
  console.log(`${app}: ${report[app].length} to translate`);
  for (const entry of report[app].slice(0, 20)) console.log(`  ${entry.key} ${text(entry.en)}`);
}
