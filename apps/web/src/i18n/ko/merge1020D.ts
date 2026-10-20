/** Korean strings for user-facing text that arrived with the 2026-10-20 upstream merge (area D). */
export const KO_MERGE_1020_D: Readonly<Record<string, string>> = {
  // Browser preview
  "Saved browser settings could not be loaded.": "저장된 브라우저 설정을 불러올 수 없습니다.",
  "The integrated browser is unavailable in this runtime.":
    "이 실행 환경에서는 내장 브라우저를 사용할 수 없습니다.",

  // T3 Connect relay link
  "Could not check relay client availability.":
    "릴레이 클라이언트를 사용할 수 있는지 확인할 수 없습니다.",
  "T3 Code cannot install the relay client automatically on {platform}.":
    "{platform}에서는 T3 Code가 릴레이 클라이언트를 자동으로 설치할 수 없습니다.",
  "Could not confirm relay client installation.": "릴레이 클라이언트 설치를 확인할 수 없습니다.",
  "Relay client installation was cancelled.": "릴레이 클라이언트 설치가 취소되었습니다.",
  "Could not install the relay client.": "릴레이 클라이언트를 설치할 수 없습니다.",
  "The relay client install completed without a final status.":
    "릴레이 클라이언트 설치는 끝났지만 최종 상태를 받지 못했습니다. 다시 시도하십시오.",
  "The relay client is still unavailable after installation.":
    "설치 후에도 릴레이 클라이언트를 사용할 수 없습니다.",
  "Relay returned credentials for a different environment.":
    "릴레이가 다른 환경의 인증 정보를 반환했습니다.",
  "Relay returned credentials for a different endpoint provider.":
    "릴레이가 다른 엔드포인트 프로바이더의 인증 정보를 반환했습니다.",
  "Could not read environment cloud link state.": "환경의 클라우드 연결 상태를 읽을 수 없습니다.",
  "Could not update environment cloud preferences.":
    "환경의 클라우드 설정을 업데이트할 수 없습니다.",
  "Could not unlink the environment from cloud.": "환경의 클라우드 연결을 해제할 수 없습니다.",
  "Could not obtain environment link proof.": "환경 연결 증명을 가져올 수 없습니다.",
  "Could not configure environment relay access.": "환경의 릴레이 접근을 설정할 수 없습니다.",
  "Could not read T3 Connect link state.": "T3 Connect 연결 상태를 읽을 수 없습니다.",
  "Could not update T3 Connect access.": "T3 Connect 접근 설정을 업데이트할 수 없습니다.",
  "Could not update T3 Connect": "T3 Connect 업데이트 실패",
  "Local environment is not ready yet.":
    "로컬 환경이 아직 준비되지 않았습니다. 잠시 후 다시 시도하십시오.",
  "This connection needs permission to view and manage T3 Connect settings.":
    "이 연결에는 T3 Connect 설정을 보고 관리할 권한이 필요합니다.",
  "Wait until the current T3 Connect settings can be read.":
    "현재 T3 Connect 설정을 읽을 수 있을 때까지 기다려야 합니다.",
  "Sign in to T3 Connect before enabling this.":
    "이 기능을 켜려면 먼저 T3 Connect에 로그인해야 합니다.",

  // Add project to another machine
  "Add to another machine": "다른 머신에 추가",
  "Choose a folder on the other machine.": "다른 머신에서 사용할 폴더를 지정해야 합니다.",
  "Could not start the clone.": "클론을 시작할 수 없습니다.",
  "Clone {name} and bring the local files git does not track.":
    "{name}을(를) 클론하고 git이 추적하지 않는 로컬 파일도 함께 가져옵니다.",
  "no files": "파일 없음",
  "+ {count} file": "+ 파일 {count}개",
  "+ {count} files": "+ 파일 {count}개",
  "Machine to add the project to": "프로젝트를 추가할 머신",
  "No machine available": "사용 가능한 머신 없음",
  "Clone over": "클론 방식",
  "Clone protocol": "클론 프로토콜",
  "Folder on {machine}": "{machine}의 폴더",
  "the other machine": "다른 머신",
  "Copy ignored files": "무시된 파일 복사",
  "{selected} of {total}": "{total}개 중 {selected}개",
  "No ignored files to copy.": "복사할 무시된 파일이 없습니다.",
  "Finding ignored files…": "무시된 파일 찾는 중…",
  "Showing the first {count} files.": "처음 {count}개 파일만 표시합니다.",
  "Files are copied after the clone finishes. Folders git ignores whole, like node_modules, are left out.":
    "파일은 클론이 끝난 뒤 복사됩니다. node_modules처럼 git이 통째로 무시하는 폴더는 제외됩니다.",
  "Clone to {machine}": "{machine}에 클론",
  machine: "머신",
  "Over 1 MB": "1MB 초과",

  // Branch picker
  "Start worktree from remote": "원격에서 워크트리 시작",

  // Chat
  "The file was not found on {machine} at {path}.":
    "{machine}의 {path}에서 파일을 찾을 수 없습니다.",
  "Environment is not connected.": "환경이 연결되어 있지 않습니다.",
  "The thread has changed. Select a message to rewind again.":
    "스레드가 바뀌었습니다. 되돌릴 메시지를 다시 선택하십시오.",
  "Copying files": "파일 복사 중",
  "Could not download {name}": "{name} 다운로드 실패",
  "This thread is no longer available": "더 이상 사용할 수 없는 스레드",
  "No machine can read every attached thread. Choose a machine in the composer or remove the threads.":
    "첨부한 스레드를 모두 읽을 수 있는 머신이 없습니다. 컴포저에서 머신을 선택하거나 스레드를 제거하십시오.",
  "its machine": "원래 머신",
  "Attached thread is on another machine": "첨부한 스레드가 다른 머신에 있음",
  "This machine's agent can't read \"{thread}\". Remove it, or switch back to {machine} to send.":
    '이 머신의 에이전트는 "{thread}"을(를) 읽을 수 없습니다. 첨부를 제거하거나 {machine}(으)로 다시 전환한 뒤 보내십시오.',
  "Could not start thread": "스레드 시작 실패",
  "On another machine, so this machine's agent can't read it. Remove it or switch back to send.":
    "다른 머신에 있어 이 머신의 에이전트가 읽을 수 없습니다. 제거하거나 다시 전환한 뒤 보내십시오.",
  "Diff file contents are unavailable for this selection.":
    "선택한 항목의 diff 파일 내용을 불러올 수 없습니다.",
  'Add an "origin" remote before pushing.': '푸시하려면 먼저 "origin" 원격을 추가해야 합니다.',

  // Hosted home screen
  "This computer is off": "이 컴퓨터가 꺼져 있음",
  "No computer connected": "연결된 컴퓨터 없음",
  "Turn it back on, or connect a different computer.":
    "컴퓨터를 다시 켜거나 다른 컴퓨터를 연결하십시오.",
  "Your agents run on your computer.": "에이전트는 사용자의 컴퓨터에서 실행됩니다.",
  "Your agents run on your computer. Start T3 Code there first.":
    "에이전트는 사용자의 컴퓨터에서 실행됩니다. 먼저 그 컴퓨터에서 T3 Code를 시작하십시오.",
  "Waiting for your computer…": "컴퓨터 기다리는 중…",
  "Add pairing link": "페어링 링크 추가",
  "Run on your computer:": "컴퓨터에서 실행:",
  "Or download the desktop app": "또는 데스크톱 앱 다운로드",

  // Legacy sidebar
  "Group by repository": "저장소별로 묶기",
  "Group by repository path": "저장소 경로별로 묶기",
  "Keep separate": "따로 두기",
  "Projects from the same repository share one sidebar row.":
    "같은 저장소의 프로젝트를 사이드바에서 한 줄로 표시합니다.",
  "Projects group only when both the repository and repo-relative path match.":
    "저장소와 저장소 기준 경로가 모두 같을 때만 프로젝트를 묶습니다.",
  "Every project path gets its own sidebar row.": "프로젝트 경로마다 사이드바에 따로 표시합니다.",
  "Unable to open preview": "미리보기 열기 실패",
  "The preview could not be opened.": "미리보기를 열 수 없습니다.",
  "Thread action failed": "스레드 작업 실패",
  "PR #{number}, status pending": "PR #{number}, 상태 확인 중",
  "Open localhost:{port}": "localhost:{port} 열기",
  "Confirm archive {title}": "{title} 보관 확인",
  "Archive {title}": "{title} 보관",
  "Show more": "더 보기",
  "Project is not empty": "프로젝트가 비어 있지 않음",
  "Delete all threads in this project before removing it.":
    "프로젝트를 제거하려면 먼저 이 프로젝트의 스레드를 모두 삭제해야 합니다.",
  "Delete anyway": "그래도 삭제",
  "Path: {path}": "경로: {path}",
  "Environment: {environment}": "환경: {environment}",
  "This removes only this project entry.": "이 프로젝트 항목만 제거합니다.",
  'Remove project "{title}"?': '"{title}" 프로젝트를 제거하시겠습니까?',
  'Remove project "{title}" and delete its {count} thread?':
    '"{title}" 프로젝트를 제거하고 스레드 {count}개를 삭제하시겠습니까?',
  'Remove project "{title}" and delete its {count} threads?':
    '"{title}" 프로젝트를 제거하고 스레드 {count}개를 삭제하시겠습니까?',
  'Failed to remove "{title}"': '"{title}" 제거 실패',
  "Unknown error removing project.": "프로젝트를 제거하는 중 알 수 없는 오류가 발생했습니다.",
  "Group into...": "묶을 위치...",
  "Copy Path": "경로 복사",
  "Copy Thread ID": "스레드 ID 복사",
  "Failed to archive threads": "스레드 보관 실패",
  "Could not choose environment": "환경 선택 실패",
  "New thread on {branch}": "{branch}에서 새 스레드",
  "Local sandbox project": "로컬 샌드박스 프로젝트",
  "Remote project": "원격 프로젝트",
  "Local sandbox: {environments}": "로컬 샌드박스: {environments}",
  "Remote environment: {environments}": "원격 환경: {environments}",
  "Create new thread in {project}": "{project}에서 새 스레드 만들기",
  "New thread ({shortcut})": "새 스레드 ({shortcut})",
  "Rename project": "프로젝트 이름 변경",
  "Update the title for {path}.": "{path}의 제목을 변경합니다.",
  "Update the project title.": "프로젝트 제목을 변경합니다.",
  "Project title": "프로젝트 제목",
  "This connection cannot change projects.": "이 연결로는 프로젝트를 변경할 수 없습니다.",
  "Choose how {path} should be grouped in the sidebar.":
    "사이드바에서 {path}을(를) 묶는 방식을 선택합니다.",
  "Choose how this project should be grouped in the sidebar.":
    "사이드바에서 이 프로젝트를 묶는 방식을 선택합니다.",
  "Grouping rule": "그룹화 규칙",
  "Project grouping rule": "프로젝트 그룹화 규칙",
  "Use global default ({mode})": "전역 기본값 사용 ({mode})",
  "Use global default": "전역 기본값 사용",
  "Connecting {names}": "{names} 연결 중",
  "Couldn't connect {names}": "{names} 연결 실패",
  "The backend didn't respond.": "백엔드가 응답하지 않았습니다.",
  "Sidebar options": "사이드바 옵션",
  "Sort projects": "프로젝트 정렬",
  "Visible thread count": "표시할 스레드 수",
  "Decrease visible thread count": "표시할 스레드 수 줄이기",
  "Increase visible thread count": "표시할 스레드 수 늘리기",
  "Download ARM build": "ARM 빌드 다운로드",
  "Install ARM build": "ARM 빌드 설치",
  "Archive {count} thread?": "스레드 {count}개를 보관하시겠습니까?",
  "Archive {count} threads?": "스레드 {count}개를 보관하시겠습니까?",
  "Delete {count} thread?": "스레드 {count}개를 삭제하시겠습니까?",
  "Delete {count} threads?": "스레드 {count}개를 삭제하시겠습니까?",

  // Terminal
  "Opening links is unavailable in this browser.": "이 브라우저에서는 링크를 열 수 없습니다.",
  "Unable to open path": "경로를 열 수 없습니다",
  "Terminal write failed": "터미널에 입력을 보내지 못했습니다",
  "Unable to initialize libghostty-vt": "libghostty-vt를 초기화할 수 없습니다",
  "{message} — close and reopen the terminal to retry.":
    "{message} — 터미널을 닫았다가 다시 열면 재시도합니다.",

  // Pairing
  "Pairing with this environment": "이 환경과 페어링 중",
  "Validating the pairing link and preparing your session.":
    "페어링 링크를 확인하고 세션을 준비하는 중입니다.",
  "Pair with this environment": "이 환경과 페어링",
  "Pairing token": "페어링 토큰",
  "Paste a one-time token or pairing secret": "일회용 토큰이나 페어링 시크릿 붙여넣기",
  "Connecting to this backend.": "이 백엔드에 연결하는 중입니다.",
  "This pairing link is missing its backend host or token.":
    "이 페어링 링크에 백엔드 호스트나 토큰이 없습니다. 새 페어링 링크를 요청하십시오.",
  "This one-time pairing token was already submitted. Request a new pairing link.":
    "이 일회용 페어링 토큰은 이미 제출되었습니다. 새 페어링 링크를 요청하십시오.",
  "{environment} is saved in this browser.": "{environment}을(를) 이 브라우저에 저장했습니다.",
  "The environment": "환경",
  "If the backend accepted this one-time token, request a new pairing link before retrying.":
    "백엔드가 이 일회용 토큰을 이미 받았다면 새 페어링 링크를 요청한 뒤 다시 시도하십시오.",
  "Backend paired": "백엔드 페어링 완료",
  "Pairing failed": "페어링 실패",
  "Pairing backend": "백엔드 페어링 중",
  "Host:": "호스트:",
  "Verify the backend is reachable from this browser, supports CORS for hosted clients, and is served over HTTPS when opening this page from HTTPS.":
    "이 브라우저에서 백엔드에 접속할 수 있는지, 호스팅된 클라이언트용 CORS를 지원하는지, 이 페이지를 HTTPS로 열었다면 백엔드도 HTTPS로 제공되는지 확인하십시오.",
  "Open app": "앱 열기",
  "Authentication failed.": "인증에 실패했습니다.",
  "This environment expects a trusted pairing credential before the app can connect.":
    "앱을 연결하려면 이 환경에서 신뢰할 수 있는 페어링 인증 정보가 필요합니다.",
  "Enter a pairing token to start a session with this environment.":
    "이 환경과 세션을 시작하려면 페어링 토큰을 입력하십시오.",
  "Desktop-managed pairing and one-time pairing tokens are both accepted for this environment.":
    "이 환경은 데스크톱 관리 페어링과 일회용 페어링 토큰을 모두 지원합니다.",
  "This environment is desktop-managed. Open it from the desktop app or paste a bootstrap credential if one was issued explicitly.":
    "이 환경은 데스크톱 앱에서 관리합니다. 데스크톱 앱에서 열거나, 따로 발급받은 부트스트랩 인증 정보가 있으면 붙여넣으십시오.",
  "This environment accepts one-time pairing tokens. Pairing links can open this page directly, or you can paste the token here.":
    "이 환경은 일회용 페어링 토큰을 지원합니다. 페어링 링크로 이 페이지를 바로 열거나 여기에 토큰을 붙여넣을 수 있습니다.",

  // T3 Connect account
  "Mobile clients": "모바일 클라이언트",
  "T3 Connect": "T3 Connect",
  "This forgets its pairing, credentials, and cached threads here.":
    "이 기기에 저장된 페어링, 인증 정보, 캐시된 스레드를 지웁니다.",
  "It stays on your T3 Connect account and keeps its host space. Deregister it in {link} to free it.":
    "T3 Connect 계정에는 그대로 남고 호스트 공간도 계속 차지합니다. 공간을 비우려면 {link}에서 등록을 해제하십시오.",
  "T3 Connect settings": "T3 Connect 설정",
  "Remove from this device": "이 기기에서 제거",
  "Link date unavailable": "연결 날짜 없음",
  "Linked {date}": "{date}에 연결됨",
  "Managed tunnel": "관리형 터널",
  "Activity publishing only": "활동 게시만",
  Deregister: "등록 해제",
  "Confirm deregistration of {name}": "{name} 등록 해제 확인",
  "Deregister server": "서버 등록 해제",
  "“{name}” will be removed from this account.": "“{name}”이(가) 이 계정에서 제거됩니다.",
  "T3 Connect access will be revoked, any managed tunnel will be removed, and a host space will become available. Local connections on your devices are not changed.":
    "T3 Connect 접근 권한이 취소되고 관리형 터널이 제거되며 호스트 공간 하나가 비워집니다. 기기의 로컬 연결은 바뀌지 않습니다.",
  "Deregistering…": "등록 해제 중…",
  "Server deregistered": "서버 등록 해제됨",
  "T3 Connect access was revoked and a host space is now available.":
    "T3 Connect 접근 권한을 취소했고 호스트 공간 하나가 비워졌습니다.",
  "Could not deregister the server.": "서버 등록을 해제할 수 없습니다.",
  "Could not deregister server": "서버 등록 해제 실패",
  "Environments registered to your account. Connections on this device are managed in Settings.":
    "계정에 등록된 환경입니다. 이 기기의 연결은 설정에서 관리합니다.",
  "Loading environments…": "환경 불러오는 중…",
  "No T3 Connect environments": "T3 Connect 환경 없음",
  "Link an environment from its local Settings to make it available through T3 Connect.":
    "T3 Connect로 사용하려면 해당 환경의 로컬 설정에서 연결하십시오.",

  // T3 Connect CLI authorization
  "Authorization request": "승인 요청",
  "This connect link is incomplete": "연결 링크가 완전하지 않음",
  "The link is missing its authorization request. Re-run `t3 connect` in your terminal and open the freshly printed URL.":
    "링크에 승인 요청이 없습니다. 터미널에서 `t3 connect`를 다시 실행하고 새로 출력된 URL을 여십시오.",
  "Browser authorization": "브라우저 승인",
  "Connecting your terminal": "터미널 연결 중",
  "Redirecting to authorize T3 Connect for your CLI…":
    "CLI용 T3 Connect 승인 페이지로 이동하는 중…",
  "Sign in to continue authorizing T3 Connect for your CLI.":
    "CLI용 T3 Connect 승인을 계속하려면 로그인하십시오.",

  // T3 Connect onboarding
  "T3 Connect enabled": "T3 Connect 켜짐",
  "Set up T3 Connect": "T3 Connect 설정",
  "Mesh your devices together — publish this environment and connect the rest, all in one place.":
    "이 환경을 게시하고 나머지 기기도 연결해 한곳에서 모든 기기를 묶습니다.",
  "Connect devices": "기기 연결",
  "Don't show this again": "다시 표시 안 함",
  "Not now": "나중에",
  "Publish this environment": "이 환경 게시",
  "Send activity from this environment to your mobile clients for push notifications and Live Activities.":
    "푸시 알림과 실시간 현황을 위해 이 환경의 활동을 모바일 클라이언트로 보냅니다.",
  "No other environments are published to your account yet. Publish one from another device and it will show up here.":
    "계정에 게시된 다른 환경이 아직 없습니다. 다른 기기에서 환경을 게시하면 여기에 표시됩니다.",

  // SSH verification
  "SSH verification required": "SSH 인증 필요",
  "Enter the password or verification code required by":
    "다음 호스트에서 요구하는 비밀번호나 인증 코드를 입력하십시오:",
  ". T3 Code passes your response to the local SSH process and keeps it in memory to reuse for this host. T3 Code does not write it to disk.":
    ". T3 Code는 입력한 값을 로컬 SSH 프로세스에 전달하고, 이 호스트에 다시 쓸 수 있도록 메모리에만 보관합니다. 디스크에는 저장하지 않습니다.",
  "SSH keys may replace a password, but your server can still require a verification code.":
    "SSH 키로 비밀번호를 대신할 수 있지만 서버에서 인증 코드를 따로 요구할 수도 있습니다.",
  "SSH verification prompt failed.": "SSH 인증 요청을 처리하지 못했습니다.",
  "This SSH verification prompt expired. Try connecting again.":
    "SSH 인증 요청이 만료되었습니다. 다시 연결하십시오.",

  // Desktop updates
  "Updates unavailable": "업데이트 사용 불가",

  // Device panel
  "Fold command timed out.": "접기 명령 시간이 초과되었습니다. 다시 시도하십시오.",
  "Could not change fold posture.": "접힘 상태를 바꿀 수 없습니다.",
  "Android fold controls": "Android 접기 제어",
  "Fold device": "기기 접기",
  "Unfold device": "기기 펼치기",
  "Device controls": "기기 제어",
  Home: "홈",
  Recents: "최근 앱",
  "Rotate device": "기기 회전",
  Landscape: "가로",
  "Switch device to dark mode": "기기를 다크 모드로 전환",
  "Switch device to light mode": "기기를 라이트 모드로 전환",
  "Device text size": "기기 글자 크기",
  "Device tools": "기기 도구",
  "Capturing screenshot": "스크린샷 찍는 중",
  "Save screenshot": "스크린샷 저장",
  "More device actions": "기기 작업 더 보기",
  "Float device over chat": "채팅 위에 기기 띄우기",
  "Close device panel": "기기 패널 닫기",
  "Power off device": "기기 전원 끄기",
  "3D view": "3D 보기",
  "Flat view": "평면 보기",
  "Detach Magic Keyboard": "Magic Keyboard 분리",
  "Attach Magic Keyboard": "Magic Keyboard 연결",
  "Restore 3D view": "3D 보기 초기화",
};
