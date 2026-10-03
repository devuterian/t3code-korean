import { useCallback, useSyncExternalStore } from "react";

import { DEFAULT_INTERFACE_LANGUAGE, type InterfaceLanguage } from "@t3tools/contracts/settings";

import { ZH_CN_DICTIONARY } from "./dictionary";
import { KO_DICTIONARY } from "./dictionary.ko";

type Listener = () => void;

let currentLanguage: InterfaceLanguage = DEFAULT_INTERFACE_LANGUAGE;
let languageConfigured = false;
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): InterfaceLanguage {
  return currentLanguage;
}

/**
 * Imperatively set the active language. Called by the settings row's
 * subscription once client settings hydrate and whenever the persisted value
 * changes, so non-React modules (search, formatting) can read the same value.
 */
export function setInterfaceLanguage(language: InterfaceLanguage): void {
  if (currentLanguage === language) return;
  currentLanguage = language;
  emitChange();
}

/** Mark the language store as configured so React can skip the default flash. */
export function markInterfaceLanguageConfigured(): void {
  languageConfigured = true;
  emitChange();
}

export function isInterfaceLanguageConfigured(): boolean {
  return languageConfigured;
}

/** Read the active language from non-React formatting and state modules. */
export function getInterfaceLanguage(): InterfaceLanguage {
  return currentLanguage;
}

