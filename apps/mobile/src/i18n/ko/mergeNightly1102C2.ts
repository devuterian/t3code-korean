/**
 * Korean copy for the 2026-11-02 nightly merge (threads, usage, workspace, git state).
 * Registered last in `dictionary.ko.ts`, so the 해요체 rewrites below replace older
 * 합쇼체 entries that share a key.
 */
export const KO_MERGE_NIGHTLY_1102_C2: Readonly<Record<string, string>> = {
  // New strings
  "Send now, queued message {index}": "대기 중인 메시지 {index} 지금 보내기",
  "Opens queued messages to send now, edit, or remove":
    "대기 중인 메시지를 열고 지금 보내기, 편집, 제거를 할 수 있어요",
  "messages queued to send": "대기 중인 메시지 있음",
  "regenerating title": "제목 다시 만드는 중",
  "Turn into project": "프로젝트로 전환",
  "Copy thread": "스레드 복사",
  "Failed to copy thread": "스레드를 복사하지 못했어요",
  "Try copying this thread again.": "스레드 복사를 다시 시도하세요.",
  "Runs on {label}": "실행 위치: {label}",
  "Provider not allowed": "사용할 수 없는 프로바이더",
  "{message} Choose another model.": "{message} 다른 모델을 선택하세요.",
  "Earlier work": "이전 작업",
  "Link {target}": "{target} 연결",
  "an environment": "환경",
  "Failed to refresh branches.": "브랜치를 새로 고치지 못했어요.",
  "Forget {name} and its cached threads on this device.\n\n{note}":
    "이 기기에서 '{name}' 환경과 캐시된 스레드를 삭제해요.\n\n{note}",
  "It stays on your T3 Connect account and keeps its host space. Deregister it under T3 Account → T3 Connect to free it.":
    "T3 Connect 계정에는 그대로 남고 호스트 자리도 유지돼요. 자리를 비우려면 T3 계정의 T3 Connect에서 등록을 해제하세요.",
  "It's no longer on your T3 Connect account.": "이미 T3 Connect 계정에서 빠져 있어요.",
  "This doesn't change your T3 Connect account. To deregister it there, use T3 Account → T3 Connect.":
    "T3 Connect 계정에는 영향이 없어요. 계정에서 등록을 해제하려면 T3 계정의 T3 Connect를 이용하세요.",
  "Hourly cost": "시간별 비용",
  "Hourly processed tokens": "시간별 처리 토큰",
  "Daily cost": "일별 비용",
  "Daily processed tokens": "일별 처리 토큰",

  // Snooze menu labels built by the shared preset resolver
  "In {count} minutes": "{count}분 후",
  "In {count} hours": "{count}시간 후",
  "In {count} days": "{count}일 후",
  "Next {weekday}": "다음 주 {weekday}",
  "This morning": "오늘 오전",
  "This afternoon": "오늘 오후",
  Monday: "월요일",
  Tuesday: "화요일",
  Wednesday: "수요일",
  Thursday: "목요일",
  Friday: "금요일",
  Saturday: "토요일",
  Sunday: "일요일",

  // 해요체 rewrites of existing entries
  "No linked {terms}.": "연결된 {terms} 없음",
  "No messages waiting in this queue.": "대기 중인 메시지 없음",
  "Opens this message in the composer for editing": "입력창에서 이 메시지를 편집해요",
  "Opens this turn's subagents": "이 턴의 서브에이전트를 열어요",
  "You’re on the default branch. You can create a new branch when committing.":
    "기본 브랜치예요. 커밋할 때 새 브랜치를 만들 수 있어요.",
  "Leave empty to generate a message automatically.": "비워 두면 메시지를 자동으로 만들어요.",
  "No changed files to commit.": "커밋할 변경 파일 없음",
  "Could not switch machine": "머신을 전환할 수 없어요",
  "The folder for threads without a project could not be created.":
    "프로젝트 없는 스레드용 폴더를 만들 수 없어요.",
  "Collapses the snoozed threads.": "다시 알림으로 설정한 스레드를 접어요.",
  "Expands the snoozed threads.": "다시 알림으로 설정한 스레드를 펼쳐요.",
  "Collapses the settled threads.": "정리한 스레드를 접어요.",
  "Expands the settled threads.": "정리한 스레드를 펼쳐요.",
  "Could not load older threads. Retry": "이전 스레드를 불러오지 못했어요. 다시 시도",
  "Opens the draft in the new task composer. Swipe left to {action}.":
    "새 작업 입력창에서 초안을 열어요. 왼쪽으로 밀면 {action} 작업을 할 수 있어요.",
  "Sends when the environment reconnects. Opens the task for editing. Swipe left to {action}.":
    "환경이 다시 연결되면 보내요. 작업을 열어 편집할 수 있어요. 왼쪽으로 밀면 {action} 작업을 할 수 있어요.",
  "That snooze time has passed. Choose another time.":
    "이 다시 알림 시간은 이미 지났어요. 다른 시간을 선택하세요.",
  "Opens the thread": "스레드를 열어요",
  "Opens the thread. Swipe left to {action}.":
    "스레드를 열어요. 왼쪽으로 밀면 {action} 작업을 할 수 있어요.",
  "Opens the thread. Swipe left for {action} and snooze actions.":
    "스레드를 열어요. 왼쪽으로 밀면 {action}, 다시 알림 작업을 할 수 있어요.",
  "Opens this agent's thread": "이 에이전트의 스레드를 열어요",
  "Usage limit reached. Retry after {time}.":
    "사용량 한도에 도달했어요. {time} 이후에 다시 시도하세요.",
  "Usage limit reached.": "사용량 한도에 도달했어요.",
  "Long press to copy.": "길게 눌러 복사할 수 있어요.",
  "Output is no longer available.": "출력을 더 이상 사용할 수 없어요.",
  "Opens this agent's thread. Long press to copy.":
    "이 에이전트의 스레드를 열어요. 길게 눌러 복사할 수 있어요.",
  "Double tap to hide full details. Long press to copy.":
    "두 번 탭하면 전체 세부 정보를 숨겨요. 길게 눌러 복사할 수 있어요.",
  "Double tap to show full details. Long press to copy.":
    "두 번 탭하면 전체 세부 정보를 표시해요. 길게 눌러 복사할 수 있어요.",
  "Double tap to hide {count} tool call.": "두 번 탭하면 도구 호출 {count}개를 숨겨요.",
  "Double tap to hide {count} tool calls.": "두 번 탭하면 도구 호출 {count}개를 숨겨요.",
  "Double tap to show {count} tool call.": "두 번 탭하면 도구 호출 {count}개를 표시해요.",
  "Double tap to show {count} tool calls.": "두 번 탭하면 도구 호출 {count}개를 표시해요.",
  "The {singular} could not be opened.": "{singular} 열기에 실패했어요.",
  "The file could not be loaded. Reconnect and try again.":
    "파일을 불러올 수 없어요. 다시 연결한 뒤 다시 시도하세요.",
  "Paste a {singular} URL, or enter 123 / #123 for this thread's repository.":
    "{singular} URL을 붙여넣거나, 이 스레드 저장소의 번호(123 또는 #123)를 입력하세요.",
  "Use a {singular} URL, 123, or #123.": "{singular} URL, 123 또는 #123 형식으로 입력하세요.",
  "No provider on the selected environments reports subscription limits.":
    "선택한 환경에 구독 한도를 확인할 수 있는 프로바이더가 없어요.",
  "{names} could not refresh limits. Showing the last known values.":
    "{names} 한도를 새로 고치지 못했어요. 마지막으로 확인한 값을 표시해요.",
  "This account is no longer reporting limits on the selected environments.":
    "이 계정은 선택한 환경에서 더 이상 한도를 확인할 수 없어요.",
  "One login, one quota: these instances share this limit.":
    "로그인 하나에 한도 하나예요. 이 프로바이더들은 같은 한도를 함께 사용해요.",
  "No activity in this window.": "이 기간에는 활동이 없어요.",
  "{error} Showing saved totals.": "{error} 저장된 합계를 표시해요.",
  "Choose a pull request from the sidebar to review it.":
    "사이드바에서 풀 리퀘스트를 선택하면 검토할 수 있어요.",
  "This connection cannot delete pending attachments.":
    "이 연결에서는 대기 중인 첨부 파일을 삭제할 수 없어요.",
  "Unsupported image type for '{name}'.": "지원하지 않는 이미지 형식이에요: '{name}'",
  "'{name}' is no longer available. Attach the image again.":
    "이미지를 더 이상 사용할 수 없어요: '{name}'. 이미지를 다시 첨부하세요.",
  "Upload cancelled.": "업로드를 취소했어요.",
  "This connection cannot upload attachments.": "이 연결에서는 첨부 파일을 업로드할 수 없어요.",
  "Upload failed for '{name}' ({status}).": "'{name}' 업로드에 실패했어요 ({status}).",
  "The environment is not connected.": "환경이 연결되어 있지 않아요.",
  "Upload failed for '{name}'.": "'{name}' 업로드에 실패했어요.",
  "Clipboard is empty.": "클립보드가 비어 있어요.",
  "You can attach up to {max} files per message.":
    "메시지당 파일은 최대 {max}개까지 첨부할 수 있어요.",
  "Could not open the file picker.": "파일 선택기를 열 수 없어요.",
  "'{name}' exceeds the 10 MB attachment limit.": "첨부 한도(10MB)를 넘은 파일이에요: '{name}'",
  "Could not read '{name}'.": "'{name}' 파일을 읽을 수 없어요.",
  "The photo library is unavailable right now.": "지금은 사진 보관함을 사용할 수 없어요.",
  "You can attach up to {max} attachments per message.": "메시지당 첨부 파일은 최대 {max}개예요.",
  "Could not open the photo library.": "사진 보관함을 열 수 없어요.",
  "Video attachments are unavailable here.": "여기서는 동영상을 첨부할 수 없어요.",
  "Unsupported file type for '{name}'.": "지원하지 않는 파일 형식이에요: '{name}'",
  "Failed to read '{name}'.": "'{name}' 파일을 읽지 못했어요.",
  "Failed to pair with the environment.": "환경과 페어링하지 못했어요.",
  "Forget {name} and its cached threads on this device. Switch it off instead to keep it saved.":
    "이 기기에서 '{name}' 환경과 캐시된 스레드를 삭제해요. 저장해 두려면 대신 끄세요.",
  "Failed to refresh git status.": "Git 상태를 새로 고치지 못했어요.",
  "This connection cannot update the thread's branch.":
    "이 연결에서는 스레드의 브랜치를 변경할 수 없어요.",
  "Git action failed.": "Git 작업에 실패했어요.",
  "1 comment attachment was not added. Messages can contain at most {max} attachments.":
    "코멘트 첨부 파일 1개를 추가하지 못했어요. 메시지에는 첨부 파일을 최대 {max}개까지 넣을 수 있어요.",
  "{count} comment attachments were not added. Messages can contain at most {max} attachments.":
    "코멘트 첨부 파일 {count}개를 추가하지 못했어요. 메시지에는 첨부 파일을 최대 {max}개까지 넣을 수 있어요.",
  "A queued message cannot be left empty.": "대기 중인 메시지는 비워 둘 수 없어요.",
  "Your edit is still in the composer.": "편집한 내용은 입력창에 그대로 남아 있어요.",
  "It may have already started. Your edit is still in the composer.":
    "이미 시작됐을 수 있어요. 편집한 내용은 입력창에 남아 있어요.",
  "Send a message before you submit feedback.": "피드백을 보내려면 먼저 메시지를 보내야 해요.",
  "Failed to save the queued message.": "대기 중인 메시지를 저장하지 못했어요.",
};
