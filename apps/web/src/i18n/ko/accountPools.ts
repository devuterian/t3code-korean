/** Korean strings for account pools, provider account sync, and CLI sign-in (ScriptedAlchemy merge). */
export const KO_ACCOUNT_POOLS: Readonly<Record<string, string>> = {
  // Settings navigation and search
  "Account pools": "계정 풀",
  "Sync provider accounts": "프로바이더 계정 동기화",

  // Account pools page
  "Reconnect {environment} to set up its account pools.":
    "계정 풀을 설정하려면 {environment}에 다시 연결해야 합니다.",
  "Connect an environment to set up its account pools.":
    "계정 풀을 설정하려면 환경을 연결해야 합니다.",
  "This environment's server is too old for account pools. Update it to use them.":
    "이 환경의 서버 버전이 낮아 계정 풀을 사용할 수 없습니다. 서버를 업데이트하면 사용할 수 있습니다.",
  "Share the work across accounts": "여러 계정으로 작업 분산",
  "Pool two or more accounts of the same provider. The model picker then shows one entry for the provider, each turn runs on an account that still has quota, and a turn that hits a usage limit continues on another account. A conversation stays on its account while that account is available. Switching Claude accounts continues from a summary of the conversation; accounts that share one Codex home carry on natively.":
    "같은 프로바이더의 계정을 두 개 이상 하나의 풀로 묶습니다. 모델 선택기에는 해당 프로바이더가 하나만 표시되고, 각 턴은 사용량이 남은 계정에서 실행됩니다. 턴이 사용량 한도에 도달하면 다른 계정에서 이어서 실행합니다. 대화는 해당 계정을 사용할 수 있는 동안 같은 계정에 머뭅니다. Claude 계정을 전환하면 대화 요약을 바탕으로 이어 가고, 같은 Codex 홈을 공유하는 계정끼리는 대화를 그대로 이어 갑니다.",
  "Add a second account for a provider on the Providers page to pool them.":
    "풀로 묶으려면 프로바이더 페이지에서 같은 프로바이더의 계정을 하나 더 추가해야 합니다.",
  "Pool these accounts": "계정 풀 사용",
  "One {provider} entry in the model picker, with turns routed across the ticked accounts.":
    "모델 선택기에 {provider} 항목이 하나만 표시되고, 턴은 선택한 계정들에 나뉘어 실행됩니다.",
  "Tick at least two accounts to turn the pool on.":
    "풀을 켜려면 계정을 두 개 이상 선택해야 합니다.",
  "Pool {provider} accounts": "{provider} 계정 풀 사용",
  "Include {account} in the {provider} pool": "{provider} 풀에 {account} 포함",
  "Own conversation history, so switching to or from it uses a summary":
    "대화 기록이 따로 있어 이 계정으로 전환하거나 다른 계정으로 전환할 때 요약을 사용합니다",
  "In {pool} pool": "{pool} 풀에 포함",
  "Instance IDs starting with 'pool_' are reserved for account pools.":
    "'pool_'로 시작하는 인스턴스 ID는 계정 풀용으로 예약되어 있습니다. 다른 ID를 입력하십시오.",

  // Usage limits
  "Signed in on": "로그인 인스턴스",
  "One login, one quota: these instances share this limit.":
    "같은 로그인을 쓰는 인스턴스는 사용량 한도를 함께 씁니다.",
  "{count} account": "계정 {count}개",
  "{count} accounts": "계정 {count}개",

  // Add provider: connection method
  "Connection method": "연결 방식",
  "{environment}: choose how {provider} connects.":
    "{environment}: {provider} 연결 방식을 선택합니다.",
  "Sign in with Codex CLI": "Codex CLI로 로그인",
  "Add an account that shares your Codex skills, plugins, and history.":
    "Codex 스킬, 플러그인, 기록을 공유하는 계정을 추가합니다.",
  "Use existing Codex CLI": "기존 Codex CLI 사용",
  "Use the CLI account and settings on this environment.":
    "이 환경에 있는 CLI 계정과 설정을 사용합니다.",
  "Use ChatGPT sharing": "ChatGPT 공유 사용",
  "Use your ChatGPT plan. Some Codex features are unavailable.":
    "ChatGPT 요금제를 사용합니다. 일부 Codex 기능은 사용할 수 없습니다.",
  "Sign in with Claude Code": "Claude Code로 로그인",
  "Add an account with its own Claude settings and history.":
    "Claude 설정과 기록을 따로 쓰는 계정을 추가합니다.",
  "Use existing Claude Code": "기존 Claude Code 사용",

  // Codex CLI install and sign-in
  "Codex update available": "Codex 업데이트 가능",
  "Version {version} is available.": "{version} 버전을 사용할 수 있습니다.",
  "Update Codex": "Codex 업데이트",
  "Selected by this provider instance.": "이 프로바이더 인스턴스가 선택합니다.",
  "Install Codex CLI on this environment before signing in.":
    "로그인하기 전에 이 환경에 Codex CLI를 설치해야 합니다.",
  "Could not open the sign-in page. Use Open browser or copy the link.":
    "로그인 페이지를 열 수 없습니다. 브라우저 열기를 누르거나 링크를 복사하십시오.",
  "Downloading Codex CLI ({downloaded} MB).": "Codex CLI 다운로드 중 ({downloaded} MB).",
  "Downloading Codex CLI ({downloaded} MB of {total} MB).":
    "Codex CLI 다운로드 중 ({total} MB 중 {downloaded} MB).",
  "Extracting Codex CLI.": "Codex CLI 압축 해제 중.",
  "Checking Codex CLI.": "Codex CLI 확인 중.",
  "This provider cannot use the environment's Codex executable. Install Codex CLI for this provider.":
    "이 프로바이더는 환경의 Codex 실행 파일을 사용할 수 없습니다. 이 프로바이더용 Codex CLI를 설치하십시오.",
  "Codex CLI is installed. Checking whether this provider can run it.":
    "Codex CLI가 설치되었습니다. 이 프로바이더에서 실행할 수 있는지 확인하는 중입니다.",
  "Codex CLI installation failed.": "Codex CLI를 설치하지 못했습니다.",
  "Codex {version} is available.": "Codex {version} 버전을 사용할 수 있습니다.",
  "Codex CLI download": "Codex CLI 다운로드",
  "Could not cancel Codex installation. Try again.":
    "Codex 설치를 취소하지 못했습니다. 다시 시도하십시오.",
  "Installing Codex CLI": "Codex CLI 설치 중",
  "Could not install Codex CLI. Try again.": "Codex CLI를 설치하지 못했습니다. 다시 시도하십시오.",
  "Could not refresh Codex status. Try again.":
    "Codex 상태를 새로고침하지 못했습니다. 다시 시도하십시오.",
  "Update Codex CLI": "Codex CLI 업데이트",
  "Install Codex CLI": "Codex CLI 설치",
  "Refresh status": "상태 새로고침",
  "Paste the code from Claude": "Claude에서 받은 코드 붙여넣기",

  // Sync accounts dialog
  "Sync accounts": "계정 동기화",
  "Settings and API keys are copied from {device}. Sign-ins are not: each device signs in on its own, and a Cursor sign-in travels as an API key. Paths stay on {device}.":
    "설정과 API 키는 {device}에서 복사됩니다. 로그인 정보는 복사되지 않으므로 기기마다 따로 로그인해야 하며, Cursor 로그인은 API 키로 옮겨집니다. 경로는 {device}에만 남습니다.",
  "Sync again at any time; it updates the copies without duplicating them.":
    "언제든 다시 동기화할 수 있습니다. 다시 동기화해도 사본이 중복되지 않고 업데이트됩니다.",
  "Accounts on {device}": "{device}의 계정",
  "No configured or signed-in accounts on {device}.":
    "{device}에 구성되었거나 로그인된 계정이 없습니다.",
  "Signed in as {account}": "로그인 계정: {account}",
  "Copy to": "복사 대상",
  "Connect another device to sync accounts to it.":
    "계정을 동기화하려면 다른 기기를 연결해야 합니다.",
  Sync: "동기화",
  "Syncing…": "동기화 중…",
  "Sync to…": "다른 기기로 동기화…",
  "Sync this account to another device": "이 계정을 다른 기기로 동기화",
  "This is the source device.": "원본 기기입니다.",
  "{device} isn't connected.": "{device}: 연결되어 있지 않습니다.",
  "Update {device} to sync accounts.": "계정을 동기화하려면 {device}을(를) 업데이트해야 합니다.",
  "This connection can't manage providers on {device}.":
    "이 연결로는 {device}의 프로바이더를 관리할 수 없습니다.",
  "{device} uses this account's ID for another provider.":
    "{device}에서 이 계정의 ID를 다른 프로바이더가 사용하고 있습니다.",
  "Stays on {device}: {settings}.": "{device}에만 남는 항목: {settings}.",
  "Not supported on {device}, update it: {settings}.":
    "{device}에서 지원하지 않는 항목(업데이트 필요): {settings}.",
  "No value on {device}: {settings}.": "{device}에 값이 없는 항목: {settings}.",
  "Too large to copy: {settings}.": "너무 커서 복사할 수 없는 항목: {settings}.",
  "{account} on {device}": "{device}의 {account}",
  "Ready.": "준비 완료.",
  "Ready, signed in as {account}.": "준비 완료. 로그인 계정: {account}.",
  "Starting on {device}.": "{device}에서 시작 중.",
  "Turned off on {device}.": "{device}에서 꺼져 있습니다.",
  "Problem on {device}.": "{device}에서 문제가 발생했습니다.",
  "Problem on {device}: {message}": "{device}에서 문제가 발생했습니다: {message}",
  "Sign in on {device} to finish.": "{device}에서 로그인하면 완료됩니다.",
  "Sign in on {device} with the provider's own tool.":
    "{device}에서 프로바이더 자체 도구로 로그인해야 합니다.",
  "Sign in on {device}": "{device}에서 로그인",
  "Open on {device}": "{device}에서 열기",
  "Adds {account}": "{account} 추가",
  "Updates {account}": "{account} 업데이트",
  "Updates {account} (signed in as {email})": "{account} 업데이트 (로그인 계정: {email})",
  "Connect {provider}": "{provider} 연결",
  "Sign in on {environment}.": "{environment}에서 로그인합니다.",
  "Sign out of {provider} on {environment}?": "{environment}에서 {provider} 로그아웃하시겠습니까?",
};

/** Strings built by `ProviderPoolsSettings.logic.ts`, whose tests assert the English output. */
export const KO_ACCOUNT_POOLS_PATTERNS: ReadonlyArray<
  readonly [pattern: RegExp, render: (match: string) => string]
> = [
  [/^Limited until (.+)$/, (time) => `${time}까지 사용 제한`],
  [/^Continues the same conversations as (.+)$/, (names) => `${names}의 대화를 그대로 이어 갑니다`],
  [/^Same login as (.+)$/, (names) => `같은 로그인: ${names}`],
  [
    /^All (\d+) models are available with the same options in every ticked account$/,
    (n) => `선택한 모든 계정에서 모델 ${n}개를 모두 같은 옵션으로 사용할 수 있습니다`,
  ],
  [
    /^(\d+ of \d+) models are available with the same options in every ticked account$/,
    (text) => {
      const [available, total] = text.split(" of ");
      return `선택한 모든 계정에서 모델 ${total}개 중 ${available}개를 같은 옵션으로 사용할 수 있습니다`;
    },
  ],
];
