/** Korean strings for user-facing text that arrived with the 2026-10-20 upstream merge (settings and usage, area B). */
export const KO_MERGE_1020_B: Readonly<Record<string, string>> = {
  "Same on all machines": "모든 머신에서 동일",
  "Render math": "수식 렌더링",
  "Typeset LaTeX math, such as $x^2$ or \\[x^2\\], in messages and Markdown previews. The composer keeps TeX source editable.":
    "메시지와 Markdown 미리보기에서 $x^2$, \\[x^2\\] 같은 LaTeX 수식을 조판합니다. 입력창에서는 TeX 원문을 그대로 편집할 수 있습니다.",
  "Compact long idle Claude threads just before their prompt cache expires, so coming back costs less.":
    "오래 쉬고 있는 Claude 스레드를 프롬프트 캐시가 만료되기 직전에 압축합니다. 나중에 다시 이어 갈 때 비용이 줄어듭니다.",
  "Compact idle Claude threads (beta)": "유휴 Claude 스레드 압축 (베타)",
  "Uses the latest commit of the base branch’s tracked remote branch, even if its name differs. Otherwise uses the same-named branch on origin. Uses your local branch if that remote branch is missing.":
    "기본 브랜치가 추적하는 원격 브랜치의 최신 커밋을 사용합니다. 이름이 달라도 마찬가지입니다. 추적 브랜치가 없으면 origin의 같은 이름 브랜치를 쓰고, 그 원격 브랜치도 없으면 로컬 브랜치를 사용합니다.",
  "Start new worktrees from remote by default": "기본적으로 새 워크트리를 원격에서 시작",
  "New worktrees start from remote": "새 워크트리를 원격에서 시작",
  "Start from remote": "원격에서 시작",
  "Code blocks, diffs, and file previews.": "코드 블록, diff, 파일 미리보기.",
  "No matches found.": "일치하는 항목 없음",
  "Search environments": "환경 검색",
  Machine: "머신",
  Folder: "폴더",
  "Reset to inherited value": "상속된 값으로 재설정",
  "Environment-wide setting. Select an environment to change it.":
    "환경 전체에 적용되는 설정입니다. 변경하려면 환경을 선택해야 합니다.",
  "Inherited from the repository's t3.json": "저장소의 t3.json에서 상속됨",
  "Inherited from {environment}": "{environment}에서 상속됨",
  "Search engine": "검색 엔진",
  "GitHub accounts and token": "GitHub 계정 및 토큰",
  "Hold webhooks while offline": "오프라인 중 웹훅 보관",
  "This connection cannot change environment settings.":
    "이 연결에서는 환경 설정을 변경할 수 없습니다.",
  "Connect {target} to save this setting.": "이 설정을 저장하려면 {target}에 연결해야 합니다.",
  "an environment": "환경",
  "Up to 1 session at once, each stopped after {minutes} min or {idle} idle min":
    "동시에 최대 1개 세션, 각각 {minutes}분 또는 {idle}분 유휴 후 중지",
  "Up to {count} sessions at once, each stopped after {minutes} min or {idle} idle min":
    "동시에 최대 {count}개 세션, 각각 {minutes}분 또는 {idle}분 유휴 후 중지",
  "{counts} on every machine": "모든 머신에서 {counts}",
  "Even pace": "균등 사용",
  "{percent}% left by now": "지금쯤 {percent}% 남음",
  "Using reset credit…": "초기화 크레딧 사용 중…",
  "Usage breakdown by time": "시간별 사용량 세부 내역",
  "{percent} of cost": "비용의 {percent}",
  "{percent} of tokens": "토큰의 {percent}",
  "{count} tokens": "토큰 {count}개",
  "Map to a different model.": "다른 모델로 매핑해야 합니다.",
  "Update server to map models": "모델을 매핑하려면 서버를 업데이트해야 합니다",
};
