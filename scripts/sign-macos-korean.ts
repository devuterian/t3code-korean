import { sign as signApplication, type SignOptions } from "@electron/osx-sign";

/** Sign the Korean fork's mac app with the self-signed identity from the environment. */
export default async function sign(options: SignOptions): Promise<void> {
  const identity = process.env.T3CODE_MAC_SIGN_IDENTITY?.trim();
  if (!identity) {
    throw new Error("T3CODE_MAC_SIGN_IDENTITY is required for Korean fork mac signing.");
  }
  const keychain = process.env.T3CODE_MAC_SIGN_KEYCHAIN?.trim();
  await signApplication({
    ...options,
    identity,
    identityValidation: false,
    ...(keychain ? { keychain } : {}),
    batchCodesignCalls: true,
  });
}
