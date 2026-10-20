import { View } from "react-native";
import { Notice } from "../../components/ui/Notice";
import { useTranslate } from "../../i18n/translate";

/** Why the thread's last message did not send, above the composer until dismissed. */
export function ComposerErrorNotice(props: {
  readonly message: string;
  readonly onDismiss: () => void;
}) {
  const t = useTranslate();
  return (
    <View className="px-4 pb-3">
      <Notice
        message={props.message}
        icon="exclamationmark.circle"
        iconTone="danger"
        floating
        onDismiss={props.onDismiss}
        dismissLabel={t("Dismiss error")}
      />
    </View>
  );
}
