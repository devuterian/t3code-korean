// Korean copy for upstream strings wrapped after the 2026-11-02 nightly merge.
export const KO_MERGE_1102_E: Readonly<Record<string, string>> = {
  // Thread error banner (usage limit)
  "Send it to your workspace admin.": "작업 공간 관리자에게 보내세요.",
  "Could not copy the request": "요청을 복사하지 못했어요",
  "You've reached your workspace's limit for using your ChatGPT plan in other apps. Copy a request to ask your workspace admin for increased usage limits.":
    "다른 앱에서 ChatGPT 플랜을 쓸 수 있는 작업 공간 한도에 도달했어요. 요청을 복사해 작업 공간 관리자에게 사용량 한도를 늘려 달라고 요청하세요.",
  "Review your usage settings in ChatGPT.": "ChatGPT에서 사용량 설정을 확인하세요.",
  "Copy request for admin": "관리자용 요청 복사",

  // Chat view, side chats
  Conversation: "대화",
  "Message input": "메시지 입력",
  "Side chats cannot start side chats.": "사이드 채팅에서는 사이드 채팅을 시작할 수 없어요.",
  "Subagent threads cannot start side chats.":
    "서브에이전트 스레드에서는 사이드 채팅을 시작할 수 없어요.",
  "Side chats are not ready yet. Try again in a moment.":
    "사이드 채팅을 아직 사용할 수 없어요. 잠시 후 다시 시도하세요.",
  "Update this environment's T3 Code server to use side chats.":
    "사이드 채팅을 사용하려면 이 환경의 T3 Code 서버를 업데이트하세요.",
  "Side chats start after the first message.":
    "첫 메시지를 보낸 뒤에 사이드 채팅을 시작할 수 있어요.",
  "Available once the thread's worktree is set up.":
    "스레드 워크트리 설정이 끝나면 사용할 수 있어요.",
  "Side chat": "사이드 채팅",
  "Delete side chat": "사이드 채팅 삭제",
  'Delete side chat "{title}"?': '"{title}" 사이드 채팅을 삭제할까요?',
  "This permanently clears its conversation history.": "대화 기록이 완전히 지워져요.",
  "Could not delete the side chat": "사이드 채팅을 삭제하지 못했어요",
  "This side chat was deleted.": "이 사이드 채팅은 삭제됐어요.",
  "Bring back": "가져오기",
  "Brought back": "가져옴",
  "The main thread gets this side chat with your next message there.":
    "메인 스레드에서 다음 메시지를 보낼 때 이 사이드 채팅이 함께 전달돼요.",
  "Could not bring back the side chat": "사이드 채팅을 가져오지 못했어요",
  "Available when the main thread is idle.": "메인 스레드가 대기 중일 때 사용할 수 있어요.",
  "Available after a finished reply.": "답변이 끝난 뒤에 사용할 수 있어요.",
  "Adds this side chat to the main thread's next message.":
    "이 사이드 채팅을 메인 스레드의 다음 메시지에 추가해요.",

  // Command palette
  "Triage an issue": "이슈 분류",
  "An agent investigates a T3 Code problem and helps file an issue":
    "에이전트가 T3 Code 문제를 조사하고 이슈 등록을 도와요",
  "Copy thread": "스레드 복사",
  "Focus Next Workspace Area": "다음 작업 영역으로 포커스 이동",
  "Focus Previous Workspace Area": "이전 작업 영역으로 포커스 이동",
  "Unpin project": "프로젝트 고정 해제",
  "Repository name incomplete": "저장소 이름이 완성되지 않음",

  // Diff panel
  Commits: "커밋",
  "Loading commits...": "커밋 불러오는 중…",
  "No commits on this branch.": "이 브랜치에 커밋이 없어요.",
  "Showing latest {count} commits": "최근 커밋 {count}개 표시",
  "Hide test files": "테스트 파일 숨기기",
  "Show test files": "테스트 파일 표시",
  "This tool call changed {count} files. The recorded patch omits {omitted} of them.":
    "이 도구 호출로 파일 {count}개가 바뀌었어요. 기록된 패치에는 그중 {omitted}개가 빠져 있어요.",
  "The provider recorded file content without a diff.":
    "프로바이더가 변경 사항 없이 파일 내용만 기록했어요.",
  "Empty content.": "내용이 비어 있어요.",
  "Resize Changes files": "변경 사항 파일 목록 크기 조절",
  "Resize PR Code files": "PR 코드 파일 목록 크기 조절",
  "Tool call": "도구 호출",
  "Loading tool call diff...": "도구 호출 변경 사항 불러오는 중…",
  "Loading commit...": "커밋 불러오는 중…",
  "Relative path": "상대 경로",
  "Full path": "전체 경로",

  // Right panel, server update, sidebar
  "Workspace panel": "작업 공간 패널",
  "not updated": "업데이트되지 않음",
  "That snooze time has passed. Choose another time.":
    "미루기 시간이 이미 지났어요. 다른 시간을 선택하세요.",

  // Browser device toolbar
  Dimensions: "크기",
  "Browser device toolbar": "브라우저 기기 도구 모음",
  "Browser device preset": "브라우저 기기 프리셋",
  "Viewport dimensions": "뷰포트 크기",
  "Viewport width": "뷰포트 너비",
  "Viewport height": "뷰포트 높이",
  "Rotate viewport": "뷰포트 회전",
  "Lock viewport aspect ratio": "뷰포트 가로세로 비율 고정",
  "Unlock viewport aspect ratio": "뷰포트 가로세로 비율 고정 해제",
  "Lock aspect ratio": "가로세로 비율 고정",
  "Unlock aspect ratio": "가로세로 비율 고정 해제",
  "PDF document": "PDF 문서",
  "Loading code...": "코드 불러오는 중…",
  "This environment is managed by {organization}.": "이 환경은 {organization}에서 관리해요.",
  "Could not open this address": "이 주소를 열 수 없어요",
  "Enter an http or https URL.": "http 또는 https URL을 입력하세요.",

  // Child thread approvals, pending approval row
  "Approval from {title}": "{title}의 승인",
  "Approval needed from {title}": "{title}의 승인 필요",
  "Provider process is gone. Interrupt or restart the child thread to respond.":
    "프로바이더 프로세스가 종료됐어요. 응답하려면 하위 스레드를 중단하거나 다시 시작하세요.",
  "Provider process is gone. Interrupt or restart the run to respond.":
    "프로바이더 프로세스가 종료됐어요. 응답하려면 실행을 중단하거나 다시 시작하세요.",
  "Why am I being asked this?": "왜 이런 요청이 오나요?",
  "Full access skips approvals, but an ask rule in the agent's own settings matches this action, so it still asks. Remove or narrow that rule to stop these prompts.":
    "전체 액세스는 승인을 건너뛰지만, 에이전트 자체 설정의 확인 규칙이 이 작업과 일치해서 계속 물어봐요. 이 요청을 없애려면 그 규칙을 제거하거나 범위를 좁히세요.",
  "Full access skips approvals, but the agent still stops for a few safety checks of its own that no setting can skip, such as a delete whose path it can't verify. T3 Code can't turn these off, so check the request and approve it if it's what you expect.":
    "전체 액세스는 승인을 건너뛰지만, 에이전트에는 어떤 설정으로도 건너뛸 수 없는 자체 안전 확인이 있어요. 경로를 확인할 수 없는 삭제가 그 예예요. T3 Code에서는 이 확인을 끌 수 없으니 요청을 확인하고, 의도한 작업이면 승인하세요.",

  // Composer effort column
  "No effort levels": "추론 강도 없음",
  "Permissions: {mode}": "권한: {mode}",

  // Link request card
  "Link a machine to this environment": "이 환경에 머신 연결",
  "Link {name} to this environment": "이 환경에 {name} 연결",
  "Choose machine…": "머신 선택…",
  "Review link…": "연결 검토…",
  "Only a session that manages access here can answer this.":
    "여기서 액세스를 관리하는 세션만 응답할 수 있어요.",
  "Link a machine": "머신 연결",
  "Link {name}": "{name} 연결",
  "Agents here can then launch, message and wait on threads there. Revoke it in that machine's Connections.":
    "연결하면 이 환경의 에이전트가 해당 머신의 스레드를 시작하고, 메시지를 보내고, 끝날 때까지 기다릴 수 있어요. 해당 머신의 연결 설정에서 해제할 수 있어요.",
  Address: "주소",
  "This app has no address for {name} that another machine can reach. Enter its https or Tailscale address.":
    "다른 머신에서 접근할 수 있는 {name}의 주소를 앱에서 알 수 없어요. https 또는 Tailscale 주소를 입력하세요.",
  "Paste the code": "코드 붙여넣기",
  "Create a link on {name}: Settings → Connections → Create link, then paste its code here.":
    "{name}에서 설정 → 연결 → 링크 만들기를 선택해 링크를 만든 뒤 코드를 여기에 붙여넣으세요.",
  "This environment is already linked to {name}. The agent can use that link as it is; change its access in Settings → Connections.":
    "이 환경은 이미 {name}에 연결돼 있어요. 에이전트가 그 연결을 그대로 쓸 수 있고, 액세스는 설정 → 연결에서 바꿀 수 있어요.",
  "Linking…": "연결 중…",
  "Use this link": "이 연결 사용",
  "Another address…": "다른 주소…",

  // Native child work dialog
  "Subagent work": "서브에이전트 작업",
  "Read only. These subagents cannot take messages.":
    "읽기 전용이에요. 이 서브에이전트에는 메시지를 보낼 수 없어요.",
  "The provider has no record of which subagents this call started.":
    "이 호출이 시작한 서브에이전트에 대한 기록이 프로바이더에 없어요.",
  "Earlier steps are not shown.": "이전 단계는 표시되지 않아요.",
  "No transcript yet.": "아직 기록이 없어요.",

  // Thread details
  "Show in thread details": "스레드 상세에 표시",
  "Environment and worktree": "환경 및 워크트리",
  "Branch and pull request": "브랜치 및 풀 리퀘스트",
  "Ahead of pace": "사용 속도가 적정보다 빠름",
  "On pace": "적정 속도",
  "Under pace": "사용 속도가 적정보다 느림",
  "Resets in {duration}": "{duration} 후 초기화",
  "{percent}% left": "{percent}% 남음",
  "{label}: {percent}% left": "{label}: {percent}% 남음",
  "{percent}% used": "{percent}% 사용",
  "{tokens} tokens used": "토큰 {tokens}개 사용",
  "Context: {percent}% used": "컨텍스트: {percent}% 사용",
  "Context: {tokens} tokens used": "컨텍스트: 토큰 {tokens}개 사용",
  "{used} of {max} tokens": "토큰 {max}개 중 {used}개",
  Servers: "서버",
  "Stop server": "서버 중지",
  "Stop localhost:{port}": "localhost:{port} 중지",
  "Unable to open in browser": "브라우저에서 열 수 없어요",
  "Could not stop server": "서버를 중지하지 못했어요",
  "Open in the browser panel. {key} for your browser.":
    "브라우저 패널에서 열어요. 내 브라우저에서 열려면 {key}하세요.",

  // Triage hero
  "What went wrong?": "무엇이 잘못됐나요?",
  "or run": "또는 실행",
  "The agent reads T3 Code's logs and source here, and asks before it applies a fix or posts anything.":
    "에이전트가 여기서 T3 Code의 로그와 소스를 읽어요. 수정을 적용하거나 무언가를 게시하기 전에 먼저 물어봐요.",
  "Copy command, for a terminal": "터미널용 명령 복사",

  // T3 Connect tunnels
  "Manage tunnels": "터널 관리",
  "{used} of {limit} tunnels in use": "터널 {limit}개 중 {used}개 사용 중",
  "T3 Connect tunnels in use": "사용 중인 T3 Connect 터널",
  "You're out of tunnels (they cost us money).":
    "터널을 모두 사용했어요. 터널은 운영 비용이 들어요.",
  "Switch to Tailscale or get more tunnels by linking your T3 Chat sub (sorry!)":
    "Tailscale로 전환하거나 T3 Chat 구독을 연결해 터널을 더 받을 수 있어요.",
  "Switch to Tailscale or get more tunnels by upgrading your T3 Chat sub (sorry!)":
    "Tailscale로 전환하거나 T3 Chat 구독을 업그레이드해 터널을 더 받을 수 있어요.",
  "Switch to Tailscale or deregister an environment you no longer use (sorry!)":
    "Tailscale로 전환하거나 더 이상 쓰지 않는 환경의 등록을 해제하세요.",
  "Link T3 Chat Pro for up to {pro} tunnels, or Premier for up to {premier}.":
    "T3 Chat Pro를 연결하면 터널을 최대 {pro}개, Premier는 최대 {premier}개까지 쓸 수 있어요.",
  "Upgrade to T3 Chat Pro for up to {pro} tunnels, or Premier for up to {premier}.":
    "T3 Chat Pro로 업그레이드하면 터널을 최대 {pro}개, Premier는 최대 {premier}개까지 쓸 수 있어요.",
  "Upgrade to T3 Chat Premier for up to {premier} tunnels.":
    "T3 Chat Premier로 업그레이드하면 터널을 최대 {premier}개까지 쓸 수 있어요.",
  "Premier · up to {count} tunnels": "Premier · 터널 최대 {count}개",
  "Pro · up to {pro} tunnels. {link} to Premier for {premier}.":
    "Pro · 터널 최대 {pro}개. {link}하면 Premier는 {premier}개까지 쓸 수 있어요.",
  "{link} for more tunnels": "{link}하면 터널을 더 쓸 수 있어요",
  "Link a paid T3 Chat account for more T3 Connect tunnels: up to {pro} with Pro, {premier} with Premier.":
    "유료 T3 Chat 계정을 연결하면 T3 Connect 터널을 더 쓸 수 있어요. Pro는 최대 {pro}개, Premier는 최대 {premier}개예요.",
  "Could not load T3 Chat link": "T3 Chat 연결 정보를 불러오지 못했어요",
  "This T3 Connect server does not support T3 Chat linking.":
    "이 T3 Connect 서버는 T3 Chat 연결을 지원하지 않아요.",
  "Not linked": "연결 안 됨",
  "You confirm the link on t3.chat.": "t3.chat에서 연결을 확인하세요.",
  "Unlinking…": "연결 해제 중…",
  Unlink: "연결 해제",

  // Device panel
  "Starting {names}… This can take a minute.": "{names} 시작 중… 1분 정도 걸릴 수 있어요.",
  "Opening device…": "기기 여는 중…",
  "Starting device…": "기기 시작 중…",
  "Finding devices…": "기기 찾는 중…",
  "The device hub failed to start.": "기기 허브를 시작하지 못했어요.",
  "No simulators or emulators were found on this environment.":
    "이 환경에서 시뮬레이터나 에뮬레이터를 찾지 못했어요.",
  "iOS Simulators": "iOS 시뮬레이터",
  "Android Emulators": "Android 에뮬레이터",
  Start: "시작",
  "{action} {name}": "{name} {action}",
  "No Android virtual devices found. Create one in Android Studio's Device Manager, then refresh.":
    "Android 가상 기기를 찾지 못했어요. Android Studio의 Device Manager에서 만든 뒤 새로고침하세요.",
  "Refresh devices": "기기 새로고침",
  "Dismiss device warning": "기기 경고 닫기",
  "Dismiss device error": "기기 오류 닫기",
  "Device discovery warning · {label}": "기기 검색 경고 · {label}",
  "iPhone Duo 3D requires Device Hub 0.11.0 or newer":
    "iPhone Duo 3D는 Device Hub 0.11.0 이상이 필요해요",
  "3D is unavailable on this browser": "이 브라우저에서는 3D를 사용할 수 없어요",
  "3D requires the H.264 stream": "3D는 H.264 스트림이 필요해요",
  "Turn off accessibility frames to use 3D": "3D를 쓰려면 접근성 프레임을 끄세요",
  "iOS Simulator screen": "iOS 시뮬레이터 화면",
  "Android Emulator screen": "Android 에뮬레이터 화면",
  "Show 3D phone": "3D 휴대폰 보기",
  Flat: "평면",
  "Input disconnected, reconnecting…": "입력 연결이 끊겨 다시 연결하는 중…",
  "Input disconnected ({detail}), reconnecting…": "입력 연결이 끊겨 다시 연결하는 중… ({detail})",
  "Waiting for device video…": "기기 영상 대기 중…",
  "Stream failed.": "스트림을 시작하지 못했어요.",
  "Connecting video…": "영상 연결 중…",

  // Files
  "Read-only connection. Unsaved edits are kept until write access returns.":
    "읽기 전용 연결이에요. 저장하지 않은 편집은 쓰기 권한이 돌아올 때까지 유지돼요.",

  // Pull requests
  "Allow edits from maintainers": "유지 관리자의 편집 허용",
  "Maintainers can push to this branch. If your fork has workflows, this can also give access to its secrets.":
    "유지 관리자가 이 브랜치에 푸시할 수 있어요. 포크에 워크플로가 있으면 시크릿에도 접근할 수 있게 돼요.",
  "Could not save maintainer access": "유지 관리자 권한을 저장하지 못했어요",
};
