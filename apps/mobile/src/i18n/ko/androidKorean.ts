/** Korean fork, Android only: GitHub self-updater and the first-run permissions screen. */
export const KO_ANDROID_KOREAN: Readonly<Record<string, string>> = {
  // Updater banner and Settings > About row
  "Version {version} is available": "새 버전 {version} 있음",
  "Version {version} is ready to install": "{version} 설치 준비 완료",
  "Downloading {version}… {percent}%": "{version} 내려받는 중… {percent}%",
  "Android will ask you to confirm the update.": "Android에서 업데이트를 한 번 더 확인합니다.",
  "{size} MB download. Your connections and threads stay as they are.":
    "{size}MB를 내려받습니다. 연결과 스레드는 그대로 유지됩니다.",
  Install: "설치",
  Hide: "숨기기",
  "GitHub is limiting update checks. Try again in an hour.":
    "GitHub에서 업데이트 확인 요청을 제한했습니다. 1시간 뒤에 다시 시도하십시오.",
  "GitHub returned an error ({status}).": "GitHub에서 오류를 반환했습니다({status}).",
  "Could not check for updates.": "업데이트를 확인하지 못했습니다.",
  "The download was incomplete. Try again.": "다운로드가 완료되지 않았습니다. 다시 시도하십시오.",
  "The downloaded update failed verification. Try again.":
    "받은 업데이트 파일이 검증을 통과하지 못했습니다. 다시 시도하십시오.",
  "Download failed.": "다운로드하지 못했습니다.",
  "Could not open the installer.": "설치 화면을 열지 못했습니다.",
  "Never checked": "아직 확인 안 함",
  "Last checked {time}": "마지막 확인 {time}",
  "You have the latest version": "최신 버전 사용 중",
  "Current version {version}": "현재 {version}",

  // Permissions screen
  "Review permissions": "권한 설정 다시 보기",
  "Set up permissions": "권한 설정",
  "T3 Code asks only for what it uses. You can change these any time in Settings.":
    "T3 Code는 실제로 쓰는 권한만 요청합니다. 설정에서 언제든 바꿀 수 있습니다.",
  Camera: "카메라",
  "Install updates": "업데이트 설치",
  "Get a heads-up when an agent finishes or needs your answer.":
    "에이전트가 작업을 끝내거나 답을 기다리면 알림을 보냅니다.",
  "Scan the pairing QR code to connect to a computer.":
    "컴퓨터에 연결할 때 페어링 QR 코드를 스캔합니다.",
  "Install new versions of this app from GitHub without a computer.":
    "컴퓨터 없이 GitHub에서 새 버전을 바로 설치합니다.",
  "Allow all": "모두 허용",
};
