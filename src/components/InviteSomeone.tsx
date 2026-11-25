import { useEffect, useRef, useState } from 'react'
import { referral } from '../content'
import { CODE_HINT, checkCode, claimCode, myCode, normCode, refLink, refPrefix, type CheckResult } from '../lib/referral'

// Inviting someone: a personal referral link (getcastkey.netlify.app/r/CODE) plus Text and Email
// buttons that open the person's own Messages or Mail app with the message already written.

/** Generic link to the application page, used when someone shares without a code of their own. */
export function siteLink(page: 'invite' | 'invited', hash = '') {
  const site = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '')
  if (site) return `${site}/${page}/${hash ? `#${hash}` : ''}`
  if (import.meta.env.VITE_MULTI_PAGE && /^https?:$/.test(location.protocol)) return `${location.origin}/${page}/${hash ? `#${hash}` : ''}`
  return `${location.origin}${location.pathname}#${hash || 'invite'}`
}

/** Pre-written invite. Personal links include a short disclosure that the sender earns a reward. */
export function inviteMessage(link: string, personal: boolean) {
  const disclose = personal ? ' (I earn a referral reward if you join.)' : ''
  const sms = `This is Castkey. Brands pay creators every month to use their face and voice in AI content, and you set the rules. Apply to list your likeness: ${link}${disclose}`
  const subject = 'You’re invited to Castkey'
  const body = [
    'Hey,',
    '',
    'This is Castkey. Brands pay creators every month to use their face and voice in AI content. You set the rules, and you approve every brand before anything is made. No manager needed: their team helps find deals for you.',
    '',
    'It’s free to apply and takes about two minutes:',
    link,
    ...(personal ? ['', 'Full disclosure: I earn a referral reward if you join.'] : []),
  ].join('\n')
  return { sms, subject, body }
}

const enc = encodeURIComponent

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}
const CHAT = 'M4 5h16v11H9l-5 4V5z'
const MAIL = 'M3 6h18v12H3zM3 7l9 6 9-6'
const LINK = 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'

/** Text, Email, Copy and More buttons for one link. */
export function InviteActions({ link, personal = false, tone = 'dark' }: { link: string; personal?: boolean; tone?: 'dark' | 'light' }) {
  const [copied, setCopied] = useState<'' | 'msg' | 'link'>('')
  const m = inviteMessage(link, personal)
  // iOS reads "sms:&body=", Android reads "sms:?body="; "sms:?&body=" works on both.
  const sms = `sms:?&body=${enc(m.sms)}`
  const mail = `mailto:?subject=${enc(m.subject)}&body=${enc(m.body)}`
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  const copy = async (what: 'msg' | 'link') => {
    try {
      await navigator.clipboard.writeText(what === 'msg' ? m.sms : link)
      setCopied(what)
      setTimeout(() => setCopied(''), 2200)
    } catch { /* clipboard blocked: the link is shown on screen to copy by hand */ }
  }
  const more = async () => {
    try { await navigator.share({ title: m.subject, text: m.sms }) } catch { /* cancelled */ }
  }
  const big = tone === 'light' ? 'bg-ink-950 text-paper hover:bg-ink-800' : 'bg-paper text-ink-950 hover:bg-paper/90'
  const small = tone === 'light' ? 'text-ink-950/75 hover:text-ink-950' : 'text-sub hover:text-paper'
  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <a href={sms} className={`press flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-base font-semibold ${big}`}><Icon d={CHAT} /> Send a text</a>
        <a href={mail} className={`press flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-base font-semibold ${big}`}><Icon d={MAIL} /> Send an email</a>
      </div>
      <div className={`mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-medium ${small}`}>
        <button type="button" className="inline-flex min-h-11 items-center gap-2" onClick={() => copy('link')}><Icon d={LINK} /> {copied === 'link' ? 'Link copied' : 'Copy link'}</button>
        <button type="button" className="min-h-11" onClick={() => copy('msg')}>{copied === 'msg' ? 'Message copied' : 'Copy message'}</button>
        {canShare && <button type="button" className="min-h-11" onClick={more}>More apps</button>}
      </div>
      <p className="sr-only" aria-live="polite">{copied ? 'Copied.' : ''}</p>
    </div>
  )
}

/** Live availability check for a link name, debounced. */
export function useCodeCheck(raw: string) {
  const [state, setState] = useState<CheckResult | ''>('')
  useEffect(() => {
    const c = normCode(raw)
    if (!c) { setState(''); return }
    setState('checking')
    const t = setTimeout(async () => setState(await checkCode(c)), 450)
    return () => clearTimeout(t)
  }, [raw])
  return state
}

export function CodeStatus({ state, id }: { state: CheckResult | ''; id: string }) {
  const text = { '': '', checking: 'Checking…', available: '✓ Available', taken: 'Taken. Try another.', invalid: CODE_HINT, unknown: 'Couldn’t check right now. You can still continue.' }[state]
  const color = state === 'available' ? 'text-ice' : state === 'taken' || state === 'invalid' ? 'text-coral' : 'text-mute'
  return <p id={id} className={`mt-2 min-h-5 text-xs ${color}`} aria-live="polite">{text}</p>
}

