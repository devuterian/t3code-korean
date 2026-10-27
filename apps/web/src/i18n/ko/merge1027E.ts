/** Korean strings for the 1027 upstream merge sweep: guest links, file viewers, boot error, and merge/change request wording. */
export const KO_MERGE_1027_E: Readonly<Record<string, string>> = {
  "Open Settings -> Source control to configure this provider.":
    "이 프로바이더를 구성하려면 설정 -> 소스 제어를 여세요.",
  "Provider status unavailable. Open Settings -> Source control and rescan.":
    "프로바이더 상태를 확인할 수 없습니다. 설정 -> 소스 제어를 열고 다시 검색하세요.",
  "Mark this merge request as ready for review": "이 머지 리퀘스트를 리뷰 준비 완료로 표시합니다",
  "Mark this change request as ready for review": "이 변경 요청을 리뷰 준비 완료로 표시합니다",
  "Merge merge request?": "머지 리퀘스트를 머지할까요?",
  "Merge change request?": "변경 요청을 머지할까요?",
  "Review change request": "변경 요청 리뷰",
  "Detached HEAD: create and check out a branch to enable push and change request actions.":
    "분리된 HEAD: 푸시와 변경 요청 작업을 사용하려면 브랜치를 만들어 체크아웃하세요.",
  "pull request reference": "풀 리퀘스트 참조",
  "pull request reference copied": "풀 리퀘스트 참조 복사됨",
  "Failed to copy pull request reference": "풀 리퀘스트 참조를 복사하지 못했습니다",
  "pull request checkout command": "풀 리퀘스트 체크아웃 명령",
  "pull request checkout command copied": "풀 리퀘스트 체크아웃 명령 복사됨",
  "Failed to copy pull request checkout command": "풀 리퀘스트 체크아웃 명령을 복사하지 못했습니다",
  "merge request reference": "머지 리퀘스트 참조",
  "merge request reference copied": "머지 리퀘스트 참조 복사됨",
  "Failed to copy merge request reference": "머지 리퀘스트 참조를 복사하지 못했습니다",
  "merge request checkout command": "머지 리퀘스트 체크아웃 명령",
  "merge request checkout command copied": "머지 리퀘스트 체크아웃 명령 복사됨",
  "Failed to copy merge request checkout command":
    "머지 리퀘스트 체크아웃 명령을 복사하지 못했습니다",
  "change request reference": "변경 요청 참조",
  "change request reference copied": "변경 요청 참조 복사됨",
  "Failed to copy change request reference": "변경 요청 참조를 복사하지 못했습니다",
  "change request checkout command": "변경 요청 체크아웃 명령",
  "change request checkout command copied": "변경 요청 체크아웃 명령 복사됨",
  "Failed to copy change request checkout command": "변경 요청 체크아웃 명령을 복사하지 못했습니다",
  "MR link copied": "MR 링크 복사됨",
  "Failed to copy MR link": "MR 링크를 복사하지 못했습니다",
  "MR number copied": "MR 번호 복사됨",
  "Failed to copy MR number": "MR 번호를 복사하지 못했습니다",
  "change request link copied": "변경 요청 링크 복사됨",
  "Failed to copy change request link": "변경 요청 링크를 복사하지 못했습니다",
  "change request number copied": "변경 요청 번호 복사됨",
  "Failed to copy change request number": "변경 요청 번호를 복사하지 못했습니다",
  "pull request link": "풀 리퀘스트 링크",
  "merge request link": "머지 리퀘스트 링크",
  "Guest Request": "게스트 요청",
  "Could not create a guest link.": "게스트 링크를 만들 수 없습니다.",
  "The guest sees the thread as you do, including command output and the agent's reasoning. Each message they send waits for you.":
    "게스트는 명령 출력과 에이전트의 추론을 포함해 스레드를 소유자와 똑같이 봅니다. 게스트가 보낸 메시지는 소유자가 승인할 때까지 대기합니다.",
  "Guest link": "게스트 링크",
  "A new link ends the current one.": "새 링크를 만들면 현재 링크는 종료됩니다.",
  "The link works once and expires in 24 hours.":
    "링크는 한 번만 사용할 수 있으며 24시간 뒤에 만료됩니다.",
  "Creating...": "생성 중...",
  "Stop sharing": "공유 중지",
  "Guest link expired": "게스트 링크 만료됨",
  "Guest link active": "게스트 링크 사용 중",
  "{name} is a guest": "게스트: {name}",
  Guest: "게스트",
  guest: "게스트",
  "{count} guest message waiting": "대기 중인 게스트 메시지 {count}개",
  "{count} guest messages waiting": "대기 중인 게스트 메시지 {count}개",
  "Dismiss message from {name}": "{name}의 메시지 무시",
  "Send message from {name}": "{name}의 메시지 보내기",
  "Something went wrong. Try again.": "문제가 발생했습니다. 다시 시도하세요.",
  "Could not reach the server.": "서버에 연결할 수 없습니다. 네트워크를 확인한 뒤 다시 시도하세요.",
  "Waiting for approval": "승인 대기 중",
  "Not sent": "보내지 않음",
  "This link has ended or is not valid": "종료되었거나 올바르지 않은 링크입니다",
  "Ask the owner for a new link. Each link works in one browser.":
    "소유자에게 새 링크를 요청하세요. 링크 하나는 브라우저 하나에서만 사용할 수 있습니다.",
  "This link has ended": "종료된 링크입니다",
  "The owner stopped sharing this thread.": "소유자가 이 스레드 공유를 중지했습니다.",
  "Join a shared thread": "공유된 스레드 참여",
  "Your name": "이름",
  Join: "참여",
  "The owner sees your name and approves each message before the agent gets it.":
    "소유자에게 이름이 표시되며, 에이전트에 전달되기 전에 소유자가 메시지를 하나씩 승인합니다.",
  "Attached files": "첨부 파일",
  "Files to attach": "첨부할 파일",
  "The owner approves each message": "소유자가 메시지를 하나씩 승인합니다",
  "Attached files can total up to 10 MB per message.":
    "메시지 하나에 첨부할 수 있는 파일은 모두 합쳐 10 MB까지입니다.",
  "This file cannot be attached. Images must be PNG, JPEG, GIF, or WebP.":
    "이 파일은 첨부할 수 없습니다. 이미지는 PNG, JPEG, GIF, WebP만 지원합니다.",
  "Could not load this item.": "이 항목을 불러올 수 없습니다.",
  Beta: "베타",
  "Share a thread with a guest who watches it live in their browser and sends messages you approve. Sign in to T3 Connect to use guest links.":
    "게스트가 브라우저에서 스레드를 실시간으로 보고, 소유자가 승인한 메시지만 보낼 수 있도록 스레드를 공유합니다. 게스트 링크를 사용하려면 T3 Connect에 로그인하세요.",
  "Share a thread with a guest who watches it live in their browser and sends messages you approve. Needs T3 Connect: sign in and link this machine in {link}. While it is off, every guest link stops working.":
    "게스트가 브라우저에서 스레드를 실시간으로 보고, 소유자가 승인한 메시지만 보낼 수 있도록 스레드를 공유합니다. T3 Connect가 필요하며, {link}에서 로그인하고 이 기기를 연결하세요. 끄면 모든 게스트 링크가 작동하지 않습니다.",
  "Could not load the cited response": "인용한 응답을 불러올 수 없습니다",
  "Load earlier turns, then click the citation to try again. Your saved quote is unchanged.":
    "이전 턴을 불러온 뒤 인용을 다시 클릭하세요. 저장된 인용문은 그대로 유지됩니다.",
  "The cited response is unavailable": "인용한 응답을 사용할 수 없습니다",
  "It may have been removed. The selected text is still saved in your citation.":
    "응답이 삭제되었을 수 있습니다. 선택한 텍스트는 인용에 그대로 저장되어 있습니다.",
  "The citation does not refer to an assistant response":
    "이 인용은 에이전트 응답을 가리키지 않습니다",
  "The selected text is still saved in your citation.":
    "선택한 텍스트는 인용에 그대로 저장되어 있습니다.",
  "Could not load history.": "기록을 불러올 수 없습니다.",
  "Show title details": "제목 자세히 보기",
  "Context compaction": "컨텍스트 압축",
  "No favorites yet": "즐겨찾기 없음",
  "Model picker is disabled": "모델 선택기를 사용할 수 없습니다",
  "Skill {label}": "스킬 {label}",
  "Needs approval": "승인 필요",
  "Needs your input": "입력 필요",
  "The environment it came from is not reachable right now.":
    "원본 환경에 지금 연결할 수 없습니다.",
  "Send approval feedback without attachments or added context.":
    "첨부 파일이나 추가 컨텍스트 없이 승인 피드백을 보내세요.",
  "Send again when it's ready.": "준비되면 다시 보내세요.",
  "The t3 command is unavailable.": "t3 명령을 사용할 수 없습니다.",
  "Failed to load the t3 command state.": "t3 명령 상태를 불러오지 못했습니다.",
  "Advanced in Maintenance settings.": "유지 관리 설정의 고급 항목에 표시됩니다.",
  "Queue follow-ups while the agent runs or steer the current run.":
    "에이전트가 실행 중일 때 후속 메시지를 대기열에 넣거나 현재 실행의 방향을 바꿉니다.",
  "Diffs & pull requests": "Diff 및 풀 리퀘스트",
  Creation: "생성",
  Branches: "브랜치",
  "new worktrees start from remote": "새 워크트리를 원격에서 시작",
  "We do not recommend managing multiple {provider} accounts in T3 Code.":
    "T3 Code에서 {provider} 계정을 여러 개 관리하는 것은 권장하지 않습니다.",
  "Close (Esc)": "닫기 (Esc)",
  "Copy was blocked. The text is selected so you can copy it manually.":
    "복사가 차단되었습니다. 텍스트를 선택해 두었으니 직접 복사하세요.",
  "The update download failed. Try Download update again.":
    "업데이트 다운로드에 실패했습니다. 업데이트 다운로드를 다시 시도하세요.",
  "The update install failed. Try Restart to update again.":
    "업데이트 설치에 실패했습니다. 업데이트를 위해 다시 시작을 다시 시도하세요.",
  "Press ⌘C to copy": "⌘C를 눌러 복사",
  "Press Ctrl+C to copy": "Ctrl+C를 눌러 복사",
  "T3 Code failed to start": "T3 Code를 시작하지 못했습니다",
  "This browser appears to be offline. Check the connection, then reload.":
    "이 브라우저가 오프라인 상태인 것 같습니다. 연결을 확인한 뒤 새로고침하세요.",
  "We are not sure why. Try a reload first.": "원인을 알 수 없습니다. 먼저 새로고침을 시도하세요.",
  "Copied to clipboard.": "클립보드에 복사했습니다.",
  "Copy error details": "오류 세부 정보 복사",
  "More options if it keeps failing": "계속 실패할 때의 추가 방법",
  "Download and reinstall the latest nightly build": "최신 나이틀리 빌드를 다운로드해 다시 설치",
  "Download and reinstall T3 Code": "T3 Code를 다운로드해 다시 설치",
  "Run this on the computer that runs T3 Code. Your agent can check the local logs and help you file a bug report.":
    "T3 Code가 실행되는 컴퓨터에서 이 명령을 실행하세요. 에이전트가 로컬 로그를 확인하고 버그 리포트 작성을 도와줍니다.",
  "Details may include local file paths and names. Check before sharing.":
    "세부 정보에 로컬 파일 경로와 이름이 포함될 수 있습니다. 공유하기 전에 확인하세요.",
  "File a bug report on GitHub": "GitHub에서 버그 리포트 작성",
  "Download update": "업데이트 다운로드",
  "Could not copy file": "파일을 복사할 수 없습니다",
  "Wait for the file to finish loading before copying.": "파일을 모두 불러온 뒤에 복사하세요.",
  "Audio unavailable. Open the file or retry playback.":
    "오디오를 사용할 수 없습니다. 파일을 열거나 다시 재생하세요.",
  "Audio unavailable.": "오디오를 사용할 수 없습니다.",
  Pause: "일시정지",
  "Only UTF-8 text and images can be opened inside an archive.":
    "압축 파일 안에서는 UTF-8 텍스트와 이미지만 열 수 있습니다.",
  "Preview limited to the first 1 MB.": "미리보기는 처음 1 MB까지만 표시합니다.",
  "This file took too long to preview. Close it and try again.":
    "파일 미리보기가 너무 오래 걸립니다. 파일을 닫고 다시 시도하세요.",
  "Could not load the file viewer. Close it and try again.":
    "파일 뷰어를 불러올 수 없습니다. 파일을 닫고 다시 시도하세요.",
  "Could not read this file.": "이 파일을 읽을 수 없습니다.",
  "Parent folder": "상위 폴더",
  "Back to archive": "압축 파일로 돌아가기",
  "Archive contents": "압축 파일 내용",
  "{count} entries": "항목 {count}개",
  Table: "테이블",
  "{count} rows": "행 {count}개",
  "{count} columns": "열 {count}개",
  "{count} lines": "줄 {count}개",
  "{count} cells": "셀 {count}개",
  "0 rows": "행 0개",
  "0 bytes": "0바이트",
  "{from}–{to} of {total}": "{total}개 중 {from}–{to}",
  "Previous rows": "이전 행",
  "Next rows": "다음 행",
  "Read-only. Up to 50 columns and 1,024 characters per cell. Blob contents are omitted.":
    "읽기 전용입니다. 열은 50개, 셀당 1,024자까지 표시하며 Blob 내용은 생략합니다.",
  "Archive entries": "압축 파일 항목",
  Size: "크기",
  Modified: "수정한 날짜",
  "This table is empty.": "이 테이블은 비어 있습니다.",
  "This database has no readable tables.": "이 데이터베이스에는 읽을 수 있는 테이블이 없습니다.",
  "Decrease reading size": "글자 크기 줄이기",
  "Increase reading size": "글자 크기 키우기",
  "Reset reading size": "글자 크기 초기화",
  "Save it to open in another app.": "저장한 뒤 다른 앱에서 여세요.",
  "Save it or open it in another app.": "저장하거나 다른 앱에서 여세요.",
  "Font preview": "글꼴 미리보기",
  "Loading the rest of the file…": "파일의 나머지를 불러오는 중…",
  "Showing the first 1,024 columns. Source and Save retain every column.":
    "처음 1,024개 열만 표시합니다. 원본 보기와 저장에는 모든 열이 유지됩니다.",
  "Indexing…": "색인 생성 중…",
  "This file is empty.": "이 파일은 비어 있습니다.",
  "This diagram contains resource URLs, markup, node metadata, or custom configuration. Show Mermaid source to inspect it safely.":
    "이 다이어그램에 리소스 URL, 마크업, 노드 메타데이터 또는 사용자 설정이 포함되어 있습니다. 안전하게 확인하려면 Mermaid 소스를 표시하세요.",
  "Saved outputs only. Code is never executed.":
    "저장된 출력만 표시합니다. 코드는 실행되지 않습니다.",
  "Cell {number}": "셀 {number}",
  "Cell {number} HTML output": "셀 {number} HTML 출력",
  "Cell {number} output": "셀 {number} 출력",
  Markdown: "Markdown",
  Raw: "원본",
  "This notebook is empty.": "이 노트북은 비어 있습니다.",
  "Show more cells ({count} remaining)": "셀 더 보기 ({count}개 남음)",
  "Fit to width": "너비에 맞춤",
  "Chapter {page} of {count}": "{count}개 중 {page}번째 챕터",
  "Slide {page} of {count}": "슬라이드 {page}/{count}",
  "Page {page} of {count}": "{page}/{count}페이지",
  "Sheet {page} of {count}": "시트 {page}/{count}",
  Sheet: "시트",
  Chapter: "챕터",
  "Previous sheet": "이전 시트",
  "Next sheet": "다음 시트",
  "Previous chapter": "이전 챕터",
  "Next chapter": "다음 챕터",
  "Previous slide": "이전 슬라이드",
  "Next slide": "다음 슬라이드",
  "Previous page": "이전 페이지",
  "Next page": "다음 페이지",
  "{count} sheet": "시트 {count}개",
  "{count} sheets": "시트 {count}개",
  "{count} chapter": "챕터 {count}개",
  "{count} chapters": "챕터 {count}개",
  "{count} slide": "슬라이드 {count}개",
  "{count} slides": "슬라이드 {count}개",
  "{count} page": "페이지 {count}개",
  "{count} pages": "페이지 {count}개",
  "Page {number}": "{number}페이지",
  "Slide {number}": "슬라이드 {number}",
  "Text and images. Layout and embedded objects may differ from the original.":
    "텍스트와 이미지만 표시합니다. 레이아웃과 포함된 개체는 원본과 다를 수 있습니다.",
  "Cell values only. Charts, images, and formatting are not shown.":
    "셀 값만 표시합니다. 차트, 이미지, 서식은 표시되지 않습니다.",
  "Limited to 500 rows and 50 columns.": "행 500개, 열 50개까지만 표시합니다.",
  "Preview limited to 250,000 rows, 1,024 columns, and bounded cell text.":
    "미리보기는 행 250,000개, 열 1,024개, 셀 텍스트 길이 제한까지만 표시합니다.",
  "This sheet is empty.": "이 시트는 비어 있습니다.",
  "Preview limited. Save it or open it in another app to read the full document.":
    "미리보기가 제한되어 있습니다. 전체 문서를 보려면 저장하거나 다른 앱에서 여세요.",
  "Loading image…": "이미지 불러오는 중…",
  "Fit image": "이미지 맞춤",
  "Actual image size": "실제 크기",
  "Fit width": "너비에 맞춤",
  "Find in PDF": "PDF에서 찾기",
  "Next matching page": "다음 일치 페이지",
  "{current} / {total} pages": "{current} / {total}페이지",
  "Hidden slide": "숨겨진 슬라이드",
  "Speaker notes": "발표자 노트",
  "This slide could not be drawn.": "이 슬라이드를 그릴 수 없습니다.",
  Sheets: "시트 목록",
  "This PDF page could not render.": "이 PDF 페이지를 렌더링할 수 없습니다.",
  "This PDF took too long to load. Try again.":
    "PDF를 불러오는 데 너무 오래 걸립니다. 다시 시도하세요.",
  "Preview limited to 2,000 pages. Save this PDF to read it in full.":
    "미리보기는 2,000페이지까지만 지원합니다. 전체를 보려면 PDF를 저장하세요.",
  "Unable to open PDF.": "PDF를 열 수 없습니다.",
  "This PDF has too much text to search. Save it to search in another app.":
    "이 PDF는 텍스트가 너무 많아 검색할 수 없습니다. 저장한 뒤 다른 앱에서 검색하세요.",
  "Could not search this PDF.": "이 PDF를 검색할 수 없습니다.",
  "The font could not be loaded.": "글꼴을 불러올 수 없습니다.",
  "Font previews are limited to 10 MB.": "글꼴 미리보기는 10 MB까지만 지원합니다.",
  "The font is unavailable.": "글꼴을 사용할 수 없습니다.",
  "The font could not be decoded.": "글꼴을 해석할 수 없습니다.",
  "The font took too long to load.": "글꼴을 불러오는 데 너무 오래 걸립니다.",
  "The font is damaged or unsupported.": "글꼴이 손상되었거나 지원하지 않는 형식입니다.",
  "The text viewer stopped.": "텍스트 뷰어가 중단되었습니다.",
  "Could not load the text viewer. Close the file and try again.":
    "텍스트 뷰어를 불러올 수 없습니다. 파일을 닫고 다시 시도하세요.",
  "The file is unavailable.": "파일을 사용할 수 없습니다.",
  "Another copy is in progress.": "다른 복사가 진행 중입니다.",
  "The file could not be loaded. Close it and try again.":
    "파일을 불러올 수 없습니다. 파일을 닫고 다시 시도하세요.",
  "Preview limited to files under 50 MB.": "미리보기는 50 MB 미만의 파일만 지원합니다.",
  "This document took too long to preview. Open it in another app.":
    "문서 미리보기가 너무 오래 걸립니다. 다른 앱에서 여세요.",
  "Could not load the Office viewer. Close the file and try again.":
    "Office 뷰어를 불러올 수 없습니다. 파일을 닫고 다시 시도하세요.",
  "Could not load the Office viewer.": "Office 뷰어를 불러올 수 없습니다.",
  "Could not read the Office viewer response.": "Office 뷰어의 응답을 읽을 수 없습니다.",
  "Could not render this Office document.": "이 Office 문서를 렌더링할 수 없습니다.",
  "This browser cannot draw slides.": "이 브라우저에서는 슬라이드를 그릴 수 없습니다.",
  "Preview limited to presentations with 1 to 500 slides.":
    "미리보기는 슬라이드가 1개에서 500개인 프레젠테이션만 지원합니다.",
  "Preview limited to 1,000 pages.": "미리보기는 1,000페이지까지만 지원합니다.",
  "This workbook has no visible sheets.": "이 통합 문서에는 표시할 수 있는 시트가 없습니다.",
  "This sheet could not be opened.": "이 시트를 열 수 없습니다.",
  "These cells could not be drawn. Try scrolling to another area.":
    "이 셀을 그릴 수 없습니다. 다른 영역으로 스크롤해 보세요.",
  "These cells could not be drawn.": "이 셀을 그릴 수 없습니다.",
  "Select fewer than 200,000 cells to copy.": "복사하려면 셀을 200,000개 미만으로 선택하세요.",
  "No cells": "셀 없음",
  "The selected cells could not be copied.": "선택한 셀을 복사할 수 없습니다.",
  "Could not parse this file.": "이 파일을 해석할 수 없습니다.",
  "This sheet is unavailable.": "이 시트를 사용할 수 없습니다.",
  "Could not preview this file.": "이 파일을 미리 볼 수 없습니다.",
  "The Office engine stopped": "Office 엔진이 중단되었습니다",
  "The Office engine sent an unreadable reply": "Office 엔진이 읽을 수 없는 응답을 보냈습니다",
  "The Office engine was closed": "Office 엔진이 종료되었습니다",
  "The call was aborted": "호출이 중단되었습니다",
  "Replaced by a newer call": "더 새로운 호출로 대체되었습니다",
  "The document's fonts could not be prepared": "문서의 글꼴을 준비할 수 없습니다",
  "The document produced no pages": "문서에서 페이지가 만들어지지 않았습니다",
  "This browser has no fonts in workers": "이 브라우저는 워커에서 글꼴을 지원하지 않습니다",
  "This embedded image exceeds the preview pixel limit.":
    "포함된 이미지가 미리보기 픽셀 제한을 초과합니다.",
  "The expanded archive exceeds the preview size or compression ratio limit.":
    "압축을 풀면 미리보기 크기 또는 압축률 제한을 초과합니다.",
  "This TAR uses an unsupported numeric format.": "이 TAR은 지원하지 않는 숫자 형식을 사용합니다.",
  "This archive contains more than 2,048 entries.":
    "이 압축 파일에는 항목이 2,048개를 넘게 들어 있습니다.",
  "The TAR header is damaged.": "TAR 헤더가 손상되었습니다.",
  "An archive entry is too large or damaged.": "압축 파일 항목이 너무 크거나 손상되었습니다.",
  "Archive metadata is too large.": "압축 파일 메타데이터가 너무 큽니다.",
  "The TAR metadata is damaged.": "TAR 메타데이터가 손상되었습니다.",
  "This archive has no readable entries.": "이 압축 파일에는 읽을 수 있는 항목이 없습니다.",
  "This archive entry is unavailable.": "이 압축 파일 항목을 사용할 수 없습니다.",
  "Entry previews are limited to 10 MB.": "항목 미리보기는 10 MB까지만 지원합니다.",
  "This table is unavailable.": "이 테이블을 사용할 수 없습니다.",
  "Database previews are limited to 100 tables.":
    "데이터베이스 미리보기는 테이블 100개까지만 지원합니다.",
  "An archive path is too long to preview.": "압축 파일 경로가 너무 길어 미리 볼 수 없습니다.",
  "This is not a readable ZIP archive.": "읽을 수 있는 ZIP 압축 파일이 아닙니다.",
  "Unsupported ZIP64 directory.": "지원하지 않는 ZIP64 디렉터리입니다.",
  "This ZIP64 directory is too large or damaged.": "ZIP64 디렉터리가 너무 크거나 손상되었습니다.",
  "This ZIP directory is damaged.": "ZIP 디렉터리가 손상되었습니다.",
  "Image decoding cancelled.": "이미지 디코딩이 취소되었습니다.",
  "This image took too long to decode.": "이미지를 디코딩하는 데 너무 오래 걸립니다.",
  "Could not load the image decoder.": "이미지 디코더를 불러올 수 없습니다.",
  "Could not decode this image.": "이 이미지를 디코딩할 수 없습니다.",
  "Image decoding is unavailable.": "이미지 디코딩을 사용할 수 없습니다.",
  "Invalid TIFF metadata.": "TIFF 메타데이터가 올바르지 않습니다.",
  "This TIFF has too much or truncated metadata.": "TIFF 메타데이터가 너무 많거나 잘렸습니다.",
  "Unsupported TIFF metadata type.": "지원하지 않는 TIFF 메타데이터 형식입니다.",
  "Invalid TIFF metadata pointer.": "TIFF 메타데이터 포인터가 올바르지 않습니다.",
  "Image previews are limited to 32 megapixels and 16,384 pixels per side.":
    "이미지 미리보기는 32메가픽셀, 한 변 16,384픽셀까지만 지원합니다.",
  "This image has too much metadata.": "이미지 메타데이터가 너무 많습니다.",
  "Invalid HEIF metadata.": "HEIF 메타데이터가 올바르지 않습니다.",
  "Invalid HEIF dimensions.": "HEIF 크기 정보가 올바르지 않습니다.",
  "This HEIF image has no readable dimensions.":
    "이 HEIF 이미지에는 읽을 수 있는 크기 정보가 없습니다.",
  "Invalid or oversized TIFF strip.": "TIFF 스트립이 올바르지 않거나 너무 큽니다.",
  "Invalid TIFF LZW dictionary.": "TIFF LZW 사전이 올바르지 않습니다.",
  "Truncated TIFF strip.": "TIFF 스트립이 잘렸습니다.",
  "Unsupported TIFF strip layout.": "지원하지 않는 TIFF 스트립 배치입니다.",
  "Invalid TIFF strip.": "TIFF 스트립이 올바르지 않습니다.",
  "Oversized TIFF strip.": "TIFF 스트립이 너무 큽니다.",
  "This TIFF compression is not supported.": "이 TIFF 압축 방식은 지원하지 않습니다.",
  "This TIFF has too much image data.": "TIFF 이미지 데이터가 너무 많습니다.",
  "This TIFF has no readable image.": "이 TIFF에는 읽을 수 있는 이미지가 없습니다.",
  "This TIFF orientation is not supported.": "이 TIFF 방향 정보는 지원하지 않습니다.",
  "This TIFF color format is not supported.": "이 TIFF 색상 형식은 지원하지 않습니다.",
  "Text previews support files up to 256 MB.": "텍스트 미리보기는 256 MB까지의 파일만 지원합니다.",
  "This file contains binary data.": "이 파일에는 바이너리 데이터가 들어 있습니다.",
  "A line or record exceeds the 1 MB preview limit.":
    "줄 또는 레코드가 미리보기 제한인 1 MB를 넘습니다.",
  "Text previews support up to 5 million rows.": "텍스트 미리보기는 행 500만 개까지 지원합니다.",
  "The file download was incomplete. Close it and try again.":
    "파일 다운로드가 완료되지 않았습니다. 파일을 닫고 다시 시도하세요.",
  "This document contains invalid or unsupported XML.":
    "이 문서에 올바르지 않거나 지원하지 않는 XML이 있습니다.",
  "This document is nested too deeply to preview.": "문서 구조가 너무 깊어 미리 볼 수 없습니다.",
  "This document has too much content to preview.": "문서 내용이 너무 많아 미리 볼 수 없습니다.",
  "The rendered document is too large to preview.":
    "렌더링된 문서가 너무 커서 미리 볼 수 없습니다.",
  "This spreadsheet contains invalid repeated cells.":
    "이 스프레드시트에 올바르지 않은 반복 셀이 있습니다.",
  "This OpenDocument file has no readable content.":
    "이 OpenDocument 파일에는 읽을 수 있는 내용이 없습니다.",
  "This workbook has no sheets or too many sheets to preview.":
    "이 통합 문서에 시트가 없거나 너무 많아 미리 볼 수 없습니다.",
  "A spreadsheet cell is too large to preview.": "셀 하나가 너무 커서 미리 볼 수 없습니다.",
  "This spreadsheet has too much text to preview.":
    "스프레드시트의 텍스트가 너무 많아 미리 볼 수 없습니다.",
  "This document has no pages or too many pages to preview.":
    "문서에 페이지가 없거나 너무 많아 미리 볼 수 없습니다.",
  "This EPUB has no readable package.": "이 EPUB에는 읽을 수 있는 패키지가 없습니다.",
  "This EPUB has no chapters or too many chapters to preview.":
    "이 EPUB에 챕터가 없거나 너무 많아 미리 볼 수 없습니다.",
  "This EPUB has no readable XHTML chapters.": "이 EPUB에는 읽을 수 있는 XHTML 챕터가 없습니다.",
  "A notebook cell is too large to preview.": "노트북 셀 하나가 너무 커서 미리 볼 수 없습니다.",
  "Notebook preview limited to files under 8 MB.":
    "노트북 미리보기는 8 MB 미만의 파일만 지원합니다.",
  "A notebook cell has too many outputs to preview.":
    "노트북 셀의 출력이 너무 많아 미리 볼 수 없습니다.",
  "Rich text preview limited to files under 8 MB.":
    "서식 있는 텍스트 미리보기는 8 MB 미만의 파일만 지원합니다.",
  "This is not a valid rich text document.": "올바른 서식 있는 텍스트 문서가 아닙니다.",
  "Rich text preview limited to 500 pages.":
    "서식 있는 텍스트 미리보기는 500페이지까지만 지원합니다.",
  "This rich text document has too much content to preview.":
    "서식 있는 텍스트 문서의 내용이 너무 많아 미리 볼 수 없습니다.",
  "This rich text document is nested too deeply.": "서식 있는 텍스트 문서 구조가 너무 깊습니다.",
  "This rich text document is damaged.": "서식 있는 텍스트 문서가 손상되었습니다.",
  "Invalid rich text byte escape.": "서식 있는 텍스트의 바이트 이스케이프가 올바르지 않습니다.",
  "Invalid rich text binary data.": "서식 있는 텍스트의 바이너리 데이터가 올바르지 않습니다.",
  "This rich text code page is not supported.":
    "이 서식 있는 텍스트의 코드 페이지는 지원하지 않습니다.",
  "This document contains unsupported XML declarations.":
    "이 문서에 지원하지 않는 XML 선언이 있습니다.",
  "This Word document has excessive XML nesting.": "이 Word 문서의 XML 중첩이 너무 깊습니다.",
  "This Word document has too much section markup.": "이 Word 문서의 섹션 마크업이 너무 많습니다.",
  "This Word document has no readable body.": "이 Word 문서에는 읽을 수 있는 본문이 없습니다.",
  "This workbook contains invalid cell coordinates.":
    "이 통합 문서에 올바르지 않은 셀 좌표가 있습니다.",
  "This workbook contains invalid worksheet dimensions.":
    "이 통합 문서에 올바르지 않은 워크시트 크기가 있습니다.",
  "This workbook contains excessive XML nesting.": "이 통합 문서의 XML 중첩이 너무 깊습니다.",
  "This workbook contains invalid worksheet structure.":
    "이 통합 문서에 올바르지 않은 워크시트 구조가 있습니다.",
  "This workbook contains invalid row coordinates.":
    "이 통합 문서에 올바르지 않은 행 좌표가 있습니다.",
  "This workbook exceeds the preview limit: 250,000 rows.":
    "이 통합 문서는 미리보기 제한인 행 250,000개를 넘습니다.",
  "This workbook contains inconsistent cell rows.": "이 통합 문서의 셀 행이 일관되지 않습니다.",
  "This workbook exceeds the preview limit: 2 million cells or 8 million grid positions.":
    "이 통합 문서는 미리보기 제한인 셀 200만 개 또는 격자 위치 800만 개를 넘습니다.",
  "This workbook contains invalid cell metadata.":
    "이 통합 문서에 올바르지 않은 셀 메타데이터가 있습니다.",
  "This workbook has no worksheet data.": "이 통합 문서에는 워크시트 데이터가 없습니다.",
  "This workbook has invalid or too many sheets.":
    "이 통합 문서의 시트가 올바르지 않거나 너무 많습니다.",
  "This workbook has a missing worksheet.": "이 통합 문서에 없는 워크시트가 있습니다.",
  "This file is damaged, encrypted, or not a valid Office document.":
    "이 파일이 손상되었거나 암호화되었거나 올바른 Office 문서가 아닙니다.",
  "This file contains too many archive entries to preview.":
    "이 파일에는 미리 볼 수 없을 만큼 많은 압축 항목이 있습니다.",
  "The expanded document is too large to preview safely.":
    "압축을 푼 문서가 너무 커서 안전하게 미리 볼 수 없습니다.",
  "This is not a valid Office Open XML file. Encrypted files are not supported.":
    "올바른 Office Open XML 파일이 아닙니다. 암호화된 파일은 지원하지 않습니다.",
  "This file is unavailable or too large to preview.":
    "파일을 사용할 수 없거나 너무 커서 미리 볼 수 없습니다.",
  "This file is too large to preview.": "파일이 너무 커서 미리 볼 수 없습니다.",
  "Preview closed.": "미리보기가 닫혔습니다.",
  "This file is unavailable.": "파일을 사용할 수 없습니다.",
};

