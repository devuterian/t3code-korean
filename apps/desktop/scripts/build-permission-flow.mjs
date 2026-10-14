import * as NodeChildProcess from "node:child_process";
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";
import * as NodeURL from "node:url";
import * as NodeUtil from "node:util";

// Builds the macOS PermissionFlow helper (apps/desktop/native/permission-flow)
// and copies the executable plus PermissionFlow's resource bundle into
// --output. The packaged app runs it from Contents/Resources/permission-flow/.

// oxlint-disable-next-line t3code/no-global-process-runtime -- The Swift toolchain targets the actual host; this script has no Effect runtime.
const hostArch = process.arch;
// oxlint-disable-next-line t3code/no-global-process-runtime -- Swift builds only run on macOS hosts.
const hostPlatform = process.platform;

const { values } = NodeUtil.parseArgs({
  options: { output: { type: "string" }, arch: { type: "string", default: hostArch } },
});

if (hostPlatform !== "darwin") throw new Error("The PermissionFlow helper only builds on macOS.");
if (!values.output) throw new Error("--output is required.");

const swiftArchs = { arm64: ["arm64"], x64: ["x86_64"], universal: ["arm64", "x86_64"] }[
  values.arch
];
if (!swiftArchs) throw new Error(`Unsupported macOS architecture: ${values.arch}`);

const packageDir = NodeURL.fileURLToPath(new URL("../native/permission-flow/", import.meta.url));
const swiftArgs = ["build", "-c", "release", ...swiftArchs.flatMap((arch) => ["--arch", arch])];
NodeChildProcess.execFileSync("swift", swiftArgs, { cwd: packageDir, stdio: "inherit" });
const binPath = NodeChildProcess.execFileSync("swift", [...swiftArgs, "--show-bin-path"], {
  cwd: packageDir,
  encoding: "utf8",
}).trim();

const output = NodePath.resolve(values.output);
NodeFS.rmSync(output, { recursive: true, force: true });
NodeFS.mkdirSync(output, { recursive: true });
NodeFS.copyFileSync(
  NodePath.join(binPath, "T3PermissionFlow"),
  NodePath.join(output, "t3-permission-flow"),
);
NodeFS.chmodSync(NodePath.join(output, "t3-permission-flow"), 0o755);
// Bundle.module looks for this next to the executable.
NodeFS.cpSync(
  NodePath.join(binPath, "PermissionFlow_PermissionFlow.bundle"),
  NodePath.join(output, "PermissionFlow_PermissionFlow.bundle"),
  { recursive: true },
);
