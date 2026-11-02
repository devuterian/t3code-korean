// Korean copy for upstream strings wrapped after the 2026-11-02 nightly merge.
export const KO_MERGE_1102_F: Readonly<Record<string, string>> = {
  "Could not copy version": "버전을 복사하지 못했어요",
  "Copy version": "버전 복사",
  "Android list may be incomplete": "Android 목록이 완전하지 않을 수 있어요",
  "This connection cannot change settings on {environments}.":
    "이 연결로는 {environments} 설정을 변경할 수 없어요.",
  "Device host not removed everywhere": "일부 환경에서 기기 호스트를 제거하지 못했어요",
  "Device host not saved everywhere": "일부 환경에서 기기 호스트를 저장하지 못했어요",
  "Device host not saved": "기기 호스트를 저장하지 못했어요",
  "EAS host not removed everywhere": "일부 환경에서 EAS 호스트를 제거하지 못했어요",
  "EAS host not saved everywhere": "일부 환경에서 EAS 호스트를 저장하지 못했어요",
  "Simlock host not saved everywhere": "일부 환경에서 Simlock 호스트를 저장하지 못했어요",
  "Simlock host not removed everywhere": "일부 환경에서 Simlock 호스트를 제거하지 못했어요",
  "{host}: {failed} of {total} environments failed": "{host}: 환경 {total}개 중 {failed}개 실패",
  "{host}: connection checks passed": "{host}: 연결 확인 통과",
  "Simulators and emulators installed on each environment's own machine.":
    "각 환경의 머신에 설치된 시뮬레이터와 에뮬레이터예요.",
  "Simulators and emulators installed on this environment's machine.":
    "이 환경의 머신에 설치된 시뮬레이터와 에뮬레이터예요.",
  "Testing connection": "연결 테스트 중",
  "Can't connect": "연결할 수 없음",
  "Add source": "소스 추가",
  "Machine over SSH": "SSH로 연결하는 머신",
  "Simlock pool (alpha)": "Simlock 풀 (알파)",
  "{platform} available on some": "{platform} 일부에서 사용 가능",
  "{platform} available": "{platform} 사용 가능",
  "{platform} not available": "{platform} 사용할 수 없음",
  "Not set up on this machine.": "이 머신에는 설정되지 않았어요.",
  "What agents here may do there": "여기 에이전트가 그곳에서 할 수 있는 작업",
  "An agent never gets more access there than its own mode here. Below full access, it can change only threads this link started, not that machine's own threads, projects or settings.":
    "에이전트는 여기서 가진 모드보다 넓은 권한을 그곳에서 받지 않아요. 전체 액세스보다 낮으면 이 연결로 시작한 스레드만 변경할 수 있고, 그 머신의 기존 스레드, 프로젝트, 설정은 변경할 수 없어요.",
  "Choose a machine": "머신 선택",
  "Could not load linked environments": "연결된 환경을 불러오지 못했어요",
  "Loading linked environments…": "연결된 환경을 불러오는 중…",
  "No linked environments": "연결된 환경 없음",
  "Link another machine running T3 Code, such as a VPS, so agents here can launch and drive threads there.":
    "VPS처럼 T3 Code가 실행 중인 다른 머신을 연결하면 여기 에이전트가 그곳에서 스레드를 시작하고 제어할 수 있어요.",
  'Forget {label}? Agents here stop working there. Revoke "T3 Code · …" in {label}\'s Connections to end the session there too.':
    '{label} 연결을 해제할까요? 여기 에이전트는 더 이상 그곳에서 작업할 수 없어요. 그곳의 세션도 끝내려면 {label}의 연결에서 "T3 Code · …"를 해지하세요.',
  "Could not forget the link": "연결을 해제하지 못했어요",
  "Expired. Link it again with a new pairing code.":
    "만료됐어요. 새 페어링 코드로 다시 연결하세요.",
  "Not answering right now.": "지금은 응답하지 않아요.",
  Reachable: "연결 가능",
  "Expires in {count} day. Link it again to renew.":
    "{count}일 후 만료돼요. 다시 연결하면 갱신돼요.",
  "Expires in {count} days. Link it again to renew.":
    "{count}일 후 만료돼요. 다시 연결하면 갱신돼요.",
  "Forgetting…": "연결 해제 중…",
  Forget: "연결 해제",
  "Could not link the environment": "환경을 연결하지 못했어요",
  "Linked {label}": "{label} 연결됨",
  "Link an environment": "환경 연결",
  "Agents here can then launch, message and wait on threads there. It appears in that environment's Connections, where it can be revoked.":
    "연결하면 여기 에이전트가 그곳의 스레드를 시작하고, 메시지를 보내고, 끝날 때까지 기다릴 수 있어요. 그 환경의 연결에 표시되며 그곳에서 해지할 수 있어요.",
  "Already linked. Linking again renews it with the access you pick.":
    "이미 연결돼 있어요. 다시 연결하면 선택한 권한으로 갱신돼요.",
  Address: "주소",
  "This app has no address for {machine} that another machine can reach. Enter its https or Tailscale address.":
    "이 앱에는 다른 머신이 접근할 수 있는 {machine}의 주소가 없어요. https 또는 Tailscale 주소를 입력하세요.",
  "From that environment's Connections, or t3 pair there":
    "그 환경의 연결 또는 t3 pair 명령에서 받은 코드",
  "Create a link on {machine}: Settings → Connections → Create link, then paste its code here.":
    "{machine}에서 설정 → 연결 → 링크 만들기를 선택한 다음, 받은 코드를 여기에 붙여넣으세요.",
  "Add color": "색상 추가",
  "Run only when every filter matches. Other requests are logged as filtered. Separate “is one of” values with commas; a value can't contain a comma.":
    "모든 필터가 일치할 때만 실행해요. 나머지 요청은 필터링됨으로 기록돼요. “다음 중 하나” 값은 쉼표로 구분하고, 값에는 쉼표를 넣을 수 없어요.",
  "Add filter": "필터 추가",
  "Filter {number} path": "필터 {number} 경로",
  "Remove filter {number}": "필터 {number} 제거",
  "Filter {number} test": "필터 {number} 조건",
  "Filter {number} value": "필터 {number} 값",
  equals: "같음",
  "does not equal": "같지 않음",
  "is one of": "다음 중 하나",
  "starts with": "다음으로 시작",
  exists: "있음",
  "Add a 1Password provider": "1Password 프로바이더 추가",
  "Provider variables on {environment} can read values from it by name. Values are read with the op CLI on that server when a provider starts.":
    "{environment}의 프로바이더 변수가 이름으로 이 값을 읽을 수 있어요. 프로바이더가 시작될 때 해당 서버에서 op CLI로 값을 읽어요.",
  "The account shorthand, sign-in address without https://, or ID that op account list shows.":
    "op account list에 표시되는 계정 약칭, https:// 없는 로그인 주소, 또는 ID예요.",
  "{label} source": "{label} 소스",
  Value: "값",
  "{label} reference": "{label} 참조",
  "Enter a valid secret reference.": "올바른 시크릿 참조를 입력하세요.",
  "Update T3 Code on {environment} to manage its secret providers.":
    "{environment}의 시크릿 프로바이더를 관리하려면 T3 Code를 업데이트하세요.",
  "Connect an environment to manage the secret providers its provider variables read from.":
    "환경을 연결하면 프로바이더 변수가 값을 읽어 오는 시크릿 프로바이더를 관리할 수 있어요.",
  "Toggle account visibility": "계정 표시 전환",
  "Unsupported provider ({kind})": "지원하지 않는 프로바이더 ({kind})",
  "Remove {label}?": "{label} 프로바이더를 제거할까요?",
  "Provider variables that read from {label} stop resolving until a provider with the same name is added again. The secrets themselves are untouched.":
    "{label}에서 값을 읽는 프로바이더 변수는 같은 이름의 프로바이더를 다시 추가할 때까지 값을 가져오지 못해요. 시크릿 자체는 그대로 남아요.",
  "Remove provider": "프로바이더 제거",
  "No secret providers configured.": "구성된 시크릿 프로바이더 없음",
  "Add a 1Password account, then pick it as the source of a provider variable.":
    "1Password 계정을 추가한 다음 프로바이더 변수의 소스로 선택하세요.",
  "Add Simlock host": "Simlock 호스트 추가",
  "Each selected environment's server leases devices from your Simlock gateway with its own agent token, and releases them when they close.":
    "선택한 환경의 서버가 각자의 에이전트 토큰으로 Simlock 게이트웨이에서 기기를 빌리고, 닫히면 반납해요.",
  "The environment's server leases devices from your Simlock gateway and releases them when they close.":
    "환경의 서버가 Simlock 게이트웨이에서 기기를 빌리고, 닫히면 반납해요.",
  "Gateway URL": "게이트웨이 URL",
  "Agent token · {environment}": "에이전트 토큰 · {environment}",
  "Agent token": "에이전트 토큰",
  "Leases, drives, and streams devices.": "기기를 빌리고, 조작하고, 화면을 스트리밍해요.",
  "Create one per environment with {command}, or leave it blank to add it later.":
    "환경마다 {command} 명령으로 만들 수 있어요. 비워 두고 나중에 추가해도 돼요.",
  "Create one with {command}, or leave it blank to add it later.":
    "{command} 명령으로 만들 수 있어요. 비워 두고 나중에 추가해도 돼요.",
  "A blank token uses the machine's {token} when its {url} is this gateway.":
    "토큰을 비워 두면, 머신의 {url} 값이 이 게이트웨이일 때 머신의 {token} 값을 사용해요.",
  "Devices at once": "동시 사용 기기",
  "Lease minutes": "대여 시간(분)",
  "A lease ends after the lease minutes even while in use.":
    "사용 중이어도 대여 시간이 지나면 대여가 끝나요.",
  "Saving restarts this host, which releases its devices.":
    "저장하면 이 호스트가 다시 시작되며 기기를 반납해요.",
  "Using this machine's agent-device token ({account}).":
    "이 머신의 agent-device 토큰을 사용 중이에요 ({account}).",
  "Accepted as {account}.": "{account} 계정으로 확인됐어요.",
  "Clear agent token": "에이전트 토큰 지우기",
  "Give the host a label.": "호스트 이름을 입력하세요.",
  "Enter the gateway's origin, such as https://gateway.example.ts.net:4700.":
    "https://gateway.example.ts.net:4700처럼 게이트웨이 주소를 입력하세요.",
  "Keep the limits within the ranges shown.": "한도를 표시된 범위 안으로 맞추세요.",
  "1 device": "기기 1대",
  "{count} devices": "기기 {count}대",
  "Up to {devices} at once, each released after {minutes} min":
    "동시에 최대 {devices}, 각 {minutes}분 뒤 반납",
  "Passed for today": "오늘은 지났어요",
  "Duplicate of an option above": "위 옵션과 중복",
  "Same time as an option above": "위 옵션과 같은 시각",
  "Snooze option {number}": "미루기 옵션 {number}",
  "Remove snooze option {number}": "미루기 옵션 {number} 제거",
  "Menus offer only Custom…": "메뉴에 “사용자 지정…”만 표시돼요",
  "Menu now: {options}": "현재 메뉴: {options}",
  "Add option": "옵션 추가",
  "Up to {max} options": "최대 {max}개",
  at: "시각",
  Amount: "수량",
  In: "지금부터",
  Today: "오늘",
  Monday: "월요일",
  Tuesday: "화요일",
  Wednesday: "수요일",
  Thursday: "목요일",
  Friday: "금요일",
  Saturday: "토요일",
  Sunday: "일요일",
  minute: "분",
  hour: "시간",
  hours: "시간",
  "Choices in every snooze menu, listed soonest first. Weekdays mean the next one after today.":
    "모든 미루기 메뉴에 표시되는 선택지예요. 빠른 순서로 정렬되고, 요일은 오늘 이후 가장 가까운 요일이에요.",
  "snooze options": "미루기 옵션",
  "Signed-in GitHub account": "로그인한 GitHub 계정",
  "Show account": "계정 표시",
  "Hide account": "계정 숨기기",
  "Signed in, but the token saved below is used until you remove it.":
    "로그인돼 있지만, 아래에 저장된 토큰을 제거하기 전까지는 그 토큰을 사용해요.",
  "Approve the app on GitHub to finish signing in.": "GitHub에서 앱을 승인하면 로그인이 끝나요.",
  "A far higher GitHub API rate limit than a personal token or gh login.":
    "개인 토큰이나 gh 로그인보다 GitHub API 요청 한도가 훨씬 높아요.",
  "Sign in with GitHub": "GitHub로 로그인",
  "Copy code & open GitHub": "코드 복사 후 GitHub 열기",
  "Waiting for approval · code expires at {time}": "승인 대기 중 · 코드 만료 시각 {time}",
  "Reaches repositories in accounts and organizations that installed the app.":
    "앱을 설치한 계정과 조직의 저장소에 접근할 수 있어요.",
  "Install on an organization": "조직에 설치",
  "Manage on GitHub": "GitHub에서 관리",
  "Or use your own credentials": "또는 내 인증 정보 사용",
  "Add a Guide tab to pull requests. An agent explains the changes and points out decisions that need review.":
    "풀 리퀘스트에 가이드 탭을 추가해요. 에이전트가 변경 내용을 설명하고 검토가 필요한 결정을 짚어 줘요.",
  "Model for source control text and branch or bookmark names. When disabled, use the text generation model configured for this environment.":
    "소스 제어 텍스트와 브랜치 또는 북마크 이름에 쓰는 모델이에요. 끄면 이 환경에 설정된 텍스트 생성 모델을 사용해요.",
  "{enabled} of {total} on": "{total}개 중 {enabled}개 켜짐",
  "Choose what the thread details card shows. You can also right-click the card.":
    "스레드 세부 정보 카드에 표시할 항목을 선택해요. 카드를 오른쪽 클릭해도 돼요.",
  "thread details": "스레드 세부 정보",
  "Switch to {track}": "전환: {track}",
  "Switch to {track}?": "{track} 채널로 전환할까요?",
  "Could not find the latest {track} release in this environment's npm registry.":
    "이 환경의 npm 레지스트리에서 최신 {track} 릴리스를 찾지 못했어요.",
  "Checking releases…": "릴리스 확인 중…",
  "Could not switch to {track}": "{track} 채널로 전환하지 못했어요",
  "This app downloaded nothing, not {release} or newer.":
    "이 앱이 아무것도 다운로드하지 않았어요. {release} 이상이어야 해요.",
  "This app downloaded {downloaded}, not {release} or newer.":
    "이 앱이 {downloaded} 버전을 다운로드했지만, {release} 이상이어야 해요.",
  "Every connected machine is already on {track}. This only saves the track.":
    "연결된 모든 머신이 이미 {track} 채널이에요. 채널 설정만 저장해요.",
  "This app's updates are off here, so reinstall it yourself to switch.":
    "이 앱은 업데이트가 꺼져 있어서, 전환하려면 직접 다시 설치해야 해요.",
  "If T3 Code does not reopen after it restarts, open it again.":
    "다시 시작한 뒤 T3 Code가 열리지 않으면 직접 다시 여세요.",
  "This app cannot switch: {reason}.": "이 앱은 전환할 수 없어요: {reason}.",
  "effort display": "추론 강도 표시",
  "provider health interval": "프로바이더 상태 확인 간격",
  "active host power interval": "활성 호스트 전원 확인 간격",
  "idle host power interval": "유휴 호스트 전원 확인 간격",
  "fallback model": "대체 모델",
  "project name": "프로젝트 이름",
  "compact idle threads": "유휴 스레드 압축",
  "Use git-worktree-fast": "git-worktree-fast 사용",
  "Clones commits you prepared with git-worktree-fast from its APFS cache instead of checking them out. Prepare one by running this in a T3 Code terminal:":
    "git-worktree-fast로 미리 준비한 커밋은 체크아웃하지 않고 APFS 캐시에서 바로 복제해요. T3 Code 터미널에서 이 명령으로 준비할 수 있어요:",
  "Other commits, and a failed fast clone that left nothing behind, use Git’s normal checkout.":
    "준비하지 않은 커밋이나 빠른 복제에 실패한 경우에는 Git의 일반 체크아웃을 써요.",
  "Install git-worktree-fast to use this, then reload:":
    "git-worktree-fast를 설치한 다음 새로고침하면 쓸 수 있어요:",
  "Install git-worktree-fast on {machines} to use this, then reload:":
    "{machines}에 git-worktree-fast를 설치한 다음 새로고침하면 쓸 수 있어요:",
  "Create worktrees with git-worktree-fast": "git-worktree-fast로 워크트리 만들기",
};