/** Source strings with an embedded value, tried by `translate` after a dictionary miss. */
export const KO_MERGE_1027_E_PATTERNS: ReadonlyArray<readonly [RegExp, (match: string) => string]> =
  [
    [
      /^(\d+[hm] left)$/,
      (text) =>
        text.endsWith("h left") ? `${parseInt(text, 10)}시간 남음` : `${parseInt(text, 10)}분 남음`,
    ],
    [
      /^(\d+\+? (?:pages|slides|sheets|chapters))$/,
      (text) => {
        const [, n, unit] = /^(\d+\+?) (\w+)$/.exec(text) ?? [];
        const ko: Record<string, string> = {
          pages: "페이지",
          slides: "슬라이드",
          sheets: "시트",
          chapters: "챕터",
        };
        return unit === "pages" ? `${n}페이지` : `${ko[unit!] ?? unit} ${n}개`;
      },
    ],
    [
      /^(Tasks \d+\/\d+(?: · .+)?)$/,
      (text) => {
        const [, done, total, current] = /^Tasks (\d+)\/(\d+)(?: · (.+))?$/.exec(text) ?? [];
        return `작업 ${done}/${total}${current ? ` · ${current}` : ""}`;
      },
    ],
    [
      /^(.+ froze for \d+s)$/,
      (text) => {
        const [, host, seconds] = /^(.+) froze for (\d+)s$/.exec(text) ?? [];
        return `${host}: ${seconds}초 동안 멈춤`;
      },
    ],
    [
      /^(Its CPU is overloaded \(load \d+ on \d+ cores\)\.)$/,
      (text) => {
        const [, load, cores] =
          /^Its CPU is overloaded \(load (\d+) on (\d+) cores\)\.$/.exec(text) ?? [];
        return `CPU가 과부하 상태입니다 (코어 ${cores}개에 부하 ${load}).`;
      },
    ],
    [
      /^(T3 Code on .+ was too busy to answer\.)$/,
      (text) => {
        const [, host] = /^T3 Code on (.+) was too busy to answer\.$/.exec(text) ?? [];
        return `${host}의 T3 Code가 너무 바빠 응답하지 못했습니다.`;
      },
    ],
    [
      /^(Merge this (?:merge|change) request \(.+\))$/,
      (text) => {
        const [, kind, method] = /^Merge this (merge|change) request \((.+)\)$/.exec(text) ?? [];
        return `이 ${kind === "merge" ? "머지 리퀘스트" : "변경 요청"} 머지(${method})`;
      },
    ],
    [
      /^(Stack of \d+ (?:merge|change) requests, .+)$/,
      (text) => {
        const [, n, kind, state] =
          /^Stack of (\d+) (merge|change) requests, (.+)$/.exec(text) ?? [];
        return `${kind === "merge" ? "머지 리퀘스트" : "변경 요청"} 스택 ${n}개, ${state}`;
      },
    ],
    [
      /^((?:MR|change request) #\d+, status pending)$/,
      (text) => {
        const [, label, n] = /^(MR|change request) #(\d+), status pending$/.exec(text) ?? [];
        return `${label === "MR" ? "MR" : "변경 요청"} #${n}, 상태 확인 중`;
      },
    ],
    [
      /^(This conversation is only partially loaded\. \d+ comments? (?:is|are) loaded; open it on the host to read the rest\.)$/,
      (text) => {
        const [, n] = /loaded\. (\d+) comment/.exec(text) ?? [];
        return `이 대화는 일부만 불러왔습니다. 코멘트 ${n}개를 불러왔으며, 나머지는 호스트에서 여세요.`;
      },
    ],
  ];
