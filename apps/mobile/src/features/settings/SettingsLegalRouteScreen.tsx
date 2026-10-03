import { SettingsLegalDocumentRouteScreen } from "./components/SettingsLegalDocumentRouteScreen";
import { LEGAL_URL } from "./lib/legal-document-url";
import { useTranslate } from "../../i18n/translate";

export function SettingsLegalRouteScreen() {
  const t = useTranslate();
  return <SettingsLegalDocumentRouteScreen documentName={t("Legal")} documentUrl={LEGAL_URL} />;
}
