import type { EnvironmentId, ThreadId } from "@t3tools/contracts";
import { useState, type ReactNode } from "react";

import type { MediaActionsSource } from "../../lib/mediaActionsSource";
import { ImageCiteContext } from "../../state/mediaActions";
import { ImageRegionCiteModal } from "./ImageRegionCiteModal";

/**
 * Lets image menus under a thread offer "Cite region" into that thread's draft.
 * A null threadId keeps the provider mounted (so the subtree is not remounted) but disables citing.
 */
export function ImageCiteProvider(props: {
  readonly environmentId: EnvironmentId;
  readonly threadId: ThreadId | null;
  readonly children: ReactNode;
}) {
  const [source, setSource] = useState<MediaActionsSource | null>(null);
  const threadId = props.threadId;
  return (
    <ImageCiteContext value={threadId === null ? null : setSource}>
      {props.children}
      {source && threadId !== null ? (
        <ImageRegionCiteModal
          source={source}
          environmentId={props.environmentId}
          threadId={threadId}
          onClose={() => setSource(null)}
        />
      ) : null}
    </ImageCiteContext>
  );
}