/** React hook returning the active interface language. */
export function useInterfaceLanguage(): InterfaceLanguage {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

type CountPattern = readonly [pattern: RegExp, render: (match: string) => string];

interface LanguagePack {
  readonly dictionary: Readonly<Record<string, string>>;
  /** Source strings with an embedded value, tried in order after a dictionary miss. */
  readonly patterns: ReadonlyArray<CountPattern>;
}

const LANGUAGE_PACKS: Partial<Record<InterfaceLanguage, LanguagePack>> = {
  "zh-CN": {
    dictionary: ZH_CN_DICTIONARY,
    patterns: [
      [/^Settled \((\d+)\)$/, (n) => `已收档 (${n})`],
      [/^Snoozed \((\d+)\)$/, (n) => `已搁置 (${n})`],
      [/^Unpin \((\d+)\)$/, (n) => `取消置顶 (${n})`],
      [/^Settle \((\d+)\)$/, (n) => `收档 (${n})`],
      [/^Snooze \((\d+)\)$/, (n) => `搁置 (${n})`],
      [/^Mark unread \((\d+)\)$/, (n) => `标记为未读 (${n})`],
      [/^Delete \((\d+)\)$/, (n) => `删除 (${n})`],
      [/^Regenerate titles \((\d+)\)$/, (n) => `重新生成标题 (${n})`],
      [/^Regenerating… \((\d+)\)$/, (n) => `正在重新生成… (${n})`],
      [/^Worked for (.+)$/, (d) => `运行了 ${d}`],
      [/^Model Picker: Jump: (\d+)$/, (n) => `模型选择器：跳转：${n}`],
      [/^Thread: Jump: (\d+)$/, (n) => `线程：跳转：${n}`],
    ],
  },
  ko: {
    dictionary: KO_DICTIONARY,
    patterns: [
      [/^Settled \((\d+)\)$/, (n) => `정리됨 (${n})`],
      [/^Snoozed \((\d+)\)$/, (n) => `미뤄 둠 (${n})`],
      [/^Unpin \((\d+)\)$/, (n) => `고정 해제 (${n})`],
      [/^Settle \((\d+)\)$/, (n) => `정리 (${n})`],
      [/^Snooze \((\d+)\)$/, (n) => `미루기 (${n})`],
      [/^Mark unread \((\d+)\)$/, (n) => `읽지 않음으로 표시 (${n})`],
      [/^Delete \((\d+)\)$/, (n) => `삭제 (${n})`],
      [/^Regenerate titles \((\d+)\)$/, (n) => `제목 다시 생성 (${n})`],
      [/^Regenerating… \((\d+)\)$/, (n) => `다시 생성 중… (${n})`],
      [/^Worked for (.+)$/, (d) => `${d} 동안 작업함`],
      [/^Model Picker: Jump: (\d+)$/, (n) => `모델 선택기: 이동: ${n}`],
      [/^Thread: Jump: (\d+)$/, (n) => `스레드: 이동: ${n}`],
      [/^Working \((\d+)\)$/, (n) => `작업 중 (${n})`],
      [/^(\d+) archived threads?$/, (n) => `보관된 스레드 ${n}개`],
      [/^Archived thread actions for (.+)$/, (project) => `${project}의 보관된 스레드 작업`],
      [
        /^(Delete \d+ archived threads?(?: in .+)?)\?$/,
        (text) => {
          const [, n, project] = /^Delete (\d+) archived threads?(?: in (.+))?$/.exec(text) ?? [];
          return project
            ? `${project}의 보관된 스레드 ${n}개를 삭제할까요?`
            : `보관된 스레드 ${n}개를 삭제할까요?`;
        },
      ],
      // Shell (sidebar, palette, git, pull requests, usage) — orchestrator V2 port.
      [/^Previous worktree \((.+)\)$/, (branch) => `이전 워크트리 (${branch})`],
      [
        /^(Showing \d+ of \d+ refs)$/,
        (text) => {
          const [, shown, total] = /^Showing (\d+) of (\d+) refs$/.exec(text) ?? [];
          return `ref ${total}개 중 ${shown}개 표시`;
        },
      ],
      [/^Create new ref "(.+)"$/, (name) => `새 ref "${name}" 생성`],
      [/^Pushing to (.+)\.\.\.$/, (target) => `${target}에 푸시 중...`],
      [/^Commit & push to (.+)$/, (branch) => `${branch}에 커밋 및 푸시`],
      [/^Push to (.+)$/, (branch) => `${branch}에 푸시`],
      [
        /^(This action will .+ on ".+"\. You can continue on this ref or create a feature ref and run the same action there\.)$/,
        (text) => {
          const [, what, branch] =
            /^This action will (.+) on "(.+)"\. You can continue/.exec(text) ?? [];
          const terms: Record<string, string> = {
            "pull request": "풀 리퀘스트를",
            "merge request": "머지 리퀘스트를",
            "change request": "변경 요청을",
          };
          const term = (name: string) => terms[name] ?? name;
          let action = what ?? "";
          let m: RegExpExecArray | null;
          if (action === "commit and push changes") action = "변경사항을 커밋하고 푸시합니다";
          else if (action === "push local commits") action = "로컬 커밋을 푸시합니다";
          else if ((m = /^commit, push, and create an? (.+)$/.exec(action)))
            action = `커밋하고 푸시한 뒤 ${term(m[1]!)} 생성합니다`;
          else if ((m = /^push local commits and create an? (.+)$/.exec(action)))
            action = `로컬 커밋을 푸시하고 ${term(m[1]!)} 생성합니다`;
          return `이 작업은 "${branch}"에서 ${action}. 이 ref에서 계속하거나 기능 ref를 만들어 같은 작업을 그곳에서 실행할 수 있습니다.`;
        },
      ],
      [
        /^(Updated .+ from .+)$/,
        (text) => {
          const [, ref, upstream] = /^Updated (.+) from (.+)$/.exec(text) ?? [];
          return `${upstream}에서 ${ref}을(를) 업데이트했습니다`;
        },
      ],
      [/^(.+) is already synchronized\.$/, (ref) => `${ref}은(는) 이미 동기화되어 있습니다.`],
      [/^Publishing repository to (.+)\.\.\.$/, (host) => `${host}에 저장소 게시 중...`],
      [
        /^(.+ is now live on .+\.)$/,
        (text) => {
          const [, branch, host] = /^(.+) is now live on (.+)\.$/.exec(text) ?? [];
          return `${branch}이(가) 이제 ${host}에 게시되었습니다.`;
        },
      ],
      [
        /^Remote "(.+)" is set up\. Make a commit and push it to share your code\.$/,
        (remote) => `"${remote}" 원격이 설정되었습니다. 커밋하고 푸시해 코드를 공유하세요.`,
      ],
      [/^Open on (.+)$/, (host) => `${host}에서 열기`],
      [
        /^(.+) is not authenticated\. Open Settings -> Source Control for setup guidance\.$/,
        (provider) =>
          `${provider} 인증이 필요합니다. 설정 안내는 설정 -> 소스 제어에서 확인하세요.`,
      ],
      [
        /^(\(\d+ of \d+\))$/,
        (text) => {
          const [, selected, total] = /^\((\d+) of (\d+)\)$/.exec(text) ?? [];
          return `(${total}개 중 ${selected}개)`;
        },
      ],
      [/^Terminal (\d+)$/, (n) => `터미널 ${n}`],
      [/^Committed ([0-9a-f]{7,40})$/, (sha) => `${sha} 커밋됨`],
      [
        /^(Pushed(?: [0-9a-f]{7,40})?(?: to .+)?)$/,
        (text) => {
          const [, sha, branch] = /^Pushed(?: ([0-9a-f]{7,40}))?(?: to (.+))?$/.exec(text) ?? [];
          const target = branch ? `${branch}에 ` : "";
          return sha ? `${target}${sha} 푸시됨` : `${target}푸시됨`;
        },
      ],
      [
        /^((?:Created|Opened) (?:PR|MR|change request)(?: #\d+)?)$/,
        (text) => {
          const [, verb, kind, num] =
            /^(Created|Opened) (PR|MR|change request)(?: (#\d+))?$/.exec(text) ?? [];
          const label = kind === "change request" ? "변경 요청" : (kind ?? "");
          return `${label}${num ? ` ${num}` : ""} ${verb === "Created" ? "생성됨" : "열림"}`;
        },
      ],
      [
        /^(Enter .+ repository \(.+\))$/,
        (s) => {
          const [, l, h] = /^Enter (.+) repository \((.+)\)$/.exec(s) ?? [];
          return `${l} 저장소 입력 (${h})`;
        },
      ],
      [/^Appearance: (.+)$/, (m) => `화면 모드: ${KO_DICTIONARY[m] ?? m}`],
      [
        /^(Clone .+ (?:owner\/repo|group\/project|workspace\/repository|project\/repository))$/,
        (s) => {
          const [, l, h] = /^Clone (.+) (\S+)$/.exec(s) ?? [];
          return `${l} ${h} 복제`;
        },
      ],
      [
        /^(.+) is not connected\.$/,
        (e) =>
          e === "The selected environment"
            ? "선택한 환경이 연결되어 있지 않습니다."
            : `${e}: 연결되어 있지 않습니다.`,
      ],
      [/^For (light|dark) mode$/, (m) => (m === "light" ? "라이트 모드용" : "다크 모드용")],
      [
        /^Open in (Finder|File Explorer|Files)$/,
        (m) => `${m === "File Explorer" ? "파일 탐색기" : m === "Files" ? "파일" : m}에서 열기`,
      ],
      [/^Creates (.+)$/, (p) => `생성 위치: ${p}`],
      [/^Goes in (.+)$/, (p) => `저장 위치: ${p}`],
      [/^Search file contents in (.+)$/, (p) => `${p}에서 파일 내용 검색`],
      [/^Search in (.+)$/, (p) => `${p}에서 검색`],
      [
        /^([\d,.]+\+? results in [\d,.]+ files)$/,
        (s) => {
          const [, n, f] = /^([\d,.]+\+?) results in ([\d,.]+) files$/.exec(s) ?? [];
          return `파일 ${f}개에서 결과 ${n}개`;
        },
      ],
      [
        /^Hold (.+) or press twice to quit$/,
        (k) => `종료하려면 ${k}를 길게 누르거나 두 번 누르세요`,
      ],
      [/^Press (.+) again to quit$/, (k) => `종료하려면 ${k}를 한 번 더 누르세요`],
      [
        /^Update (.+) ready to download$/,
        (v) =>
          v === "available" ? "업데이트를 다운로드할 수 있습니다" : `업데이트 ${v} 다운로드 가능`,
      ],
      [/^Downloading update \((\d+)%\)$/, (n) => `업데이트 다운로드 중 (${n}%)`],
      [/^Downloading update$/, () => "업데이트 다운로드 중"],
      [
        /^Update (.+) downloaded\. Click to restart and install\.$/,
        (v) =>
          v === "ready"
            ? "업데이트를 다운로드했습니다. 클릭하면 다시 시작해 설치합니다."
            : `업데이트 ${v}을(를) 다운로드했습니다. 클릭하면 다시 시작해 설치합니다.`,
      ],
      [
        /^Download failed for (.+)\. Click to retry\.$/,
        (v) => `${v} 다운로드에 실패했습니다. 클릭해 다시 시도하세요.`,
      ],
      [
        /^Install failed for (.+)\. Click to retry\.$/,
        (v) => `${v} 설치에 실패했습니다. 클릭해 다시 시도하세요.`,
      ],
      [
        /^Install update(.*) and restart T3 Code\?\n\nAny running tasks will be interrupted\. Make sure you're ready before continuing\.$/,
        (v) =>
          `업데이트${v}을(를) 설치하고 T3 Code를 다시 시작할까요?\n\n실행 중인 작업은 모두 중단됩니다. 준비가 되었는지 확인한 뒤 계속하세요.`,
      ],
      [
        /^Migrating ([\d,.]+) threads? from the previous version\. You can keep working while this finishes\.$/,
        (n) =>
          `이전 버전에서 스레드 ${n}개를 옮기는 중입니다. 완료될 때까지 계속 작업할 수 있습니다.`,
      ],
      [
        /^(\d+ requests? waiting longer than \d+s\.)$/,
        (s) => {
          const [, n, sec] = /^(\d+) requests? waiting longer than (\d+)s\.$/.exec(s) ?? [];
          return `요청 ${n}개가 ${sec}초 넘게 대기 중입니다.`;
        },
      ],
      [
        /^(.+) can be updated from provider settings\.$/,
        (l) => `${l.replace(/,? and /g, ", ")}: 프로바이더 설정에서 업데이트할 수 있습니다.`,
      ],
      [
        /^(.+) still appears? outdated\. (?:Check|Review) provider settings for details\.$/,
        (l) =>
          `${l.replace(/,? and /g, ", ")}: 아직 오래된 버전입니다. 자세한 내용은 프로바이더 설정을 확인하세요.`,
      ],
      [/^(\d+) providers updated$/, (n) => `프로바이더 ${n}개 업데이트됨`],
      [
        /^(\d+ of \d+) provider updates failed$/,
        (s) => {
          const [a, b] = s.split(" of ");
          return `프로바이더 업데이트 ${b}개 중 ${a}개 실패`;
        },
      ],
      [/^(\d+) provider updates failed$/, (n) => `프로바이더 업데이트 ${n}개 실패`],
      [
        /^(\d+) providers still need updates$/,
        (n) => `프로바이더 ${n}개에 아직 업데이트가 필요합니다`,
      ],
      [/^Updates Available: (\d+) providers$/, (n) => `업데이트 가능: 프로바이더 ${n}개`],
      [/^Updating (\d+) providers$/, (n) => `프로바이더 ${n}개 업데이트 중`],
      [/^(.+) update in progress\.$/, (l) => `${l} 업데이트 진행 중입니다.`],
      [
        /^(.+) updates are in progress\.$/,
        (l) => `${l.replace(/,? and /g, ", ")} 업데이트 진행 중입니다.`,
      ],
      [
        /^(.+) failed to update\. Check provider settings for details\.$/,
        (l) =>
          `${l.replace(/,? and /g, ", ")} 업데이트에 실패했습니다. 자세한 내용은 프로바이더 설정을 확인하세요.`,
      ],
      [
        /^Desktop app relaunched on (.+)\.$/,
        (v) => `데스크톱 앱이 ${v} 버전으로 다시 실행되었습니다.`,
      ],
      [/^Reconnected on (t3@.+)\.$/, (v) => `${v}로 다시 연결되었습니다.`],
      [
        /^Update the T3 Code desktop apps on (.+)\? They will close and relaunch on those machines\.$/,
        (l) =>
          `${l}의 T3 Code 데스크톱 앱을 업데이트할까요? 해당 기기에서 앱이 닫혔다가 다시 실행됩니다.`,
      ],
      [
        /^Update the T3 Code desktop app that runs the (.+)\? It will close and relaunch on that machine\.$/,
        (s) =>
          `${s}을(를) 실행하는 T3 Code 데스크톱 앱을 업데이트할까요? 해당 기기에서 앱이 닫혔다가 다시 실행됩니다.`,
      ],
      [
        /^(Run `[^`]+` on .+ to update it\.)$/,
        (s) => {
          const [, c, h] = /^Run `([^`]+)` on (.+) to update it\.$/.exec(s) ?? [];
          return `${h}에서 \`${c}\`을(를) 실행해 업데이트하세요.`;
        },
      ],
      [
        /^((?:Update|Retry|Retry update|Copy update command) for .+)$/,
        (s) => {
          const [, a, h] =
            /^(Update|Retry|Retry update|Copy update command) for (.+)$/.exec(s) ?? [];
          return `${h}: ${KO_DICTIONARY[a!] ?? a}`;
        },
      ],
      [/^Cancelled cloning (.+)$/, (n) => `${n} 복제 취소됨`],
      [/^Failed to clone (.+)$/, (n) => `${n}을(를) 복제하지 못했습니다`],
      [/^Cloning (.+)$/, (n) => `${n} 복제 중`],
      [/^Cloned (.+)$/, (n) => `${n} 복제 완료`],
      [/^Searching every host for “([\s\S]*)”$/, (q) => `모든 호스트에서 “${q}” 검색 중`],
      [/^Nothing matches “([\s\S]*)”$/, (q) => `“${q}”와(과) 일치하는 항목 없음`],
      [/^(\d+) merges loaded$/, (n) => `불러온 머지 ${n}개`],
      [/^(\d+) selected$/, (n) => `${n}개 선택됨`],
      [/^Conflicts with (.+)$/, (branch) => `${branch} 브랜치와 충돌`],
      [/^Open (.+)'s profile$/, (login) => `${login} 프로필 열기`],
      [
        /^The checkout is ready on `(.+)`\. Point a thread at it from the branch picker, then ask again\.$/,
        (branch) =>
          `체크아웃이 \`${branch}\`에 준비되었습니다. 브랜치 선택기에서 스레드가 이 브랜치를 가리키게 한 뒤 다시 질문하세요.`,
      ],
      [
        /^(\d+ of \d+) failing$/,
        (s) => {
          const [a, b] = s.split(" of ");
          return `${b}개 중 ${a}개 실패`;
        },
      ],
      [
        /^(\d+ of \d+) running$/,
        (s) => {
          const [a, b] = s.split(" of ");
          return `${b}개 중 ${a}개 실행 중`;
        },
      ],
      [
        /^(\d+ of \d+) passing$/,
        (s) => {
          const [a, b] = s.split(" of ");
          return `${b}개 중 ${a}개 통과`;
        },
      ],
      [
        /^(\d+ workflows? and \d+ checks?) awaiting action$/,
        (s) => {
          const [w, c] = s.match(/\d+/g) ?? [];
          return `워크플로 ${w}개와 체크 ${c}개 조치 대기 중`;
        },
      ],
      [/^(\d+) workflows? awaiting approval$/, (n) => `워크플로 ${n}개 승인 대기 중`],
      [/^(\d+) checks? awaiting action$/, (n) => `체크 ${n}개 조치 대기 중`],
      [
        /^This branch is out-of-date with (.+)\.$/,
        (v) => {
          const m = /^(.+) by ([\d,]+) commits?$/.exec(v);
          return m
            ? `이 브랜치는 ${m[1]}보다 커밋 ${m[2]}개 뒤처져 있습니다.`
            : `이 브랜치는 ${v}보다 오래되었습니다.`;
        },
      ],
      [/^Open (.+) repository$/, (repo) => `${repo} 저장소 열기`],
      [/^Open pull request #(\d+) on host$/, (n) => `호스트에서 풀 리퀘스트 #${n} 열기`],
      [/^Stacked on (.+)$/, (b) => `${b} 위에 스택됨`],
      [/^([\d,]+) changed files?$/, (n) => `변경된 파일 ${n}개`],
      [/^([\d,]+) files?$/, (n) => `파일 ${n}개`],
      [/^([\d,]+) comments?$/, (n) => `코멘트 ${n}개`],
      [/^([\d,]+) commits?$/, (n) => `커밋 ${n}개`],
      [/^Checks: (.+)$/, (summary) => `체크: ${summary}`],
      [
        /^This merges (#\d+ using \S+) as soon as the host considers it ready, which may be immediately\.$/,
        (v) => {
          const [n, m] = v.split(" using ");
          return `호스트가 준비되었다고 판단하는 즉시 ${n} 풀 리퀘스트를 ${m} 방식으로 머지합니다. 바로 머지될 수도 있습니다.`;
        },
      ],
      [
        /^This merges (#\d+ using \S+)\.$/,
        (v) => {
          const [n, m] = v.split(" using ");
          return `${n} 풀 리퀘스트를 ${m} 방식으로 머지합니다.`;
        },
      ],
      [
        /^This opens a new pull request that reverses the changes merged by #(\d+)\.$/,
        (n) => `#${n}에서 머지된 변경사항을 되돌리는 새 풀 리퀘스트를 엽니다.`,
      ],
      [
        /^This allows (\d+ workflows? from #\d+) to run\. Review the code and workflow changes first\.$/,
        (v) => {
          const m = /^(\d+) workflows? from (#\d+)$/.exec(v);
          return m
            ? `${m[2]}의 워크플로 ${m[1]}개 실행을 허용합니다. 먼저 코드와 워크플로 변경사항을 검토하세요.`
            : v;
        },
      ],
      [
        /^This closes #(\d+) without merging it\.$/,
        (n) => `#${n} 풀 리퀘스트를 머지하지 않고 닫습니다.`,
      ],
      [/^(\d+ of \d+) awaiting action$/, (v) => `${v.replace(" of ", "/")} 조치 대기 중`],
      [/^Commit ([0-9a-f]{7,})$/, (oid) => `커밋 ${oid}`],
      [
        /^Review pull request, (\d+) comments? pending$/,
        (n) => `풀 리퀘스트 리뷰, 대기 중인 코멘트 ${n}개`,
      ],
      [/^Review \((\d+)\)$/, (n) => `리뷰 (${n})`],
      [
        /^Could not take back the review request to (.+)$/,
        (login) => `${login}에게 보낸 리뷰 요청을 취소하지 못했습니다`,
      ],
      [/^Could not ask (.+) for a review$/, (login) => `${login}에게 리뷰를 요청하지 못했습니다`],
      [
        /^Review request to (.+) taken back$/,
        (login) => `${login}에게 보낸 리뷰 요청을 취소했습니다`,
      ],
      [/^Review requested from (.+)$/, (login) => `${login}에게 리뷰를 요청했습니다`],
      [/^Could not take (.+) off$/, (label) => `${label} 라벨을 떼지 못했습니다`],
      [/^Could not put (.+) on$/, (label) => `${label} 라벨을 붙이지 못했습니다`],
      [
        /^No project in this environment can read (.+)\.$/,
        (repo) => `이 환경에는 ${repo}을(를) 읽을 수 있는 프로젝트가 없습니다.`,
      ],
      [/^Stack #(\d+)$/, (n) => `스택 #${n}`],
      [
        /^Stack (\d+, layer \d+ of \d+)$/,
        (m) => {
          const [n, p, s] = m.match(/\d+/g) ?? [];
          return `스택 ${n}, 레이어 ${p}/${s}`;
        },
      ],
      [
        /^View stack #(\d+, layer \d+ of \d+)$/,
        (m) => {
          const [n, p, s] = m.match(/\d+/g) ?? [];
          return `스택 #${n} 보기, 레이어 ${p}/${s}`;
        },
      ],
      [/^Merge stack \((\d+)\)$/, (n) => `스택 머지 (${n})`],
      [
        /^Merge stack through (#\d+ into .+ \(\d+ pull requests?\))$/,
        (m) => {
          const r = /^#(\d+) into (.+) \((\d+) pull requests?\)$/.exec(m);
          return r ? `#${r[1]}까지의 스택을 ${r[2]}에 머지 (풀 리퀘스트 ${r[3]}개)` : m;
        },
      ],
      [/^Merge (\d+) pull requests\?$/, (n) => `풀 리퀘스트 ${n}개를 머지하시겠습니까?`],
      [/^Rebase (\d+) pull requests\?$/, (n) => `풀 리퀘스트 ${n}개를 리베이스하시겠습니까?`],
      [
        /^Merge #(\d+ and its unmerged layers below into .+ using .+)\. GitHub checks their rules before merging or queueing them and rebases the remaining stack after merging\.$/,
        (m) => {
          const r = /^(\d+) and its unmerged layers below into (.+) using (.+)$/.exec(m);
          return r
            ? `#${r[1]}과(와) 그 아래의 머지되지 않은 레이어를 ${r[3]} 방식으로 ${r[2]}에 머지합니다. GitHub가 머지하거나 대기열에 넣기 전에 규칙을 확인하고, 머지 후 남은 스택을 리베이스합니다.`
            : m;
        },
      ],
      [
        /^Rebase the remote branches from bottom to top onto (.+)\. This rewrites branch history and may restart checks\. If a layer fails, earlier updates remain\.$/,
        (base) =>
          `원격 브랜치를 아래에서 위로 ${base}에 리베이스합니다. 브랜치 기록이 다시 쓰이고 체크가 다시 시작될 수 있습니다. 레이어 하나가 실패해도 앞선 업데이트는 그대로 남습니다.`,
      ],
      [/^Linked from (\d+) threads?$/, (n) => `스레드 ${n}개에서 연결됨`],
      [/^([\d,]+) authors?$/, (n) => `작성자 ${n}명`],
      [/^View commit ([0-9a-f]+)$/, (sha) => `커밋 ${sha} 보기`],
      [
        /^Show (\d+ older comments? \(\d+ hidden\))$/,
        (m) => {
          const [a, h] = m.match(/\d+/g) ?? [];
          return `이전 코멘트 ${a}개 더 보기 (${h}개 숨김)`;
        },
      ],
      [/^Show only (\d+) recent comments$/, (n) => `최근 코멘트 ${n}개만 보기`],
      [/^Comments \((\d+)\)$/, (n) => `코멘트 (${n})`],
      [/^(\d+) bot comments?$/, (n) => `봇 코멘트 ${n}개`],
      [/^(\d+) resolved or dismissed comments?$/, (n) => `해결되었거나 기각된 코멘트 ${n}개`],
      [
        /^This conversation is longer than this page reads in one go\. The most recent (\d+) are here; open it on the host to read the rest\.$/,
        (n) =>
          `이 대화는 한 번에 읽어 올 수 있는 길이보다 깁니다. 최근 ${n}개만 표시되며, 나머지는 호스트에서 열어 확인하세요.`,
      ],
      [/^Show more \((\d+) left\)$/, (n) => `더 보기 (${n}개 남음)`],
      [/^viewed in (.+)$/, (app) => `${app}에서 확인함`],
      [/^(\d+) conversations?$/, (n) => `대화 ${n}개`],
      [/^Line (\d+)$/, (n) => `${n}번째 줄`],
      [/^Pull request #(\d+) files$/, (n) => `풀 리퀘스트 #${n} 파일`],
      [/^(\d+) terminal process(?:es)? running$/, (n) => `터미널 프로세스 ${n}개 실행 중`],
      [/^Handed off from (.+)$/, (names) => `${names}에서 넘겨받음`],
      [/^(\d+) attachments?$/, (n) => `첨부 파일 ${n}개`],
      [/^Pinned \((\d+)\)$/, (n) => `고정됨 (${n})`],
      [/^Active \((\d+)\)$/, (n) => `활성 (${n})`],
      [/^Show (\d+) more$/, (n) => `${n}개 더 보기`],
      [/^No threads in (.+) yet$/, (project) => `${project}에 아직 스레드가 없습니다`],
      [/^Project settings for (.+)$/, (project) => `${project} 프로젝트 설정`],
      [/^Archive \((\d+)\)$/, (n) => `보관 (${n})`],
      [/^Failed to snooze (\d+) threads?$/, (n) => `스레드 ${n}개를 미루지 못했습니다`],
      [/^Delete (\d+) threads?\?$/, (n) => `스레드 ${n}개를 삭제할까요?`],
      [/^Archive thread "(.*)"\?$/, (title) => `"${title}" 스레드를 보관할까요?`],
      [/^Delete thread "(.*)"\?$/, (title) => `"${title}" 스레드를 삭제할까요?`],
      [
        /^((?:Settled|Snoozed|Unpinned|Archived) \d+ threads?)$/,
        (text) => {
          const [, action, n] = /^(\w+) (\d+) threads?$/.exec(text) ?? [];
          const verb =
            action === "Settled"
              ? "정리함"
              : action === "Snoozed"
                ? "미룸"
                : action === "Unpinned"
                  ? "고정 해제함"
                  : "보관함";
          return `스레드 ${n}개 ${verb}`;
        },
      ],
      [/^PR #(\d+), status pending$/, (n) => `PR #${n}, 상태 확인 중`],
      [
        /^(Stack of \d+ pull requests, .+)$/,
        (text) => {
          const [, n, state] = /^Stack of (\d+) pull requests, (.+)$/.exec(text) ?? [];
          return `풀 리퀘스트 스택 ${n}개, ${state}`;
        },
      ],
      [/^and (\d+) more linked$/, (n) => `외 ${n}개 연결됨`],
      [/^(\d+) more changes? on GitHub$/, (n) => `GitHub에서 변경사항 ${n}개 더 보기`],
      [/^Changes in (.+)$/, (version) => `${version} 변경사항`],
      [/^(\d+) older releases? on GitHub$/, (n) => `GitHub에서 이전 릴리스 ${n}개 보기`],
      [/^([\d,]+) sessions?$/, (n) => `세션 ${n}개`],
      [
        /^API estimate excludes (\S+) unpriced records\.$/,
        (p) => `API 추정치에서 가격 미정 기록 ${p}는 제외됩니다.`,
      ],
      [/^([<\d.,]+%) of cost$/, (p) => `비용의 ${p}`],
      [/^([<\d.,]+%) of tokens$/, (p) => `토큰의 ${p}`],
      [/^([\d.,]+[KMBT]?) tokens$/, (n) => `토큰 ${n}개`],
      [
        /^([\d.,]+[KMBT]?) tokens have no known price$/,
        (n) => `토큰 ${n}개의 가격 정보가 없습니다`,
      ],
      [/^Enable Cursor usage from (.+)$/, (env) => `${env}에서 Cursor 사용량 활성화`],
      [/^Enable on (.+)$/, (env) => `${env}에서 사용`],
      [/^(.+) could not report usage\.$/, (env) => `${env}에서 사용량을 보고하지 못했습니다.`],
      [/^(\d+) environments$/, (n) => `환경 ${n}개`],
      [/^(\d+) environments? still scanning$/, (n) => `환경 ${n}개 스캔 중`],
      [/^(\d+)% left$/, (n) => `${n}% 남음`],
      [/^(\d+)% of the window left$/, (n) => `기간 ${n}% 남음`],
      [/^(\d+) banked$/, (n) => `${n}개 보유`],
      [/^expires in (.+)$/, (d) => `${d} 후 만료`],
      [/^(\d+) reset credits? banked$/, (n) => `초기화 크레딧 ${n}개 보유`],
      [/^next expires in (.+)$/, (d) => `다음 만료까지 ${d}`],
      [/^\+(\d+)% of pool$/, (n) => `풀의 +${n}%`],
      [
        /^((?:Input|Output) is required on .+)\.$/,
        (text) => {
          const [, field, env] = /^(Input|Output) is required on (.+)$/.exec(text) ?? [];
          return `${env}에서 ${field === "Input" ? "입력" : "출력"} 가격은 필수입니다.`;
        },
      ],
      [
        /^((?:Input|Output|Cache read|Cache write) price for .+)$/,
        (text) => {
          const [, field = "", model = ""] =
            /^(Input|Output|Cache read|Cache write) price for (.+)$/.exec(text) ?? [];
          const names: Record<string, string> = {
            Input: "입력",
            Output: "출력",
            "Cache read": "캐시 읽기",
            "Cache write": "캐시 쓰기",
          };
          return `${model === "new model" ? "새 모델" : model}의 ${names[field] ?? field} 가격`;
        },
      ],
      [/^Undo reset for (.+)$/, (model) => `${model} 초기화 취소`],
      [/^Reset price for (.+) to automatic$/, (model) => `${model} 가격을 자동으로 재설정`],
      [/^Changes apply to (.+)$/, (target) => `변경 내용 적용 대상: ${target}`],
      [/^Remove (.+) from history$/, (label) => `기록에서 ${label} 제거`],
      // Generic catch-all patterns: keep last.
      [/^On (.+)$/, (labels) => `${labels}에 있음`],
      [/^Also on (.+)$/, (labels) => `${labels}에도 있음`],
      [/^(.+) to undo$/, (shortcut) => `${shortcut} 눌러 실행 취소`],
      [/^Updating (.+)$/, (p) => `${p} 업데이트 중`],
      [/^(.+) copied$/, (label) => `${label} 복사됨`],
      [/^Failed to copy (.+)$/, (label) => `${label} 복사 실패`],
      [/^Started (.+)$/, (t) => `${t} 시작`],
      [/^From (\S+)$/, (ref) => `${ref}에서 시작`],
      [/^ on (.+)$/, (e) => ` (${e})`],
      [/^(\d+) failed$/, (n) => `${n}개 실패`],
      [/^updated (.+)$/, (time) => `${time} 업데이트됨`],
      [/^opened (.+)$/, (time) => `${time} 열림`],
    ],
  },
};

/**
 * Translate an English source string into the active language. Falls back to
 * the source string when no translation exists, so partial dictionaries ship
 * safely.
 */
export function translate(source: string, language: InterfaceLanguage = currentLanguage): string {
  const pack = LANGUAGE_PACKS[language];
  if (pack === undefined) return source;
  const direct = pack.dictionary[source];
  if (direct !== undefined) return direct;
  for (const [pattern, render] of pack.patterns) {
    const value = pattern.exec(source)?.[1];
    if (value !== undefined) return render(value);
  }
  return source;
}

/** React hook translating an English source string. */
export function useTranslate() {
  const language = useInterfaceLanguage();
  return useCallback((source: string) => translate(source, language), [language]);
}
