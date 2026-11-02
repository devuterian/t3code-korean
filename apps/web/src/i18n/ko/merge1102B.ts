// Dictionary additions for new upstream English strings found in chunk-5 files.
// Drop into apps/web/src/i18n/ko/ (haeyo-che). Keys are the exact English `t()` sources.
export const KO_MERGE_1102_B: Readonly<Record<string, string>> = {
  // RemoveT3ConnectEnvironmentDialog
  "It stays on your T3 Connect account and keeps its host space. Deregister it in {link} to free it.":
    "T3 Connect 계정에는 그대로 남고 호스트 공간도 계속 차지해요. 공간을 비우려면 {link}에서 등록을 해제하세요.",
  "This doesn't change your T3 Connect account. To deregister it there, use {link}.":
    "T3 Connect 계정은 그대로예요. 계정에서 등록을 해제하려면 {link}에서 해제하세요.",
  "It's no longer on your T3 Connect account.": "T3 Connect 계정에서 이미 제거된 환경이에요.",
  // V2LifecycleRow (pattern, not dictionary): /^on (.+)$/ -> `${label}에서`  [or add key per label]
  // T3ConnectUserProfilePage
  "Confirm on {link}, then select Refresh.": "{link}에서 확인한 뒤 새로고침을 선택하세요.",
  "Opening…": "여는 중…",
  "Link T3 Chat": "T3 Chat 연결",
  "Upgrade on T3 Chat": "T3 Chat에서 업그레이드",
  // DeviceSetup
  "{host} starts Android emulators in the cloud with EAS Simulator.":
    "{host}에서 EAS Simulator로 클라우드의 Android 에뮬레이터를 실행해요.",
  // DeviceControlsRail
  "Return device to the pool": "기기를 풀로 반환",
  // GuestPage
  "Could not load earlier turns. Try again.": "이전 턴을 불러올 수 없어요. 다시 시도하세요.",
  // mediaContent
  "This inline media could not be decoded.": "이 인라인 미디어를 읽을 수 없어요.",
  "The file could not be fetched. Check the connection and try again.":
    "파일을 가져올 수 없어요. 연결을 확인한 뒤 다시 시도하세요.",
  // WelcomeWizard
  "To read more about how your data is used, see our": "데이터 사용 방식은 다음을 참고하세요:",
  // + pattern: /^(.+) turned off anonymous usage data\.$/ -> `${org}에서 익명 사용 데이터를 껐어요.`
  "On the computer with your code, start T3 Code or run {command}, then run:":
    "코드가 있는 컴퓨터에서 T3 Code를 시작하거나 {command} 명령을 실행한 뒤 아래 명령을 실행하세요:",
  "On a tailnet, run {command} instead.": "tailnet을 쓴다면 {command} 명령을 대신 실행하세요.",
  // PreviewEmptyState
  "Type a URL above, or run a dev script. Local servers this thread starts will show up here automatically.":
    "위에 URL을 입력하거나 개발 스크립트를 실행하세요. 이 스레드가 시작한 로컬 서버가 여기에 자동으로 표시돼요.",
  // PullRequestGuideTab
  "Could not write a review guide": "리뷰 가이드를 만들지 못했어요",
  "Could not rewrite this guide.": "이 가이드를 다시 만들지 못했어요.",
  "Check the review guide model in Settings → Source control.":
    "설정 → 소스 제어에서 리뷰 가이드 모델을 확인하세요.",
  "Technical details": "기술 정보",
  // PullRequestReviewForm
  "The host refused the review. Your draft is still here to try again.":
    "호스트가 리뷰를 거부했어요. 작성한 초안은 그대로 있으니 다시 시도하세요.",
  // PullRequestStackMenu
  "The host refused the merge. Check that you have write access, that the checks it requires have passed, and that the branch is not conflicting.":
    "호스트가 병합을 거부했어요. 쓰기 권한과 필수 검사 통과 여부, 브랜치 충돌 여부를 확인하세요.",
  "The host refused the rebase. A rebase stops at the first commit that does not apply cleanly.":
    "호스트가 리베이스를 거부했어요. 리베이스는 깔끔하게 적용되지 않는 첫 커밋에서 멈춰요.",
  // PullRequestDetailPanel -> PullRequestDetailActions (mergeBlockedReason, wrapped with t() at display)
  "Couldn't check stack membership": "스택 소속을 확인할 수 없어요",
  "Checking stack membership…": "스택 소속 확인 중…",
  // AppearanceSettingsPanel
  "Nightly artwork": "Nightly 아트워크",
  "Dev artwork": "Dev 아트워크",
  "Only built-in themes show artwork, so this theme shows the version pill.":
    "아트워크는 기본 제공 테마에서만 표시돼요. 이 테마에서는 버전 배지가 표시돼요.",
  "Only built-in themes show artwork.": "아트워크는 기본 제공 테마에서만 표시돼요.",
  "Show Dev or Nightly artwork in the sidebar header.":
    "사이드바 헤더에 Dev 또는 Nightly 아트워크를 표시해요.",
  "Show reasoning effort in the composer as its name, such as High, or as bars.":
    "입력창에서 추론 강도를 높음 같은 이름 또는 막대로 표시해요.",
  "Effort display": "추론 강도 표시",
  Word: "이름",
  "Word (default)": "이름 (기본값)",
  Bars: "막대",
};
