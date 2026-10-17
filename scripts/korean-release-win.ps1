# Build an unsigned Windows x64 NSIS release of the Korean fork: installer,
# blockmap and latest.yml for devuterian/t3code-korean. It never uploads anything.
#
#   powershell -File scripts/korean-release-win.ps1 0.1.0-ko.2 [output-dir]
#
# Needs Node, the installed workspace (vp i), Rust with the x86_64-pc-windows-msvc
# target, Python 3 and Visual Studio Build Tools (Desktop development with C++,
# Windows SDK, Spectre-mitigated libs). The app keeps the official app id, so it
# installs over and updates earlier Korean Windows builds in
# %LOCALAPPDATA%\Programs\t3code.
param(
  [Parameter(Mandatory = $true)][string]$Version,
  [string]$OutputDir
)
$ErrorActionPreference = "Stop"

$UpdateRepository = "devuterian/t3code-korean"
$RepoRoot = Split-Path -Parent $PSScriptRoot

# T3 Connect only works when the public Clerk/relay identifiers are baked in.
# They come from the gitignored root .env (copy .env.example); a fresh checkout
# has none, which silently ships a build where Connect sign-in is broken.
$envFiles = @("$RepoRoot\.env", "$RepoRoot\.env.local") | Where-Object { Test-Path $_ }
foreach ($key in "T3CODE_CLERK_PUBLISHABLE_KEY", "T3CODE_CLERK_JWT_TEMPLATE", "T3CODE_RELAY_URL") {
  $fromEnv = [Environment]::GetEnvironmentVariable($key)
  $fromFile = $envFiles | Where-Object { Select-String -Path $_ -Pattern "^$key=.+" -Quiet }
  if (-not $fromEnv -and -not $fromFile) {
    Write-Error "$key is not set; copy .env.example to $RepoRoot\.env first."
  }
}

if ($Version -notmatch '^[0-9]+\.[0-9]+\.[0-9]+-ko\.[0-9]+$') {
  Write-Error "usage: korean-release-win.ps1 <version like 0.1.0-ko.2> [output-dir]"
}
if (-not $OutputDir) {
  $OutputDir = Join-Path $RepoRoot ("release-ko" + ($Version -replace '^.*-ko\.', '') + "-win")
}
if ((Test-Path $OutputDir) -and (Get-ChildItem $OutputDir -Force | Select-Object -First 1)) {
  Write-Error "$OutputDir already has files; pick another output dir."
}

# No Azure Trusted Signing for fork builds.
foreach ($name in "T3CODE_DESKTOP_SIGNED", "CSC_LINK", "CSC_KEY_PASSWORD", "WIN_CSC_LINK", "WIN_CSC_KEY_PASSWORD",
  "AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET") {
  Remove-Item "Env:$name" -ErrorAction SilentlyContinue
}

$env:PATH = "$RepoRoot\node_modules\.bin;$env:USERPROFILE\.cargo\bin;$env:PATH"
$env:T3CODE_DESKTOP_UPDATE_REPOSITORY = $UpdateRepository

Push-Location $RepoRoot
try {
  & node scripts/build-desktop-artifact.ts `
    --platform win --target nsis --arch x64 `
    --build-version $Version --output-dir $OutputDir
  if ($LASTEXITCODE -ne 0) { Write-Error "desktop build failed with exit code $LASTEXITCODE." }
} finally {
  Pop-Location
}

$Base = "T3-Code-Korean-$Version-win-x64"
$Files = @("$Base.exe", "$Base.exe.blockmap", "latest.yml")
foreach ($file in $Files) {
  if (-not (Test-Path (Join-Path $OutputDir $file))) {
    Write-Error "expected $OutputDir\$file was not produced."
  }
}
if (-not (Select-String -Path (Join-Path $OutputDir "latest.yml") -Pattern "url: $Base.exe" -SimpleMatch -Quiet)) {
  Write-Error "latest.yml does not reference $Base.exe."
}

Write-Host ""
Write-Host "Upload these to the v$Version release on $UpdateRepository (names unchanged):"
foreach ($file in $Files) { Write-Host "  $OutputDir\$file" }
Write-Host ""
Write-Host "Installed Windows builds follow the newest ko release, so every release"
Write-Host "that should reach Windows must carry all 3 files above."
