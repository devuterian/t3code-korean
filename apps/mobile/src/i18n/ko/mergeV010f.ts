/** Korean strings for upstream text that arrived with the v0.1.0 merge (mobile, clean merge). */
export const KO_MERGE_V010_F: Readonly<Record<string, string>> = {
  // Microphone settings
  Microphone: "마이크",
  "Microphone access": "마이크 접근 권한",
  "Allow microphone access": "마이크 접근 허용",
  "Voice input needs microphone access before it can record or list your microphones.":
    "음성 입력으로 녹음하거나 마이크 목록을 보려면 마이크 접근 권한이 필요합니다.",
  "Microphone access is off for T3 Code. Turn it on in Settings to use voice input.":
    "T3 Code의 마이크 접근 권한이 꺼져 있습니다. 음성 입력을 사용하려면 설정에서 켜야 합니다.",
  "Preferred order": "우선순위",
  "Voice input records from the first connected microphone in this list. Wired and Bluetooth devices are added by name after you use voice input with them connected; until then, the Other row ranks them.":
    "음성 입력은 이 목록에서 연결된 첫 번째 마이크로 녹음합니다. 유선 및 Bluetooth 기기는 연결한 상태로 음성 입력을 한 번 사용하면 이름으로 추가됩니다. 그 전까지는 '기타' 항목의 순서를 따릅니다.",
  Wired: "유선",
  "Other wired": "기타 유선",
  "Headsets and USB microphones not listed": "목록에 없는 헤드셋 및 USB 마이크",
  Bluetooth: "Bluetooth",
  "Other Bluetooth": "기타 Bluetooth",
  "AirPods, headsets, and cars not listed": "목록에 없는 AirPods, 헤드셋, 차량",
  "Built-in": "내장",
  "Built-in microphone": "내장 마이크",
  "The microphone on this device": "이 기기의 마이크",
  CarPlay: "CarPlay",
  "The car’s microphone": "차량 마이크",
  "Forget {name}": "{name} 삭제",
  "{title}, {kind}, {position} of {count}": "{title}, {kind}, {position}/{count}",

  // Prompt links
  "Could not open link": "링크를 열 수 없음",
  "Drafts could not be loaded, so the prompt was not added.":
    "초안을 불러올 수 없어 프롬프트를 추가하지 못했습니다.",
  "No connected environment offers threads without a project.":
    "연결된 환경 중 프로젝트 없는 스레드를 지원하는 환경이 없습니다.",
  "Could not clone": "클론할 수 없음",
  "Connect an environment first.": "먼저 환경을 연결해야 합니다.",
  "The prompt opens in a new task once the clone starts.":
    "클론이 시작되면 프롬프트가 새 작업에서 열립니다.",
  "Open the link again after the clone to get the prompt.":
    "클론이 끝난 뒤 링크를 다시 열면 프롬프트를 가져옵니다.",
  "This prompt had only hidden characters, so it may be malicious. T3 Code did not open it.":
    "이 프롬프트는 숨겨진 문자로만 이루어져 있어 악성일 수 있습니다. T3 Code에서 열지 않았습니다.",
  "This link names a pull request T3 Code cannot read.":
    "이 링크의 풀 리퀘스트를 T3 Code에서 읽을 수 없습니다.",
  "This link has no prompt.": "이 링크에 프롬프트가 없습니다.",
  "This link names a repository T3 Code cannot read.":
    "이 링크의 저장소를 T3 Code에서 읽을 수 없습니다.",
  "You don't have {repository}": "{repository} 저장소 없음",
  "Use without project": "프로젝트 없이 사용",
  Clone: "클론",
  "Prompt from a link": "링크로 받은 프롬프트",
  "Linked prompt ready. Replace draft?": "링크 프롬프트 준비 완료. 초안을 바꾸시겠습니까?",
  "Keep mine": "내 초안 유지",
  Replace: "바꾸기",
  "This prompt had hidden characters, it may be malicious. They were removed. Read it before you send.":
    "이 프롬프트에 숨겨진 문자가 있어 악성일 수 있습니다. 숨겨진 문자는 제거했습니다. 보내기 전에 내용을 확인해야 합니다.",
  "This prompt came from a link. Read it before you send.":
    "링크로 받은 프롬프트입니다. 보내기 전에 내용을 확인해야 합니다.",
  "The requested model is not available, so your default is used.":
    "요청한 모델을 사용할 수 없어 기본 모델을 사용합니다.",
  "Pull request #{number} could not be loaded, so this task starts from your default branch.":
    "풀 리퀘스트 #{number}을(를) 불러올 수 없어 기본 브랜치에서 작업을 시작합니다.",

  // Model availability
  "Model turned off for this project": "이 프로젝트에서 꺼진 모델",
  "Turn it back on from web or desktop, or choose another model.":
    "웹이나 데스크톱에서 다시 켜거나 다른 모델을 선택하세요.",
  Hidden: "숨김",
  "Show model: {provider}, {model}": "모델 표시: {provider}, {model}",
  "Hide model: {provider}, {model}": "모델 숨기기: {provider}, {model}",

  // Workspace tabs and toolbar
  PRs: "PR",
  Pulls: "PR",
  "New chat": "새 채팅",
  "Show tabs, {tab} selected": "탭 표시, {tab} 선택됨",
  "Search {tab}": "{tab} 검색",
  "Search pull requests": "풀 리퀘스트 검색",
  "Cancel search": "검색 취소",
  "Select a pull request": "풀 리퀘스트 선택",
  "Choose a pull request from the sidebar to review it.":
    "사이드바에서 리뷰할 풀 리퀘스트를 선택합니다.",

  // Thread list filters
  "Filter threads by environment": "환경별 스레드 필터",
  "Filter threads by project": "프로젝트별 스레드 필터",
  "Reset thread filters": "스레드 필터 초기화",

  // Markdown links
  "Open link": "링크 열기",
  "Copy link": "링크 복사",
  "Share link": "링크 공유",

  // Message intent badge
  "from queue": "대기열에서",
  "Queued while the agent was busy": "에이전트가 작업 중일 때 대기열에 추가됨",
  "This badge records that the message was queued. It stays visible after the message leaves the queue.":
    "이 메시지가 대기열에 있었음을 나타내는 배지입니다. 메시지가 대기열을 벗어난 뒤에도 계속 표시됩니다.",
  "This message was intended to steer the agent while its turn was still running.":
    "턴이 진행 중일 때 에이전트의 방향을 조정하려고 보낸 메시지입니다.",
  "This message was originally queued, then promoted to steer the agent while its turn was still running.":
    "처음에는 대기열에 있었다가, 턴이 진행 중일 때 에이전트의 방향을 조정하도록 승격된 메시지입니다.",
  "Message history": "메시지 기록",

  // Sheets
  "Close {name}": "{name} 닫기",

  // Sweep: queued PR messages
  "The PR worktree has local changes and could not update to the PR head. Resolve them before trying again.":
    "PR 워크트리에 로컬 변경사항이 있어 PR 헤드로 업데이트할 수 없습니다. 변경사항을 해결한 뒤 다시 시도해야 합니다.",
};
