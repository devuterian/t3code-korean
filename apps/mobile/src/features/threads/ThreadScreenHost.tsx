import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Platform, View } from "react-native";
import { ThreadDetailScreen, type ThreadDetailScreenProps } from "./ThreadDetailScreen";
import { ImageCiteProvider } from "../imageCite/ImageCiteProvider";

type ThreadScreenContent =
  | { readonly props: ThreadDetailScreenProps }
  | { readonly fallback: ReactNode; readonly header?: ReactNode };

function createThreadScreenStore() {
  let current: ThreadScreenContent | null = null;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => current,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    publish: (content: ThreadScreenContent) => {
      current = content;
      for (const listener of listeners) listener();
    },
  };
}
const ThreadScreenContext = createContext<ReturnType<typeof createThreadScreenStore> | null>(null);

function ThreadScreenOutlet() {
  const store = useContext(ThreadScreenContext)!;
  const content = useSyncExternalStore(store.subscribe, store.getSnapshot);
  if (content === null) return null;
  const body = "props" in content ? <ThreadDetailScreen {...content.props} /> : content.fallback;
  const screen = (
    <>
      {"props" in content ? content.props.header : content.header}
      {Platform.OS === "android" ? (
        <View className="flex-1 overflow-hidden rounded-t-[28px] bg-thread-canvas">{body}</View>
      ) : (
        body
      )}
    </>
  );
  if (!("props" in content)) return screen;
  // Image region citation targets a live thread's draft; draft screens have no thread yet.
  // The provider stays mounted across the draft-to-live switch so the screen is not remounted.
  return (
    <ImageCiteProvider
      environmentId={content.props.environmentId}
      threadId={content.props.draftMode ? null : content.props.selectedThread.id}
    >
      {screen}
    </ImageCiteProvider>
  );
}

// Controllers can change from draft to live without replacing the native screen,
// the keyboard host, or the editor. Publish before paint to avoid an intermediate frame.
export function ThreadScreenHost({ children }: { readonly children: ReactNode }) {
  const [store] = useState(createThreadScreenStore);
  return (
    <ThreadScreenContext.Provider value={store}>
      {children}
      <View className="flex-1 bg-screen android:bg-header">
        <ThreadScreenOutlet />
      </View>
    </ThreadScreenContext.Provider>
  );
}

export function ThreadScreenBinding(props: ThreadDetailScreenProps) {
  const store = useContext(ThreadScreenContext)!;
  useLayoutEffect(() => {
    store.publish({ props });
  });
  return null;
}

export function ThreadScreenFallback({
  children,
  header,
}: {
  readonly children: ReactNode;
  readonly header?: ReactNode;
}) {
  const store = useContext(ThreadScreenContext)!;
  useLayoutEffect(() => {
    store.publish({ fallback: children, header });
  });
  return null;
}
