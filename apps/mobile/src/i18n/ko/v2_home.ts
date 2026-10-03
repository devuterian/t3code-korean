/** Korean entries added while porting to the orchestrator V2 codebase. */
export const KO_V2_HOME: Readonly<Record<string, string>> = {
  // Navigation titles and home
  "Provider accounts": "프로바이더 계정",
  "Follow-ups": "후속 메시지",
  "Scheduled Tasks": "예약된 작업",
  "Scheduled tasks": "예약된 작업",
  "Scheduled task": "예약된 작업",
  "New scheduled task": "새 예약 작업",
  "Edit scheduled task": "예약 작업 편집",
  Automations: "자동화",
  "Mobile control surface for your live coding environments":
    "실행 중인 코딩 환경을 위한 모바일 제어 화면",
  "Create a task to start a new coding runtime in one of your connected projects.":
    "작업을 만들어 연결된 프로젝트 중 하나에서 새 코딩 런타임을 시작하세요.",
  "New thread on {branch}": "{branch}에서 새 스레드",

  // Shared components
  "Linux/WSL": "Linux/WSL",
  "Mini PC": "미니 PC",
  Workstation: "워크스테이션",

  // New task flow
  "What should we work on?": "무엇을 작업할까요?",
  "Choose a project": "프로젝트 선택",
  "No project": "프로젝트 없음",
  "Start a task without a project": "프로젝트 없이 작업 시작",
  "Start without a project": "프로젝트 없이 시작",
  "Could not start without a project": "프로젝트 없이 시작할 수 없습니다",
  "The folder for threads without a project could not be created.":
    "프로젝트 없는 스레드용 폴더를 만들 수 없습니다.",
  "It has not reached this device yet. Pick No project from the list once it appears.":
    "아직 이 기기에 반영되지 않았습니다. 목록에 나타나면 '프로젝트 없음'을 선택하세요.",
  "Could not switch machine": "머신을 전환할 수 없습니다",
  "It has not reached this device yet. Try again.":
    "아직 이 기기에 반영되지 않았습니다. 다시 시도하세요.",

  // Thread settings
  "ChatGPT token sharing is active": "ChatGPT 토큰 공유가 활성화됨",
  "ChatGPT sharing is on": "ChatGPT 공유가 켜져 있습니다",
  "Eligible usage uses your ChatGPT plan. Credit settings and limits are managed in ChatGPT.":
    "해당되는 사용량은 ChatGPT 요금제를 사용합니다. 크레딧 설정과 한도는 ChatGPT에서 관리합니다.",
  "Using ChatGPT plan": "ChatGPT 요금제 사용 중",
  "Manage usage": "사용량 관리",

  // Add project
  "New project": "새 프로젝트",
  "Start a new Git repository from a name": "이름으로 새 Git 저장소 시작",
  "Created without a first commit": "첫 커밋 없이 생성됨",
  "Could not create the GitHub repository": "GitHub 저장소를 만들 수 없습니다",
  "Creates {path} on {environment}": "{environment}에 {path} 생성",
  "Creates {path}": "{path} 생성",
  "Goes in {path} on {environment}": "{environment}의 {path} 안에 생성",
  "Goes in {path}": "{path} 안에 생성",
  "Create private repository on GitHub": "GitHub에 비공개 저장소 만들기",
  "Create project": "프로젝트 만들기",
  "Add existing project": "기존 프로젝트 추가",
  "Open a folder or clone a repository": "폴더를 열거나 저장소를 클론",

  // Review
  Changes: "변경사항",
  Uncommitted: "커밋되지 않음",
  "Staged, unstaged, and untracked files": "스테이징됨, 스테이징 안 됨, 추적되지 않는 파일",

  // Settings: follow-ups, keyboard, branch naming
  Steer: "방향 전환",
  "While the agent is running": "에이전트 실행 중",
  "Your message waits and runs after the current turn finishes.":
    "메시지가 대기했다가 현재 턴이 끝난 뒤 실행됩니다.",
  "Your message reaches the agent right away, changing what it is working on.":
    "메시지가 에이전트에 바로 전달되어 진행 중인 작업 방향을 바꿉니다.",
  "Long-press the send button to use the other option for a single message. With a hardware keyboard, hold Command while sending.":
    "보내기 버튼을 길게 누르면 메시지 하나에 다른 옵션을 사용합니다. 하드웨어 키보드에서는 보낼 때 Command를 누르고 있으세요.",
  "Worktree branch naming": "워크트리 브랜치 이름 지정",
  "Static prefix": "고정 접두사",
  "Add your prefix to the generated branch name.": "생성된 브랜치 이름에 지정한 접두사를 붙입니다.",
  "Semantic prefix": "의미 기반 접두사",
  "Let the model choose feat/, fix/, refactor/, or another prefix.":
    "모델이 feat/, fix/, refactor/ 등의 접두사를 고릅니다.",
  "Custom instructions": "사용자 지정 지침",
  "Generate the complete name with no added prefix or suffix.":
    "접두사나 접미사 없이 전체 이름을 생성합니다.",
  "Use t3code or t3code/ for t3code/add-search. Leave empty for no prefix.":
    "t3code/add-search 형식이면 t3code 또는 t3code/를 입력하세요. 접두사가 없으면 비워 두세요.",
  "Branch prefix": "브랜치 접두사",
  "No prefix": "접두사 없음",
  "Append instructions to the naming prompt.": "이름 생성 프롬프트에 지침을 덧붙입니다.",
  "Branch naming instructions": "브랜치 이름 지정 지침",
  "Mixed. Enter instructions for all selected targets.":
    "값이 섞여 있습니다. 선택한 모든 대상에 적용할 지침을 입력하세요.",
  "Use julius/ followed by the issue ID and a short description.":
    "julius/ 뒤에 이슈 ID와 짧은 설명을 붙이세요.",
  "Auto-resume limited threads": "한도 걸린 스레드 자동 재개",
  "Snooze limited threads": "한도 걸린 스레드 미루기",

  // Settings: provider accounts
  "Select a connected environment.": "연결된 환경을 선택하세요.",
  "Configure a provider with in-app sign-in in web or desktop Settings.":
    "앱 내 로그인을 지원하는 프로바이더는 웹 또는 데스크톱 설정에서 구성하세요.",
  "Could not update provider sign-in.": "프로바이더 로그인을 업데이트할 수 없습니다.",
  "Signed in.": "로그인됨.",
  "Discovering sign-in methods…": "로그인 방법을 찾는 중…",
  "No in-app sign-in advertised. Follow the provider's docs to finish setup.":
    "앱 내 로그인을 지원하지 않습니다. 프로바이더 문서를 따라 설정을 마치세요.",
  "Connect this provider.": "이 프로바이더를 연결하세요.",
  "Enter code {code} on the sign-in page.": "로그인 페이지에 코드 {code}를 입력하세요.",
  "Terminal response": "터미널 응답",
  "Send response": "응답 보내기",
  Connect: "연결",
  "Final localhost URL": "최종 localhost URL",
  "Open sign-in page": "로그인 페이지 열기",
  "Could not open the sign-in page.": "로그인 페이지를 열 수 없습니다.",
  "Open docs": "문서 열기",
  "Could not open the provider docs.": "프로바이더 문서를 열 수 없습니다.",
  "Cancel sign-in": "로그인 취소",
  "Change account": "계정 변경",
  "Sign out": "로그아웃",
  "Sign out?": "로그아웃할까요?",
  "Running threads sharing this sign-in on {environment} will stop. Thread history is kept.":
    "{environment}에서 이 로그인을 공유하는 실행 중인 스레드가 중지됩니다. 스레드 기록은 유지됩니다.",

  // Settings: scheduled tasks
  "Open a scheduled task form first.": "먼저 예약 작업 양식을 여세요.",
  "This project is no longer available.": "이 프로젝트를 더 이상 사용할 수 없습니다.",
  Mon: "월",
  Tue: "화",
  Wed: "수",
  Thu: "목",
  Fri: "금",
  Sat: "토",
  Sun: "일",
  "Every day": "매일",
  Weekdays: "평일",
  "Choose days": "요일 선택",
  "{days} at {time}": "{days} {time}",
  "Connect an environment to view and create scheduled tasks.":
    "예약 작업을 보고 만들려면 환경을 연결하세요.",
  "No environments match these filters. Change the filter above.":
    "이 필터와 일치하는 환경이 없습니다. 위의 필터를 변경하세요.",
  "Saving task": "작업 저장 중",
  "Wait for the task to finish saving before leaving.":
    "작업 저장이 끝날 때까지 기다린 뒤 나가세요.",
  "Discard changes?": "변경사항을 버릴까요?",
  "Your dictation and unsaved changes will be lost.":
    "받아쓰기 내용과 저장하지 않은 변경사항이 사라집니다.",
  "Your unsaved changes will be lost.": "저장하지 않은 변경사항이 사라집니다.",
  "Keep editing": "계속 편집",
  "Discard changes": "변경사항 버리기",
  "Connect an environment to create a scheduled task.": "예약 작업을 만들려면 환경을 연결하세요.",
  "No environments match the current filters. Change the filters to create a task.":
    "현재 필터와 일치하는 환경이 없습니다. 작업을 만들려면 필터를 변경하세요.",
  "Incomplete task": "작업 정보 부족",
  "Add a name, prompt, project, model, valid schedule, and checkout path if needed.":
    "이름, 프롬프트, 프로젝트, 모델, 올바른 일정, 그리고 필요하면 체크아웃 경로를 입력하세요.",
  "Project unavailable": "프로젝트를 사용할 수 없음",
  "Choose a project in this environment.": "이 환경의 프로젝트를 선택하세요.",
  "Could not save task": "작업을 저장할 수 없습니다",
  "This task no longer exists.": "이 작업은 더 이상 존재하지 않습니다.",
  "This environment is disconnected. Reconnect before saving.":
    "이 환경의 연결이 끊겼습니다. 저장하기 전에 다시 연결하세요.",
  "Runs on": "실행 위치",
  Task: "작업",
  "Check for issues": "문제 확인",
  Context: "컨텍스트",
  "No projects available": "사용 가능한 프로젝트 없음",
  Model: "모델",
  "No models available": "사용 가능한 모델 없음",
  Workspace: "작업 공간",
  "Run in": "실행 위치",
  "Project checkout": "프로젝트 체크아웃",
  "Specific checkout": "특정 체크아웃",
  "Checkout path": "체크아웃 경로",
  Schedule: "일정",
  "At a time": "지정 시각",
  "Every interval": "일정 간격",
  "Time, {time}": "시간, {time}",
  Repeat: "반복",
  "Minutes between runs": "실행 간격(분)",
  "Intervals must be at least 1 minute. Update this interval before saving.":
    "간격은 1분 이상이어야 합니다. 저장하기 전에 간격을 수정하세요.",
  "This task previously ran more than once per minute. Saving requires an interval of at least 1 minute.":
    "이 작업은 이전에 1분에 한 번보다 자주 실행되었습니다. 저장하려면 간격이 1분 이상이어야 합니다.",
  "Task enabled": "작업 사용",
  "Time uses the environment's time zone, which may differ from your phone's.":
    "시간은 환경의 시간대를 따르며, 휴대폰의 시간대와 다를 수 있습니다.",
  "Saving…": "저장하는 중…",
  "Save changes": "변경사항 저장",
  "Create task": "작업 만들기",
  "Could not run task": "작업을 실행할 수 없습니다",
  "Could not update task": "작업을 업데이트할 수 없습니다",
  "Could not delete task": "작업을 삭제할 수 없습니다",
  "Loading tasks…": "작업을 불러오는 중…",
  "No scheduled tasks yet.": "아직 예약된 작업이 없습니다.",
  "No tasks in this project.": "이 프로젝트에 작업이 없습니다.",
  "Edit {name}": "{name} 편집",
  Paused: "일시 중지됨",
  "Last run failed: {error}": "마지막 실행 실패: {error}",
  Resume: "재개",
  "Run now": "지금 실행",
  "Delete task?": "작업을 삭제할까요?",
  Prompt: "프롬프트",
  "What should the agent do each time?": "에이전트가 매번 무엇을 할까요?",
  "Next run unavailable": "다음 실행 정보 없음",
  "Next run due": "다음 실행 예정",
  "Next run in less than a minute": "1분 이내에 다음 실행",
  "Next run in 1 minute": "1분 후 다음 실행",
  "Next run in {count} minutes": "{count}분 후 다음 실행",
  "Next run in 1 hour": "1시간 후 다음 실행",
  "Next run in {count} hours": "{count}시간 후 다음 실행",
  "Next run tomorrow at {time}": "다음 실행: 내일 {time}",
  "Next run next {weekday} at {time}": "다음 실행: 다음 {weekday} {time}",
  "Next run {date} at {time}": "다음 실행: {date} {time}",

  // Updates
  "Could not save pending state.": "대기 중인 상태를 저장할 수 없습니다.",

  // Connection
  "SSH environments are only available in the desktop app.":
    "SSH 환경은 데스크톱 앱에서만 사용할 수 있습니다.",
  "Forget {name} and its cached threads on this device.\n\nIt stays on your T3 Connect account and keeps its host space. Deregister it under T3 Account → T3 Connect to free it.":
    "이 기기에서 {name}과(와) 캐시된 스레드를 삭제합니다.\n\nT3 Connect 계정에는 남아 있으며 호스트 공간도 유지됩니다. 공간을 비우려면 T3 계정 → T3 Connect에서 등록을 해제하세요.",
  "Open T3 Account": "T3 계정 열기",

  // Usage
  "ChatGPT shared usage": "ChatGPT 공유 사용량",
  "{accounts}. Open ChatGPT with the account you connected.":
    "{accounts}. 연결한 계정으로 ChatGPT를 여세요.",
  "Cache read": "캐시 읽기",
  "Cache write": "캐시 쓰기",
  Other: "기타",
  Ultrafast: "초고속",
  "By type": "유형별",
  "By speed": "속도별",
  "{amount} premium": "추가 요금 {amount}",

  // Files, terminal, sharing
  "type and press return": "입력 후 Return 키를 누르세요",
  "'{name}' was skipped because this server does not support files.":
    "이 서버가 파일을 지원하지 않아 '{name}'을(를) 건너뛰었습니다.",
  "'{name}' is empty or could not be read.": "'{name}'이(가) 비어 있거나 읽을 수 없습니다.",
  "'{name}' is not a supported image type.": "'{name}'은(는) 지원되지 않는 이미지 형식입니다.",
  "'{name}' exceeds the 10 MB attachment limit.": "'{name}'이(가) 10MB 첨부 한도를 초과합니다.",
};
