/** Korean strings for user-facing text that arrived with the 2026-10-20 upstream merge (settings group A). */
export const KO_MERGE_1020_A: Readonly<Record<string, string>> = {
  // Connection diagnosis
  "retrying in {seconds}s": "{seconds}초 후 재시도",
  retrying: "재시도 중",
  "attempt {attempt}": "{attempt}번째 시도",
  "Diagnostics copied": "진단 정보 복사됨",
  "Could not copy diagnostics": "진단 정보를 복사할 수 없음",
  "What to try": "해결 방법",
  "More info": "자세히",
  "Retry now": "지금 다시 시도",
  "Copy diagnostics": "진단 정보 복사",
  "Add direct route": "직접 경로 추가",

  // Connections
  "Fix:": "해결:",
  "T3 Connect is on, but other devices cannot reach this environment.":
    "T3 Connect가 켜져 있지만 다른 기기에서 이 환경에 접속할 수 없습니다.",
  "T3 Connect is on. Reachability has not been checked yet.":
    "T3 Connect가 켜져 있습니다. 접속 가능 여부는 아직 확인하지 않았습니다.",

  // Database storage
  "Reclaim {size} GiB on {label}": "{label}에서 {size} GiB 확보 가능",
  "Old history is cleaned up automatically, but this database still holds the freed space. Run the command on {label} to return it to disk; it pauses and restarts the background service. Quit the desktop app first if it hosts this environment.":
    "오래된 기록은 자동으로 정리되지만, 비워진 공간은 아직 이 데이터베이스가 차지하고 있습니다. {label}에서 명령어를 실행하면 공간을 디스크로 돌려줍니다. 실행 중에는 백그라운드 서비스가 잠시 멈췄다가 다시 시작됩니다. 데스크톱 앱이 이 환경을 호스팅하고 있다면 먼저 앱을 종료해야 합니다.",

  // Device hosts
  "Per-machine results": "머신별 결과",
  "No device hosts": "기기 호스트 없음",
  "Checking connections": "연결 확인 중",
  "Checking connections…": "연결 확인 중…",
  "Connection not checked": "연결 확인 안 됨",
  "Connected or available locally on each listed machine":
    "목록의 모든 머신에서 연결되었거나 로컬에서 사용할 수 있습니다.",
  "Test the connection to check access from each machine":
    "연결을 테스트하면 각 머신에서 접근할 수 있는지 확인합니다.",
  "The Android device list may be incomplete. Refresh devices to try again.":
    "Android 기기 목록이 불완전할 수 있습니다. 기기를 새로고침하면 다시 확인합니다.",
  "machine details": "머신 세부 정보",
  "Retry from {label}": "{label}에서 다시 시도",
  "Retrying from {label}": "{label}에서 다시 시도 중",

  // EAS Simulator
  "EAS Simulator": "EAS 시뮬레이터",
  "Run iOS Simulators in Expo's cloud from this environment. Sessions bill the Expo account until they stop, so each host limits how many run and for how long. Editing or removing a host stops its running sessions.":
    "이 환경에서 Expo 클라우드의 iOS 시뮬레이터를 실행합니다. 세션이 멈출 때까지 Expo 계정에 요금이 청구되므로 호스트마다 동시 실행 수와 실행 시간을 제한합니다. 호스트를 편집하거나 제거하면 실행 중인 세션이 중지됩니다.",
  "EAS host not removed": "EAS 호스트를 제거하지 못함",
  "EAS host not saved": "EAS 호스트를 저장하지 못함",
  "Add EAS host": "EAS 호스트 추가",
  "Edit EAS host": "EAS 호스트 편집",
  "No EAS hosts.": "EAS 호스트가 없습니다.",
  "Idle minutes must be smaller than session minutes.": "유휴 시간은 세션 시간보다 짧아야 합니다.",
  "Give the host a label and limits within the ranges shown.":
    "호스트 이름을 입력하고 제한값을 표시된 범위 안에서 설정해야 합니다.",
  "The environment's server signs in to Expo and starts the sessions. Without a token here it uses EXPO_TOKEN, then its eas login.":
    "환경의 서버가 Expo에 로그인하고 세션을 시작합니다. 여기에 토큰이 없으면 EXPO_TOKEN을 쓰고, 그것도 없으면 서버의 eas login을 사용합니다.",
  "Expo access token": "Expo 액세스 토큰",
  "Clear access token": "액세스 토큰 지우기",
  "Signed in as {account} with {source}.": "{source}(으)로 {account} 계정에 로그인되어 있습니다.",
  "the access token saved here": "여기에 저장된 액세스 토큰",
  "EXPO_TOKEN on the server": "서버의 EXPO_TOKEN",
  "the server's eas login": "서버의 eas login",
  "Checking the Expo account…": "Expo 계정 확인 중…",
  "Check the Expo account before choosing a project.":
    "프로젝트를 선택하기 전에 Expo 계정을 확인해야 합니다.",
  "Check account": "계정 확인",
  "EAS project": "EAS 프로젝트",
  "From the thread's project": "스레드의 프로젝트 사용",
  "Sessions bill the project's Expo account. \"From the thread's project\" reads extra.eas.projectId from the project's app config.":
    '세션 요금은 프로젝트의 Expo 계정에 청구됩니다. "스레드의 프로젝트 사용"은 프로젝트 앱 설정의 extra.eas.projectId를 읽습니다.',
  "Sessions at once": "동시 세션 수",
  "Session minutes": "세션 시간(분)",
  "Idle minutes": "유휴 시간(분)",
  "Expo allows sessions of up to 40 minutes on free accounts and 115 on paid ones, and ends one after the idle minutes without activity, so idle minutes must be smaller than session minutes.":
    "Expo는 무료 계정에서 최대 40분, 유료 계정에서 최대 115분까지 세션을 허용하고, 유휴 시간 동안 활동이 없으면 세션을 종료합니다. 그래서 유휴 시간은 세션 시간보다 짧아야 합니다.",
  "Saving restarts this host, which stops its running sessions.":
    "저장하면 이 호스트가 다시 시작되어 실행 중인 세션이 중지됩니다.",

  // Browser
  "What the address bar searches when you type something that isn't a URL.":
    "주소 표시줄에 URL이 아닌 내용을 입력했을 때 사용할 검색 엔진입니다.",
  "Search engine": "검색 엔진",
  "search engine": "검색 엔진",
  "Custom search URL": "사용자 지정 검색 URL",
  "Use %s where the search terms go.": "검색어가 들어갈 자리에 %s를 넣습니다.",
  "Enter an http or https URL containing %s. Searches use DuckDuckGo until then.":
    "%s가 포함된 http 또는 https URL을 입력해야 합니다. 그전까지는 DuckDuckGo로 검색합니다.",

  // Mobile app
  "iPhone and iPad": "iPhone 및 iPad",
  "Connect to your server from your phone or tablet.": "휴대폰이나 태블릿에서 서버에 연결합니다.",
  "Scan with your phone camera.": "휴대폰 카메라로 스캔",
  "{store} link": "{store} 링크",
  "Open {store}": "{store} 열기",

  // Projects
  "Show all environments": "모든 환경 표시",
  "Choose a project to manage its name, icon, checkouts and actions.":
    "이름, 아이콘, 체크아웃, 액션을 관리할 프로젝트를 선택합니다.",

  // Scheduled tasks
  "Not connected:": "연결 안 됨:",
  "Loading scheduled tasks on": "예약 작업 불러오는 중:",
  "Could not load scheduled tasks:": "예약 작업을 불러올 수 없음:",
  "No tasks on": "작업 없음:",
};
