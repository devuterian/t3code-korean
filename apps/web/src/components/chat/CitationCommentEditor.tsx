import { ASSISTANT_CITATION_MAX_COMMENT_LENGTH, type EnvironmentId } from "@t3tools/contracts";
import { T, useGT, Var } from "gt-react";
import {
  use,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { TextFieldSpeechControls, useTextFieldSpeech } from "~/speech/useTextFieldSpeech";
import type { AssistantCitationSourceAnchor } from "~/lib/assistantTextSelection";
import { textDirection } from "~/textDirection";

import { ComposerContextActionsContext } from "../composerContextActions";
import { Button } from "../ui/button";
import { usePrimaryEnvironmentId } from "~/state/environments";

type CitationCommentEditorProps = {
  initialComment?: string;
  /** Input typed before the editor mounted, handed over until the textarea takes focus. */
  commentInput?: AssistantCitationSourceAnchor["commentInput"];
  label: string;
  description: string;
  submitLabel: string;
  /** Holds submission while the owner finishes the previous one. */
  submitDisabled?: boolean;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  /** Names the dictation target when the surrounding composer context has no environment. */
  speechEnvironmentId?: EnvironmentId | null;
  /** Separates this field's dictation state from other citation comments. */
  speechOwnerKey?: string;
  onSubmit: (comment: string) => boolean | void;
  onSubmitAndSend?: (comment: string) => boolean | void;
  onCancel: () => void;
  onDraftChange?: (comment: string) => void;
  onVoiceSetupOpenChange?: (open: boolean) => void;
};

type CitationCommentFieldsProps = Omit<CitationCommentEditorProps, "speechEnvironmentId"> & {
  environmentId: EnvironmentId;
};

/** The comment field shared by text and image citations. Enter submits; Escape cancels. */
export function CitationCommentEditor(props: CitationCommentEditorProps) {
  const { environmentId: contextEnvironmentId } = use(ComposerContextActionsContext);
  const primaryEnvironmentId = usePrimaryEnvironmentId();
  const environmentId = contextEnvironmentId ?? props.speechEnvironmentId ?? primaryEnvironmentId;
  if (environmentId === null) return null;
  return <CitationCommentFields {...props} environmentId={environmentId} />;
}

function CitationCommentFields({
  environmentId,
  speechOwnerKey,
  initialComment = "",
  commentInput,
  label,
  description,
  submitLabel,
  submitDisabled = false,
  inputRef,
  onSubmit,
  onSubmitAndSend,
  onCancel,
  onDraftChange,
  onVoiceSetupOpenChange,
}: CitationCommentFieldsProps) {
  const gt = useGT();
  const [comment, setComment] = useState(commentInput?.text ?? initialComment);
  const localInputRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaRef = inputRef ?? localInputRef;
  const { projectId } = use(ComposerContextActionsContext);
  const updateComment = (text: string) => {
    setComment(text);
    onDraftChange?.(text);
  };
  const receiveCommentInput = useEffectEvent((text: string) => {
    if (commentInput?.cancelled) onCancel();
    else updateComment(text);
  });
  // oxlint-disable-next-line t3code/no-unreasoned-state-sync -- transfers input buffered while the citation popover was mounting into its editor
  useLayoutEffect(() => {
    return commentInput?.subscribe(receiveCommentInput);
  }, [commentInput]);
  const speech = useTextFieldSpeech({
    environmentId,
    projectId,
    ownerKey: speechOwnerKey ?? JSON.stringify(["citation-comment", label]),
    text: comment,
    textareaRef,
    onTextChange: updateComment,
  });
  const setupOpen = speech.setup.open;
  // oxlint-disable-next-line t3code/no-unreasoned-state-sync -- keeps the citation popover open while the voice setup dialog owns focus
  useEffect(() => {
    onVoiceSetupOpenChange?.(setupOpen);
    return () => onVoiceSetupOpenChange?.(false);
  }, [onVoiceSetupOpenChange, setupOpen]);
  const commentTooLong = comment.length > ASSISTANT_CITATION_MAX_COMMENT_LENGTH;
  const submit = () => {
    speech.submitAfterDictation((text) => {
      if (!submitDisabled && text.length <= ASSISTANT_CITATION_MAX_COMMENT_LENGTH) onSubmit(text);
    });
  };
  const submitAndSend = () => {
    speech.submitAfterDictation((text) => {
      if (!submitDisabled && text.length <= ASSISTANT_CITATION_MAX_COMMENT_LENGTH) {
        (onSubmitAndSend ?? onSubmit)(text);
      }
    });
  };

  return (
    <div
      data-citation-comment-editor="true"
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.nativeEvent.isComposing || event.keyCode === 229) return;
        if (event.key === "Escape") {
          event.preventDefault();
          if (speech.state.phase !== "idle") speech.cancel();
          else onCancel();
        }
      }}
    >
      <textarea
        ref={textareaRef}
        onFocus={() => {
          commentInput?.release();
        }}
        readOnly={speech.freezesEditor}
        aria-label={label}
        aria-description={description}
        aria-invalid={commentTooLong || undefined}
        placeholder={gt("Add an optional comment...")}
        rows={2}
        dir={textDirection(comment)}
        className="field-sizing-content block max-h-40 min-h-16 w-full resize-none bg-transparent px-1 py-1.5 text-base outline-none placeholder:text-muted-foreground sm:text-sm"
        value={comment}
        onChange={(event) => updateComment(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing &&
            event.keyCode !== 229
          ) {
            event.preventDefault();
            if (event.metaKey || event.ctrlKey) {
              submitAndSend();
            } else {
              submit();
            }
          }
        }}
      />
      {commentTooLong ? (
        <p role="status" className="pt-1 text-xs text-destructive">
          <T>
            Comments can contain up to{" "}
            <Var>{ASSISTANT_CITATION_MAX_COMMENT_LENGTH.toLocaleString()}</Var> characters.
          </T>
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
        <TextFieldSpeechControls speech={speech} />
        {/* Wrap as a pair so the recording pill never pushes Save alone onto a new row under Cancel. */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="xs"
            // Escape cancels; keep Tab from the comment on Save so Enter cannot discard a new citation.
            tabIndex={-1}
            onPointerDown={(event) => event.preventDefault()}
            onClick={onCancel}
          >
            <T>Cancel</T>
          </Button>
          <Button
            size="xs"
            disabled={
              speech.preparing || submitDisabled || (commentTooLong && !speech.blocksSubmission)
            }
            onPointerDown={(event) => event.preventDefault()}
            onClick={submit}
          >
            {commentTooLong ? gt("Shorten comment") : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
