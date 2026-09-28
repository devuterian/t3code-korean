/** Settings sub-screens, usage & limits, diagnostics, updates, T3 Connect account, shared dialogs. */
export const KO_SETTINGS2: Readonly<Record<string, string>> = {
  // Settings: shared rows & environment filter
  "Filter settings environments and projects": "설정 환경 및 프로젝트 필터",
  "Settings scope": "설정 범위",
  "All environments": "모든 환경",
  "All connected environments": "연결된 모든 환경",
  "All projects": "모든 프로젝트",
  "Close settings": "설정 닫기",
  "{count} environment": "환경 {count}개",
  "{count} environments": "환경 {count}개",
  "Environment · {name}": "환경 · {name}",
  "Project · {name}": "프로젝트 · {name}",
  Project: "프로젝트",
  Environment: "환경",
  "Use environment defaults": "환경 기본값 사용",
  "Use defaults": "기본값 사용",
  "Update the selected environments to edit project overrides.":
    "프로젝트별 재정의를 편집하려면 선택한 환경을 업데이트하세요.",
  Mixed: "혼합",
  "Mixed · Set on": "혼합 · 켜기",
  "Set {name} on for selected environments": "선택한 환경에서 {name} 켜기",
  "Selected project checkouts use different values":
    "선택한 프로젝트 체크아웃의 값이 서로 다릅니다",
  "Selected environments use different values": "선택한 환경의 값이 서로 다릅니다",

  // Auto-settle days field
  "Days before auto-settle": "자동 정리까지 일수",
  "Days before auto-settle: {count}": "자동 정리까지 일수: {count}",
  "Decrease days before auto-settle": "자동 정리까지 일수 줄이기",
  "Increase days before auto-settle": "자동 정리까지 일수 늘리기",
  "{count} day before auto-settle": "자동 정리까지 {count}일",
  "{count} days before auto-settle": "자동 정리까지 {count}일",
  "{count} day": "{count}일",
  "{count} days": "{count}일",

  // Thread behavior
  "Auto-settle": "자동 정리",
  "Auto-settle merged threads": "머지된 스레드 자동 정리",
  "Auto-settle inactive threads": "비활성 스레드 자동 정리",
  "Inactive days": "비활성 일수",
  "Across environments": "환경 간",
  "Auto-settle defaults differ": "자동 정리 기본값이 서로 다릅니다",
  "Apply auto-settle defaults": "자동 정리 기본값 적용",
  Legacy: "레거시",
  "Plan Mode": "계획 모드",
  "Opt into retired interfaces kept for compatibility. Plan Mode restores the Build/Plan control; otherwise every task runs in Build mode.":
    "호환성을 위해 남겨 둔 이전 인터페이스를 사용합니다. 계획 모드는 Build/Plan 전환을 복원하며, 끄면 모든 작업이 Build 모드로 실행됩니다.",

  // Keyboard
  "Return key": "Return 키",
  "Send message": "메시지 보내기",
  "Return sends the message. Shift-Return inserts a new line.":
    "Return으로 메시지를 보냅니다. Shift-Return은 줄을 바꿉니다.",
  "Insert new line": "줄 바꿈",
  "Return inserts a new line. Command-Return sends the message.":
    "Return으로 줄을 바꿉니다. Command-Return은 메시지를 보냅니다.",
  "Applies to the composer when a hardware keyboard is connected.":
    "하드웨어 키보드가 연결되어 있을 때 입력창에 적용됩니다.",

  // Organization
  "Project grouping": "프로젝트 그룹화",
  "Group by repository": "저장소별로 그룹화",
  "Matching repositories appear as one project.": "같은 저장소는 하나의 프로젝트로 표시됩니다.",
  "Group by repository path": "저장소 경로별로 그룹화",
  "Keep monorepo paths separate.": "모노레포 경로를 따로 유지합니다.",
  "Keep separate": "따로 유지",
  "Show every workspace as its own project.": "모든 작업 공간을 각각의 프로젝트로 표시합니다.",

  // Environments list & detail
  "Environment options": "환경 옵션",
  "Refresh cloud environments": "클라우드 환경 새로 고침",
  "Add environment": "환경 추가",
  "The action could not be completed. Try again.": "작업을 완료할 수 없습니다. 다시 시도하세요.",
  "Update {name}?": "{name}을(를) 업데이트할까요?",
  "Update environment?": "환경을 업데이트할까요?",
  "Install T3 Code {version}. The desktop app will close and relaunch. Running threads may be interrupted.":
    "T3 Code {version}을(를) 설치합니다. 데스크톱 앱이 닫혔다가 다시 실행됩니다. 실행 중인 스레드가 중단될 수 있습니다.",
  "Install T3 Code {version}. The server will restart and reconnect. Running threads may be interrupted.":
    "T3 Code {version}을(를) 설치합니다. 서버가 다시 시작된 후 재연결됩니다. 실행 중인 스레드가 중단될 수 있습니다.",
  Update: "업데이트",
  "Updated to {version}.": "{version}(으)로 업데이트했습니다.",
  "This environment is no longer saved on this device.":
    "이 환경은 더 이상 이 기기에 저장되어 있지 않습니다.",
  Connection: "연결",
  "Connect this environment to manage it.": "이 환경을 관리하려면 연결하세요.",
  "Could not verify your permissions. Reconnect to try again.":
    "권한을 확인할 수 없습니다. 다시 연결한 후 시도하세요.",
  "Checking permissions…": "권한 확인 중…",
  "This connection does not have permission to manage the environment.":
    "이 연결에는 환경을 관리할 권한이 없습니다.",
  "Version {version}": "버전 {version}",
  "Restarting and reconnecting…": "다시 시작하고 재연결하는 중…",
  "Downloading update…": "업데이트 다운로드 중…",
  "Version {version} is available.": "버전 {version}을(를) 사용할 수 있습니다.",
  "You are up to date.": "최신 버전입니다.",
  "Update the desktop app on this machine.": "이 컴퓨터에서 데스크톱 앱을 업데이트하세요.",
  "Update and restart T3 Code on this machine.":
    "이 컴퓨터에서 T3 Code를 업데이트하고 다시 시작하세요.",
  "Check for updates": "업데이트 확인",
  "Update to {version}": "{version}(으)로 업데이트",
  Providers: "프로바이더",
  "Refresh providers": "프로바이더 새로 고침",
  "Provider status refreshed.": "프로바이더 상태를 새로 고쳤습니다.",
  "Version unknown": "버전 알 수 없음",
  "Not installed": "설치되지 않음",
  "Latest {version}": "최신 {version}",
  "Update queued": "업데이트 대기 중",
  "Update running": "업데이트 중",
  "Update succeeded": "업데이트 완료",
  "Update failed": "업데이트 실패",
  "Update unchanged": "변경 사항 없음",
  "Update this provider on the environment's machine.":
    "환경이 실행 중인 컴퓨터에서 이 프로바이더를 업데이트하세요.",
  "Update {name}": "{name} 업데이트",

  // Server settings pages
  "Select a project with a checkout on a connected environment.":
    "연결된 환경에 체크아웃이 있는 프로젝트를 선택하세요.",
  "Use the filter above to select a connected environment.":
    "위의 필터에서 연결된 환경을 선택하세요.",
  "Default workspace": "기본 작업 공간",
  "Worktree submodules": "워크트리 서브모듈",
  "Default permissions": "기본 권한",
  Inherit: "상속",
  "Use the repository's t3.json, or initialize recursively.":
    "저장소의 t3.json을 사용하거나, 없으면 재귀적으로 초기화합니다.",
  Recursive: "재귀",
  "Initialize nested submodules too.": "중첩된 서브모듈도 초기화합니다.",
  "Top level only": "최상위만",
  "Skip submodules declared inside other submodules.":
    "다른 서브모듈 안에 선언된 서브모듈은 건너뜁니다.",
  Skip: "건너뛰기",
  "Leave submodules empty for a setup script.":
    "설정 스크립트가 처리하도록 서브모듈을 비워 둡니다.",
  "Use the repository's t3.json, or the current checkout.":
    "저장소의 t3.json을 사용하거나, 없으면 현재 체크아웃을 사용합니다.",
  "Current checkout": "현재 체크아웃",
  "Start new threads in the existing workspace.": "새 스레드를 기존 작업 공간에서 시작합니다.",
  "New worktree": "새 워크트리",
  "Give each new thread a separate checkout.": "새 스레드마다 별도의 체크아웃을 만듭니다.",
  Supervised: "감독 모드",
  "Ask before commands and file changes.": "명령 실행 및 파일 변경 전에 묻습니다.",
  "Auto-accept edits": "편집 자동 수락",
  "Auto-approve edits, ask before other actions.":
    "편집은 자동 승인하고, 다른 작업은 먼저 묻습니다.",
  Auto: "자동",
  "Supported providers approve routine actions; others still ask.":
    "지원되는 프로바이더는 일상적인 작업을 승인하고, 나머지는 계속 묻습니다.",
  "Full access": "전체 액세스",
  "Allow commands and edits without prompts.": "확인 없이 명령 실행과 편집을 허용합니다.",
  "Default branch": "기본 브랜치",
  "Automatically pull": "자동으로 풀",
  "Keep the default branch current when there are no local changes.":
    "로컬 변경 사항이 없으면 기본 브랜치를 최신 상태로 유지합니다.",
  Worktrees: "워크트리",
  "Start from origin": "origin에서 시작",
  "Base new worktrees on the remote branch.": "새 워크트리를 원격 브랜치 기준으로 만듭니다.",
  "Response streaming": "응답 스트리밍",
  "After the turn": "턴이 끝난 후",
  "Show the answer when the agent finishes.": "에이전트가 끝나면 답변을 표시합니다.",
  "Finished paragraphs": "완성된 문단 단위",
  "Show each paragraph or code block as it completes.":
    "문단이나 코드 블록이 완성될 때마다 표시합니다.",
  "Token by token (legacy)": "토큰 단위(레거시)",
  "Repaint for every token; this can be slower.": "토큰마다 다시 그립니다. 느려질 수 있습니다.",
  "Use legacy token streaming?": "레거시 토큰 스트리밍을 사용할까요?",
  "Repainting every token can make the app slower.":
    "토큰마다 다시 그리면 앱이 느려질 수 있습니다.",
  "Use token streaming": "토큰 스트리밍 사용",
  "Preview browser": "미리보기 브라우저",
  "Agent browser access": "에이전트 브라우저 접근",
  "Allow agents to use the in-app preview browser.":
    "에이전트가 앱 내 미리보기 브라우저를 사용하도록 허용합니다.",
  "Manage environments": "환경 관리",
  "Server and provider updates": "서버 및 프로바이더 업데이트",
  Updates: "업데이트",
  "Check provider updates": "프로바이더 업데이트 확인",
  "Environment-wide setting. Select All projects to change it.":
    "환경 전체 설정입니다. 변경하려면 모든 프로젝트를 선택하세요.",
  "Check installed provider CLIs for newer versions.":
    "설치된 프로바이더 CLI의 새 버전을 확인합니다.",
  "Continue after restart": "다시 시작 후 계속",
  "Resume interrupted threads after an update or restart.":
    "업데이트나 다시 시작 후 중단된 스레드를 재개합니다.",
  "Update older servers to control restart continuation.":
    "다시 시작 후 계속 설정을 제어하려면 이전 버전 서버를 업데이트하세요.",

  // Project overview
  "Project overview": "프로젝트 개요",
  "This project has no checkout on the selected connected environments. Change the filter above.":
    "선택한 연결 환경에 이 프로젝트의 체크아웃이 없습니다. 위의 필터를 변경하세요.",
  "1 checkout": "체크아웃 1개",
  "{count} checkouts": "체크아웃 {count}개",
  Name: "이름",
  "Project name": "프로젝트 이름",
  "Save project name": "프로젝트 이름 저장",
  Checkouts: "체크아웃",

  // Notifications
  "Unavailable on this platform": "이 플랫폼에서는 사용할 수 없음",
  "Notifications require T3 Connect in this app build.":
    "이 앱 빌드에서 알림을 사용하려면 T3 Connect가 필요합니다.",
  "Install a newer app build to enable notifications":
    "알림을 사용하려면 최신 앱 빌드를 설치하세요",
  "Notifications unavailable": "알림을 사용할 수 없음",
  "Could not request notification permission.": "알림 권한을 요청할 수 없습니다.",
  "Notifications enabled": "알림 켜짐",
  "Agent notifications are enabled for this device.": "이 기기에서 에이전트 알림이 켜졌습니다.",
  "Couldn't finish enabling notifications": "알림을 완전히 켜지 못했습니다",
  "Notification access was granted, but this device could not be registered with T3 Connect. Notifications will start once registration succeeds.":
    "알림 권한은 허용되었지만 이 기기를 T3 Connect에 등록하지 못했습니다. 등록에 성공하면 알림이 시작됩니다.",
  "Agent notifications are unavailable on this platform.":
    "이 플랫폼에서는 에이전트 알림을 사용할 수 없습니다.",
  "Notifications disabled": "알림 꺼짐",
  "Notifications were not enabled.": "알림이 켜지지 않았습니다.",
  "Notifications were denied for this app. Open Settings to enable them.":
    "이 앱의 알림이 거부되었습니다. 설정을 열어 알림을 켜세요.",
  "Open Settings": "설정 열기",
  "Sign in to T3 Connect": "T3 Connect에 로그인",
  "Live Activity updates require T3 Connect so relay can deliver updates to this device.":
    "릴레이가 이 기기로 업데이트를 전달하려면 실시간 현황 업데이트에 T3 Connect가 필요합니다.",
  Continue: "계속",
  "Ongoing activity unavailable": "진행 중인 활동을 사용할 수 없음",
  "Could not enable agent notifications.": "에이전트 알림을 켤 수 없습니다.",
  "Notification permission needed": "알림 권한 필요",
  "Enable notifications in system Settings to show ongoing agent activity.":
    "진행 중인 에이전트 활동을 표시하려면 시스템 설정에서 알림을 켜세요.",
  "Live Activities unavailable": "실시간 현황을 사용할 수 없음",
  "Could not enable agent activity updates.": "에이전트 활동 업데이트를 켤 수 없습니다.",
  "Ongoing activity enabled": "진행 중인 활동 켜짐",
  "Live Activities enabled": "실시간 현황 켜짐",
  "{count} environment linked for agent activity updates.":
    "에이전트 활동 업데이트를 위해 환경 {count}개를 연결했습니다.",
  "{count} environments linked for agent activity updates.":
    "에이전트 활동 업데이트를 위해 환경 {count}개를 연결했습니다.",
  "Agent activity updates are enabled. Add an environment to start receiving updates.":
    "에이전트 활동 업데이트가 켜졌습니다. 업데이트를 받으려면 환경을 추가하세요.",
  "Couldn't finish enabling activity updates": "활동 업데이트를 완전히 켜지 못했습니다",
  "This device could not be registered with T3 Connect, so activity updates won't appear yet. They'll start once registration succeeds.":
    "이 기기를 T3 Connect에 등록하지 못해 아직 활동 업데이트가 표시되지 않습니다. 등록에 성공하면 시작됩니다.",
  "Disable notifications": "알림 끄기",
  "Open system Settings to disable notifications for T3 Code.":
    "T3 Code 알림을 끄려면 시스템 설정을 여세요.",
  "Agent activity": "에이전트 활동",
  "Device Notifications": "기기 알림",
  "Agent Live Updates": "에이전트 실시간 업데이트",
  "Ongoing Agent Activity": "진행 중인 에이전트 활동",
  "Live Activity Updates": "실시간 현황 업데이트",
  "Turn off Live Activity preference": "실시간 현황 설정 끄기",
  "Live Update Settings": "실시간 업데이트 설정",
  "Couldn't open Settings": "설정을 열 수 없습니다",
  "Open Android Settings, select T3 Code, then enable Live Updates in Notifications.":
    "Android 설정을 열고 T3 Code를 선택한 다음 알림에서 실시간 업데이트를 켜세요.",

  // About / client storage / diagnostics
  "Checking…": "확인 중…",
  "Downloading…": "다운로드 중…",
  "Update ready": "업데이트 준비됨",
  "Restarting…": "다시 시작하는 중…",
  "Up to date": "최신 상태",
  Version: "버전",
  "Client Storage": "클라이언트 저장소",
  Diagnostics: "진단",
  "Open source licenses": "오픈 소스 라이선스",
  Legal: "법률 정보",
  "Clear cache for {name}?": "{name}의 캐시를 지울까요?",
  "Clear cache for {name}": "{name} 캐시 지우기",
  "This removes offline threads, server metadata, and cached branches for this environment. The saved connection and credentials stay intact.":
    "이 환경의 오프라인 스레드, 서버 메타데이터, 캐시된 브랜치를 삭제합니다. 저장된 연결과 자격 증명은 그대로 유지됩니다.",
  "Clear Cache": "캐시 지우기",
  "Clear all client caches?": "모든 클라이언트 캐시를 지울까요?",
  "This removes offline data for every environment. Connections, credentials, account data, and app preferences stay intact.":
    "모든 환경의 오프라인 데이터를 삭제합니다. 연결, 자격 증명, 계정 데이터, 앱 설정은 그대로 유지됩니다.",
  "Clear All Caches": "모든 캐시 지우기",
  "Environment caches": "환경 캐시",
  "Storage unavailable": "저장소를 사용할 수 없음",
  "Restart the app and try again.": "앱을 다시 시작한 후 다시 시도하세요.",
  "Inspecting cached data…": "캐시된 데이터 확인 중…",
  "No cached data": "캐시된 데이터 없음",
  "Offline cache records will appear here after environments are used.":
    "환경을 사용하면 오프라인 캐시 기록이 여기에 표시됩니다.",
  Actions: "작업",
  "Clear {size}": "{size} 지우기",
  "Clear caches": "캐시 지우기",
  "Clearing caches never removes environment connections, credentials, account data, or appearance preferences.":
    "캐시를 지워도 환경 연결, 자격 증명, 계정 데이터, 모양 설정은 삭제되지 않습니다.",
  "Client storage is temporarily unavailable. Try again after restarting the app.":
    "클라이언트 저장소를 일시적으로 사용할 수 없습니다. 앱을 다시 시작한 후 시도하세요.",
  "Startup crashes": "시작 시 충돌",
  "Reading crash log…": "충돌 로그 읽는 중…",
  "Crash log unavailable": "충돌 로그를 사용할 수 없음",
  "Startup crash records are only kept in store and TestFlight builds.":
    "시작 시 충돌 기록은 스토어 및 TestFlight 빌드에서만 보관됩니다.",
  "No startup crashes": "시작 시 충돌 없음",
  "Nothing has taken the app down during launch in the last 7 days.":
    "최근 7일 동안 실행 중에 앱이 종료된 적이 없습니다.",
  "Copy crash report": "충돌 보고서 복사",
  "Paste the report into a GitHub issue. It contains the app version, the JavaScript error message, and the component stack. Error messages can quote values from the app, so read it over before sharing.":
    "보고서를 GitHub 이슈에 붙여 넣으세요. 앱 버전, JavaScript 오류 메시지, 컴포넌트 스택이 포함됩니다. 오류 메시지에 앱의 값이 인용될 수 있으니 공유하기 전에 확인하세요.",

  // App updates
  "A new version has been downloaded and installs automatically the next time you leave the app. Install it now instead?":
    "새 버전을 다운로드했으며 다음에 앱을 나갈 때 자동으로 설치됩니다. 지금 설치할까요?",
  Later: "나중에",
  "Install Now": "지금 설치",
  "Could not check for updates.": "업데이트를 확인할 수 없습니다.",
  "Could not download the update.": "업데이트를 다운로드할 수 없습니다.",
  "Downloaded, but could not restart the app.": "다운로드했지만 앱을 다시 시작할 수 없습니다.",

  // Open source licenses & legal
  "Opens the complete license notice": "전체 라이선스 고지를 엽니다",
  "License notices are unavailable in this build.":
    "이 빌드에서는 라이선스 고지를 사용할 수 없습니다.",
  "Search packages": "패키지 검색",
  "No licenses match that search.": "검색과 일치하는 라이선스가 없습니다.",
  "Search open-source licenses": "오픈 소스 라이선스 검색",
  "License notice": "라이선스 고지",
  "This license notice is unavailable.": "이 라이선스 고지를 사용할 수 없습니다.",
  "Opens the project website": "프로젝트 웹사이트를 엽니다",
  "Project source": "프로젝트 소스",
  "Close legal document": "법률 문서 닫기",
  "Open legal documents in external browser": "외부 브라우저에서 법률 문서 열기",
  "Couldn't load the {document}": "{document} 페이지를 불러올 수 없습니다",
  "Try Again": "다시 시도",
  "Open in Browser": "브라우저에서 열기",
  "The page could not be loaded.": "페이지를 불러올 수 없습니다.",
  "The server returned status {status}.": "서버가 상태 {status}을(를) 반환했습니다.",

  // Appearance
  "Code & Diffs": "코드 및 diff",
  "Custom font size": "사용자 지정 글꼴 크기",
  "Font size": "글꼴 크기",
  "Word break": "줄 바꿈",
  Terminal: "터미널",
  Text: "텍스트",
  "Text size": "텍스트 크기",
  "Increase {name}": "{name} 키우기",
  "Decrease {name}": "{name} 줄이기",
  "The quick brown fox jumps over the lazy dog.": "다람쥐 헌 쳇바퀴에 타고파.",
  "Messages, labels, and headings scale with this size.":
    "메시지, 라벨, 제목이 이 크기에 맞춰 조정됩니다.",
  System: "시스템",
  Light: "라이트",
  Dark: "다크",
  "Color scheme": "색 구성표",
  Themes: "테마",
  "Sets the light appearance only": "라이트 모양에만 적용합니다",
  "Sets the dark appearance only": "다크 모양에만 적용합니다",
  "Sets both light and dark appearances": "라이트와 다크 모양 모두에 적용합니다",
  "{name} light theme": "{name} 라이트 테마",
  "{name} dark theme": "{name} 다크 테마",
  "{name} theme": "{name} 테마",
  "{name} appearance": "{name} 모양",

  // T3 Connect account page & onboarding
  "Link date unavailable": "연결 날짜 알 수 없음",
  "Linked {date}": "{date}에 연결됨",
  "Managed tunnel": "관리형 터널",
  "Activity publishing only": "활동 게시 전용",
  "Deregister server?": "서버 등록을 해제할까요?",
  "“{name}” will be removed from this account. T3 Connect access will be revoked, any managed tunnel will be removed, and a host space will become available. Local connections on your devices are not changed.":
    "“{name}”이(가) 이 계정에서 제거됩니다. T3 Connect 접근 권한이 취소되고 관리형 터널이 제거되며 호스트 자리 하나가 비게 됩니다. 기기의 로컬 연결은 변경되지 않습니다.",
  Deregister: "등록 해제",
  "Could not deregister the server.": "서버 등록을 해제할 수 없습니다.",
  "Could not deregister server": "서버 등록을 해제할 수 없음",
  "Trace ID: {id}": "추적 ID: {id}",
  "Copy trace ID": "추적 ID 복사",
  "Registered servers": "등록된 서버",
  "Could not load T3 Connect environments": "T3 Connect 환경을 불러올 수 없음",
  "Loading environments": "환경 불러오는 중",
  "Actions for {name}": "{name} 작업",
  "No servers registered": "등록된 서버 없음",
  "Link a server from its local Settings to reach it through T3 Connect.":
    "T3 Connect로 접속하려면 서버의 로컬 설정에서 서버를 연결하세요.",
  "Connections on this device are managed in Settings.": "이 기기의 연결은 설정에서 관리합니다.",
  "Set up T3 Connect": "T3 Connect 설정",
  "Sign in to your T3 account to set up T3 Connect.":
    "T3 Connect를 설정하려면 T3 계정에 로그인하세요.",
  "Don't show this again": "다시 표시하지 않음",
  "Client not supported": "지원되지 않는 클라이언트",
  "Available · Relay online": "사용 가능 · 릴레이 온라인",
  "Relay is offline.": "릴레이가 오프라인입니다.",
  "Available · Checking relay status...": "사용 가능 · 릴레이 상태 확인 중...",
  "Available · Relay status unknown": "사용 가능 · 릴레이 상태 알 수 없음",

  // Shared dialogs / error boundary
  "This screen couldn't be displayed": "이 화면을 표시할 수 없습니다",
  "Try again. If it keeps happening, copy the details for a bug report.":
    "다시 시도하세요. 계속 발생하면 버그 신고를 위해 세부 정보를 복사하세요.",
  "Copy details": "세부 정보 복사",

  // Usage
  Limits: "한도",
  Cost: "비용",
  Tokens: "토큰",
  "Past 24 hours": "지난 24시간",
  "Past 7 days": "지난 7일",
  "Past 30 days": "지난 30일",
  "Past 90 days": "지난 90일",
  "Filter usage environments": "사용량 환경 필터",
  "Filter usage environments, some environments are loading":
    "사용량 환경 필터, 일부 환경을 불러오는 중",
  "Counted once across environments sharing a transcript directory: {sources}":
    "트랜스크립트 디렉터리를 공유하는 환경은 한 번만 집계됨: {sources}",
  "Scanning provider transcripts…": "프로바이더 트랜스크립트 검색 중…",
  "Connect an environment to see usage.": "사용량을 보려면 환경을 연결하세요.",
  "Select an environment to see usage.": "사용량을 보려면 환경을 선택하세요.",
  "Requires access to your Cursor login in macOS Keychain.":
    "macOS 키체인의 Cursor 로그인 정보에 대한 접근 권한이 필요합니다.",
  "Enable Cursor usage from {name}": "{name}에서 Cursor 사용량 사용",
  Enable: "사용",
  "Enable on {name}": "{name}에서 사용",
  "Raw token cost": "원시 토큰 비용",
  "Processed tokens": "처리된 토큰",
  "* if billed at full API rate": "* API 정가로 청구될 경우",
  "Across {count} sessions": "세션 {count}개 전체",
  "No activity in this window.": "이 기간에는 활동이 없습니다.",
  "{percent} of cost · {tokens} tokens": "비용의 {percent} · 토큰 {tokens}",
  "{percent} of tokens · {cost}": "토큰의 {percent} · {cost}",
  Totals: "합계",
  "{tokens} per active hour": "활동 시간당 {tokens}",
  "{tokens} per active day": "활동일당 {tokens}",
  "Cache savings": "캐시 절감액",
  "{ratio}x the raw cost": "원시 비용의 {ratio}배",
  "vs full input rates": "입력 정가 대비",
  "Cached input": "캐시된 입력",
  "{percent} of observed input": "관측된 입력의 {percent}",
  "Uncached input": "캐시되지 않은 입력",
  "{tokens} cache writes": "캐시 쓰기 {tokens}",
  Output: "출력",
  "incl. {tokens} reasoning": "추론 {tokens} 포함",
  Unpriced: "가격 미정",
  "of records, excluded from cost": "기록 중 비용에서 제외됨",
  "By model": "모델별",
  "no known rates · {tokens} tokens": "알려진 요금 없음 · 토큰 {tokens}",
  "Disconnected · showing saved usage": "연결 끊김 · 저장된 사용량 표시 중",
  "Waiting for connection…": "연결 대기 중…",
  "Usage unavailable · showing saved totals": "사용량을 사용할 수 없음 · 저장된 합계 표시 중",
  "Usage unavailable": "사용량을 사용할 수 없음",
  "Updating usage…": "사용량 업데이트 중…",
  "Loading usage…": "사용량 불러오는 중…",
  "Usage up to date": "사용량 최신 상태",

  // Usage limits
  Account: "계정",
  left: "남음",
  "{percent}% left": "{percent}% 남음",
  "Ahead of pace": "예상보다 빠름",
  "On pace": "예상대로",
  "Under pace": "예상보다 느림",
  "ahead of pace": "예상보다 빠름",
  "on pace": "예상대로",
  "under pace": "예상보다 느림",
  now: "지금",
  "in {duration}": "{duration} 후",
  "resets now": "지금 초기화",
  "resets in {duration}": "{duration} 후 초기화",
  "Segment {index}, {name}, {percent}% left": "세그먼트 {index}, {name}, {percent}% 남음",
  "Show account details": "계정 세부 정보 표시",
  "{count} reset credits banked": "초기화 크레딧 {count}개 보유",
  "{count} reset credit banked": "초기화 크레딧 {count}개 보유",
  "No reset credits banked": "보유한 초기화 크레딧 없음",
  "next expires in {duration}": "다음 만료까지 {duration}",
  "Select an environment to see limits.": "한도를 보려면 환경을 선택하세요.",
  "No provider on the selected environments reports subscription limits.":
    "선택한 환경에서 구독 한도를 보고하는 프로바이더가 없습니다.",
  "{names} could not refresh limits. Showing the last known values.":
    "{names}에서 한도를 새로 고칠 수 없습니다. 마지막으로 확인된 값을 표시합니다.",
  "This account is no longer reporting limits on the selected environments.":
    "이 계정은 선택한 환경에서 더 이상 한도를 보고하지 않습니다.",
  "Hide account email": "계정 이메일 숨기기",
  "Reveal account email": "계정 이메일 표시",
  "Hide account label": "계정 라벨 숨기기",
  "Reveal account label": "계정 라벨 표시",
  "Resets {date}": "{date}에 초기화",
  "Restores {percent}% of the pool": "풀의 {percent}% 복원",
  Source: "소스",
  "Reset credits": "초기화 크레딧",
  "Reset applied. Your windows have cleared.": "초기화했습니다. 한도 기간이 비워졌습니다.",
  "Nothing to reset right now.": "지금은 초기화할 항목이 없습니다.",
  "No reset credit left.": "남은 초기화 크레딧이 없습니다.",
  "That credit was already redeemed.": "이미 사용한 크레딧입니다.",
  "Could not use the reset credit.": "초기화 크레딧을 사용할 수 없습니다.",
  "Use a reset credit?": "초기화 크레딧을 사용할까요?",
  "This redeems one credit on your account and clears the current rate-limit windows. It cannot be undone.":
    "계정의 크레딧 1개를 사용해 현재 사용량 한도 기간을 비웁니다. 되돌릴 수 없습니다.",
  "Use credit": "크레딧 사용",
  "Using…": "사용 중…",
  "Use reset": "초기화 사용",
  "This account has no subscription limits.": "이 계정에는 구독 한도가 없습니다.",
  "Could not read limits.": "한도를 읽을 수 없습니다.",
  "No limits reported.": "보고된 한도가 없습니다.",
  "No accounts reported.": "보고된 계정이 없습니다.",
  Session: "세션",
  Weekly: "주간",
  Monthly: "월간",
  Overall: "전체",
  "Cursor Models": "Cursor 모델",
  "Other Models": "기타 모델",
  "Combined usage across both allowances, not a third quota.":
    "두 한도를 합친 사용량이며, 별도의 세 번째 한도가 아닙니다.",
  "Grok and Composer use this first. Auto can use either pool.":
    "Grok과 Composer가 먼저 사용합니다. Auto는 두 풀을 모두 사용할 수 있습니다.",
  "Claude, GPT, and Gemini use this pool. Grok and Composer fall back here.":
    "Claude, GPT, Gemini가 이 풀을 사용합니다. Grok과 Composer는 부족할 때 이 풀을 사용합니다.",
};
