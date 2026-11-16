// Korean copy for upstream strings wrapped after the 2026-11-16 merge.
export const KO_MERGE_1116: Readonly<Record<string, string>> = {
  // Connection and links
  URL: "URL",
  "Waiting for approval": "승인 대기 중",
  "Waiting for approval on the host": "호스트에서 승인 대기 중",
  "Agents here can then launch, message and wait on threads there. It appears under Authorized clients in that machine's Sharing & access, where it can be revoked.":
    "그러면 이 환경의 에이전트가 그 기기의 스레드를 시작하고, 메시지를 보내고, 기다릴 수 있어요. 그 기기의 공유 및 접근에서 승인된 클라이언트에 표시되고, 거기서 해제할 수 있어요.",
  "Check this address": "주소 확인",
  "This app cannot confirm it is one of your machines. The pairing code you paste is sent there.":
    "이 앱은 내 기기가 맞는지 확인할 수 없어요. 붙여넣은 페어링 코드가 그 주소로 전송돼요.",
  "This environment is already linked to {name}. The agent can use that link as it is; change its access in Settings → Environments.":
    "이 환경은 이미 {name}에 연결되어 있어요. 에이전트가 그 링크를 그대로 쓸 수 있고, 접근 권한은 설정 → 환경에서 바꿀 수 있어요.",
  "Create a link on {name}: Settings → Sharing & access → Authorized clients → Create link, then paste its code here.":
    "{name}에서 설정 → 공유 및 접근 → 승인된 클라이언트 → 링크 만들기로 링크를 만든 뒤, 받은 코드를 여기에 붙여넣으세요.",
  "This environment": "이 환경",

  // Threads and pull requests
  "Loading threads": "스레드 불러오는 중",
  "Diff too large to display. Tap to load it.":
    "변경 사항이 너무 커서 표시할 수 없어요. 눌러서 불러오세요.",
  "Diff too large to display here.": "변경 사항이 너무 커서 여기에는 표시할 수 없어요.",
  "Couldn't load this diff. Tap to try again.":
    "변경 사항을 불러올 수 없어요. 눌러서 다시 시도하세요.",
  "No text diff for this file.": "이 파일은 텍스트 변경 사항이 없어요.",
  "the overview": "개요",
  'Looking for "{query}" in messages.': '메시지에서 "{query}" 검색 중이에요.',
  "The server could not prepare triage.": "서버가 분류를 준비하지 못했어요.",
  "Saved drafts could not be loaded. Try again.":
    "저장된 초안을 불러올 수 없어요. 다시 시도하세요.",
  "Follow settings": "설정 따르기",
  "Next send keeps all {tokens} tokens of history":
    "다음 전송 때 기록 {tokens} 토큰을 모두 유지해요",
  "Next send compacts {tokens} tokens of history first":
    "다음 전송 때 기록 {tokens} 토큰을 먼저 압축해요",
  "Compacts first": "먼저 압축",
  "Keeps the full history": "전체 기록 유지",
  "Could not resume queue": "대기열을 다시 시작할 수 없음",
  "Continued for {duration}": "{duration} 동안 이어서 작업함",
  Continued: "이어서 작업함",
  "Could not save image": "이미지를 저장할 수 없음",
  "Saving image…": "이미지 저장 중…",
  "Save image": "이미지 저장",
  Share: "공유",
  "Disable line wrap": "줄바꿈 끄기",
  "Wrap lines": "줄바꿈",
  "Show diagram": "다이어그램 보기",
  "Show code": "코드 보기",

  // Settings
  "Tool calls in chat": "채팅의 도구 호출",
  "Long-press the send button to use the other option for a single message. With a hardware keyboard, hold Ctrl while sending.":
    "전송 버튼을 길게 누르면 메시지 하나만 다른 옵션으로 보낼 수 있어요. 하드웨어 키보드에서는 Ctrl을 누른 채 보내세요.",
  "Project sources": "프로젝트 소스",
  "Keep awake while agents work": "에이전트 작업 중 절전 방지",
  "Method on {name}": "{name}의 방식",
  "Beta: Fast worktree checkout": "베타: 빠른 워크트리 체크아웃",
  "On a Mac, clone new worktrees from a checkout cached in the T3 home folder instead of writing every file. Uses Git’s normal checkout when it can’t. Turning it off deletes the cache.":
    "Mac에서는 파일을 하나씩 쓰는 대신 T3 홈 폴더에 캐시된 체크아웃에서 새 워크트리를 복제해요. 복제할 수 없으면 Git의 일반 체크아웃을 써요. 끄면 캐시가 삭제돼요.",

  // Voice models
  "Transcription models": "받아쓰기 모델",
  "Search models or languages": "모델이나 언어 검색",
  "Close transcription models": "받아쓰기 모델 닫기",
  "Local model": "로컬 모델",
  "Not available on this environment": "이 환경에서는 사용할 수 없음",
  "Verifying {name}…": "{name} 확인 중…",
  "Downloading {name} · {percent}%": "{name} 다운로드 중 · {percent}%",
  "Local model · {size}": "로컬 모델 · {size}",
  "No model installed · Choose one to download": "설치된 모델 없음 · 다운로드할 모델을 고르세요",
  "No model installed · Add one using T3 Code on {name}":
    "설치된 모델 없음 · {name}의 T3 Code에서 추가하세요",

  // Cloud dictation
  "Cloud provider": "클라우드 프로바이더",
  "Cloud providers": "클라우드 프로바이더",
  "Use your own API key": "내 API 키 사용",
  "OpenRouter no longer lists {model}. Dictation stays off until you choose another model.":
    "OpenRouter 목록에서 {model} 모델이 사라졌어요. 다른 모델을 고를 때까지 받아쓰기가 꺼져 있어요.",
  "Search OpenRouter models": "OpenRouter 모델 검색",
  "Search transcription models": "받아쓰기 모델 검색",
  "No transcription model matches.": "일치하는 받아쓰기 모델 없음",
  "Show all {count} models": "모델 {count}개 모두 보기",
  "Could not enable cloud dictation": "클라우드 받아쓰기를 켤 수 없음",
  "Check device storage and choose the provider again.":
    "기기 저장 공간을 확인한 뒤 프로바이더를 다시 고르세요.",
  "Could not update the API key": "API 키를 업데이트할 수 없음",
  "Check the environment connection and your settings permissions.":
    "환경 연결과 설정 권한을 확인하세요.",
  "Environment not connected": "환경이 연결되지 않음",
  "Could not load keys · Retry": "키를 불러올 수 없음 · 다시 시도",
  "Checking API keys…": "API 키 확인 중…",
  "Audio is sent through {name} using its API key.": "{name}의 API 키로 오디오를 전송해요.",
  "Update the environment to use this provider": "이 프로바이더를 쓰려면 환경을 업데이트하세요",
  "{model} · Tap to change model or key": "{model} · 눌러서 모델이나 키 변경",
  "{model} · Tap to change model": "{model} · 눌러서 모델 변경",
  "Tap to manage key": "눌러서 키 관리",
  "API key saved · choose a model to use it": "API 키 저장됨 · 모델을 고르면 쓸 수 있어요",
  "API key saved": "API 키 저장됨",
  "Add an API key to use this provider": "이 프로바이더를 쓰려면 API 키를 추가하세요",
  "Ask an environment administrator to add an API key": "환경 관리자에게 API 키 추가를 요청하세요",
  "Use {name} for dictation?": "받아쓰기에 {name}을(를) 쓸까요?",
  "Select This device to stop sharing.": "공유를 멈추려면 ‘이 기기’를 선택하세요.",
  "Use {name}": "{name} 사용",
  "Enter a valid API key.": "API 키 형식을 확인하세요.",
  "Uses the API key saved on this environment. The model choice applies only to this device.":
    "이 환경에 저장된 API 키를 써요. 모델 선택은 이 기기에만 적용돼요.",
  "Anyone with dictation access to {name} can bill this key.":
    "{name}의 받아쓰기를 쓸 수 있는 사람은 누구나 이 키로 요금을 발생시킬 수 있어요.",
  "Updates the {company} key on {name}. Your dictation destination stays the same.":
    "{name}의 {company} 키를 업데이트해요. 받아쓰기 대상은 그대로예요.",
  "Could not load models · Retry": "모델을 불러올 수 없음 · 다시 시도",
  "Loading transcription models…": "받아쓰기 모델 불러오는 중…",
  "API key": "API 키",
  "{name} API key reference": "{name} API 키 참조",
  "{name} API key": "{name} API 키",
  "Saved key · enter a new one to replace": "저장된 키 · 바꾸려면 새 키 입력",
  "Ask an administrator to add an OpenRouter key": "관리자에게 OpenRouter 키 추가를 요청하세요",
  "Save and enable": "저장 후 켜기",
  "Save key": "키 저장",
  "Remove key from environment": "환경에서 키 삭제",
  "Remove the {name} key from {environment}?": "{environment}에서 {name} 키를 삭제할까요?",
  "Everyone using it for dictation will lose access.":
    "받아쓰기에 이 키를 쓰는 모든 사람이 쓸 수 없게 돼요.",
  "Remove key": "키 삭제",
  "Back to providers": "프로바이더 목록으로",
};
