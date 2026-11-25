import { useEffect, useRef, useState } from 'react'

// Send someone an invite by text or email. Both open the person's own Messages or Mail app
// with the message already written, so they only have to pick who it goes to and press send.

/** Link to the application page. With VITE_SITE_URL set it points at /invite/ (its own share thumbnail). */
export function siteLink(page: 'invite' | 'invited', hash = '') {
  const site = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '')
  if (site) return `${site}/${page}/${hash ? `#${hash}` : ''}`
  // Hosted build (Netlify etc.): use this site's own /invite/ and /invited/ pages.
  if (import.meta.env.VITE_MULTI_PAGE && /^https?:$/.test(location.protocol)) return `${location.origin}/${page}/${hash ? `#${hash}` : ''}`
  return `${location.origin}${location.pathname}#${hash || 'invite'}`
}

export function inviteMessage(link: string) {
  const sms = `This is Castkey. Brands pay creators every month to use their face and voice in AI content, and you set the rules. Apply to list your likeness: ${link}`
  const subject = 'You’re invited to Castkey'
  const body = [
    'Hey,',
    '',
    'This is Castkey. Brands pay creators every month to use their face and voice in AI content. You set the rules, and you approve every brand before anything is made.',
    '',
    'It’s free to apply and takes about two minutes:',
    link,
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

/** The two big buttons plus copy, used inline (after applying) and inside the popover. */
export function InviteActions({ link, tone = 'dark' }: { link: string; tone?: 'dark' | 'light' }) {
  const [copied, setCopied] = useState(false)
  const m = inviteMessage(link)
  // iOS reads "sms:&body=", Android reads "sms:?body="; "sms:?&body=" works on both.
  const sms = `sms:?&body=${enc(m.sms)}`
  const mail = `mailto:?subject=${enc(m.subject)}&body=${enc(m.body)}`
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(m.sms)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* clipboard blocked: the link is shown below to copy by hand */ }
  }
  const more = async () => {
    try { await navigator.share({ title: m.subject, text: m.sms }) } catch { /* cancelled */ }
  }
  const big = tone === 'light'
    ? 'bg-ink-950 text-paper hover:bg-ink-800'
    : 'bg-paper text-ink-950 hover:bg-paper/90'
  const small = tone === 'light' ? 'text-ink-950/70 hover:text-ink-950' : 'text-sub hover:text-paper'
  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <a href={sms} className={`press flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-base font-semibold ${big}`}>
          <Icon d={CHAT} /> Send a text
        </a>
        <a href={mail} className={`press flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-base font-semibold ${big}`}>
          <Icon d={MAIL} /> Send an email
        </a>
      </div>
      <div className={`mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-medium ${small}`}>
        <button type="button" className="inline-flex min-h-11 items-center gap-2" onClick={copy}>
          <Icon d={LINK} /> {copied ? 'Message and link copied' : 'Copy message and link'}
        </button>
        {canShare && <button type="button" className="min-h-11" onClick={more}>More apps</button>}
      </div>
      <p className="sr-only" aria-live="polite">{copied ? 'Copied.' : ''}</p>
    </div>
  )
}

/** "Invite a creator" button that opens a small panel with the actions above. */
export function InviteSomeone({ label = 'Invite a creator', tone = 'dark' }: { label?: string; tone?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const link = siteLink('invite')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [open])

  const btn = tone === 'light'
    ? 'border-ink-950/25 text-ink-950 hover:bg-ink-950/5'
    : 'border-line text-paper hover:bg-paper/5'

  return (
    <div ref={wrap} className="flex flex-col items-center">
      <button type="button" className={`press inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-base font-semibold ${btn}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19 8v6M22 11h-6" />
        {label}
      </button>
      {open && (
        <div role="group" aria-label="Invite a creator" className="material mt-3 w-[min(92vw,420px)] rounded-3xl p-5 text-left text-paper" style={{ animation: 'materialize 360ms cubic-bezier(0.22,1,0.36,1) both' }}>
          <p className="text-base font-semibold">Invite someone to Castkey</p>
          <p className="mt-1 text-sm text-sub">The message is written for you. Just pick who it goes to.</p>
          <div className="mt-4"><InviteActions link={link} /></div>
        </div>
      )}
    </div>
  )
}
