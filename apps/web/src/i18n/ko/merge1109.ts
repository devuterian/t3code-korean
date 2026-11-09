// Korean copy for upstream strings wrapped after the 2026-11-09 merge.
export const KO_MERGE_1109: Readonly<Record<string, string>> = {
  // T3 Connect relay failures
  "T3 Connect timed out. Try again.": "T3 Connect 응답 시간이 초과됐어요. 다시 시도하세요.",
  "Could not reach T3 Connect. Check your network.":
    "T3 Connect에 연결할 수 없어요. 네트워크를 확인하세요.",
  "T3 Connect is unavailable. Try again.": "지금은 T3 Connect를 쓸 수 없어요. 다시 시도하세요.",
  "Disconnected here, but T3 Connect still lists it. Remove it in Account.":
    "여기서는 연결을 해제했지만 T3 Connect에는 아직 남아 있어요. 계정에서 삭제하세요.",
  "Disconnected locally, but T3 Connect did not confirm it removed this environment":
    "이 기기에서는 연결을 해제했지만 T3 Connect에서 이 환경이 삭제됐는지 확인하지 못했어요",

  // Scheduled task destination
  "New thread each run": "실행할 때마다 새 스레드",
  "Started by the first run": "첫 실행 때 시작",
  "Destination thread": "대상 스레드",
  "Search threads": "스레드 검색",
  "Search all threads...": "모든 스레드 검색...",
  "No threads found.": "스레드 없음",
  "Each run starts a fresh session in this thread, without earlier runs' context.":
    "실행할 때마다 이 스레드에서 새 세션을 시작해요. 이전 실행 내용은 이어지지 않아요.",
  "The first run starts a thread with the workspace and model below. Later runs continue that conversation.":
    "첫 실행 때 아래 작업 공간과 모델로 스레드를 시작해요. 그다음 실행부터는 그 대화를 이어가요.",
  "The first run starts a thread with the workspace and model below. Later runs post there, each in a fresh session without earlier runs' context.":
    "첫 실행 때 아래 작업 공간과 모델로 스레드를 시작해요. 그다음 실행부터는 그 스레드에 새 세션으로 올라가고, 이전 실행 내용은 이어지지 않아요.",
};
