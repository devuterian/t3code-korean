/** Korean strings for the cherry-picked upstream PRs after the 1027 merge: move to local checkout, next prompt suggestions, idle agent release, file explorer resize. */
export const KO_MERGE_1027_F: Readonly<Record<string, string>> = {
  // Move to the local checkout
  "Move to the local checkout": "로컬 체크아웃으로 이동",
  "Move to local checkout…": "로컬 체크아웃으로 이동…",
  "Move to local checkout (wait for the turn to end)":
    "로컬 체크아웃으로 이동 (턴이 끝날 때까지 대기)",
  "Moved to the local checkout": "로컬 체크아웃으로 이동함",
  "Couldn't move to the local checkout": "로컬 체크아웃으로 이동하지 못했습니다",
  "Workspace actions": "작업 공간 메뉴",
  "The thread continues in the project folder from its next message.":
    "다음 메시지부터 스레드가 프로젝트 폴더에서 이어집니다.",
  "Can't move yet": "아직 이동할 수 없음",
  "An earlier move didn't finish": "이전 이동이 완료되지 않음",
  "Moving now first undoes what it left behind, then moves the thread.":
    "지금 이동하면 이전 이동이 남긴 흔적을 먼저 되돌린 뒤 스레드를 이동합니다.",
  "Moving…": "이동 중…",
  "Checking what would move": "이동할 항목 확인 중",
  "Couldn't check what would move.": "이동할 항목을 확인하지 못했습니다.",
  "The thread couldn't move.": "스레드를 이동하지 못했습니다.",
  "This T3 Code server can't move threads yet. Update it, then try again.":
    "이 T3 Code 서버는 아직 스레드 이동을 지원하지 않습니다. 서버를 업데이트한 뒤 다시 시도하세요.",
  Where: "위치",
  "Comes along": "함께 이동",
  "Stays behind": "그대로 남음",
  becomes: "변경 후",
  "detached HEAD": "분리된 HEAD",
  "the current commit": "현재 커밋",
  "No uncommitted changes. Only the branch switches.":
    "커밋되지 않은 변경사항이 없습니다. 브랜치만 전환됩니다.",
  "The worktree folder keeps its own copy of these changes, on a detached HEAD. Ignored files there, like node_modules or .env, don't come along. Delete the folder once you no longer need it.":
    "워크트리 폴더에는 이 변경사항의 복사본이 분리된 HEAD 상태로 남습니다. node_modules나 .env 같은 무시된 파일은 함께 이동하지 않습니다. 더 필요하지 않으면 폴더를 삭제하세요.",
  "The worktree folder is already gone, so only the branch moves.":
    "워크트리 폴더가 이미 없어서 브랜치만 이동합니다.",
  Staged: "스테이징됨",
  Unstaged: "스테이징 안 됨",
  "Staged + unstaged": "스테이징됨 + 스테이징 안 됨",
  "{count} staged": "스테이징됨 {count}개",
  "{count} unstaged": "스테이징 안 됨 {count}개",
  "{count} new file": "새 파일 {count}개",
  "{count} new files": "새 파일 {count}개",
  "{count} commit": "커밋 {count}개",
  "{count} commits": "커밋 {count}개",
  "Same commit as {base}": "{base}와 같은 커밋",
  "{commits} ahead of {base}": "{base}보다 {commits} 앞섬",
  "{commits} behind {base}": "{base}보다 {commits} 뒤처짐",
  "{commits} ahead of {base}, {behind} behind": "{base}보다 {commits} 앞서고 {behind}개 뒤처짐",
  "and {more} more": "외 {more}개",
  "Now on {branch}.": "{branch} 브랜치로 전환했습니다.",
  "Your uncommitted changes came along.": "커밋되지 않은 변경사항도 함께 이동했습니다.",
  "The old worktree folder keeps its own copy.": "이전 워크트리 폴더에는 복사본이 남아 있습니다.",

  // File explorer
  "File explorer": "파일 탐색기",
  "Resize file explorer": "파일 탐색기 크기 조절",

  // Next prompt suggestions
  "Next prompt suggestions": "다음 프롬프트 제안",
  "Next prompt instructions": "다음 프롬프트 지침",
  "next prompt instructions": "다음 프롬프트 지침",
  "After the agent replies, suggest your next message in the empty composer. Press Tab to use it; it is never sent for you. Each suggestion is one extra request to the text generation model.":
    "에이전트가 답한 뒤 빈 입력창에 다음 메시지를 제안합니다. Tab 키로 채택할 수 있으며 자동으로 전송되지는 않습니다. 제안할 때마다 텍스트 생성 모델에 요청이 한 번 더 전송됩니다.",
  "Appended to the prompt that predicts your next message.":
    "다음 메시지를 예측하는 프롬프트 끝에 덧붙입니다.",
  "Write suggestions as short commands. Prefer asking for tests before merging.":
    "제안은 짧은 명령형으로 작성합니다. 머지하기 전에 테스트를 요청하는 쪽을 우선합니다.",

  // Idle agent release
  "Agent memory": "에이전트 메모리",
  "Release idle agents": "유휴 에이전트 해제",
  "release idle agents": "유휴 에이전트 해제",
  "Free memory used by idle agents. The conversation resumes automatically when you send another message. Active turns and background work delay release.":
    "유휴 에이전트가 쓰는 메모리를 비웁니다. 메시지를 다시 보내면 대화가 자동으로 이어집니다. 진행 중인 턴이나 백그라운드 작업이 있으면 해제가 미뤄집니다.",
  "1 minute": "1분",
  "5 minutes": "5분",
  "10 minutes": "10분",
  "30 minutes": "30분",
  "1 hour": "1시간",
};
