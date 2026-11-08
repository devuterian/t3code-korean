// Korean copy for upstream strings wrapped after the 2026-11-08 merge.
export const KO_MERGE_1108: Readonly<Record<string, string>> = {
  "Close inspector": "인스펙터 닫기",
  "Close environments": "환경 닫기",
  "Hide sidebar": "사이드바 숨기기",
  "Close thread": "스레드 닫기",
  "This folder does not exist yet. Cloning creates it.":
    "이 폴더는 아직 없어요. 클론하면 만들어져요.",
  "Settled threads": "정리된 스레드",
  "Resolve conflicts to merge": "충돌 해결 후 머지",
  "Auto-merge pending": "자동 머지 대기 중",
  "Checking stack…": "스택 확인 중…",
  "The provider has more reviewers than are listed here. Search to find them.":
    "여기 표시된 것보다 리뷰어가 더 있어요. 검색해서 찾을 수 있어요.",
  "Only listed reviewers are matched: the provider search failed.":
    "프로바이더 검색에 실패해서 목록에 있는 리뷰어만 찾았어요.",
  "More reviewers match than the provider returned. Keep typing to narrow it down.":
    "프로바이더가 돌려준 것보다 일치하는 리뷰어가 더 많아요. 계속 입력해서 좁혀 보세요.",
  "Enter a name for this account.": "계정 이름을 입력하세요.",
  "Enter the Claude config folder this account is signed in with.":
    "이 계정으로 로그인한 Claude 설정 폴더를 입력하세요.",
  "Could not save the Claude account.": "Claude 계정을 저장하지 못했어요.",
  "It leaves the model picker on {environment}. The config folder and its sign-in stay on the server.":
    "{environment}의 모델 선택기에서 빠져요. 설정 폴더와 로그인 정보는 서버에 그대로 남아요.",
  "Default config folder": "기본 설정 폴더",
  "{name} options": "{name} 옵션",
  "Add Claude account": "Claude 계정 추가",
  "Use a Claude config folder that is already signed in on this server.":
    "이 서버에서 이미 로그인된 Claude 설정 폴더를 사용해요.",
  "Point at a CLAUDE_CONFIG_DIR folder on {environment} where Claude Code is already signed in. Sign in there with the Claude CLI first.":
    "Claude Code가 이미 로그인된 {environment}의 CLAUDE_CONFIG_DIR 폴더를 지정해요. 먼저 그곳에서 Claude CLI로 로그인해야 해요.",
  "Account name": "계정 이름",
  "Name, e.g. Work": "이름 (예: 업무)",
  "Claude config folder": "Claude 설정 폴더",
  "Config folder, e.g. ~/.claude-work": "설정 폴더 (예: ~/.claude-work)",
  Add: "추가",
  "These databases still hold space freed by history cleanup. Run the command on each machine to reclaim it. It restarts the background service. Quit the desktop app first if it hosts the environment.":
    "이 데이터베이스는 기록 정리로 비운 공간을 아직 차지하고 있어요. 공간을 되찾으려면 각 기기에서 명령을 실행해야 해요. 백그라운드 서비스가 다시 시작돼요. 데스크톱 앱이 환경을 호스팅한다면 먼저 종료하세요.",
  "Remove incomplete connection": "미완료 연결 제거",
  Destination: "대상",
  "Each run starts a new thread.": "실행할 때마다 새 스레드를 시작해요.",
  "Runs continue one conversation.": "실행마다 하나의 대화를 이어가요.",
  "Runs share one thread, each in a fresh session without earlier runs' context.":
    "모든 실행이 한 스레드를 공유하지만, 각 실행은 이전 실행의 컨텍스트 없이 새 세션에서 시작해요.",
  "The first run starts the thread. Deleting it also deletes this task.":
    "첫 실행에서 스레드가 만들어져요. 스레드를 삭제하면 이 작업도 삭제돼요.",
  "Runs go to": "실행 결과 전달 위치",
  Clones: "클론",
  "Clone into host folders": "호스트 폴더에 클론",
  "Clones go to github.com/owner/repo under the Add project folder, like ghq.":
    "프로젝트 추가 폴더 아래 github.com/owner/repo 경로로 클론돼요. ghq와 같은 방식이에요.",
  "Could not save transcription choice": "받아쓰기 선택을 저장하지 못했어요",
  "Dictation on an environment is off for this session. Save again before closing the app, or your previous choice may return when it restarts.":
    "이번 세션에서는 환경에서의 받아쓰기가 꺼져 있어요. 앱을 닫기 전에 다시 저장하지 않으면 앱을 다시 켤 때 이전 선택으로 돌아갈 수 있어요.",
  "Transcription unavailable": "받아쓰기를 쓸 수 없음",
  "No transcription model installed": "설치된 받아쓰기 모델 없음",
  "Send finished recordings to this environment.": "완료된 녹음을 이 환경으로 보내요.",
  "Send microphone audio to {name}?": "{name}에 마이크 오디오를 보낼까요?",
  "Finished recordings will be sent to {destination} for transcription. You can switch back to This device at any time.":
    "완료된 녹음이 받아쓰기를 위해 {destination}에 전송돼요. 언제든 '이 기기'로 되돌릴 수 있어요.",
  "Use environment": "이 환경 사용",
  Voice: "음성",
  "Transcribe on": "받아쓰기 위치",
  "Audio stays on this device and is transcribed here.":
    "오디오는 이 기기에 남고, 여기서 받아쓰기해요.",
  "Previously selected environment": "이전에 선택한 환경",
  "No longer paired": "페어링 해제됨",
  "Allow microphone access to record and to see your microphones.":
    "녹음하고 마이크 목록을 보려면 마이크 접근을 허용해야 해요.",
  "Turn on microphone access for T3 Code in Settings to use voice input.":
    "음성 입력을 쓰려면 설정에서 T3 Code의 마이크 접근을 켜야 해요.",
  "Voice input uses the first connected microphone in this list. A wired or Bluetooth microphone is added by name the first time you dictate with it connected; until then it falls under Other. Swipe left on a named microphone to forget it.":
    "음성 입력은 이 목록에서 가장 먼저 연결된 마이크를 사용해요. 유선이나 Bluetooth 마이크는 연결한 채 처음 받아쓸 때 이름으로 추가되고, 그 전에는 기타에 속해요. 이름이 있는 마이크를 왼쪽으로 밀면 목록에서 지워져요.",
  "Android may still use a different microphone if the preferred one can’t be routed.":
    "선호하는 마이크로 연결할 수 없으면 Android가 다른 마이크를 쓸 수도 있어요.",
  "Let agents on a machine work on your other machines, and theirs on it. Turn it on for each machine. While off, nothing new starts over a link; running tasks finish.":
    "한 기기의 에이전트가 다른 기기에서 작업하고, 다른 기기의 에이전트도 이 기기에서 작업할 수 있게 해요. 기기마다 따로 켜야 해요. 꺼져 있으면 링크로 새 작업이 시작되지 않고, 실행 중인 작업은 끝까지 진행돼요.",
  "Beta: Tool calls in chat": "베타: 채팅의 도구 호출",
  "Hide the commands, edits, and searches agents run. Hide successful keeps failures. Zen shows only final answers. Approvals, questions, and errors always show.":
    "에이전트가 실행하는 명령, 수정, 검색을 숨겨요. 성공 항목 숨기기는 실패한 항목을 남기고, 최종 답변만은 최종 답변만 보여줘요. 승인, 질문, 오류는 항상 표시돼요.",
  "Hide successful": "성공 항목 숨기기",
  "Hide all": "모두 숨기기",
  Zen: "최종 답변만",
  "Fast and Ultrafast are unavailable with this ChatGPT connection. Use an existing Codex CLI login for speed options your account supports.":
    "이 ChatGPT 연결에서는 Fast와 Ultrafast를 쓸 수 없어요. 계정이 지원하는 속도 옵션을 쓰려면 기존 Codex CLI 로그인을 사용하세요.",
  "{label} reference in {source}": "{source}의 {label} 참조",
  "New session": "새 세션",
  "Copy request for admin": "관리자에게 보낼 요청 복사",
  "Could not copy the request. Try again.": "요청을 복사하지 못했어요. 다시 시도하세요.",
  "Could not open ChatGPT. Go to chatgpt.com → Settings → Usage.":
    "ChatGPT를 열지 못했어요. chatgpt.com의 설정 → 사용량으로 이동하세요.",
  "ChatGPT usage limit reached": "ChatGPT 사용 한도 도달",
  "Request copied. Send it to your workspace admin.":
    "요청을 복사했어요. 작업 공간 관리자에게 보내세요.",
  "You've reached your workspace's limit for using your ChatGPT plan in other apps. Copy a request to ask your workspace admin for increased usage limits.":
    "작업 공간에서 ChatGPT 요금제를 다른 앱에 쓸 수 있는 한도에 도달했어요. 요청을 복사해 작업 공간 관리자에게 한도 상향을 요청하세요.",
  "Review your usage settings in ChatGPT.": "ChatGPT에서 사용량 설정을 확인하세요.",
  "Usage limit reached. {reset}": "사용 한도에 도달했어요. {reset}",
  "Usage limit reached. The provider did not report a reset time. Retry manually when your limit is available.":
    "사용 한도에 도달했어요. 프로바이더가 초기화 시간을 알려주지 않았어요. 한도가 풀리면 직접 다시 시도하세요.",
};
