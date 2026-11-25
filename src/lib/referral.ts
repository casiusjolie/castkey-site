// Referral links: getcastkey.netlify.app/r/CODE.
// - Codes are issued by the intake script (Codes tab), once per email, never changed or reused.
// - The first referral link someone arrives through is remembered for 60 days, so credit sticks
//   even if they come back later to apply.
// - Each link open is counted once per browser session.

const env = import.meta.env
const ENDPOINT = env.VITE_SUBMISSION_MODE === 'endpoint' ? (env.VITE_FORM_ENDPOINT as string | undefined) : undefined
const SITE = (env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '')
const REF_KEY = 'ck_ref'
const MINE_KEY = 'ck_mycode'
const KEEP_MS = 60 * 864e5

export const CODE_RE = /^[a-z0-9][a-z0-9-]{1,18}[a-z0-9]$/
const RESERVED = ['admin', 'castkey', 'invite', 'invited', 'investors', 'privacy', 'apply', 'join', 'demo', 'refer', 'calls', 'earn', 'how', 'faq', 'agencies', 'brand', 'brands', 'creator', 'creators', 'partner', 'partners', 'support', 'help', 'team', 'official', 'test']

export const normCode = (c: string) => c.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20)
export const validCode = (c: string) => CODE_RE.test(c) && !RESERVED.includes(c)
export const CODE_HINT = '3 to 20 letters, numbers or hyphens.'

/** Public link for a code. Hosted site: /r/CODE. Preview copy: this page with #invite-CODE. */
export function refLink(code: string) {
  if (SITE) return `${SITE}/r/${code}`
  if (env.VITE_MULTI_PAGE && /^https?:$/.test(location.protocol)) return `${location.origin}/r/${code}`
  return `${location.origin}${location.pathname}#invite-${code}`
}
/** Display form without https://, for showing next to an input. */
export function refPrefix() {
  return refLink('').replace(/^https?:\/\//, '').replace(/#invite-$/, '#invite-')
}

const store = {
  get(k: string) { try { return localStorage.getItem(k) } catch { return null } },
  set(k: string, v: string) { try { localStorage.setItem(k, v) } catch { /* storage blocked */ } },
}

function codeFromUrl(): string {
  try {
    const path = location.pathname.match(/\/r\/([A-Za-z0-9-]{3,20})\/?$/)
    if (path) return normCode(path[1])
    const q = new URLSearchParams(location.search)
    const fromQuery = q.get('ref') || q.get('invite')
    if (fromQuery) return normCode(fromQuery)
    const h = location.hash.match(/^#invite-([A-Za-z0-9-]{3,40})$/)
    if (h) return normCode(h[1])
  } catch { /* ignore */ }
  return ''
}

/** True when this visit arrived through a referral link (used to skip the intro). */
export const arrivedWithRef = () => !!codeFromUrl()

/** Who referred this visitor: the link they came in on, else one remembered from the last 60 days. */
export function readRef(): string {
  const fromUrl = codeFromUrl()
  if (fromUrl && validCode(fromUrl)) {
    const saved = parseSaved()
    if (!saved) store.set(REF_KEY, JSON.stringify({ code: fromUrl, at: Date.now() })) // first link wins
    pingVisit(fromUrl)
    return saved?.code || fromUrl
  }
  return parseSaved()?.code || ''
}
function parseSaved(): { code: string; at: number } | null {
  try {
    const v = JSON.parse(store.get(REF_KEY) || 'null')
    if (v && validCode(v.code) && Date.now() - v.at < KEEP_MS) return v
  } catch { /* ignore */ }
  return null
}

function pingVisit(code: string) {
  if (!ENDPOINT) return
  const k = `ck_seen_${code}`
  try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1') } catch { /* ignore */ }
  fetch(`${ENDPOINT}?visit=${encodeURIComponent(code)}`).catch(() => {})
}

/** This visitor's own code, once they've applied or claimed a link on this device. */
export const myCode = () => store.get(MINE_KEY) || ''
export const saveMyCode = (c: string) => { if (validCode(c)) store.set(MINE_KEY, c) }

export type CheckResult = 'checking' | 'available' | 'taken' | 'invalid' | 'unknown'
export async function checkCode(raw: string): Promise<CheckResult> {
  const c = normCode(raw)
  if (!validCode(c)) return 'invalid'
  if (!ENDPOINT) return 'available'
  try {
    const r = await (await fetch(`${ENDPOINT}?check=${encodeURIComponent(c)}`)).json()
    return r && r.valid ? (r.available ? 'available' : 'taken') : 'invalid'
  } catch {
    return 'unknown'
  }
}

export type ClaimResult = { kind: 'ok'; code: string } | { kind: 'preview'; code: string } | { kind: 'error'; message: string }
export async function claimCode(name: string, email: string, raw: string): Promise<ClaimResult> {
  const code = normCode(raw)
  if (!validCode(code)) return { kind: 'error', message: `That link name won’t work. Use ${CODE_HINT.toLowerCase()}` }
  if (!ENDPOINT) return { kind: 'preview', code }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ audience: 'code', fields: { name, email, code }, submittedAt: new Date().toISOString() }),
    })
    const d = await res.json().catch(() => null)
    if (d && d.received && d.code) { saveMyCode(d.code); return { kind: 'ok', code: d.code } }
    if (d && d.error === 'taken') return { kind: 'error', message: 'That link name is taken. Try another.' }
    if (d && d.error === 'invalid') return { kind: 'error', message: `That link name won’t work. Use ${CODE_HINT.toLowerCase()}` }
    if (d && d.error === 'busy') return { kind: 'error', message: 'Lots of sign-ups right now. Please try again in a minute.' }
    return { kind: 'error', message: 'We couldn’t create your link. Please try again.' }
  } catch {
    return { kind: 'error', message: 'Network problem. Please try again.' }
  }
}

/** Suggest a code from a social link (instagram.com/name → name) or a name. */
export function suggestCode(profile: string, name: string) {
  const handle = profile.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[/?#]/)[1] || ''
  const fromHandle = normCode(handle.replace(/^@/, '').replace(/[._]/g, '-'))
  if (validCode(fromHandle)) return fromHandle
  const fromName = normCode(name.trim().split(/\s+/).join('-'))
  return validCode(fromName) ? fromName : ''
}
