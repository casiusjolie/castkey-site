// Application submission adapter.
//
// The page talks only to `getSubmitter()`. In "endpoint" mode it posts to VITE_FORM_ENDPOINT, which is
// the Google Apps Script web app in google-apps-script/Code.gs. That script appends each application as
// a row in the "Castkey applications" Google Sheet (Creators, Brands or Partners tab).
//
// Contract: POST { audience, fields, submittedAt } as text/plain JSON  ->  { "received": true }
// (text/plain keeps it a "simple" request, which Apps Script can answer without a CORS preflight).
// Anything else is treated as a failure, and the form keeps the user's values for a retry.

export type Audience = 'brand' | 'creator' | 'partner'

export type BrandFields = {
  name: string
  email: string
  company: string
  website: string
  brandType: string
  intendedUse: string
  adSpend: string // monthly paid social / ads spend range (brands)
  creatorSpend: string // monthly spend on UGC creators and influencers, incl. usage rights (brands)
  paysUsage: string // pays creators for usage rights or whitelisting today: Yes / No / Not sure
  aiTools: string // AI ad tools they use today, comma separated
  rosterSize?: string // agencies and managers: how many creators they represent
  managesDeals?: string // agencies and managers: do they handle brand deals for their creators today
}
export type CreatorFields = {
  name: string
  email: string
  profileUrl: string // main social link
  followers: string // follower range (optional)
  licensing: string // Face / Voice / Face and voice
  neverAllowed: string // topics they tapped as off limits
  note: string // anything else (optional)
  invitedBy: string // invite code from the link they arrived through, if any
  inviteCode: string // this creator's own code, for the invite link they share
}
export type Payload =
  | { audience: 'brand'; fields: BrandFields }
  | { audience: 'partner'; fields: BrandFields } // reuses brand fields: company = agency, intendedUse = roster
  | { audience: 'creator'; fields: CreatorFields }
  | { audience: 'privacy'; fields: { email: string; request: string; details: string } }

export type SubmitResult =
  | { kind: 'received'; code?: string } // the sheet confirmed the row was saved (creators get their referral code back)
  | { kind: 'demo' } // preview mode: nothing was sent
  | { kind: 'error'; message: string }

export interface Submitter {
  readonly mode: 'demo' | 'endpoint'
  submit(payload: Payload, signal?: AbortSignal): Promise<SubmitResult>
}

const env = import.meta.env

/** Readable invite code, e.g. "jordan-7k2q". Saved with the application so referrals can be traced. */
export function makeInviteCode(name: string) {
  const base = name.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'creator'
  const rand = Math.random().toString(36).slice(2, 6)
  return `${base}-${rand}`
}

/** Who referred this visitor (referral link, or one remembered for 60 days). See lib/referral.ts. */
export { readRef as readInviteCode } from './referral'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Demo mode: validates on the client, sends nothing, never claims success. */
export const demoSubmitter: Submitter = {
  mode: 'demo',
  async submit(payload) {
    await wait(900) // lets the progress state be seen and tested
    // Test hook: an email containing "+fail" simulates a failed submission.
    if (payload.fields.email.includes('+fail')) {
      return { kind: 'error', message: 'Simulated failure (demo). Your answers are still here, so you can try again.' }
    }
    return { kind: 'demo' }
  },
}

export function endpointSubmitter(url: string): Submitter {
  return {
    mode: 'endpoint',
    async submit(payload, signal) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
          signal,
        })
        if (res.status === 429) return { kind: 'error', message: 'Too many attempts. Please wait a minute and try again.' }
        const data = await res.json().catch(() => null)
        if (res.ok && data && data.received === true) return { kind: 'received', code: typeof data.code === 'string' ? data.code : undefined }
        return { kind: 'error', message: 'We could not confirm your application was received. Please try again.' }
      } catch {
        return { kind: 'error', message: 'Network problem. Your answers are still here, so you can try again.' }
      }
    },
  }
}

export function getSubmitter(): Submitter {
  const mode = env.VITE_SUBMISSION_MODE
  const url = env.VITE_FORM_ENDPOINT
  if (mode === 'endpoint' && url) return endpointSubmitter(url)
  return demoSubmitter
}

export const legalLinks = {
  privacy: (env.VITE_PRIVACY_URL as string | undefined) || '/privacy/',
  terms: (env.VITE_TERMS_URL as string | undefined) || '',
}
