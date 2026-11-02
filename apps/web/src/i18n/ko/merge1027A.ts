/** Korean strings for the v0.1.3-nightly.20261027 merge: web settings components (appearance, providers, source control, storage, themes, sharing). */
export const KO_MERGE_1027_A: Readonly<Record<string, string>> = {
  "A true black dark mode, dimmer read threads, and simpler composer controls. Turn it off for the classic look.":
    "완전한 블랙 다크 모드, 더 어둡게 표시되는 읽은 스레드, 간소해진 입력창 컨트롤을 사용해요. 이전 디자인을 쓰려면 끄세요.",
  "new design": "새 디자인",
  "New design": "새 디자인",
  "Clicking a pull request link opens it in T3 Code. Turn off to open pull request links like any other link, on your git host.":
    "풀 리퀘스트 링크를 누르면 T3 Code에서 열어요. 끄면 다른 링크처럼 Git 호스트에서 열어요.",
  Browsing: "탐색",
  Recordings: "녹화",
  "Default model for new threads, selected automatically. Projects can override it.":
    "새 스레드의 기본 모델로 자동 선택돼요. 프로젝트별로 바꿀 수 있어요.",
  "Remove recognized agent credit lines from merge and squash messages on hosts that support it, keeping human co-authors. Includes auto-merge. Excludes merge queues, stack merges, and existing commits.":
    "지원하는 호스트에서 머지·스쿼시 메시지의 에이전트 크레딧 줄을 인식해 제거하고, 사람 공동 작성자는 유지해요. 자동 머지에도 적용되고, 머지 큐와 스택 머지, 기존 커밋은 제외돼요.",
  "This interval is configured here, then the shared Background activity policy decides whether provider probes may run when the timer fires. Custom intervals appear as Advanced in Maintenance settings.":
    "간격은 여기서 설정하고, 타이머가 작동할 때 프로바이더 확인을 실행할지는 공용 백그라운드 활동 정책이 정해요. 사용자 지정 간격은 유지 관리 설정에 고급으로 표시돼요.",
  "Machines you trust here can read PR data through each other's source control access. Enable both machines. Read and act may use broader permissions than the machine that owns them. This applies only to this device.":
    "여기서 신뢰한 기기끼리는 서로의 소스 제어 접근 권한으로 PR 데이터를 읽을 수 있어요. 두 기기 모두 켜야 해요. 읽기와 실행은 권한을 가진 기기보다 넓은 권한을 쓸 수 있어요. 이 설정은 이 기기에만 적용돼요.",
  "Could not save pull request routing permission": "풀 리퀘스트 공유 권한을 저장하지 못했어요",
  "pull request routing": "풀 리퀘스트 공유",
  "Sign in to make this environment available to your other devices through T3 Connect.":
    "로그인하면 T3 Connect로 이 환경을 내 다른 기기에서 쓸 수 있어요.",
  "Sign in to send activity to mobile notifications and Live Activities.":
    "로그인하면 모바일 알림과 실시간 현황으로 활동을 보낼 수 있어요.",
  "Change in Sharing & access": "공유 및 접근에서 변경",
  "Settings sections": "설정 섹션",
  Maintenance: "유지 관리",
  Labs: "실험실",
  "Sharing & access": "공유 및 접근",
  "Choose which {command} login each {provider} host uses, or turn a host off.":
    "{provider} 호스트마다 사용할 {command} 로그인을 고르거나 호스트를 끌 수 있어요.",
  "Hide {provider} accounts": "{provider} 계정 숨기기",
  "Reveal {provider} accounts": "{provider} 계정 표시",
  "Use {provider} on {host}": "{host}에서 {provider} 사용",
  "{provider} account for {host}": "{host}용 {provider} 계정",
  "Active {command} account": "활성 {command} 계정",
  "The chosen login is no longer signed in, so the active {command} login is used.":
    "선택한 로그인이 만료돼서 활성 {command} 로그인을 사용해요.",
  "{command} reports this login as invalid.":
    "{command}에서 이 로그인을 사용할 수 없다고 알려 왔어요.",
  "Source control providers": "소스 제어 프로바이더",
  "A token saved here is used before {envVar} and the {command} login, so {provider} works without the {cliLabel}. Give it {access}.":
    "여기에 저장한 토큰은 {envVar}, {command} 로그인보다 먼저 사용돼서 {cliLabel} 없이도 {provider} 연동이 돼요. 권한: {access}",
  "read and write access to pull requests and contents": "풀 리퀘스트와 콘텐츠 읽기·쓰기",
  "No token saved; the server uses {envVar} or the {command} login.":
    "저장된 토큰이 없어요. 서버가 {envVar} 또는 {command} 로그인을 사용해요.",
  "Writing & review": "작성 및 리뷰",
  "Set the prompt, code, and terminal fonts separately instead of one monospace font.":
    "입력창, 코드, 터미널 글꼴을 고정폭 글꼴 하나 대신 따로 설정해요.",
  "Resume after usage limits": "사용 한도 후 자동 재개",
  "Snooze until limits reset": "한도 초기화까지 미루기",
  Legacy: "레거시",
  Display: "표시",
  "Follow-ups": "후속 메시지",
  Diffs: "변경 사항",
  "New projects": "새 프로젝트",
  "Snooze usage-limit stops until reset. Pair with resume to continue on wake.":
    "사용 한도 때문에 멈춘 스레드를 한도가 초기화될 때까지 미뤄요. 자동 재개와 함께 쓰면 초기화 후 이어서 실행돼요.",
  "Auto-settle": "자동 정리",
  Updates: "업데이트",
  Legal: "약관",
  "More providers": "더 많은 프로바이더",
  "Separate fonts": "글꼴 분리",
  "Guest links": "게스트 링크",
  "Pull request sharing": "풀 리퀘스트 공유",
  "Thread title instructions": "스레드 제목 지침",
  "When to compact an idle Claude thread over 200,000 tokens: after you return, just before its prompt cache expires, or never. Each Claude provider can override this.":
    "200,000 토큰이 넘는 유휴 Claude 스레드를 언제 압축할지 정해요. 돌아왔을 때, 프롬프트 캐시가 만료되기 직전, 압축 안 함 중에서 고를 수 있어요. Claude 프로바이더마다 따로 지정할 수도 있어요.",
};
