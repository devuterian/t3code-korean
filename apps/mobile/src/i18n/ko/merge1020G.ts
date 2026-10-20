/** Korean strings for upstream text from the 2026-10-20 nightly merge (mobile pass, group G). */
export const KO_MERGE_1020_G: Readonly<Record<string, string>> = {
  // Pull requests
  State: "상태",
  Involvement: "참여 방식",
  "Filter pull requests": "PR 필터",

  // Settings
  "Clear {size} of cached data": "캐시된 데이터 {size} 지우기",
  "Clear package search": "패키지 검색어 지우기",
  "Start from remote": "원격에서 시작",
  "Uses the latest commit of the base branch’s tracked remote branch, even if its name differs. Otherwise uses the same-named branch on origin. Uses your local branch if that remote branch is missing.":
    "기준 브랜치가 추적하는 원격 브랜치의 최신 커밋을 사용합니다. 이름이 달라도 마찬가지입니다. 추적 브랜치가 없으면 origin의 같은 이름 브랜치를 사용하고, 그 원격 브랜치도 없으면 로컬 브랜치를 사용합니다.",
  "Render math": "수식 렌더링",
  "Use environment defaults for this project": "이 프로젝트에 환경 기본값 사용",
  "Reclaim {size} GiB on {name}": "{name}에서 {size}GiB 확보",
  "Old history is cleaned up automatically, but this database still holds the freed space. Run this command on {name} to return it to disk; it pauses and restarts the background service. Quit the desktop app first if it hosts this environment.":
    "오래된 기록은 자동으로 정리되지만, 데이터베이스가 비운 공간을 아직 차지하고 있습니다. {name}에서 이 명령을 실행하면 디스크 공간을 돌려받습니다. 실행 중에 백그라운드 서비스가 잠시 멈췄다가 다시 시작됩니다. 데스크톱 앱이 이 환경을 호스팅하고 있다면 먼저 앱을 종료해야 합니다.",
  "Copy command": "명령어 복사",

  // Usage
  "Segment {index}, {name}, {percent}% left, {timeLeft}% of the window left":
    "세그먼트 {index}, {name}, {percent}% 남음, 기간 {timeLeft}% 남음",
  "This environment could not report usage.": "이 환경에서 사용량을 보고하지 못했습니다.",

  // Composer
  "Your edit is still in the composer.": "수정한 내용은 입력창에 그대로 남아 있습니다.",
  "Send Message": "메시지 보내기",
  "This connection cannot update the thread's branch.":
    "이 연결로는 스레드의 브랜치를 변경할 수 없습니다.",
  "Context import cancelled": "컨텍스트 가져오기 취소됨",
  "Reconnect to the source environment": "원본 환경에 다시 연결해야 합니다",
  "Attachment URL unavailable": "첨부 파일 URL을 사용할 수 없음",
  "Attachment import cancelled": "첨부 파일 가져오기 취소됨",
};
