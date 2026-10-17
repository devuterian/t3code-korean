import { useAtomValue } from "@effect/atom-react";
import { EnvironmentId } from "@t3tools/contracts";
import { Atom } from "effect/reactivity";

import { environmentThreadShells } from "~/state/threads";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useTranslate } from "../../i18n/translate";
import { Button } from "../ui/button";
import type { RestartingMachine, SkippedMachine } from "./updateEverything.logic";

/** A thread an agent is working on now. A restart stops these; queued threads wait. */
const isRunning = (status: string) =>
  status === "preparing" || status === "starting" || status === "running";

/** Running threads across the environments in a newline-joined key. */
const runningThreadCountAtom = Atom.family((environmentIds: string) =>
  Atom.make((get) =>
    environmentIds
      .split("\n")
      .filter((id) => id !== "")
      .reduce(
        (count, id) =>
          count +
          get(environmentThreadShells.environmentThreadsAtom(EnvironmentId.make(id))).filter(
            (thread) => isRunning(thread.status),
          ).length,
        0,
      ),
  ).pipe(Atom.withLabel(`update-everything-running-threads:${environmentIds}`)),
);

interface UpdateEverythingDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly summary: string;
  readonly lines: ReadonlyArray<string>;
  readonly restarts: ReadonlyArray<RestartingMachine>;
  /** Behind machines the run leaves alone. */
  readonly skipped: ReadonlyArray<SkippedMachine>;
  readonly onConfirm: () => void;
}

/**
 * Confirms an "update everything" run. It counts the running threads that the
 * restarts stop, and how many can resume afterwards because "Continue threads
 * after restarts" is on for their server. Recovery still skips some, such as a
 * thread waiting on the user, so the text says "can resume", not "will".
 * Machines the run skips are listed with the reason, so none drop silently.
 */
export function UpdateEverythingDialog({
  open,
  onOpenChange,
  ...content
}: UpdateEverythingDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        {/* The popup unmounts when closed, so the thread count is read only while open. */}
        <UpdateEverythingDialogContent {...content} />
      </AlertDialogPopup>
    </AlertDialog>
  );
}

function UpdateEverythingDialogContent({
  summary,
  lines,
  restarts,
  skipped,
  onConfirm,
}: Omit<UpdateEverythingDialogProps, "open" | "onOpenChange">) {
  const t = useTranslate();
  const stopped = useAtomValue(
    runningThreadCountAtom(
      restarts
        .filter((machine) => !machine.continuesThreads)
        .map((machine) => machine.environmentId)
        .join("\n"),
    ),
  );
  const continuing = useAtomValue(
    runningThreadCountAtom(
      restarts
        .filter((machine) => machine.continuesThreads)
        .map((machine) => machine.environmentId)
        .join("\n"),
    ),
  );
  const running = stopped + continuing;
  const threads = t(running === 1 ? "{count} running thread" : "{count} running threads").replace(
    "{count}",
    () => String(running),
  );

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{t("{summary}?").replace("{summary}", () => summary)}</AlertDialogTitle>
        <AlertDialogDescription className="whitespace-pre-line">
          {lines.join("\n")}
        </AlertDialogDescription>
        {running > 0 ? (
          <p className="pt-2 text-sm">
            {stopped === 0
              ? t("{threads} will be interrupted and can resume after the restart.").replace(
                  "{threads}",
                  () => threads,
                )
              : continuing === 0
                ? t("{threads} will be interrupted.").replace("{threads}", () => threads)
                : t("{threads} will be interrupted. {count} can resume after the restart.")
                    .replace("{threads}", () => threads)
                    .replace("{count}", () => String(continuing))}
          </p>
        ) : null}
        {skipped.length > 0 ? (
          <p className="whitespace-pre-line pt-2 text-sm">
            {skipped
              .map((machine) =>
                t("Skips {label}: {reason}")
                  .replace("{label}", () => machine.label)
                  .replace("{reason}", () => machine.reason),
              )
              .join("\n")}
          </p>
        ) : null}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogClose render={<Button variant="outline" />}>{t("Cancel")}</AlertDialogClose>
        <Button onClick={onConfirm}>{t("Update")}</Button>
      </AlertDialogFooter>
    </>
  );
}
