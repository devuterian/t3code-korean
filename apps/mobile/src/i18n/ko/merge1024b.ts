/** Korean strings for upstream text resolved during the 2026-10-24 merge (mobile group B). */
export const KO_MERGE_1024_B: Readonly<Record<string, string>> = {
  // Thread list undo
  "Could not restore snooze": "다시 알림을 복원할 수 없음",
  "Could not undo settle": "정리 실행 취소 실패",
  "Could not undo unpin": "고정 해제 실행 취소 실패",
  "Could not undo thread action": "스레드 작업을 실행 취소할 수 없음",

  // Composer attachments
  "Could not paste images": "이미지를 붙여넣을 수 없음",

  // Project overview
  Danger: "위험",
  "Remove checkout": "체크아웃 제거",
  "Remove checkout {path}": "체크아웃 제거: {path}",
  "Remove this project everywhere": "모든 기기에서 이 프로젝트 제거",
  "Deletes the selected machine's checkout entries and their threads. Other machines and files on disk are not touched.":
    "선택한 기기의 체크아웃 항목과 스레드를 삭제합니다. 다른 기기와 디스크의 파일은 그대로 유지됩니다.",
  "Deletes all {count} checkout entries and their threads on every machine. Files on disk are not touched.":
    "모든 기기에서 체크아웃 항목 {count}개와 스레드를 삭제합니다. 디스크의 파일은 그대로 유지됩니다.",
  "Deletes the project entry and its threads. Files on disk are not touched.":
    "프로젝트 항목과 스레드를 삭제합니다. 디스크의 파일은 그대로 유지됩니다.",
  "Failed to remove “{title}”": "“{title}” 제거 실패",
  "This connection cannot change projects in {environment}.":
    "이 연결로는 {environment}의 프로젝트를 변경할 수 없습니다.",
  "This connection cannot change projects in this environment.":
    "이 연결로는 이 환경의 프로젝트를 변경할 수 없습니다.",

  // Provider accounts
  "Limited permissions": "제한된 권한",
  "This session can view {environment}'s providers but can't change their settings.":
    "이 세션은 {environment}의 제공자를 볼 수 있지만 설정을 변경할 수는 없습니다.",

  // Database storage
  "Reclaim database space": "데이터베이스 공간 확보",
  "Old history is cleaned up automatically, but these databases still hold the freed space. Run the command on each machine to return it to disk; it pauses and restarts the background service. Quit the desktop app first if it hosts the environment.":
    "오래된 기록은 자동으로 정리되지만, 확보된 공간은 아직 데이터베이스에 남아 있습니다. 각 기기에서 명령을 실행하면 디스크 공간을 돌려받을 수 있습니다. 실행 중에는 백그라운드 서비스가 잠시 멈췄다가 다시 시작됩니다. 데스크톱 앱이 이 환경을 호스팅하고 있다면 먼저 앱을 종료해야 합니다.",

  // Pull requests
  "{count} error loading pull requests": "풀 리퀘스트 로드 오류 {count}개",
  "{count} errors loading pull requests": "풀 리퀘스트 로드 오류 {count}개",
  "Show details": "세부 정보 표시",
  "Hide details": "세부 정보 숨기기",
  "Renamed from {path}": "{path}에서 이름 변경됨",
  viewed: "확인함",
  Tests: "테스트",
  Mocks: "모의 객체",
  Generated: "생성됨",
  Docs: "문서",
};
