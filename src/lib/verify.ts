// Identity verification adapter.
//
// ID images and selfies must go straight to a verification provider (for example Persona or Veriff)
// through the provider's own hosted or embedded flow. Castkey's site and servers never receive or
// store the images; they keep only the provider's reference id and the pass/fail result.
//
// To connect a provider: set VITE_VERIFY_MODE=provider and implement `providerVerifier.start()` with
// the provider's client SDK (it should open their flow, then resolve with the outcome and reference).
// Your backend should confirm the result with the provider's API or webhook before trusting it.

export type VerifyResult =
  | { kind: 'passed'; reference: string }
  | { kind: 'failed'; message: string }
  | { kind: 'unavailable' } // no provider connected (preview)

export interface Verifier {
  readonly mode: 'preview' | 'provider'
  start(applicant: { name: string; email: string }): Promise<VerifyResult>
}

const previewVerifier: Verifier = {
  mode: 'preview',
  async start() {
    await new Promise((r) => setTimeout(r, 600))
    return { kind: 'unavailable' }
  },
}

const providerVerifier: Verifier = {
  mode: 'provider',
  async start() {
    // Placeholder until a provider SDK is wired in. Never fake a pass.
    return { kind: 'failed', message: 'Verification provider not configured yet.' }
  },
}

export function getVerifier(): Verifier {
  return import.meta.env.VITE_VERIFY_MODE === 'provider' ? providerVerifier : previewVerifier
}
