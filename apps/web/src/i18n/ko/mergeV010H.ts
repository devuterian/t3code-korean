/** Korean strings for upstream text that arrived with the v0.1.0 merge (web, sweep). */
export const KO_MERGE_V010_H: Readonly<Record<string, string>> = {
  // Sidebar status indicators
  "1 terminal process running. Open terminal": "터미널 프로세스 1개 실행 중. 터미널 열기",
  "{count} terminal processes running. Open terminal":
    "터미널 프로세스 {count}개 실행 중. 터미널 열기",

  // Desktop update
  "Update {version} did not apply. Click to retry.":
    "{version} 업데이트가 적용되지 않았습니다. 클릭해 다시 시도합니다.",

  // Composer
  "Loading thread context…": "스레드 컨텍스트 불러오는 중…",
  "Unable to add thread": "스레드를 추가할 수 없음",
  "The attachment limit has been reached.": "첨부 파일 한도에 도달했습니다.",
  "Start a new thread to use this model.": "이 모델을 사용하려면 새 스레드를 시작해야 합니다.",
  "From queue": "대기열에서",

  // Chat header
  "Open parent thread: {title}": "상위 스레드 열기: {title}",

  // Command palette
  "Copy prompt link with repo and model": "저장소와 모델을 포함한 프롬프트 링크 복사",
  "Host for the new repository": "새 저장소의 호스트",

  // New repository publishing
  "Could not create the {host} repository": "{host} 저장소를 만들 수 없음",
  "Use Publish Repository in the Git menu to try again.":
    "Git 메뉴의 저장소 게시로 다시 시도할 수 있습니다.",
  "Published to {host}": "{host}에 게시됨",

  // Pull request stacks
  "{host} stack of {count}: merging a layer lands the ones below it.":
    "{host} 스택 {count}개: 한 단계를 머지하면 그 아래 단계도 함께 반영됩니다.",
  "{count} pull requests chained by base branch.":
    "베이스 브랜치로 연결된 풀 리퀘스트 {count}개입니다.",

  // Review guide
  "Notes on this stop": "이 단계의 메모",
  "1 note": "메모 1개",
  "{count} notes": "메모 {count}개",

  // HTML render / workflows / prompt links
  "Page unavailable": "페이지를 사용할 수 없음",
  "Could not stop workflow": "워크플로를 중지하지 못함",
  "T3 Code could not open a new thread.": "T3 Code에서 새 스레드를 열 수 없습니다.",

  // Settings
  "On demand": "필요할 때",
  "Keep threads with a PR": "PR이 있는 스레드 유지",
  "Inactivity does not settle threads with a pull request. Merge and close still do.":
    "풀 리퀘스트가 있는 스레드는 비활성 상태여도 정리하지 않습니다. 머지하거나 닫으면 정리합니다.",
  "Check installed provider CLIs for newer available versions and fetch model catalog updates. When off, new models may not appear.":
    "설치된 프로바이더 CLI의 새 버전을 확인하고 모델 카탈로그 업데이트를 가져옵니다. 끄면 새 모델이 표시되지 않을 수 있습니다.",
  "Your preferences for review guides: what to show first, dwell on, or skip. The guide's format and coverage stay the same.":
    "리뷰 가이드에 대한 선호 사항입니다. 무엇을 먼저 보여 주고, 무엇을 자세히 다루고, 무엇을 건너뛸지 정합니다. 가이드의 형식과 다루는 범위는 그대로 유지됩니다.",

  // Onboarding
  "Import your projects": "프로젝트 가져오기",
  "Import projects and conversations from Claude Code and Codex on your selected computers.":
    "선택한 컴퓨터의 Claude Code와 Codex에서 프로젝트와 대화를 가져옵니다.",

  // Source control host credentials
  "A git.cafe token, used before CAFE_TOKEN and the cafe login, so GitCafe works without the CLI signed in.":
    "CAFE_TOKEN과 cafe 로그인보다 먼저 사용하는 git.cafe 토큰입니다. CLI에 로그인하지 않아도 GitCafe를 사용할 수 있습니다.",
  "With an API token instead of an access token.": "액세스 토큰 대신 API 토큰과 함께 사용합니다.",
  "Reaches every repository your Atlassian account can. Give it read and write access to repositories and pull requests, and read:user:bitbucket.":
    "Atlassian 계정으로 접근할 수 있는 모든 저장소에 접근합니다. 저장소와 풀 리퀘스트의 읽기 및 쓰기 권한과 read:user:bitbucket 권한을 부여해야 합니다.",
};
