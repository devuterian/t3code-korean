import type { ServerProvider } from "@t3tools/contracts";
import { useEffect, useState } from "react";

import { useClientSettings } from "../../hooks/useSettings";
import { useTranslate } from "../../i18n/translate";
import { limitedUntilLabel } from "./ProviderPoolsSettings.logic";

const LIMIT_EXPIRY_CHECK_MS = 30_000;

/**
 * The server publishes `limitedUntil` once and never again when it passes, so this reads the
 * clock itself and drops the label when the account is usable again.
 */
export function ProviderLimitedUntil({
  provider,
  className,
}: {
  readonly provider: Pick<ServerProvider, "limitedUntil"> | undefined;
  readonly className?: string;
}) {
  const t = useTranslate();
  const timestampFormat = useClientSettings((settings) => settings.timestampFormat);
  const [nowMs, setNowMs] = useState(() => Date.now());
  // oxlint-disable-next-line t3code/react-effect-budget -- the server never re-publishes an expired limit, so the label needs a clock.
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), LIMIT_EXPIRY_CHECK_MS);
    return () => clearInterval(id);
  }, []);
  const label = provider ? limitedUntilLabel(provider, nowMs, timestampFormat) : null;
  return label === null ? null : <span className={className}>{t(label)}</span>;
}
