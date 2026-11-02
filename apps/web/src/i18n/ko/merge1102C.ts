// New English keys used by chunk-6 files (via t() / translate() / SettingsRow props) that are
// NOT in apps/web/src/i18n/** yet. Proposed Korean in One UI style (해요체). Paste into a ko dictionary.
// Placeholders like {count} are filled by .replace() at the call site, keep them verbatim.

export const KO_MERGE_1102_C: Readonly<Record<string, string>> = {
  // settings / projects
  "Automatic (mixed)": "자동 (혼합)",
  "Automatic defaults differ.": "자동 기본값이 서로 달라요.",
  "Defaults differ.": "기본값이 서로 달라요.",
  "Select one environment or choose a shared model to edit effort.":
    "추론 강도를 바꾸려면 환경 하나를 선택하거나 공통 모델을 고르세요.",
  "Fallback model": "대체 모델",
  "Fallback model not saved": "대체 모델을 저장하지 못했어요",
  "Used for new threads when the default model's provider is out of usage.":
    "기본 모델의 프로바이더 사용량이 소진되면 새 스레드에 이 모델을 써요.",
  "Pin project": "프로젝트 고정",
  "Pinned projects come first in project pickers.":
    "고정한 프로젝트는 프로젝트 선택 목록 맨 위에 나와요.",
  "Hidden from project pickers. Threads and files are kept.":
    "프로젝트 선택 목록에서 숨겨요. 스레드와 파일은 그대로 남아요.",
  "Hides the project from project pickers. Threads and files are kept.":
    "프로젝트 선택 목록에서 프로젝트를 숨겨요. 스레드와 파일은 그대로 남아요.",
  "Failed to pin project": "프로젝트를 고정하지 못했어요",
  "Failed to unpin project": "프로젝트 고정을 해제하지 못했어요",
  "Failed to archive project": "프로젝트를 보관하지 못했어요",
  "Failed to unarchive project": "프로젝트 보관을 해제하지 못했어요",

  // labs
  "Boring sidebar (group by project)": "심플 사이드바 (프로젝트별 묶기)",
  "Group sidebar threads into project folders. Pinned threads stay on top, and Snoozed and Settled stay below the folders.":
    "사이드바의 스레드를 프로젝트 폴더로 묶어요. 고정한 스레드는 맨 위에, 미뤄 둔 스레드와 정리된 스레드는 폴더 아래에 둬요.",
  "Two-line folder rows": "폴더 항목 두 줄로 보기",
  "In the boring sidebar, show folder threads on two lines: the title, then the branch, pull request, and agent.":
    "심플 사이드바에서 폴더 안의 스레드를 두 줄로 보여 줘요. 첫 줄은 제목, 둘째 줄은 브랜치, 풀 리퀘스트, 에이전트예요.",
  "Linked environments": "연결된 환경",
  "Let agents here work on your other machines, and theirs here. Turn it on for each machine, then link them in {link}. While it is off, nothing new starts over a link; tasks already running finish.":
    "이 기기의 에이전트가 다른 기기에서, 다른 기기의 에이전트가 이 기기에서 작업할 수 있어요. 기기마다 켠 다음 {link}에서 연결하세요. 끄면 연결로 새 작업이 시작되지 않고, 이미 실행 중인 작업은 끝까지 진행돼요.",
  "Simlock device hosts": "Simlock 기기 호스트",
  "Simlock device hosts (alpha)": "Simlock 기기 호스트 (알파)",
  "Let the Device panel lease simulators and emulators from your own {simlock} pool, added in {devices}. An alpha that may change or break. T3 Code never installs Simlock.":
    "기기 패널에서 내 {simlock} 풀의 시뮬레이터와 에뮬레이터를 빌려 쓸 수 있어요. {devices}에서 추가해요. 알파 기능이라 바뀌거나 동작하지 않을 수 있어요. T3 Code는 Simlock을 설치하지 않아요.",

  // devices
  "Open simulators and emulators in the Device panel. Hub:":
    "기기 패널에서 시뮬레이터와 에뮬레이터를 열어요. 허브:",
  "New agent sessions can open and drive these devices. agent-device:":
    "새 에이전트 세션이 이 기기들을 열고 조작할 수 있어요. agent-device:",
  "Device sources": "기기 소스",
  "Agents can use devices": "에이전트의 기기 사용",
  "Use devices": "기기 사용",
  "Local simulators": "로컬 시뮬레이터",
  Secrets: "시크릿",
  "Secret providers": "시크릿 프로바이더",
  "Add secret provider": "시크릿 프로바이더 추가",

  // providers
  "Checking credentials and loading models…": "인증 정보를 확인하고 모델을 불러오는 중…",
  "Connect on {environment} to load models.": "모델을 불러오려면 {environment}에서 연결하세요.",
  "Checking the Antigravity runtime.": "Antigravity 런타임을 확인하는 중이에요.",
  "Enter a new value to rename a saved one or make it plain text.":
    "저장된 변수의 이름을 바꾸거나 일반 텍스트로 바꾸려면 새 값을 입력하세요.",
  "No reasoning": "추론 없음",

  // scheduled tasks
  "Run a prompt automatically on an interval, at a fixed time, once at a set date, or when a webhook is called.":
    "프롬프트를 일정 간격, 정해진 시간, 지정한 날짜에 한 번, 또는 웹훅이 호출될 때 자동으로 실행해요.",
  Once: "한 번",
  "Once, {time}": "{time}에 한 번",
  "Once is not available here": "이 환경에서는 한 번 실행을 쓸 수 없어요",
  "This environment runs an older T3 Code. Update it to schedule a one-time task, or pick another schedule.":
    "이 환경은 이전 버전의 T3 Code를 쓰고 있어요. 업데이트하면 한 번만 실행하는 작업을 예약할 수 있고, 다른 일정을 선택해도 돼요.",
  Destination: "대상",
  "Each run starts a new thread with the workspace and model below.":
    "실행할 때마다 아래 작업 공간과 모델로 새 스레드를 시작해요.",
  "Each run continues this conversation, in its workspace and with its current model.":
    "실행할 때마다 이 대화를 이어가요. 작업 공간과 모델은 지금 설정을 그대로 써요.",
  "Invalid filter": "이 필터는 사용할 수 없어요",
  "Switch this task to a time or an interval, or turn it off, to save it.":
    "저장하려면 이 작업을 시간이나 간격 방식으로 바꾸거나 꺼 두세요.",
  "Duplicate request key": "중복 요청 키",
  "Requests with the same key run only once within 7 days.":
    "같은 키의 요청은 7일 안에 한 번만 실행해요.",
  "Coalesce key": "병합 키",
  "Coalesce window": "병합 대기 시간",
  "template, optional": "템플릿, 선택",
  "seconds, 10–3600": "초, 10–3600",
  "Coalescing runs the latest payload once when the window from the first delivery closes. Empty keys run normally.":
    "첫 요청 후 대기 시간이 끝나면 가장 최근 요청 내용으로 한 번만 실행해요. 키가 비어 있으면 요청마다 실행해요.",
  "This task was deleted or belongs to a different project. Check your project filter.":
    "삭제된 작업이거나 다른 프로젝트의 작업이에요. 프로젝트 필터를 확인하세요.",

  // general / threads / appearance / about
  "Fold working and monitoring threads into a Working section. They return to the top of the inbox when they need you. The boring sidebar in Labs has no Working section.":
    "작업 중이거나 모니터링 중인 스레드를 '작업 중' 섹션으로 묶어요. 확인이 필요하면 받은 편지함 맨 위로 돌아와요. 실험실의 심플 사이드바에는 이 섹션이 없어요.",
  "Automatically resume threads when their usage limits reset. You can cancel auto-resume in each thread.":
    "사용량 한도가 초기화되면 스레드를 자동으로 이어서 실행해요. 자동 재개는 스레드마다 취소할 수 있어요.",
  "Snooze threads until their usage limits reset. Enable auto-resume to continue the agent after the reset.":
    "사용량 한도가 초기화될 때까지 스레드를 미뤄요. 자동 재개를 켜면 초기화 후 에이전트가 이어서 작업해요.",
  "Open pull requests and changes panels proactively": "풀 리퀘스트와 변경 사항 패널 자동으로 열기",
  "Effort display": "추론 강도 표시",
  "Snooze options": "미루기 옵션",
  "Wrap long lines in code blocks, diffs, and file previews by default.":
    "코드 블록, 변경 사항, 파일 미리보기의 긴 줄을 기본으로 줄 바꿈해요.",
  "Wrap code, diffs, and file previews by default":
    "코드, 변경 사항, 파일 미리보기를 기본으로 줄 바꿈",
  "Pull Request: Copy Link or Thread": "풀 리퀘스트: 링크 또는 스레드 복사",
  "Managed by {organization}.": "{organization}에서 관리해요.",
  "This environment is managed by {organization}. Some settings and features follow its policy.":
    "이 환경은 {organization}에서 관리해요. 일부 설정과 기능은 이 조직의 정책을 따라요.",
  "Get help": "도움말",
  "How we handle your data.": "데이터 처리 방식을 확인할 수 있어요.",
  "Get more tunnels": "터널 늘리기",
  "Switches this app and every connected machine whose database the target release supports.":
    "이 앱과, 대상 릴리스가 데이터베이스를 지원하는 연결된 기기 모두를 바꿔요.",
  "Nightly builds are not available.": "Nightly 빌드는 사용할 수 없어요.",
  "Nightly builds are not available; switch to Stable to keep getting updates.":
    "Nightly 빌드는 사용할 수 없어요. 계속 업데이트를 받으려면 Stable로 바꾸세요.",
  "1 machine still runs {track}.": "기기 1대가 아직 {track} 트랙이에요.",
  "{count} machines still run {track}.": "기기 {count}대가 아직 {track} 트랙이에요.",

  // sidebar
  "Go back": "뒤로",
  "Go forward": "앞으로",
  "T3 Code home": "T3 Code 홈",
  "Update release notes": "업데이트 릴리스 노트",
  today: "오늘",
  "{days}d ago": "{days}일 전",

  // update-everything dialog + logic
  "Update {count} machine?": "기기 {count}대를 업데이트할까요?",
  "Update {count} machines?": "기기 {count}대를 업데이트할까요?",
  "{count} provider update": "프로바이더 업데이트 {count}개",
  "{count} provider updates": "프로바이더 업데이트 {count}개",
  "restarts last": "마지막에 다시 시작",
  "{count} running": "{count}개 실행 중",
  "{count} skipped": "{count}개 건너뜀",
  "runs a preview build": "미리보기 빌드 사용 중",
  "switch the Mac app on that Mac": "그 Mac에서 직접 트랙을 바꾸세요",
  "run `t3 update --channel {channel} --allow-downgrade` there":
    "그 기기에서 다음 명령을 실행하세요: `t3 update --channel {channel} --allow-downgrade`",
  "its server is not connected, so its database cannot be checked":
    "서버가 연결되지 않아 데이터베이스를 확인할 수 없어요",
  "its server predates database checks; update it on {track} first":
    "서버가 데이터베이스 확인을 지원하기 전 버전이에요. 먼저 {track}에서 업데이트하세요",
  "{version} predates database checks; wait for a newer {track} release":
    "데이터베이스 확인을 지원하지 않는 버전이에요 ({version}). 더 새로운 {track} 릴리스를 기다리세요",
  "its database has changes {version} does not support yet; stay on {from} until {track} has them":
    "데이터베이스에 {version}에서 아직 지원하지 않는 변경이 있어요. {track}에 반영될 때까지 {from} 상태로 유지하세요",
};

// Already-existing keys whose English wording stays but whose call sites moved (no new entry needed):
// "retrying", "retrying in {seconds}s", "Mixed", "None", "Update", "Cancel", "Nightly", "Stable".
// "Nightly"/"Stable" are now also translate()d inside channelSwitchLabel(), so UpdateTrackSwitchDialog gets Korean for free.
