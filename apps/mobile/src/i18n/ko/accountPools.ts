/** Korean strings for the account-pools merge (provider account sync, Codex CLI install, pooled usage). */
export const KO_ACCOUNT_POOLS: Readonly<Record<string, string>> = {
  // Settings > Provider accounts: Codex CLI install
  "Install Codex CLI before signing in.": "로그인하기 전에 Codex CLI를 설치해야 합니다.",
  "Install Codex CLI on {environment} before signing in.":
    "로그인하기 전에 {environment}에 Codex CLI를 설치해야 합니다.",
  "Downloading Codex CLI ({downloaded} MB).": "Codex CLI를 내려받는 중입니다({downloaded}MB).",
  "Downloading Codex CLI ({downloaded} MB of {total} MB).":
    "Codex CLI를 내려받는 중입니다({downloaded}MB / {total}MB).",
  "Extracting Codex CLI.": "Codex CLI 압축을 푸는 중입니다.",
  "Checking Codex CLI.": "Codex CLI를 확인하는 중입니다.",
  "This provider cannot use the environment's Codex executable. Install Codex CLI for this provider.":
    "이 프로바이더는 환경에 있는 Codex 실행 파일을 쓸 수 없습니다. 이 프로바이더용 Codex CLI를 설치해야 합니다.",
  "Codex CLI is installed. Checking whether this provider can run it.":
    "Codex CLI를 설치했습니다. 이 프로바이더에서 실행할 수 있는지 확인하는 중입니다.",
  "Codex CLI installation failed.": "Codex CLI를 설치하지 못했습니다. 설치를 다시 시도하십시오.",
  "Codex {version} is available.": "Codex {version} 업데이트가 있습니다.",
  "Cancel installation": "설치 취소",
  "Update Codex CLI": "Codex CLI 업데이트",
  "Install Codex CLI": "Codex CLI 설치",
  "Refresh provider status": "프로바이더 상태 새로고침",
  "Retry installation": "설치 다시 시도",
  "Could not cancel Codex installation. Try again.":
    "Codex 설치를 취소하지 못했습니다. 다시 시도하십시오.",
  "Could not install Codex CLI. Try again.": "Codex CLI를 설치하지 못했습니다. 다시 시도하십시오.",
  "Paste the code from Claude": "Claude에서 받은 코드 붙여넣기",

  // Settings > Provider accounts: sync to other devices
  "Sync to…": "다른 기기에 동기화…",
  "Copy this account's settings to another device.": "이 계정 설정을 다른 기기에 복사합니다.",
  "Settings and API keys are copied from {device}. Sign-ins are not: each device signs in on its own. Paths stay on {device}.":
    "{device}의 설정과 API 키를 복사합니다. 로그인은 복사되지 않으므로 기기마다 따로 로그인해야 합니다. 경로는 {device}에만 남습니다.",
  "Sync again at any time; it updates the copies without duplicating them.":
    "언제든 다시 동기화할 수 있습니다. 사본을 새로 만들지 않고 기존 사본을 업데이트합니다.",
  "Syncing…": "동기화 중…",
  Sync: "동기화",
  "This is the source device.": "원본 기기입니다.",
  "{device} isn't connected.": "{device} 기기가 연결되어 있지 않습니다.",
  "Update {device} to sync accounts.": "계정을 동기화하려면 {device}에서 업데이트가 필요합니다.",
  "This connection can't manage providers on {device}.":
    "이 연결로는 {device}의 프로바이더를 관리할 수 없습니다.",
  "{device} uses this account's ID for another provider.":
    "{device}에서 다른 프로바이더가 이 계정의 ID를 쓰고 있습니다.",
  "Updates the copy on {device}.": "{device}에 있는 사본을 업데이트합니다.",
  "Updates the copy on {device} (signed in as {account}).":
    "{device}에 있는 사본을 업데이트합니다. 로그인 계정: {account}",
  "Stays on {device}: {settings}.": "{device}에만 남는 설정: {settings}",
  "Not supported on {device}, update it: {settings}.":
    "{device}에서 지원하지 않는 설정: {settings}. {device}에서 업데이트가 필요합니다.",
  "No value on {device}: {settings}.": "{device}에 값이 없는 설정: {settings}",
  "Too large to copy: {settings}.": "너무 커서 복사하지 못한 설정: {settings}",
  "{account} on {device}": "{device}의 {account}",
  "Ready.": "사용할 준비가 되었습니다.",
  "Ready, signed in as {account}.": "사용할 준비가 되었습니다. 로그인 계정: {account}",
  "Starting on {device}.": "{device}에서 시작하는 중입니다.",
  "Turned off on {device}.": "{device}에서 꺼져 있습니다.",
  "Problem on {device}.": "{device}에서 문제가 생겼습니다.",
  "Problem on {device}: {message}": "{device}에서 문제가 생겼습니다: {message}",
  "Sign in on {device} to finish.": "마무리하려면 {device}에서 로그인해야 합니다.",
  "Sign in on {device} with the provider's own tool.":
    "{device}에서 프로바이더 자체 도구로 로그인해야 합니다.",

  // Usage limits: pooled accounts
  "{count} account": "계정 {count}개",
  "{count} accounts": "계정 {count}개",
  "Signed in on": "로그인된 프로바이더",
  "One login, one quota: these instances share this limit.":
    "로그인 하나에 한도도 하나입니다. 이 프로바이더들은 같은 한도를 함께 씁니다.",

  // Thread: subagent input status (from client-runtime childThreadInputsTitle)
  "Subagent needs input": "서브에이전트 입력 필요",
  "Subagent needs approval": "서브에이전트 승인 필요",
  "Subagent needs you": "서브에이전트 확인 필요",
  "Open approval from {title}": "{title}의 승인 요청 열기",
  "Open question from {title}": "{title}의 질문 열기",

  // Home: thread undo toast
  "Settled thread": "스레드 정리됨",
  "Snoozed thread": "스레드 미뤄 둠",
  "Unpinned thread": "스레드 고정 해제됨",
  Undo: "실행 취소",
};
