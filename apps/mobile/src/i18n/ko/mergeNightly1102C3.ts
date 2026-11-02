// Korean copy for upstream strings wrapped after the 2026-11-02 nightly merge.
export const KO_MERGE_NIGHTLY_1102_C3: Readonly<Record<string, string>> = {
  // Crash reports (settings > diagnostics)
  "Crash reports": "충돌 보고서",
  "Send crash reports": "충돌 보고서 보내기",
  "When the app crashes or hits an error, it sends the error message, the stack trace, the app version, and the device model and OS version to the T3 Code team. Each launch also sends startup timings. Reports carry a random ID for this install.":
    "앱이 충돌하거나 오류가 나면 오류 메시지, 스택 트레이스, 앱 버전, 기기 모델과 OS 버전을 T3 Code 팀에 보내요. 실행할 때마다 시작 시간도 함께 보내요. 보고서에는 이 설치본의 임의 ID가 들어가요.",

  // Command palette, add project, scheduled tasks, terminal menu
  "On {machine}": "{machine}에서",
  "this machine": "이 컴퓨터",
  "{title} is still archived. Try again later.":
    "{title} 프로젝트가 아직 보관 상태예요. 나중에 다시 시도하세요.",
  "{field}, {value}": "{field}: {value}",
  "{name} ({roles})": "{name}({roles})",

  // Git sheets, linked pull requests, provider subagent bar
  "(detached HEAD)": "(분리된 HEAD)",
  "{label} #{number} {state}": "{label} #{number}({state})",
  "{term} {number}": "{term} {number}번",
  "{status} {duration}": "{status} {duration} 경과",

  // Link request card
  "Link a machine to this environment": "이 환경에 컴퓨터 연결",
  "Link {target} to this environment": "이 환경에 {target} 연결",
  "Choose machine…": "컴퓨터 선택…",
  "Review link…": "연결 검토…",
  "Only a session that manages access here can answer this.":
    "여기서 액세스를 관리하는 세션만 응답할 수 있어요.",
  "Link a machine": "컴퓨터 연결",
  "Agents here can then launch, message and wait on threads there. It appears in that machine's Connections, where it can be revoked.":
    "연결하면 이 환경의 에이전트가 그 컴퓨터에서 스레드를 시작하고, 메시지를 보내고, 끝날 때까지 기다릴 수 있어요. 연결은 그 컴퓨터의 연결 설정에 표시되고, 그곳에서 해제할 수 있어요.",
  Machine: "컴퓨터",
  "Another address…": "다른 주소…",
  "Link a machine this app does not know, by its https or Tailscale address.":
    "앱에 없는 컴퓨터를 https 또는 Tailscale 주소로 연결해요.",
  "This app has no address for {name} that another machine can reach. Enter its https or Tailscale address.":
    "다른 컴퓨터가 접속할 수 있는 {name}의 주소가 앱에 없어요. https 또는 Tailscale 주소를 입력하세요.",
  "This environment is already linked to {name}. The agent can use that link as it is; change its access in Settings → Connections.":
    "이 환경은 이미 {name}에 연결돼 있어요. 에이전트가 이 연결을 그대로 쓸 수 있고, 액세스는 설정 → 연결에서 바꿀 수 있어요.",
  "Paste the code": "코드 붙여넣기",
  "Create a link on {name}: Settings → Connections → Create link, then paste its code here.":
    "{name}에서 설정 → 연결 → 링크 만들기로 링크를 만든 뒤, 받은 코드를 여기에 붙여넣으세요.",
  "What agents here may do there": "이 환경의 에이전트가 할 수 있는 일",
  "An agent here never gets more there than its own mode here either. Threads it starts there cannot change that environment's own threads, projects or settings.":
    "에이전트는 이 환경에서 가진 모드보다 높은 권한을 그곳에서 받지 않아요. 그곳에서 시작한 스레드는 해당 환경의 기존 스레드, 프로젝트, 설정을 바꿀 수 없어요.",
  "Linking…": "연결 중…",
  "Use this link": "이 연결 사용",
  Linked: "연결됨",
  "Read only": "읽기 전용",
  "Read projects and threads. Cannot start, message or change anything.":
    "프로젝트와 스레드를 읽을 수만 있어요. 시작, 메시지 전송, 변경은 할 수 없어요.",

  // ZIP archive browser
  "Browsing works up to {size}.": "{size}까지 탐색할 수 있어요.",
  "Save the ZIP to open it in another app.": "다른 앱에서 열려면 ZIP을 저장하세요.",
  "Too large to browse here": "너무 커서 탐색할 수 없음",
  "Download cancelled": "다운로드 취소됨",
  "The ZIP wasn't downloaded. Try again to list its files.":
    "ZIP을 다운로드하지 않았어요. 다시 시도하면 파일 목록을 볼 수 있어요.",
  "Couldn't download this ZIP": "ZIP 다운로드 실패",
  "Check the connection to this environment and try again.":
    "이 환경과의 연결을 확인한 뒤 다시 시도하세요.",
  "Couldn't browse this ZIP": "ZIP 탐색 실패",
  "It may be incomplete or damaged.": "파일이 불완전하거나 손상됐을 수 있어요.",
  "{path} folder": "{path} 폴더",
  "Save ZIP": "ZIP 저장",
  "ZIP actions": "ZIP 작업",
  "of {total}": "/ {total}",
  "ZIP download progress": "ZIP 다운로드 진행률",
  "Downloading the ZIP so its files can be listed.":
    "파일 목록을 만들려고 ZIP을 다운로드하는 중이에요.",
  "{time} on this connection.": "이 연결 기준 {time}.",
  "About {count} second left": "약 {count}초 남았어요",
  "About {count} seconds left": "약 {count}초 남았어요",
  "About {count} minutes left": "약 {count}분 남았어요",
  "Filter files in ZIP": "ZIP 안 파일 필터",
  "Filter {files}": "{files} 필터",
  "Clear filter": "필터 지우기",
  "No files match “{query}”": "“{query}”에 맞는 파일 없음",
  "The filter checks file names and folder paths.":
    "필터는 파일 이름과 폴더 경로를 기준으로 찾아요.",
  "This ZIP is empty": "빈 ZIP",
  "It has no files.": "파일이 없어요.",
  "Opening ZIP...": "ZIP 여는 중...",
  "This message already has as many attachments as it can hold.":
    "이 메시지에는 더 이상 첨부할 수 없어요.",
  "Too big to preview": "너무 커서 미리 볼 수 없음",
  "Previews stop at {size}. Save the file to open it in another app.":
    "미리보기는 {size}까지만 지원해요. 다른 앱에서 열려면 파일을 저장하세요.",
  "Couldn't read this file": "파일 읽기 실패",
  "Added to chat": "채팅에 추가됨",
  "{name} is attached to your message.": "{name} 파일을 메시지에 첨부했어요.",
  "Could not save file": "파일을 저장할 수 없음",
  "Could not add file to chat": "파일을 채팅에 추가할 수 없음",
  "Show source": "소스 보기",
  "Show preview": "미리보기 표시",
  "Add to chat": "채팅에 추가",
  "Save file": "파일 저장",
  "Open it in the file viewer, save it, or add it to chat.":
    "파일 뷰어에서 열거나, 저장하거나, 채팅에 추가할 수 있어요.",

  // Outdated server update section
  "Install T3 Code {version}. T3 Code restarts on that machine and reconnects. Running threads may be interrupted.":
    "T3 Code {version} 버전을 설치해요. 그 컴퓨터에서 T3 Code가 다시 시작되고 다시 연결돼요. 실행 중인 스레드가 중단될 수 있어요.",
  "Update required": "업데이트 필요",
  "Installing update…": "업데이트 설치 중…",
  "No newer version is available yet.": "새 버전이 아직 없어요.",
  "This app needs a newer version of T3 Code on this machine.":
    "이 앱을 쓰려면 이 컴퓨터의 T3 Code를 새 버전으로 업데이트해야 해요.",
  "Retry update": "업데이트 다시 시도",

  // Subagent workflows, side chats, native child work
  "{label} workflow, {status}": "{label} 워크플로, {status}",
  "Collapses the workflow": "워크플로를 접어요",
  "Opens the current phase": "현재 단계를 열어요",
  "{title} phase, {status}, {count} completed": "{title} 단계, {status}, {count}개 완료",
  "{title} phase, {status}": "{title} 단계, {status}",
  "No agents yet": "에이전트 없음",
  "Its thread is not available yet": "스레드를 아직 열 수 없어요",
  Stopped: "중지됨",
  "Side chats": "사이드 채팅",
  "Subagent work": "서브에이전트 작업",
  "Read only. These subagents cannot take messages.":
    "읽기 전용이에요. 이 서브에이전트에는 메시지를 보낼 수 없어요.",
  "The provider has no record of which subagents this call started.":
    "이 호출이 어떤 서브에이전트를 시작했는지 프로바이더에 기록이 없어요.",
  "Earlier steps are not shown.": "이전 단계는 표시되지 않아요.",
  "No transcript yet.": "아직 대화 기록이 없어요.",

  // New task environment picker
  "Hide connection details for {title}": "{title} 연결 상세 정보 숨기기",
  "Show connection details for {title}": "{title} 연결 상세 정보 보기",
  "Next reconnect at {time}": "다음 재연결 {time}",
  "Reconnect now": "지금 다시 연결",

  // Prompt links, shared content, pull request maintainer edits
  "You don't have {name}": "{name} 저장소가 없어요",
  "The shared content is no longer in the inbox.": "공유한 콘텐츠가 공유함에 더 이상 없어요.",
  "Could not save maintainer access": "유지관리자 액세스를 저장할 수 없음",
  "Maintainers can push to this branch. If your fork has workflows, this can also give access to its secrets.":
    "유지관리자가 이 브랜치에 푸시할 수 있어요. 포크에 워크플로가 있으면 포크의 시크릿에도 접근할 수 있어요.",
};
