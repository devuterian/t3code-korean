/** Korean strings for user-facing text that arrived with the 2026-10-09 upstream merge (area D). */
export const KO_MERGE_1009_D: Readonly<Record<string, string>> = {
  "Allow {server} to run {tool}?": "{server}에서 {tool}을(를) 실행하도록 허용할까요?",
  "Send this message from {server}?": "{server}에서 이 메시지를 보낼까요?",
  "Save {files} from {server}?": "{server}에서 {files}을(를) 저장할까요?",
  "The {server} app was closed": "{server} 앱이 닫혔습니다",
  "Show app": "앱 표시",
  "Exit full screen": "전체 화면 종료",
  "The {server} app left its page and was stopped": "{server} 앱이 페이지를 벗어나 중지되었습니다",
  "Unable to load the {server} app": "{server} 앱을 불러올 수 없습니다",
  "the environment": "환경",
  "This tab is open in the T3 Code desktop app.": "이 탭은 T3 Code 데스크톱 앱에서 열려 있습니다.",
  "This connection cannot browse host folders.": "이 연결에서는 호스트 폴더를 탐색할 수 없습니다.",
  "Cannot add project": "프로젝트를 추가할 수 없음",
  "This connection cannot add projects.": "이 연결에서는 프로젝트를 추가할 수 없습니다.",
  "Clone unavailable": "복제를 사용할 수 없음",
  "This connection needs permission to write source control and add projects.":
    "이 연결에는 소스 컨트롤 쓰기 및 프로젝트 추가 권한이 필요합니다.",
  "Loading folders...": "폴더 불러오는 중...",
  "Output is no longer available.": "출력을 더 이상 사용할 수 없습니다.",
  "Expand {path}": "{path} 펼치기",
  "Collapse {path}": "{path} 접기",
  "Checking file access...": "파일 접근 권한 확인 중...",
  "This connection cannot read local diffs.": "이 연결에서는 로컬 변경사항을 읽을 수 없습니다.",
  Executable: "실행 파일",
  "Executable name or path on this environment.":
    "이 환경에서 사용할 실행 파일 이름 또는 경로입니다.",
  "e.g. dsh": "예: dsh",
  Arguments: "인수",
  "One literal argument per row, in launch order.":
    "한 행에 인수 하나씩, 실행 순서대로 입력합니다.",
  "Add argument": "인수 추가",
  "Argument {index}": "인수 {index}",
  "Remove argument {index}": "인수 {index} 제거",
  "Open {path} in editor": "편집기에서 {path} 열기",
  "This connection cannot read host files.": "이 연결에서는 호스트 파일을 읽을 수 없습니다.",
  "View policy": "정책 보기",
  "How we handle your data, including the anonymous usage data T3 Code collects.":
    "T3 Code가 수집하는 익명 사용 데이터를 포함해 데이터를 처리하는 방식입니다.",
  "Privacy policy": "개인정보 처리방침",
  "Preview limited to the first 1 MB of a {size} byte file. Save the file to read it in full.":
    "{size}바이트 파일 중 처음 1MB까지만 미리 봅니다. 전체 내용은 파일을 저장해서 확인하세요.",
  "Search matches": "검색 결과 일치 항목",
  "Current match": "현재 일치 항목",
  "This connection cannot change device settings.": "이 연결에서는 기기 설정을 변경할 수 없습니다.",
  "Settled {count} thread": "스레드 {count}개 정리함",
  "Settled {count} threads": "스레드 {count}개 정리함",
  "Snoozed {count} thread": "스레드 {count}개 미뤄 둠",
  "Snoozed {count} threads": "스레드 {count}개 미뤄 둠",
  "Unpinned {count} thread": "스레드 {count}개 고정 해제함",
  "Unpinned {count} threads": "스레드 {count}개 고정 해제함",
  "Archived {count} thread": "스레드 {count}개 보관함",
  "Archived {count} threads": "스레드 {count}개 보관함",
  "Discarded {count} draft": "초안 {count}개 삭제함",
  "Discarded {count} drafts": "초안 {count}개 삭제함",
  "For example, t3 or t3/ produces t3/add-search. Leave empty for no prefix.":
    "예: t3 또는 t3/를 입력하면 t3/add-search가 됩니다. 접두사를 쓰지 않으려면 비워 두세요.",
  "Merging stack...": "스택 머지 중...",
  "Rebasing stack...": "스택 리베이스 중...",
  "Search failed": "검색 실패",
  "Executable is required.": "실행 파일이 필요합니다.",
  "Could not install t3": "t3를 설치하지 못했습니다",
  "Could not remove t3": "t3를 제거하지 못했습니다",
  "Another t3 at {path} runs first in a new terminal. Remove it to use T3 Code's.":
    "새 터미널에서는 {path}에 있는 다른 t3가 먼저 실행됩니다. T3 Code의 t3를 쓰려면 이것을 제거하세요.",
  "Run T3 Code's CLI as `t3` from any terminal.":
    "어느 터미널에서나 T3 Code CLI를 `t3`로 실행합니다.",
  "Installed at {path}. Open a new terminal to use it.":
    "{path}에 설치했습니다. 사용하려면 새 터미널을 여세요.",
  "Installed at {path}, which is not on your PATH yet. Add its folder to your PATH to run `t3`.":
    "{path}에 설치했지만 아직 PATH에 없습니다. `t3`를 실행하려면 해당 폴더를 PATH에 추가하세요.",
  "t3 command": "t3 명령",
  "Connect an environment to see diagnostics.": "진단을 보려면 환경을 연결하세요.",
  "Checking diagnostics access…": "진단 접근 권한 확인 중…",
  "Could not check this connection's access to diagnostics and usage.":
    "이 연결의 진단 및 사용량 접근 권한을 확인하지 못했습니다.",
  "This environment is not connected.": "이 환경이 연결되어 있지 않습니다.",
  "This connection does not have access to diagnostics and usage.":
    "이 연결에는 진단 및 사용량 접근 권한이 없습니다.",
  "This connection lacks permission to change settings on {environments}.":
    "이 연결에는 {environments}의 설정을 변경할 권한이 없습니다.",
  "the primary environment": "기본 환경",
  "Reconnect the selected environment to change this setting.":
    "이 설정을 변경하려면 선택한 환경을 다시 연결하세요.",
  "Nightly needs the beta mobile app": "Nightly에는 베타 모바일 앱이 필요합니다",
  "Nightly uses the new orchestrator. The App Store and Google Play versions of T3 Code cannot connect to it.":
    "Nightly는 새 오케스트레이터를 사용합니다. App Store와 Google Play 버전의 T3 Code는 여기에 연결할 수 없습니다.",
  "Get the beta app": "베타 앱 받기",
  "Mobile app": "모바일 앱",
  "Nightly needs the beta app. The App Store and Google Play versions cannot connect.":
    "Nightly에는 베타 앱이 필요합니다. App Store와 Google Play 버전은 연결할 수 없습니다.",
  "TestFlight beta": "TestFlight 베타",
  "Scan with your iPhone camera.": "iPhone 카메라로 스캔하세요.",
  "TestFlight beta link": "TestFlight 베타 링크",
  "Google Play beta": "Google Play 베타",
  "Use the same Google account for both steps. Step 2 can take up to an hour to work after you join the group.":
    "두 단계 모두 같은 Google 계정을 사용하세요. 그룹에 가입한 뒤 2단계가 작동하기까지 최대 1시간이 걸릴 수 있습니다.",
  "1. Join the group": "1. 그룹 가입",
  "2. Become a tester": "2. 테스터 등록",
  "Android beta group link": "Android 베타 그룹 링크",
  "Google Play beta link": "Google Play 베타 링크",
  "Unable to render diagram: {message}": "다이어그램을 렌더링할 수 없습니다: {message}",
  "Mermaid failed to load.": "Mermaid를 불러오지 못했습니다.",
  "The diagram could not be rendered.": "다이어그램을 렌더링하지 못했습니다.",
  "Expand diagram": "다이어그램 확대",
  "Read projects and threads. Cannot start, message or change anything.":
    "프로젝트와 스레드를 읽습니다. 시작하거나 메시지를 보내거나 무엇이든 변경할 수는 없습니다.",
  "Could not reach this environment. Try again.": "이 환경에 연결할 수 없습니다. 다시 시도하세요.",
  "The sign-in could not continue.": "로그인을 계속할 수 없습니다.",
  "Checking the sign-in request": "로그인 요청 확인 중",
  "One moment while this environment verifies the agent's request.":
    "이 환경이 에이전트의 요청을 확인하는 동안 잠시 기다려 주세요.",
  "This sign-in cannot continue": "이 로그인은 계속할 수 없습니다",
  "Close this page and start the sign-in again from your agent.":
    "이 페이지를 닫고 에이전트에서 로그인을 다시 시작하세요.",
  "Connect {client}": "{client} 연결",
  "This agent wants to use the threads in every project on {host}.":
    "이 에이전트가 {host}의 모든 프로젝트에 있는 스레드를 사용하려고 합니다.",
  "The name is chosen by the agent. Approval returns to {host} on the computer that opened this page. Only approve a sign-in you just started.":
    "이름은 에이전트가 정합니다. 승인하면 이 페이지를 연 컴퓨터의 {host}(으)로 돌아갑니다. 방금 시작한 로그인만 승인하세요.",
  "The name is chosen by the agent. Approval gives access to whoever runs {host}. Only approve a sign-in you just started there.":
    "이름은 에이전트가 정합니다. 승인하면 {host}을(를) 운영하는 누구에게나 접근 권한이 주어집니다. 그곳에서 방금 시작한 로그인만 승인하세요.",
  "What it may do": "허용할 작업",
  "Beyond read only, it can start, message and stop threads, and none of them can run with more than the mode you pick.":
    "읽기 전용 이외의 모드에서는 스레드를 시작하고, 메시지를 보내고, 중지할 수 있으며, 어떤 스레드도 선택한 모드보다 높은 권한으로 실행되지 않습니다.",
  "Paste a one-time pairing code": "일회용 페어링 코드를 붙여 넣으세요",
  "Create one in Settings → Connections, or run {command} on this machine.":
    "설정 → 연결에서 만들거나 이 컴퓨터에서 {command}을(를) 실행하세요.",
  "Approving…": "승인 중…",
  "Denying…": "거부 중…",
  Deny: "거부",
  "Agent sign-in": "에이전트 로그인",
  "Could not switch machine": "머신을 전환하지 못했습니다",
  "This connection cannot change keyboard shortcuts.":
    "이 연결에서는 키보드 단축키를 변경할 수 없습니다.",
  "The script was deleted, but its keyboard shortcut could not be removed because permission changed.":
    "스크립트는 삭제했지만 권한이 바뀌어 키보드 단축키를 제거하지 못했습니다.",
  "The script was saved, but this connection can no longer change keyboard shortcuts.":
    "스크립트는 저장했지만 이 연결에서는 더 이상 키보드 단축키를 변경할 수 없습니다.",
  "Pursuing goal": "목표 추진 중",
  "Goal paused": "목표 일시 중지됨",
  "Goal blocked": "목표 막힘",
  "Goal hit a usage limit": "목표가 사용량 한도에 도달했습니다",
  "Goal reached its token budget": "목표가 토큰 예산에 도달했습니다",
  "Goal complete": "목표 완료",
  "Goal set": "목표 설정됨",
  "Failed to resume goal.": "목표를 재개하지 못했습니다.",
  "Failed to clear goal.": "목표를 지우지 못했습니다.",
  Resume: "재개",
  "{count} failed": "{count}개 실패",
  "Run {title} now": "{title} 지금 실행",
  "Code language: {language}": "코드 언어: {language}",
  "Search languages": "언어 검색",
  "No matching languages.": "일치하는 언어가 없습니다.",
  "Stop watching #{number}": "#{number} 지켜보기 중지",
  "Watching: the agent wakes when checks finish, someone comments, or the branch conflicts. Click to stop.":
    "지켜보는 중: 체크가 끝나거나, 누군가 댓글을 달거나, 브랜치에 충돌이 생기면 에이전트가 깨어납니다. 클릭하면 중지합니다.",
  Reopen: "다시 열기",
  "No merge method is available for this repository.":
    "이 저장소에서 사용할 수 있는 머지 방식이 없습니다.",
  "Quick actions for pull request #{number}": "풀 리퀘스트 #{number} 빠른 작업",
  "Open this pull request to merge its stack": "스택을 머지하려면 이 풀 리퀘스트를 여세요",
  "Close immediately, or drag across rows to close several":
    "바로 닫기. 여러 행을 드래그하면 한꺼번에 닫습니다",
  "Close immediately": "바로 닫기",
  "Merge immediately": "바로 머지",
  "Ready for review immediately": "바로 리뷰 준비 완료로 표시",
  "Reopen immediately": "바로 다시 열기",
  "Worktree location": "워크트리 위치",
  "worktree location": "워크트리 위치",
  "Folder where new worktrees are created, on any drive, such as D:\\worktrees or ~/worktrees. Existing worktrees stay where they are. Leave empty to use the T3 home folder.":
    "새 워크트리를 만들 폴더입니다. D:\\worktrees나 ~/worktrees처럼 어느 드라이브든 지정할 수 있습니다. 기존 워크트리는 그대로 유지됩니다. 비워 두면 T3 홈 폴더를 사용합니다.",
  "Failed to remove project": "프로젝트를 제거하지 못했습니다",
  "This connection cannot change projects in {environment}.":
    "이 연결에서는 {environment}의 프로젝트를 변경할 수 없습니다.",
  "this environment": "이 환경",
  "Shared settings require permission to change every checkout in this group.":
    "공유 설정을 바꾸려면 이 그룹의 모든 체크아웃을 변경할 권한이 필요합니다.",
  "This connection cannot change this project.": "이 연결에서는 이 프로젝트를 변경할 수 없습니다.",
  "Hidden account": "숨긴 계정",
  "Hide GitHub accounts": "GitHub 계정 숨기기",
  "Reveal GitHub accounts": "GitHub 계정 표시",
  "Use GitHub on {host}": "{host}에서 GitHub 사용",
  "GitHub account for {host}": "{host}용 GitHub 계정",
  "Active gh account": "활성 gh 계정",
  "Account {number}": "계정 {number}",
  "The chosen login is no longer signed in, so the active gh login is used.":
    "선택한 로그인이 더 이상 로그인 상태가 아니므로 활성 gh 로그인을 사용합니다.",
  "Use active login": "활성 로그인 사용",
  "can't be used:": "사용할 수 없음:",
  "gh reports this login as invalid.": "gh가 이 로그인을 유효하지 않다고 보고합니다.",
  "{variable} is set on the server, so it overrides the account chosen here until it is unset.":
    "서버에 {variable}이(가) 설정되어 있어, 해제하기 전까지 여기서 고른 계정보다 우선합니다.",
  "Sign in with {command} on the server host, then rescan to choose accounts here.":
    "서버 호스트에서 {command}(으)로 로그인한 뒤 다시 스캔하면 여기서 계정을 고를 수 있습니다.",
  "Choose which {command} login each GitHub host uses, or turn a host off.":
    "각 GitHub 호스트가 사용할 {command} 로그인을 고르거나 호스트를 끄세요.",
  "The page copied text": "페이지가 텍스트를 복사했습니다",
  "Downloaded {name}": "{name} 다운로드됨",
  "Could not send the files to the page": "파일을 페이지로 보내지 못했습니다",
  "Connecting...": "연결 중...",
  "Read-only": "읽기 전용",
  "You have control": "내가 제어 중",
  "Agent has control": "에이전트가 제어 중",
  "Another viewer has control": "다른 사용자가 제어 중",
  Watching: "보는 중",
  "Release control": "제어 넘기기",
  "Take control": "제어하기",
  "Browser page": "브라우저 페이지",
  "Press Shift+Escape to leave the browser page.":
    "Shift+Escape를 누르면 브라우저 페이지에서 나갑니다.",
  "Choose files for the page": "페이지에 보낼 파일 선택",
  "The page asks for files.": "페이지에서 파일을 요청합니다.",
  "The page asks for a file.": "페이지에서 파일 하나를 요청합니다.",
  "Browser dialog": "브라우저 대화상자",
  "Dialog response": "대화상자 응답",
  Accept: "수락",
  "Take control to respond.": "응답하려면 제어권을 가져오세요.",
  "Browser connection was refused.": "브라우저 연결이 거부되었습니다.",
  "This server's host blocks the sandbox its browser runs in. Run this once on the host, then try again:":
    "이 서버의 호스트가 브라우저 실행용 샌드박스를 막고 있습니다. 호스트에서 아래 명령을 한 번 실행한 뒤 다시 시도하세요:",
  "This server's host is missing libraries its browser needs. Run this once on the host, then try again:":
    "이 서버의 호스트에 브라우저에 필요한 라이브러리가 없습니다. 호스트에서 아래 명령을 한 번 실행한 뒤 다시 시도하세요:",
  Ran: "실행됨",
  "Run failed": "실행 실패",
  "Bad signature": "잘못된 서명",
  "Task paused": "작업 일시 중지됨",
  "Rate limited": "요청 한도 초과",
  "Too old": "너무 오래됨",
  "Recent requests to this task's webhook URL.": "이 작업의 웹훅 URL로 들어온 최근 요청입니다.",
  "Loading delivery…": "전송 기록 불러오는 중…",
  "Signature verified": "서명 확인됨",
  "Prompt sent to the agent": "에이전트에 보낸 프롬프트",
  "No run was started for this request.": "이 요청으로는 실행이 시작되지 않았습니다.",
  "Empty placeholders:": "비어 있는 자리표시자:",
  Headers: "헤더",
  Query: "쿼리",
  "Body (truncated)": "본문 (잘림)",
  Body: "본문",
  "Loading deliveries…": "전송 기록 불러오는 중…",
  "No requests yet.": "아직 요청이 없습니다.",
  "{count} empty placeholder": "비어 있는 자리표시자 {count}개",
  "{count} empty placeholders": "비어 있는 자리표시자 {count}개",
  "The URL appears after you save.": "저장하면 URL이 표시됩니다.",
  "Rotate this webhook URL?\nThe current URL stops working.":
    "이 웹훅 URL을 회전할까요?\n현재 URL은 더 이상 작동하지 않습니다.",
  "Rotate this webhook URL? The current URL stops working.":
    "이 웹훅 URL을 회전할까요? 현재 URL은 더 이상 작동하지 않습니다.",
  "Could not rotate webhook URL": "웹훅 URL을 회전하지 못했습니다",
  "Webhook URL": "웹훅 URL",
  "Link this environment to T3 Connect for a public URL.":
    "공개 URL을 받으려면 이 환경을 T3 Connect에 연결하세요.",
  "Only this computer can call this address. Link T3 Connect for a public URL.":
    "이 컴퓨터에서만 이 주소를 호출할 수 있습니다. 공개 URL을 받으려면 T3 Connect를 연결하세요.",
  "Works wherever this environment's address is reachable, for example over Tailscale or your own proxy. Link T3 Connect for a public URL.":
    "Tailscale이나 자체 프록시처럼 이 환경의 주소에 닿을 수 있는 곳이면 어디서든 작동합니다. 공개 URL을 받으려면 T3 Connect를 연결하세요.",
  "Held for up to 24 hours while this environment is offline.":
    "이 환경이 오프라인인 동안 최대 24시간 보관됩니다.",
  "Forwarded live. Requests fail while this environment is offline.":
    "실시간으로 전달됩니다. 이 환경이 오프라인이면 요청이 실패합니다.",
  "Change in Connections": "연결에서 변경",
  "Invalid age limit": "잘못된 기간 제한",
  "Enter whole minutes from 1 to {max}, or leave it blank.":
    "1에서 {max} 사이의 정수 분을 입력하거나 비워 두세요.",
  "Signing secret is required": "서명 비밀 값이 필요합니다",
  "Enter the signature header and secret.": "서명 헤더와 비밀 값을 입력하세요.",
  "Each request runs the prompt. Use {{body.path}}, {{headers.name}}, {{query.name}}, {{body}} or {{request}} in the prompt; only what it names reaches the agent.":
    "요청마다 프롬프트를 실행합니다. 프롬프트에 {{body.path}}, {{headers.name}}, {{query.name}}, {{body}} 또는 {{request}}를 쓰세요. 지정한 값만 에이전트에 전달됩니다.",
  "Skip requests older than": "다음보다 오래된 요청 건너뛰기",
  "minutes, optional": "분, 선택 사항",
  "Run every request": "모든 요청 실행",
  "Require signature": "서명 필수",
  "Reject requests without a valid HMAC-SHA256 signature of the body.":
    "본문에 대한 유효한 HMAC-SHA256 서명이 없는 요청을 거부합니다.",
  Header: "헤더",
  Prefix: "접두사",
  Encoding: "인코딩",
  Secret: "비밀 값",
  Unchanged: "변경 안 함",
  "Shared secret": "공유 비밀 값",
  "This file can’t be shown here": "이 파일은 여기에서 표시할 수 없습니다",
  "{file} from {host} was downloaded instead.": "{host}의 {file} 파일을 대신 다운로드했습니다.",
  "Open in browser": "브라우저에서 열기",
  "Remove agent credits when merging": "병합 시 에이전트 크레딧 제거",
  "Remove recognized agent credit lines from GitHub merge and squash messages, keeping human co-authors. Includes auto-merge. Excludes merge queues, stack merges, and existing commits.":
    "GitHub 병합 및 스쿼시 메시지에서 인식된 에이전트 크레딧 줄을 제거하고 사람 공동 작성자는 유지합니다. 자동 병합에도 적용됩니다. 병합 큐, 스택 병합, 기존 커밋은 제외됩니다.",
  "agent credit removal": "에이전트 크레딧 제거",
  "Keep agent credits": "에이전트 크레딧 유지",
  '"{font}" isn\'t monospace': '"{font}"은(는) 고정폭 글꼴이 아닙니다',
  "Code and terminal need a fixed-width font, so the current font was kept.":
    "코드와 터미널에는 고정폭 글꼴이 필요하므로 현재 글꼴을 유지했습니다.",
  "Laptop stand": "노트북 스탠드",
  "Tent stand": "텐트 스탠드",
  Book: "책",
  "Fold shape": "접힘 형태",
  "Device stance": "기기 자세",
  "iPhone Duo stands": "iPhone Duo 스탠드",
  "Click to queue, Ctrl/⌘-click or {shortcut} to steer":
    "클릭하면 대기열에 추가, Ctrl/⌘-클릭 또는 {shortcut}하면 조정",
  "Click to steer, Ctrl/⌘-click or {shortcut} to queue":
    "클릭하면 조정, Ctrl/⌘-클릭 또는 {shortcut}하면 대기열에 추가",
  "Provider settings": "프로바이더 설정",
  "Permissions have changed for {label}": "{label}의 권한이 변경되었습니다",
  "This connection still uses the old permissions, so some actions may no longer be available. Pair again using a new link with the permissions you need.":
    "이 연결은 아직 이전 권한을 사용하므로 일부 작업을 더 이상 사용할 수 없을 수 있습니다. 필요한 권한이 포함된 새 링크로 다시 페어링하세요.",
  "Remove {label} route?": "{label} 경로를 제거할까요?",
  "Routes to {environment}, preferred first": "{environment}(으)로 가는 경로, 우선순위 순",
  "In use": "사용 중",
  "found automatically": "자동으로 찾음",
  "Reorder {label}, position {position}": "{label} 순서 변경, {position}번째",
  "Remove {label} route": "{label} 경로 제거",
  "Remove route": "경로 제거",
  "Open in panel": "패널에서 열기",
  "Unable to load {title}": "{title}을(를) 불러올 수 없습니다",
  "{start} to {end}": "{start} ~ {end}",
  "All providers": "모든 프로바이더",
  "No providers": "프로바이더 없음",
  "{count} providers": "프로바이더 {count}개",
  "Thread action unavailable": "스레드 작업을 사용할 수 없습니다",
  "This connection cannot change one or more selected threads.":
    "이 연결로는 선택한 스레드 중 하나 이상을 변경할 수 없습니다.",
  "T3 Connect route added": "T3 Connect 경로 추가됨",
  "Environment added": "환경 추가됨",
  "{label} falls back to T3 Connect when its other routes are unreachable.":
    "{label}은(는) 다른 경로에 연결할 수 없을 때 T3 Connect를 사용합니다.",
  "Connecting to {label} through T3 Connect.": "T3 Connect를 통해 {label}에 연결하는 중입니다.",
  "Could not connect the T3 Connect environment.": "T3 Connect 환경에 연결하지 못했습니다.",
  "Could not connect environment": "환경에 연결하지 못했습니다",
  "You appear to be offline.": "오프라인 상태인 것 같습니다.",
  "Could not load T3 Connect environments": "T3 Connect 환경을 불러오지 못했습니다",
  "Saved without T3 Connect": "T3 Connect 없이 저장됨",
  "Not added": "추가되지 않음",
  "Relay online": "릴레이 온라인",
  "Relay offline": "릴레이 오프라인",
  "Checking relay status…": "릴레이 상태 확인 중…",
  "Checking relay status": "릴레이 상태 확인 중",
  "Relay status unavailable": "릴레이 상태를 확인할 수 없음",
  "These permissions apply to your active route. Other routes may have different permissions.":
    "이 권한은 현재 사용 중인 경로에 적용됩니다. 다른 경로는 권한이 다를 수 있습니다.",
  "These permissions apply to this client’s current connection.":
    "이 권한은 이 클라이언트의 현재 연결에 적용됩니다.",
  Allowed: "허용됨",
  "Not granted": "허용되지 않음",
  "Permissions not checked. Connect to this environment to view this session’s permissions.":
    "권한을 확인하지 않았습니다. 이 세션의 권한을 보려면 이 환경에 연결하세요.",
  "Change environment settings": "환경 설정 변경",
  "Manage providers": "프로바이더 관리",
  "Maintain environment": "환경 유지 관리",
  "Control previews": "미리보기 제어",
  "View diagnostics and usage": "진단 및 사용량 보기",
  "View terminals": "터미널 보기",
  "Change source control": "소스 컨트롤 변경",
  "Read files": "파일 읽기",
  "Write files": "파일 쓰기",
  "Read threads, status, checkpoints, and configuration.":
    "스레드, 상태, 체크포인트, 구성을 읽습니다.",
  "Start, update, and stop tasks.": "작업을 시작, 업데이트, 중지합니다.",
  "Edit environment preferences and keybindings.": "환경 환경설정과 키 바인딩을 편집합니다.",
  "Configure, install, sign in to, and update providers and usage sources.":
    "프로바이더와 사용량 소스를 구성, 설치, 로그인, 업데이트합니다.",
  "Update the server and control environment processes.":
    "서버를 업데이트하고 환경 프로세스를 제어합니다.",
  "Open browser previews and host browser automation.":
    "브라우저 미리보기를 열고 브라우저 자동화를 호스팅합니다.",
  "Read process diagnostics, resource history, and usage totals.":
    "프로세스 진단, 리소스 기록, 사용량 합계를 읽습니다.",
  "Read existing terminal output and status.": "기존 터미널 출력과 상태를 읽습니다.",
  "Commit, push, manage branches and repositories, and change pull requests.":
    "커밋, 푸시, 브랜치와 저장소 관리, 풀 리퀘스트 변경을 수행합니다.",
  "Browse host files, search workspaces, and inspect local changes.":
    "호스트 파일을 탐색하고 작업 공간를 검색하며 로컬 변경 사항을 확인합니다.",
  "Edit workspace files and save plans to disk.":
    "작업 공간 파일을 편집하고 계획을 디스크에 저장합니다.",
  "This connection cannot change project actions.":
    "이 연결에서는 프로젝트 액션을 변경할 수 없습니다.",
  "Run in the thread's worktree when the thread settles":
    "스레드가 정리되면 스레드의 워크트리에서 실행",
  "Action unavailable": "작업을 사용할 수 없음",
  "This connection cannot change the thread's branch.":
    "이 연결에서는 스레드의 브랜치를 변경할 수 없습니다.",
  "Every {label} host is turned off.": "모든 {label} 호스트가 꺼져 있습니다.",
  "MCP URL copied": "MCP URL 복사됨",
  "Add it to an agent, e.g. claude mcp add --transport http t3 {url}":
    "에이전트에 추가하세요. 예: claude mcp add --transport http t3 {url}",
  "Could not copy MCP URL": "MCP URL을 복사하지 못했습니다",
  "Copy MCP URL": "MCP URL 복사",
  Routes: "경로",
  "{count} routes": "경로 {count}개",
  "Hide routes": "경로 숨기기",
  "Webhooks held while offline": "오프라인 중 웹훅 보관됨",
  "Webhooks no longer held": "웹훅을 더 이상 보관하지 않음",
  "T3 Connect keeps webhook requests for up to 24 hours while this environment is offline.":
    "이 환경이 오프라인인 동안 T3 Connect가 웹훅 요청을 최대 24시간 보관합니다.",
  "Requests to an offline environment now fail. Anything already held is still delivered.":
    "이제 오프라인 환경으로 보낸 요청은 실패합니다. 이미 보관된 요청은 계속 전달됩니다.",
  "Keep webhook requests for up to 24 hours while this environment is offline, then deliver them. Off: T3 Connect only forwards requests and stores nothing.":
    "이 환경이 오프라인인 동안 웹훅 요청을 최대 24시간 보관한 뒤 전달합니다. 끄면 T3 Connect는 요청을 전달만 하고 아무것도 저장하지 않습니다.",
  "Hold webhook requests while this environment is offline":
    "이 환경이 오프라인인 동안 웹훅 요청 보관",
  "To edit these settings, pair this connection with both View relay and Manage relay permissions.":
    "이 설정을 편집하려면 릴레이 보기와 릴레이 관리 권한을 모두 사용해 이 연결을 페어링하세요.",
  "Could not add the route.": "경로를 추가하지 못했습니다.",
  "This machine is on your T3 Connect account. Use it as a fallback route.":
    "이 컴퓨터는 T3 Connect 계정에 연결되어 있습니다. 대체 경로로 사용하세요.",
  "Add T3 Connect": "T3 Connect 추가",
  "This connection can create access links but cannot view authorized clients.":
    "이 연결은 액세스 링크를 만들 수 있지만 승인된 클라이언트는 볼 수 없습니다.",
  "No environment selected": "선택된 환경 없음",
  "Connect an environment to view its settings and access.":
    "설정과 액세스를 보려면 환경을 연결하세요.",
  "Show diagram": "다이어그램 표시",
  "Rendering diagram": "다이어그램 렌더링 중",
  "Code block actions": "코드 블록 작업",
  "This connection cannot reveal files on this environment.":
    "이 연결에서는 이 환경의 파일을 표시할 수 없습니다.",
  "Preview access is unavailable for this client.":
    "이 클라이언트에서는 미리보기에 액세스할 수 없습니다.",
  "Mermaid diagram": "Mermaid 다이어그램",
  "Stored securely, never shown to the agent": "안전하게 저장되며 에이전트에게는 표시되지 않습니다",
  "Paste the secret": "비밀 값 붙여넣기",
  "Saved securely and kept private": "안전하게 저장되고 비공개로 유지됨",
  Declined: "거절됨",
  "Request ended": "요청 종료됨",
  "Waiting for an answer in the original thread": "원래 스레드에서 응답을 기다리는 중",
  "Could not answer the request. Try again.": "요청에 응답하지 못했습니다. 다시 시도하세요.",
  "Save securely": "안전하게 저장",
  "A token saved here is used before": "여기에 저장한 토큰은",
  "and the": "및",
  "login, so GitHub works without the GitHub CLI. Give it read and write access to pull requests and contents.":
    "로그인보다 먼저 사용되므로 GitHub CLI 없이도 GitHub를 사용할 수 있습니다. 풀 리퀘스트와 콘텐츠에 대한 읽기 및 쓰기 권한을 부여하세요.",
  "Create a token": "토큰 만들기",
  Token: "토큰",
  "No token saved; the server uses GH_TOKEN or the gh login.":
    "저장된 토큰이 없습니다. 서버는 GH_TOKEN 또는 gh 로그인을 사용합니다.",
  "Saved for {hosts}.": "{hosts}에 저장됨.",
  "Not connected, so setup skips {labels}. You can set it up later from Settings.":
    "연결되지 않아 설정에서 {labels}을(를) 건너뜁니다. 나중에 설정에서 구성할 수 있습니다.",
  "Not connected, so setup skips {labels}. You can set them up later from Settings.":
    "연결되지 않아 설정에서 {labels}을(를) 건너뜁니다. 나중에 설정에서 구성할 수 있습니다.",
  "T3 Code collects anonymous usage data to help us improve it. To read more about how your data is used and how to opt out, see our":
    "T3 Code는 제품 개선을 위해 익명 사용 데이터를 수집합니다. 데이터 사용 방식과 수집 거부 방법은 다음을 참고하세요:",
  "privacy policy": "개인정보 처리방침",
  "This connection cannot import projects or thread history.":
    "이 연결에서는 프로젝트나 스레드 기록을 가져올 수 없습니다.",
  "Could not stop subagent": "서브에이전트를 중지하지 못했습니다",
  "Stop subagent {title}": "서브에이전트 {title} 중지",
  "Stop subagent": "서브에이전트 중지",
  "Clear “{name}”’s cookies and cache?": "“{name}”의 쿠키와 캐시를 지울까요?",
  "You are signed out of its sites. Server browser tabs open in this profile close now.":
    "이 프로필의 사이트에서 로그아웃됩니다. 이 프로필로 열린 서버 브라우저 탭은 지금 닫힙니다.",
  "Clear data": "데이터 지우기",
};
