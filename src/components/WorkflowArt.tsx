import { useEffect, useRef, useState } from 'react'
import { Mark } from './Logo'

// Hero animation of the workflow: a brand sends a usage request, the creator accepts and verifies,
// the subscription starts and monthly payments land. Sample content, labeled illustrative.
// Phases advance on a timer, pause off screen, and show the final state under reduced motion.

const LAST = 10 // phases 0..LAST, then loop
// Example figures only (same illustrative numbers as the deck). Not Castkey pricing.
const LICENSE = 750
const PREMIUM = 225
const MONTHLY = LICENSE + PREMIUM
const TO_CREATOR = MONTHLY * 0.8
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function useCountUp(target: number, ms = 700) {
  const [v, setV] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); from.current = target; return }
    const start = performance.now(), a = from.current
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms)
      const e = 1 - Math.pow(1 - k, 3)
      setV(Math.round(a + (target - a) * e))
      if (k < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}
const STEP_MS = 1000

const Tick = ({ on, className = '' }: { on: boolean; className?: string }) => (
  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-500 ${on ? 'bg-ice text-ink-950' : 'border border-line text-transparent'} ${className}`} aria-hidden="true">
    <svg viewBox="0 0 16 16" className="h-3 w-3"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
)

function Connector({ lit, travel }: { lit: boolean; travel: boolean }) {
  return (
    <div className="relative flex h-8 items-center justify-center lg:mt-24" aria-hidden="true">
      {/* horizontal on desktop, vertical on mobile */}
      <span className={`block h-8 w-px transition-colors duration-500 lg:h-px lg:w-full ${lit ? 'bg-coral' : 'bg-line'}`} />
      <span className={`wf-dot absolute h-2 w-2 rounded-full bg-coral ${travel ? 'wf-travel' : 'opacity-0'}`} />
    </div>
  )
}

export function WorkflowArt() {
  const [phase, setPhase] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const visible = useRef(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(LAST)
      return
    }
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.2 })
    if (ref.current) io.observe(ref.current)
    const t = window.setInterval(() => {
      if (!visible.current || document.hidden) return
      setPhase((p) => (p >= LAST + 2 ? 0 : p + 1)) // two extra beats hold the finished state
    }, STEP_MS)
    return () => { window.clearInterval(t); io.disconnect() }
  }, [])

  const p = Math.min(phase, LAST)
  const show = (n: number) => `transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${p >= n ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
  const months = [7, 8, 9]
  const paidCount = months.filter((n) => p >= n).length
  const earned = useCountUp(paidCount * TO_CREATOR)

  return (
    <div ref={ref} className="relative flex w-full flex-col bg-ink-900 p-4 text-left sm:p-8 lg:p-12" role="img" aria-label="Illustration with example figures: a brand requests a $750 monthly license plus a $225 exclusivity premium, the creator accepts and verifies their ID, and the $975 monthly subscription pays the creator $780 a month, $2,340 over three months.">
      <div className="flex items-center justify-between">
        <span className="tag-ill">Illustrative · example figures</span>
        <span className="hidden text-xs text-mute sm:block">Request → Review and verify → Paid monthly</span>
      </div>

      <div className="mt-6 grid grid-rows-[auto_32px_auto_32px_auto] items-start gap-0 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)_56px_minmax(0,1fr)] lg:grid-rows-1">
        {/* 1. Request */}
        <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-paper"><span className="grid h-6 w-6 place-items-center rounded-full border border-line text-xs">1</span>Brand requests</p>
        <div className={`rounded-2xl border border-line bg-ink-850 p-4 sm:p-5 ${show(1)}`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ice">Usage request</p>
            <span className="text-xs text-mute">from Example brand</span>
          </div>
          <dl className="mt-3 grid gap-2 text-xs sm:text-sm">
            {[['Content', 'Product video'], ['Where', 'Instagram and TikTok'], ['Term', '3 months, renewing'], ['License', `${usd(LICENSE)} / month`], ['Exclusivity', `Category · +${usd(PREMIUM)}`]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3"><dt className="text-mute">{k}</dt><dd className="text-right text-paper">{v}</dd></div>
            ))}
          </dl>
        </div>

        </div>

        <Connector lit={p >= 3} travel={p === 2} />

        {/* 2. Creator reviews and verifies */}
        <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-paper"><span className="grid h-6 w-6 place-items-center rounded-full border border-line text-xs">2</span>You decide</p>
        <div className={`rounded-2xl border bg-ink-850 p-4 transition-colors duration-500 sm:p-5 ${p >= 4 ? 'border-coral/60' : 'border-line'} ${show(1)}`}>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-paper"><Mark className="h-6 w-6" ink="#171513" /></span>
            <div>
              <p className="text-sm font-medium">You review it</p>
              <p className="text-xs text-mute">Inside your rules</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-1">
            {['Accept', 'Adjust', 'Decline'].map((x) => (
              <span key={x} className={`rounded-lg py-1.5 text-center text-xs font-medium transition-colors duration-500 ${x === 'Accept' && p >= 4 ? 'bg-ice text-ink-950' : 'border border-line text-sub'}`}>{x}</span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Tick on={p >= 5} />
            <span className={p >= 5 ? 'text-paper' : 'text-mute'}>{p >= 5 ? 'Verified profile' : 'Verifying'}</span>
          </div>
        </div>

        </div>

        <Connector lit={p >= 6} travel={p === 5 || p === 6} />

        {/* 3. Subscription and payouts */}
        <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-paper"><span className="grid h-6 w-6 place-items-center rounded-full border border-line text-xs">3</span>You get paid</p>
        <div className={`rounded-2xl border border-line bg-ink-850 p-4 sm:p-5 ${show(6)}`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-coral">Subscription</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-500 ${p >= 6 ? 'bg-coral text-ink-950' : 'border border-line text-mute'}`}>{p >= 6 ? 'Active' : 'Pending'}</span>
          </div>
          <p className="mt-3 flex items-baseline justify-between gap-3 text-xs">
            <span className="font-display text-2xl font-light tracking-tight text-paper">{usd(MONTHLY)}<span className="text-sm text-mute"> / month</span></span>
            <span className="text-mute">Castkey 20%: {usd(MONTHLY * 0.2)}</span>
          </p>
          <ul className="mt-3 grid gap-2 border-t border-line pt-3 text-xs sm:text-sm">
            {months.map((n, i) => (
              <li key={n} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2"><Tick on={p >= n} /> <span className={p >= n ? 'text-paper' : 'text-mute'}>Month {i + 1}</span></span>
                <span className={`tabular-nums transition-opacity duration-500 ${p >= n ? 'text-paper opacity-100' : 'opacity-0'}`}>+{usd(TO_CREATOR)} to you</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between gap-3 rounded-xl bg-ink-950 px-3 py-2">
            <span className="text-xs text-mute">Earned so far</span>
            <span className="font-display text-2xl font-light tabular-nums tracking-tight text-coral" aria-hidden="true">{usd(earned)}</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