/** Link-name input with the site prefix shown in front of it. */
export function CodeInput({ id, value, onChange, tone = 'dark' }: { id: string; value: string; onChange: (v: string) => void; tone?: 'dark' | 'light' }) {
  const wrap = tone === 'light' ? 'border-ink-950/25 bg-paper text-ink-950 focus-within:border-ink-950' : 'border-line bg-ink-800 focus-within:border-ice'
  return (
    <div className={`flex items-center overflow-hidden rounded-xl border ${wrap}`}>
      <span className={`max-w-[55%] shrink-0 truncate pl-3 text-sm ${tone === 'light' ? 'text-ink-950/55' : 'text-mute'}`} aria-hidden="true">{refPrefix()}</span>
      <input id={id} className="w-full min-w-0 bg-transparent py-3 pr-3 text-base outline-none" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={value} onChange={(e) => onChange(normCode(e.target.value))} placeholder="yourname" aria-describedby={`${id}-status`} />
    </div>
  )
}

/** Get your own referral link (no application needed), then share it. Shows your link if you already have one. */
export function ReferralKit({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [code, setCode] = useState(myCode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [want, setWant] = useState('')
  const [touched, setTouched] = useState(false)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(false)
  const [generic, setGeneric] = useState(false)
  const check = useCodeCheck(want)
  const first = useRef(0)

  // Suggest a link from the name until the person edits the link themselves.
  useEffect(() => { if (!touched) setWant(normCode(name.trim().split(/\s+/).join('-'))) }, [name, touched])

  const label = tone === 'light' ? 'mb-2 block text-sm font-medium text-ink-950' : 'field-label'
  const field = tone === 'light' ? 'w-full rounded-xl border border-ink-950/25 bg-paper px-3 py-3 text-base text-ink-950 outline-none focus:border-ink-950' : 'field'

  if (code) {
    return (
      <div>
        <p className={`text-sm ${tone === 'light' ? 'text-ink-950/70' : 'text-sub'}`}>{preview ? 'Preview link (this copy of the page doesn’t create real links):' : 'Your referral link'}</p>
        <p className={`mt-1 break-all font-mono text-base ${tone === 'light' ? 'text-ink-950' : 'text-paper'}`}>{refLink(code).replace(/^https?:\/\//, '')}</p>
        <div className="mt-4"><InviteActions link={refLink(code)} personal tone={tone} /></div>
      </div>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (!name.trim()) { setMsg('Enter your name.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setMsg('Enter an email like name@example.com.'); return }
    if (check === 'taken') { setMsg('That link name is taken. Try another.'); return }
    if (!first.current || Date.now() - first.current < 1000) { first.current = Date.now() - 1000; setMsg('Please check your details, then press the button again.'); return }
    setBusy(true); setMsg('Creating your link…')
    const r = await claimCode(name.trim(), email.trim(), want)
    setBusy(false)
    if (r.kind === 'error') { setMsg(r.message); return }
    setMsg('')
    setPreview(r.kind === 'preview')
    setCode(r.code)
  }

  return (
    <div>
      <form noValidate onSubmit={submit} onInput={() => { if (!first.current) first.current = Date.now() }} className="grid gap-4 text-left">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor={`rk-name-${tone}`} className={label}>Your name</label><input id={`rk-name-${tone}`} className={field} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label htmlFor={`rk-email-${tone}`} className={label}>Email, so we can pay you</label><input id={`rk-email-${tone}`} type="email" className={field} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        </div>
        <div>
          <label htmlFor={`rk-code-${tone}`} className={label}>Pick your link</label>
          <CodeInput id={`rk-code-${tone}`} value={want} onChange={(v) => { setTouched(true); setWant(v) }} tone={tone} />
          <CodeStatus state={check} id={`rk-code-${tone}-status`} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={tone === 'light' ? 'btn-dark press' : 'btn-primary press'} disabled={busy}>{busy ? 'Creating…' : 'Get my referral link'}</button>
          <p className={`text-sm ${tone === 'light' ? 'text-ink-950' : 'text-coral'}`} aria-live="polite">{msg}</p>
        </div>
        <p className={`text-xs ${tone === 'light' ? 'text-ink-950/65' : 'text-mute'}`}>{referral.short} Already have a link? Enter the same email and we’ll show it.</p>
      </form>
      <div className="mt-4 text-center">
        <button type="button" className={`text-sm underline underline-offset-4 ${tone === 'light' ? 'text-ink-950/70' : 'text-sub'}`} onClick={() => setGeneric((g) => !g)} aria-expanded={generic}>
          {generic ? 'Hide' : 'Just share Castkey, without a referral link'}
        </button>
        {generic && <div className="mt-4"><InviteActions link={siteLink('invite')} tone={tone} /></div>}
      </div>
    </div>
  )
}

/** "Invite a creator" button that opens the referral kit inline. */
export function InviteSomeone({ label = 'Invite a creator', tone = 'dark' }: { label?: string; tone?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false)
  const btn = tone === 'light' ? 'border-ink-950/25 text-ink-950 hover:bg-ink-950/5' : 'border-line text-paper hover:bg-paper/5'
  return (
    <div className="flex flex-col items-center">
      <button type="button" className={`press inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-base font-semibold ${btn}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19 8v6M22 11h-6" />
        {label}
      </button>
      {open && (
        <div role="group" aria-label="Invite a creator" className="material mt-3 w-[min(92vw,520px)] rounded-3xl p-5 text-left text-paper" style={{ animation: 'materialize 360ms cubic-bezier(0.22,1,0.36,1) both' }}>
          <p className="text-base font-semibold">{referral.headline}</p>
          <p className="mt-1 mb-4 text-sm text-sub">{referral.short}</p>
          <ReferralKit />
        </div>
      )}
    </div>
  )
}
