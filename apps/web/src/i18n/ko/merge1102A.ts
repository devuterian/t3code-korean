// Dictionary additions for chunk-4 (English source key -> Korean, One UI haeyo style).
// Entries are for apps/web/src/i18n/ko/*.ts (Record<string,string>) unless marked PATTERN.
export const KO_MERGE_1102_A: Readonly<Record<string, string>> = {
  // PATTERN: /^(.+) limits threads to (.+)\.$/ -> (org, mode) => `${org} 정책에서 스레드를 ${translate(mode)} 모드까지만 허용해요.`
  // (mode labels: Supervised, Auto-accept edits, Auto, Full access; also used by ChatComposer banner and the access radio rows)
  // PATTERN: /^([\d,]+) more files? in the full diff$/ -> (n) => `전체 변경 사항에 파일 ${n}개 더 있어요`
  "Folders can only be referenced on a server running on this computer":
    "이 컴퓨터에서 실행 중인 서버에서만 폴더를 참조할 수 있어요",
  "Searching workspace skills...": "작업 공간 스킬 검색 중...",
  "Switch to {mode}": "전환: {mode}",
  Keep: "유지",
  "Context from": "컨텍스트 출처",
  "{title} on {environment}": "{environment}의 {title}",
  "Couldn't load work. Click to retry.": "작업 내용을 불러오지 못했어요. 눌러서 다시 시도하세요.",
  "Loading work history": "작업 기록 불러오는 중",
  "1 queued message": "대기 중인 메시지 1개",
  "{count} queued messages": "대기 중인 메시지 {count}개",
  "Skip compaction and send this message": "압축을 건너뛰고 이 메시지 보내기",
  "Send into the current turn": "진행 중인 턴에 보내기",
  "Side chat waiting": "사이드 채팅 대기 중",
  "Agent not responding to Stop": "에이전트가 중지에 응답하지 않아요",
  Stopping: "중지 중",
  "Force stop": "강제 중지",
  "Force stopping...": "강제 중지 중...",
  "It may be short on memory. Force stop kills its processes.":
    "메모리가 부족할 수 있어요. 강제 중지하면 에이전트의 프로세스가 모두 종료돼요.",
  "Choose what to show": "표시할 항목 선택",
  "on {environment}": "{environment}에서",
  "Runs on {environment}. Connect to it to open the thread there.":
    "이 스레드는 {environment}에서 실행 중이에요. 연결하면 그곳에서 열 수 있어요.",
  "Open on {environment}": "{environment}에서 열기",
  "Delegated from {environment}. Connect to it to open the parent thread.":
    "{environment}에서 위임한 작업이에요. 연결하면 상위 스레드를 열 수 있어요.",
  "a linked environment": "연결된 환경",
  "Open parent agent": "상위 에이전트 열기",
  "Could not merge back": "병합하지 못했어요",
  "Could not disconnect agent session": "에이전트 세션 연결을 끊지 못했어요",
  "Side chats": "사이드 채팅",
  // PATTERN: /^Side chats · (\d+) running$/ -> (n) => `사이드 채팅 · ${n}개 실행 중`
  // PATTERN: /^Open (.+) in this chat$/ already exists; "side chat" / "context transfer" / "parent agent" / "parent thread" / "subagent" / "fork" lowercase forms must map to the existing labels.
  File: "파일",
  "Sending…": "보내는 중…",
  "Sending attachment": "첨부 파일 보내는 중",
  "Compacting for": "압축 중",
};
