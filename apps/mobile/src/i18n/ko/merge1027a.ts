/** Korean strings for upstream text resolved in the 2026-10-27 merge (mobile app, first half of files). */
export const KO_MERGE_1027_A: Readonly<Record<string, string>> = {
  // Settings pages (root routes)
  Labs: "실험 기능",
  About: "정보",
  "Navigation tabs": "탐색 탭",
  General: "일반",
  Projects: "프로젝트",
  Chat: "채팅",
  // Pull request routing settings
  "Pull request routing": "풀 리퀘스트 라우팅",
  "{name} pull request routing": "{name} 풀 리퀘스트 라우팅",
  "Could not save pull request routing permission": "풀 리퀘스트 라우팅 권한을 저장할 수 없음",
  "Keep source control requests on this environment.":
    "소스 컨트롤 요청을 이 환경에서만 처리합니다.",
  "Actions may use broader source control permissions than the original environment.":
    "작업이 원래 환경보다 넓은 소스 컨트롤 권한을 사용할 수 있습니다.",
  "Choose environments you trust to share PR data and use each other's source control access. Enable both environments. This applies only to this client.":
    "PR 데이터를 공유하고 서로의 소스 컨트롤 접근 권한을 사용할 만큼 신뢰하는 환경을 선택합니다. 두 환경 모두 활성화해야 하며, 이 설정은 이 클라이언트에만 적용됩니다.",
  // Workspace, devices, command palette
  "Maximize device": "기기 화면 최대화",
  "Searching messages…": "메시지 검색 중…",
  "In messages": "메시지 내",
  "Select a setting": "설정 선택",
  "Choose a page from the sidebar.": "사이드바에서 페이지를 선택합니다.",
  "Hide thread sidebar": "스레드 사이드바 숨기기",
  "Project added": "프로젝트 추가됨",
  // Pull requests
  "Search labels…": "라벨 검색…",
  "Search authors…": "작성자 검색…",
  "Add labels": "라벨 추가",
  "Edit labels": "라벨 편집",
  "Edit title": "제목 편집",
  "Edit description": "설명 편집",
  "Loading changes": "변경사항 불러오는 중",
  "Load more": "더 불러오기",
  "Load more pull requests": "풀 리퀘스트 더 불러오기",
  // Merge request wording (GitLab) for text built from the provider's terminology
  "Open merge request": "머지 리퀘스트 열기",
  "Could not open merge request": "머지 리퀘스트를 열 수 없음",
  "Work on MR": "MR 작업하기",
  "MR agent actions": "MR 에이전트 작업",
  "Merge request {number}": "머지 리퀘스트 {number}",
  "Merge request status, {status}": "머지 리퀘스트 상태, {status}",
  "Merge request status": "머지 리퀘스트 상태",
  "Merge request": "머지 리퀘스트",
  "Merge request actions": "머지 리퀘스트 작업",
  "Couldn't load this merge request": "머지 리퀘스트를 불러올 수 없음",
  "Couldn't load this merge request.": "이 머지 리퀘스트를 불러올 수 없습니다.",
  "Requesting reviews requires write access and an open merge request.":
    "리뷰를 요청하려면 쓰기 권한과 열린 머지 리퀘스트가 필요합니다.",
  "The merge request changed. Refresh before merging.":
    "머지 리퀘스트가 변경되었습니다. 머지하기 전에 새로고침해야 합니다.",
  "Merge merge request": "머지 리퀘스트 머지",
  "Merge merge request?": "머지 리퀘스트를 머지하시겠습니까?",
  "Close merge request": "머지 리퀘스트 닫기",
  "Close merge request?": "머지 리퀘스트를 닫으시겠습니까?",
  "Reopen merge request": "머지 리퀘스트 다시 열기",
  "Reopen merge request?": "머지 리퀘스트를 다시 여시겠습니까?",
  "Create revert merge request": "되돌리기 머지 리퀘스트 만들기",
  "Stop the provider from automatically merging this merge request.":
    "프로바이더가 이 머지 리퀘스트를 자동으로 머지하지 않도록 합니다.",
  "Close this merge request without merging its changes?":
    "변경사항을 머지하지 않고 이 머지 리퀘스트를 닫으시겠습니까?",
  "Open a new merge request that reverses these changes?":
    "이 변경사항을 되돌리는 새 머지 리퀘스트를 여시겠습니까?",
  "Allow this merge request's workflows to run? Review the workflow changes first.":
    "이 머지 리퀘스트의 워크플로 실행을 허용하시겠습니까? 먼저 워크플로 변경사항을 확인해야 합니다.",
  "You can no longer submit line comments on this merge request. Your drafts are kept here.":
    "이 머지 리퀘스트에는 더 이상 줄 코멘트를 제출할 수 없습니다. 초안은 여기에 보관됩니다.",
  "Open this merge request on its provider to view the changes.":
    "변경사항을 보려면 프로바이더에서 이 머지 리퀘스트를 열어야 합니다.",
  "This merge request has been merged.": "이 머지 리퀘스트는 이미 머지되었습니다.",
  "Reopen this merge request before merging.":
    "머지하기 전에 이 머지 리퀘스트를 다시 열어야 합니다.",
  "Your account cannot merge this merge request.":
    "이 계정으로는 이 머지 리퀘스트를 머지할 수 없습니다.",
  "Explain this MR": "이 MR 설명",
  "Watch MR": "MR 지켜보기",
  "Some file contents are unavailable. Open the merge request on its provider to see the full changes.":
    "일부 파일 내용을 불러올 수 없습니다. 전체 변경사항은 프로바이더에서 머지 리퀘스트를 열어 확인해야 합니다.",
  "This merge request is no longer in the stack. Refresh it.":
    "이 머지 리퀘스트는 더 이상 스택에 없습니다. 새로고침해야 합니다.",
  "There are no open layers to merge through this merge request.":
    "이 머지 리퀘스트까지 머지할 열린 레이어가 없습니다.",
  "Couldn't update this merge request": "머지 리퀘스트를 업데이트할 수 없음",
  "Review requests aren't available for this merge request.":
    "이 머지 리퀘스트에서는 리뷰를 요청할 수 없습니다.",
  "This action isn't available for this merge request.":
    "이 머지 리퀘스트에서는 이 작업을 사용할 수 없습니다.",
  "Starting work from this MR requires source control write access.":
    "이 MR에서 작업을 시작하려면 소스 컨트롤 쓰기 권한이 필요합니다.",
};
