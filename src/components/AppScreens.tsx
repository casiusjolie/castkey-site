import type { ReactNode } from 'react'
import { useCountUpOnView, useInView } from '../lib/motion'

// Simple previews of the Castkey app, shown along the page. Illustrative UI only, nothing is clickable.

function Frame({ title, children, label, status = 'Live' }: { title: string; children: ReactNode; label: string; status?: string }) {
  const [ref, seen] = useInView<HTMLElement>(0.25)
  return (
    <figure ref={ref} className={`device relative mx-auto w-full max-w-[340px] ${seen ? 'is-in' : ''}`} aria-label={label}>
      <span className="device-glow" aria-hidden="true" />
      <div className="rounded-[30px] bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] p-[1px] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)]">
        <div className="rounded-[29px] bg-[#0a0a0a] p-2">
          <div className="overflow-hidden rounded-[22px] bg-ink-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-sm font-semibold">{title}</span>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-mute">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-coral" aria-hidden="true" />{status}
              </span>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-mute">App preview</figcaption>
    </figure>
  )
}

export function RequestScreen() {
  return (
    <Frame title="Requests" status="1 new" label="App preview: a skincare brand offers $750 a month for paid social ads. The creator sends a counter offer of $900 a month, waiting for the brand to reply.">
      <p className="text-xs text-mute">New request</p>
      <p className="mt-1 text-base font-semibold">Skincare brand</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        {[['Use', 'Paid social ads'], ['Length', '3 months'], ['Their offer', '$750 / month']].map(([k, v]) => (
          <div key={k} className="flex justify-between"><dt className="text-mute">{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <div className="mt-4 grid grid-cols-3 gap-1.5 text-xs font-semibold">
        <span className="rounded-full border border-line py-2 text-center">Accept</span>
        <span className="rounded-full bg-coral py-2 text-center text-ink-950 shadow-[0_0_24px_-4px_rgba(232,119,79,0.7)]">Counter</span>
        <span className="rounded-full border border-line py-2 text-center text-sub">Decline</span>
      </div>
      <div className="later mt-4 rounded-2xl border border-coral/50 bg-coral/10 p-3" style={{ transitionDelay: '700ms' }}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-coral">Your counter offer</span>
          <span className="inline-flex items-center gap-1 text-ice"><svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>Sent</span>
        </div>
        <p className="mt-1 font-display text-3xl tracking-[-0.02em]">$900 <span className="font-sans text-sm text-sub">/ month</span></p>
        <p className="mt-1 text-xs text-sub">Face and voice · 3 months · paid social only</p>
        <p className="mt-2 text-xs text-mute">Waiting for the brand to accept or reply</p>
      </div>
    </Frame>
  )
}

export function EarningsScreen() {
  const [numRef, n] = useCountUpOnView<HTMLParagraphElement>(1445, 1400)
  return (
    <Frame title="Earnings" status="Paid monthly" label="App preview: earnings of $1,445 this month from two brands, paid automatically on the 1st.">
      <p className="text-xs text-mute">This month</p>
      <p ref={numRef} className="mt-1 font-display text-5xl tabular-nums tracking-[-0.03em]">${Math.round(n).toLocaleString('en-US')}</p>
      <div className="mt-3 flex h-10 items-end gap-1" aria-hidden="true">
        {[22, 30, 26, 38, 34, 46, 52, 48, 60, 72, 66, 84].map((h, i) => (
          <span key={i} className="later flex-1 rounded-sm bg-coral/80" style={{ height: `${h}%`, transitionDelay: `${300 + i * 60}ms` }} />
        ))}
      </div>
      <ul className="mt-4 divide-y divide-line text-sm">
        {[['Skincare brand', '+$680'], ['Fitness app', '+$765']].map(([k, v]) => (
          <li key={k} className="flex justify-between py-2.5"><span className="text-sub">{k}</span><span className="font-semibold tabular-nums text-ice">{v}</span></li>
        ))}
      </ul>
      <p className="mt-3 rounded-xl bg-ink-850 px-3 py-2 text-xs text-sub">Castkey Exclusive · you keep 85% · manager split paid automatically</p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-mute">Next payout · the 1st</p>
    </Frame>
  )
}

export function PackScreen() {
  const items = [
    { k: 'Photo set', v: '24 of 24', done: 100 },
    { k: 'Talking videos', v: '3 of 3', done: 100 },
    { k: 'Voice recordings', v: '1 of 3', done: 33 },
  ]
  return (
    <Frame title="Training pack" status="2 of 3" label="App preview: a training pack checklist with photos and talking videos complete and voice recordings one of three done.">
      <p className="text-xs text-mute">Required before brands can license you</p>
      <ul className="mt-3 space-y-3">
        {items.map((i) => (
          <li key={i.k}>
            <div className="flex justify-between text-sm"><span>{i.k}</span><span className={i.done === 100 ? 'text-ice' : 'text-sub'}>{i.done === 100 ? '✓ ' : ''}{i.v}</span></div>
            <div className="mt-1.5 h-1.5 rounded-full bg-ink-800"><div className="h-1.5 rounded-full" style={{ width: `${i.done}%` }}><div className={`fill h-1.5 rounded-full ${i.done === 100 ? 'bg-ice' : 'bg-coral'}`} /></div></div>
          </li>
        ))}
      </ul>
      <span className="mt-4 block rounded-full bg-paper py-2 text-center text-xs font-semibold text-ink-950">Record a voice note</span>
    </Frame>
  )
}
