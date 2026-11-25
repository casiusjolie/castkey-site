import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Mark } from './Logo'
import { arrivedWithRef } from '../lib/referral'
import { fastTrackKey } from '../lib/fasttrack'
import casius from '../assets/casius.jpg'
import maya from '../assets/maya.jpg'
import jordan from '../assets/jordan.jpg'

// Opening sequence: a few full-screen scenes that explain Castkey in plain words.
// Each scene opens out of one element of the scene before it (a growing circle from
// that element), then the last scene opens into the page itself.
// Tap or press → to go on, ← to go back, Esc to skip. Shown once per visit.

const SEEN = 'ck-intro-seen'
const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'
const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

type Scene = { id: string; ms: number; tone: 'ink' | 'paper' | 'coral'; label: string; body: () => ReactNode }

function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <p className={`iz text-sm font-medium ${dark ? 'text-ink-900/70' : 'text-ice'}`} style={d(150)}>{children}</p>
}

const SCENES: Scene[] = [
  {
    id: 'open', ms: 2600, tone: 'ink', label: 'Meet Castkey',
    body: () => (
      <div className="flex flex-col items-center text-center">
        <span className="intro-mark" data-portal>
          <Mark className="h-28 w-28 sm:h-36 sm:w-36" />
        </span>
        <h2 className="iz mt-8 font-display text-5xl tracking-[-0.03em] sm:text-6xl" style={d(500)}>Castkey</h2>
        <p className="iz mt-3 text-lg text-sub" style={d(750)}>Here’s how it works, in 40 seconds.</p>
      </div>
    ),
  },
  {
    id: 'problem', ms: 4400, tone: 'paper', label: 'The problem',
    body: () => (
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow dark>The problem</Eyebrow>
          <h2 className="iz mt-3 font-display text-4xl leading-none tracking-[-0.03em] text-ink-950 sm:text-6xl" style={d(250)}>Brands are stuck using fake AI people.</h2>
          <p className="iz mt-4 max-w-[38ch] text-base text-ink-900/70 sm:mt-5 sm:text-lg" style={d(450)}>Brands make ads with AI now, but there’s been no simple, legal way to use a real person. So they settle for generic AI avatars that audiences can spot. Real creators get nothing.</p>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-3">
            {[jordan, casius, maya].map((src, i) => (
              <figure key={i} className="iz relative overflow-hidden rounded-2xl bg-ink-900/10" style={d(500 + i * 140)} {...(i === 1 ? { 'data-portal': '' } : {})}>
                <img src={src} alt="" className={`aspect-[4/5] w-full object-cover ${i === 1 ? '' : 'grayscale'}`} />
                <span className={`iz absolute inset-x-2 bottom-2 rounded-full py-1 text-center text-xs font-medium backdrop-blur ${i === 1 ? 'bg-coral text-ink-950' : 'bg-ink-950/75 text-paper'}`} style={d(1300 + i * 200)}>{i === 1 ? 'Real, licensed' : 'AI fake'}</span>
              </figure>
            ))}
          </div>
          <p className="iz mt-3 text-xs text-ink-900/50" style={d(900)}>Left and right are AI-generated. The middle is a real creator.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'ask', ms: 4800, tone: 'ink', label: 'They ask first',
    body: () => (
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>Castkey changes that</Eyebrow>
          <h2 className="iz mt-3 font-display text-5xl leading-none tracking-[-0.03em] sm:text-6xl" style={d(250)}>Brands have to ask you first.</h2>
          <p className="iz mt-5 max-w-[36ch] text-lg text-sub" style={d(450)}>Every request comes to you. Accept it, change it, or say no.</p>
        </div>
        <div className="iz rounded-3xl border border-line bg-ink-850 p-5 shadow-2xl" style={d(550)}>
          <p className="text-sm text-mute">New license request</p>
          <dl className="mt-3 divide-y divide-line text-base">
            {[['Brand', 'A skincare brand'], ['Use', 'Paid social ads'], ['Length', '3 months']].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5"><dt className="text-mute">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-semibold">
            <span className="intro-accept rounded-full bg-coral py-2.5 text-center text-ink-950" data-portal>Accept</span>
            <span className="rounded-full border border-line py-2.5 text-center text-sub">Change</span>
            <span className="rounded-full border border-line py-2.5 text-center text-sub">Decline</span>
          </div>
          <p className="iz mt-4 flex items-center gap-2 text-sm text-ice" style={d(2300)}>
            <span className="h-2 w-2 rounded-full bg-ice" /> Accepted · Verified profile
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'rules', ms: 4200, tone: 'coral', label: 'Your rules',
    body: () => (
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <Eyebrow dark>Your rules</Eyebrow>
        <h2 className="iz mt-3 font-display text-5xl leading-none tracking-[-0.03em] text-ink-950 sm:text-6xl" style={d(250)}>You decide what is allowed.</h2>
        <ul className="mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {[
            ['Fashion', true], ['Product demos', true], ['Paid ads', true],
            ['Shown as age 25–32', true], ['Politics', false], ['Gambling', false], ['Fake reviews', false],
          ].map(([k, ok], i) => (
            <li key={k as string} className={`iz rounded-full px-5 py-3 text-lg font-medium ${ok ? 'bg-ink-950 text-paper' : 'border border-ink-950/30 text-ink-950/70 line-through decoration-ink-950/40'}`} style={d(550 + i * 160)} {...(i === 2 ? { 'data-portal': '' } : {})}>
              {ok ? '✓ ' : '✕ '}{k as string}
            </li>
          ))}
        </ul>
        <p className="iz mt-8 max-w-[44ch] rounded-2xl border border-ink-950/30 px-5 py-3 text-base font-medium text-ink-950" style={d(1700)}>Adult content using our creators is prohibited in all licensing deals, and nobody can be shown as under 18.</p>
      </div>
    ),
  },
  {
    id: 'paid', ms: 5000, tone: 'ink', label: 'Getting paid',
    body: () => (
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>Getting paid</Eyebrow>
          <h2 className="iz mt-3 font-display text-5xl leading-none tracking-[-0.03em] sm:text-6xl" style={d(250)}>Brands pay you every month.</h2>
          <p className="iz mt-5 max-w-[36ch] text-lg text-sub" style={d(450)}>Brands pay monthly for as long as they use your likeness. You keep 80%, or 85% with Castkey Exclusive.</p>
        </div>
        <div className="iz rounded-3xl border border-line bg-ink-850 p-5" style={d(550)}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-mute">Subscription</span>
            <span className="rounded-full bg-ice/15 px-3 py-1 font-medium text-ice">Active</span>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {['Month 1', 'Month 2', 'Month 3'].map((m, i) => (
              <li key={m} className="iz flex justify-between py-3 text-base" style={d(1000 + i * 450)}>
                <span className="text-sub">{m}</span><span className="font-semibold text-paper">+$780 to you</span>
              </li>
            ))}
          </ul>
          <div className="iz mt-2 flex items-end justify-between border-t border-line pt-4" style={d(2500)} data-portal>
            <span className="text-sm text-mute">Earned so far</span>
            <span className="font-display text-5xl tracking-[-0.03em]">$2,340</span>
          </div>
          <p className="mt-3 text-xs text-mute">Example figures. You set your own price.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'team', ms: 4800, tone: 'ink', label: 'Marketplace and team',
    body: () => (
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>A marketplace, with a team</Eyebrow>
          <h2 className="iz mt-3 font-display text-4xl leading-none tracking-[-0.03em] sm:text-6xl" style={d(250)}>Brands find you. Our team helps.</h2>
          <p className="iz mt-4 max-w-[38ch] text-base text-sub sm:mt-5 sm:text-lg" style={d(450)}>Your profile shows up when brands search. No manager? Our team finds AI deals for you and talks you through every request, all in the app.</p>
        </div>
        <div className="iz rounded-3xl border border-line bg-ink-850 p-5" style={d(550)}>
          <p className="rounded-xl border border-line bg-ink-900 px-3 py-2 text-sm text-sub">Brand search · fitness · 25–34 · face and voice</p>
          <ul className="mt-3 space-y-2">
            {[['Your profile', 'Matched · 3 brands viewed today', true], ['Request from a sportswear brand', 'Castkey team: “Good fit. Ask for 3 months.”', false], ['New message', 'Brand: “Can you do $800 a month?”', false]].map(([k, v, hl], i) => (
              <li key={k as string} className={`iz rounded-xl border p-3 ${hl ? 'border-coral/60 bg-coral/10' : 'border-line'}`} style={d(900 + i * 450)} {...(i === 0 ? { 'data-portal': '' } : {})}>
                <p className="text-sm font-semibold">{k as string}</p>
                <p className="mt-0.5 text-sm text-sub">{v as string}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-mute">Illustrative.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'calls', ms: 5200, tone: 'ink', label: 'Open calls and your minimum',
    body: () => (
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>Open calls and your minimum</Eyebrow>
          <h2 className="iz mt-3 font-display text-4xl leading-none tracking-[-0.03em] sm:text-6xl" style={d(250)}>Set your price. Or pick a brief.</h2>
          <p className="iz mt-4 max-w-[38ch] text-base text-sub sm:mt-5 sm:text-lg" style={d(450)}>Brands that reach out must meet your monthly minimum. Brands also post open calls with their budget, and you can go lower when you apply to one.</p>
        </div>
        <div className="grid gap-3">
          <div className="iz rounded-3xl border border-coral/60 bg-coral/10 p-5" style={d(600)} data-portal>
            <p className="text-sm text-sub">Your inbound minimum</p>
            <p className="mt-1 font-display text-5xl tracking-[-0.03em]">$600<span className="font-sans text-base text-sub"> / month</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[['Skincare brand', '$600–900', 'Face + voice'], ['Coffee brand', '$400–550', 'Voice']].map(([b, p, n], i) => (
              <div key={b} className={i ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]'}>
              <div className="iz relative rounded-2xl border border-line bg-ink-850 p-4 pt-5" style={d(1100 + i * 400)}>
                <span className={`absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${i ? 'bg-ice' : 'bg-coral'}`} aria-hidden="true" />
                <p className="text-sm font-semibold">{b}</p>
                <p className="mt-2 font-display text-2xl tracking-[-0.02em]">{p}</p>
                <p className="mt-1 text-xs text-sub">{n} · open call</p>
              </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-mute">Illustrative.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'three', ms: 5800, tone: 'paper', label: 'Who gets paid',
    body: () => (
      <div className="grid w-full max-w-6xl items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
        <div>
          <Eyebrow dark>How the money moves</Eyebrow>
          <h2 className="iz mt-3 font-display text-4xl leading-none tracking-[-0.03em] text-ink-950 sm:text-6xl" style={d(250)}>Every deal pays everyone who made it happen.</h2>
          <p className="iz mt-4 max-w-[38ch] text-base text-ink-900/70 sm:mt-5 sm:text-lg" style={d(450)}>The creator keeps 80% (85% if exclusive), minus any manager split, capped at 20%. Whoever referred them earns 5%, paid by Castkey.</p>
        </div>
        <div className="text-ink-950">
          <div className="iz flex items-baseline justify-between rounded-2xl bg-ink-950 px-5 py-4 text-paper" style={d(600)}>
            <span className="text-sm font-medium sm:text-base">The brand pays</span>
            <span className="font-display text-4xl tracking-[-0.02em] sm:text-5xl">$1,000</span>
          </div>
          <p className="iz py-2 text-center text-xs text-ink-900/60 sm:text-sm" style={d(900)}>↓ split automatically by Castkey</p>
          {/* One bar = the whole $1,000, so every share is drawn to scale */}
          <div className="iz flex h-4 overflow-hidden rounded-full" style={d(1100)} aria-hidden="true">
            <div className="bg-coral" style={{ width: '64%' }} /><div className="bg-ink-700" style={{ width: '16%' }} /><div className="bg-ice" style={{ width: '5%' }} /><div className="bg-ink-950/15" style={{ width: '15%' }} />
          </div>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
            {[['Creator', '$640', '64%', 'bg-coral'], ['Manager', '$160', '16%', 'bg-ink-700'], ['Referrer', '$50', '5%', 'bg-ice']].map(([k, v, p, c], i) => (
              <li key={k} className="iz rounded-2xl bg-white/70 p-3 sm:p-4" style={d(1400 + i * 300)} {...(i === 2 ? { 'data-portal': '' } : {})}>
                <span className="flex items-center gap-1.5 text-xs font-medium sm:text-sm"><i className={`h-2 w-2 shrink-0 rounded-full ${c}`} />{k}</span>
                <span className="mt-1 block font-display text-3xl tracking-[-0.02em] sm:text-4xl">{v}</span>
                <span className="text-xs text-ink-900/60">{p}<span className="hidden sm:inline"> of the deal</span></span>
              </li>
            ))}
          </ul>
          <p className="iz mt-3 text-xs text-ink-900/60" style={d(2400)}>Example: $1,000 license, Standard plan, 20% manager split.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'cta', ms: 0, tone: 'ink', label: 'Start earning',
    body: () => null, // rendered by Intro so its buttons can reach the handlers
  },
]

function shouldShow() {
  try {
    if (arrivedWithRef() || fastTrackKey() || /\/(invited?|r\/[^/]+)\/?$/.test(location.pathname) || location.hash) return false
    if (sessionStorage.getItem(SEEN)) return false
  } catch { /* storage blocked: show it */ }
  return true
}

export function Intro() {
  const [open, setOpen] = useState(shouldShow)
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [held, setHeld] = useState(false)
  const press = useRef<{ t: number; x: number; timer: number } | null>(null)
  const top = useRef<HTMLDivElement>(null)
  const sceneRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const skipRef = useRef<HTMLButtonElement>(null)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const last = SCENES.length - 1

  // Replay from the footer.
  useEffect(() => {
    const replay = () => { setI(0); setPrev(null); setPaused(false); setLeaving(false); setOpen(true) }
    window.addEventListener('ck:intro', replay)
    return () => window.removeEventListener('ck:intro', replay)
  }, [])

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const before = root.style.overflow
    root.style.overflow = 'hidden'
    skipRef.current?.focus({ preventScroll: true })
    return () => { root.style.overflow = before }
  }, [open])

  const go = useCallback((to: number) => {
    if (to < 0 || to > last || to === i) return
    const from = i
    const fromEl = sceneRefs.current[from]
    const portal = fromEl?.querySelector<HTMLElement>('[data-portal]')
    const r = portal?.getBoundingClientRect()
    const x = r ? r.left + r.width / 2 : innerWidth / 2
    const y = r ? r.top + r.height / 2 : innerHeight / 2
    setPrev(from)
    setI(to)
    requestAnimationFrame(() => {
      const el = sceneRefs.current[to]
      if (!el) return
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
      const anim = reduce || to < from
        ? el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: ease })
        : el.animate(
            [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${radius}px at ${x}px ${y}px)` }],
            { duration: 1000, easing: ease },
          )
      anim.onfinish = () => setPrev(null)
    })
  }, [i, last, reduce])

  const close = useCallback((target?: 'invite' | 'page' | 'refer') => {
    try { sessionStorage.setItem(SEEN, '1') } catch { /* ignore */ }
    if (target === 'invite' || target === 'refer') document.getElementById(target)?.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)
    if (reduce) { setOpen(false); return }
    setLeaving(true)
    setTimeout(() => { setOpen(false); setLeaving(false) }, 750)
    if (target === 'invite') setTimeout(() => document.querySelector<HTMLElement>('#invite input, #invite button')?.focus({ preventScroll: true }), 800)
  }, [reduce])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close('page') }
      else if (e.key === 'ArrowRight' || (e.key === ' ' && !(e.target as HTMLElement).closest('button,a'))) { e.preventDefault(); go(i + 1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, i, go, close])

  if (!open) return null

  // Like stories: hold anywhere to pause, tap the left third to go back, tap anywhere else to go on.
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button,a') || e.button > 0) return
    const timer = window.setTimeout(() => setHeld(true), 180)
    press.current = { t: performance.now(), x: e.clientX, timer }
  }
  const onUp = () => {
    const p = press.current
    press.current = null
    if (!p) return
    clearTimeout(p.timer)
    const wasHold = performance.now() - p.t > 250
    setHeld(false)
    if (wasHold) return
    if (p.x < innerWidth / 3) go(i - 1)
    else go(i + 1)
  }
  const onCancel = () => {
    if (press.current) clearTimeout(press.current.timer)
    press.current = null
    setHeld(false)
  }

  const tones = { ink: 'bg-ink-950 text-paper', paper: 'bg-paper text-ink-950', coral: 'bg-coral text-ink-950' }
  const onLight = SCENES[i].tone !== 'ink'

  const renderScene = (n: number) => {
    const s = SCENES[n]
    return (
      <div
        key={s.id}
        ref={(el) => { sceneRefs.current[n] = el }}
        className={`intro-scene absolute inset-0 flex items-center justify-center px-6 pb-16 pt-24 sm:px-12 ${tones[s.tone]} ${n === prev ? 'intro-behind' : ''}`}
        aria-hidden={n !== i}
      >
        {s.id === 'cta' ? (
          <div className="flex flex-col items-center text-center">
            <Mark className="iz h-12 w-12" />
            <h2 className="iz display-1 text-hero mt-8 max-w-[680px]" style={d(200)}>Get paid<br />for your face.</h2>
            <p className="iz mt-6 text-lg text-sub" style={d(450)}>Free to apply · Verified profiles only · You approve every brand</p>
            <div className="iz mt-8 flex flex-col items-center gap-3 sm:flex-row" style={d(650)}>
              <button type="button" className="btn-primary press min-w-[240px]" onClick={() => close('invite')}>Apply to list your likeness</button>
              <button type="button" className="btn-ghost press min-w-[240px]" onClick={() => close('page')}>See the full page</button>
            </div>
            <button type="button" className="iz mt-8 w-full max-w-[520px] rounded-2xl bg-coral px-5 py-4 text-left text-ink-950 press" style={d(900)} onClick={() => close('refer')}>
              <span className="block font-display text-2xl leading-tight sm:text-3xl">Refer creators and earn up to $10,000.</span>
              <span className="mt-1 block text-sm">5% of what each creator you refer earns, paid by Castkey. Get your link ›</span>
            </button>
            <button type="button" className="iz mt-5 text-sm text-mute hover:text-paper" style={d(1100)} onClick={() => go(0)}>Watch again</button>
          </div>
        ) : s.body()}
      </div>
    )
  }

  return (
    <div
      ref={top}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction to Castkey"
      className={`intro fixed inset-0 z-[80] select-none ${leaving ? 'intro-leave' : ''}`}
      data-paused={paused || held || undefined}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
      onPointerLeave={onCancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {prev !== null && renderScene(prev)}
      {renderScene(i)}

      {/* Top bar: progress, pause, skip */}
      <div className={`absolute inset-x-0 top-0 z-10 px-4 pt-4 sm:px-8 sm:pt-6 ${onLight ? 'text-ink-950' : 'text-paper'}`}>
        <div className="flex gap-1.5" aria-hidden="true">
          {SCENES.map((s, n) => (
            <span key={s.id} className={`h-1 flex-1 overflow-hidden rounded-full ${onLight ? 'bg-ink-950/15' : 'bg-paper/20'}`}>
              <span
                key={`${n}-${i}`}
                className={`intro-seg block h-full ${onLight ? 'bg-ink-950' : 'bg-paper'} ${n < i || (n === i && s.ms === 0) ? 'is-done' : n === i ? 'is-on' : ''}`}
                style={n === i && s.ms ? ({ '--dur': `${s.ms}ms` } as CSSProperties) : undefined}
                onAnimationEnd={n === i ? () => go(i + 1) : undefined}
              />
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="min-w-0 truncate text-sm font-medium opacity-70" aria-live="polite">{i + 1} of {SCENES.length} · {SCENES[i].label}</p>
          <div className="flex items-center gap-1">
            {SCENES[i].ms > 0 && (
              <button type="button" className="rounded-full px-3 py-2 text-sm font-medium opacity-80 hover:opacity-100" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
                {paused ? 'Play' : 'Pause'}
              </button>
            )}
            <button ref={skipRef} type="button" className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${onLight ? 'bg-ink-950/10 hover:bg-ink-950/15' : 'bg-paper/10 hover:bg-paper/15'}`} onClick={() => close('page')}>
              Skip intro
            </button>
          </div>
        </div>
      </div>

      {i < last && (
        <p className={`pointer-events-none absolute inset-x-0 bottom-5 z-10 text-center text-xs ${onLight ? 'text-ink-950/50' : 'text-paper/40'}`}>
          {held ? 'Paused · let go to keep watching' : 'Tap to continue · Hold to pause · Tap left to go back'}
        </p>
      )}
    </div>
  )
}
