import type { ReactNode } from 'react'

// Simple previews of the Castkey app, shown along the page. Illustrative UI only, nothing is clickable.

function Frame({ title, children, label }: { title: string; children: ReactNode; label: string }) {
  return (
    <figure className="mx-auto w-full max-w-[340px]" aria-label={label}>
      <div className="rounded-[28px] bg-[#0a0a0a] p-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-paper/15">
        <div className="overflow-hidden rounded-[22px] bg-ink-950">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-semibold">{title}</span>
            <span className="h-2 w-2 rounded-full bg-coral" aria-hidden="true" />
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-mute">App preview</figcaption>
    </figure>
  )
}

export function RequestScreen() {
  return (
    <Frame title="Requests" label="App preview: a new license request from a skincare brand, with Accept, Counter and Decline buttons and a message thread.">
      <p className="text-xs text-mute">New request</p>
      <p className="mt-1 text-base font-semibold">Skincare brand</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        {[['Use', 'Paid social ads'], ['Length', '3 months'], ['Offer', '$750 / month']].map(([k, v]) => (
          <div key={k} className="flex justify-between"><dt className="text-mute">{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <div className="mt-4 grid grid-cols-3 gap-1.5 text-xs font-semibold">
        <span className="rounded-full bg-coral py-2 text-center text-ink-950">Accept</span>
        <span className="rounded-full border border-line py-2 text-center">Counter</span>
        <span className="rounded-full border border-line py-2 text-center text-sub">Decline</span>
      </div>
      <div className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
        <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-ink-800 px-3 py-2">Can we use your voice too?</p>
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ice px-3 py-2 text-ink-950">Yes, for $150 more.</p>
      </div>
    </Frame>
  )
}

export function EarningsScreen() {
  return (
    <Frame title="Earnings" label="App preview: earnings of $1,440 this month from two brands, paid automatically on the 1st.">
      <p className="text-xs text-mute">This month</p>
      <p className="mt-1 font-display text-5xl tracking-[-0.03em]">$1,440</p>
      <ul className="mt-4 divide-y divide-line text-sm">
        {[['Skincare brand', '+$720'], ['Fitness app', '+$720']].map(([k, v]) => (
          <li key={k} className="flex justify-between py-2.5"><span className="text-sub">{k}</span><span className="font-semibold">{v}</span></li>
        ))}
      </ul>
      <p className="mt-3 rounded-xl bg-ink-850 px-3 py-2 text-xs text-sub">Castkey Exclusive · you keep 90% · manager split paid automatically</p>
      <p className="mt-3 text-xs text-mute">Next payout: the 1st</p>
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
    <Frame title="Training pack" label="App preview: a training pack checklist with photos and talking videos complete and voice recordings one of three done.">
      <p className="text-xs text-mute">Required before brands can license you</p>
      <ul className="mt-3 space-y-3">
        {items.map((i) => (
          <li key={i.k}>
            <div className="flex justify-between text-sm"><span>{i.k}</span><span className={i.done === 100 ? 'text-ice' : 'text-sub'}>{i.done === 100 ? '✓ ' : ''}{i.v}</span></div>
            <div className="mt-1.5 h-1.5 rounded-full bg-ink-800"><div className={`h-1.5 rounded-full ${i.done === 100 ? 'bg-ice' : 'bg-coral'}`} style={{ width: `${i.done}%` }} /></div>
          </li>
        ))}
      </ul>
      <span className="mt-4 block rounded-full bg-paper py-2 text-center text-xs font-semibold text-ink-950">Record a voice note</span>
    </Frame>
  )
}
