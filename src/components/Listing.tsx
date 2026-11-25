import { useState } from 'react'
import { exampleListing as L } from '../content'

// The founder's listing, shown as it would look on a phone in the Castkey app.
// Inside the phone everything is illustrative UI: nothing in it is clickable.

const Check = () => (
  <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ice" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

function PackIcon({ k }: { k: string }) {
  if (k.startsWith('Photo')) return <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="6" cy="7" r="1.3" fill="currentColor" /><path d="M3 12l3.5-3 2.5 2 2-1.5L13 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
  if (k.startsWith('Talking')) return <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><rect x="2" y="4" width="9" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M11 7l3-2v6l-3-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
  return <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><path d="M3 7v2M5.5 5v6M8 3v10M10.5 5v6M13 7v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
}

type Tab = 'Overview' | 'Rules' | 'Pack & terms'

function Waveform() {
  const bars = [6, 10, 14, 9, 16, 12, 7, 13, 18, 11, 8, 15, 10, 6, 12, 17, 9, 13, 7, 11, 15, 8, 12, 6]
  return (
    <span className="flex h-6 flex-1 items-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => <span key={i} className={`w-[3px] rounded-full ${i < 9 ? 'bg-coral' : 'bg-paper/30'}`} style={{ height: `${h}px` }} />)}
    </span>
  )
}

function Phone() {
  const [tab, setTab] = useState<Tab>('Overview')
  return (
    <figure className="relative mx-auto w-[300px] shrink-0 sm:w-[340px]" aria-label={`${L.name}'s founding listing shown as a Castkey profile on a phone. ${L.badge}.`}>
      <div className="rounded-[48px] bg-[#0a0a0a] p-3 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-paper/15">
        <div className="relative h-[640px] overflow-hidden rounded-[38px] bg-ink-950 sm:h-[700px]">
          {/* status bar */}
          <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between bg-ink-950 px-6 text-xs font-semibold text-paper">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 18 12" className="h-3 w-4" aria-hidden="true"><path d="M1 11h2V8H1zM5 11h2V6H5zM9 11h2V4H9zM13 11h2V1h-2z" fill="currentColor" /></svg>
              <span className="h-3 w-6 rounded-sm border border-paper/70 p-px"><span className="block h-full w-4/5 rounded-[1px] bg-paper" /></span>
            </span>
          </div>

          <div className="phone-scroll h-full overflow-y-auto overscroll-contain px-4 pb-28 pt-12" tabIndex={0} aria-label="Scroll the profile">
            {/* app bar */}
            <div className="flex h-9 items-center justify-between text-paper">
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-xs font-semibold">Creator</span>
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><path d="M8 10V2M5 5l3-3 3 3M3 9v4h10V9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            {/* portrait card */}
            <div className="relative mt-2 aspect-square overflow-hidden rounded-3xl bg-ink-800">
              {L.photo ? <img src={L.photo} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center font-display text-6xl text-paper">{L.initials}</span>}
              <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2 py-1 text-xs font-medium text-paper backdrop-blur">Founding listing</span>
              <div className="absolute inset-x-2 bottom-2 rounded-2xl bg-ink-950/70 px-3 py-2 backdrop-blur">
                <p className="font-display text-xl font-light leading-tight text-paper">{L.name}</p>
                <p className="text-xs text-sub">{L.handle} · Founder of Castkey</p>
              </div>
            </div>

            {/* stats */}
            <dl className="mt-3 grid grid-cols-3 divide-x divide-line rounded-2xl bg-ink-850 py-2 text-center">
              {[['Followers', L.followers], ['Licenses', 'Face + voice'], ['Min / month', 'On request']].map(([k, v]) => (
                <div key={k} className="px-1">
                  <dd className="text-sm font-semibold text-paper">{v}</dd>
                  <dt className="text-xs text-mute">{k}</dt>
                </div>
              ))}
            </dl>

            {/* tabs */}
            <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-ink-850 p-1" role="tablist" aria-label="Profile sections">
              {(['Overview', 'Rules', 'Pack & terms'] as Tab[]).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                  className={`min-h-8 rounded-lg text-xs font-medium transition-colors duration-300 ${tab === t ? 'bg-paper text-ink-950' : 'text-sub hover:text-paper'}`}>
                  {t}
                </button>
              ))}
            </div>

            <div key={tab} className="step-in-fwd mt-3">
              {tab === 'Overview' && (
                <div className="grid gap-3">
                  <p className="text-xs leading-5 text-sub">{L.bio}</p>
                  <div className="flex items-center gap-3 rounded-2xl bg-ink-850 p-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral text-ink-950" aria-hidden="true">
                      <svg viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-paper">Voice sample</p>
                      <div className="mt-1 flex items-center gap-2"><Waveform /><span className="text-xs tabular-nums text-mute">0:12</span></div>
                    </div>
                  </div>
                  {L.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-2xl bg-ink-850 px-3 py-3 text-xs hover:bg-ink-800">
                      <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-paper" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="8" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="11.4" cy="4.6" r="0.8" fill="currentColor" /></svg>
                      <span className="font-medium text-paper">{l.label}</span>
                      <span className="ml-auto text-mute">{l.sub}</span>
                    </a>
                  ))}
                </div>
              )}
              {tab === 'Rules' && (
                <div className="grid gap-3">
                  <div className="rounded-2xl bg-ink-850 p-3">
                    <p className="text-xs font-medium text-ice">Brands may</p>
                    <ul className="mt-2 grid gap-1.5 text-xs text-paper">{L.allowed.map((x) => <li key={x} className="flex gap-1.5"><Check />{x}</li>)}</ul>
                  </div>
                  <div className="rounded-2xl bg-ink-850 p-3">
                    <p className="text-xs font-medium text-coral">Never</p>
                    <ul className="mt-2 flex flex-wrap gap-1">{L.never.map((x) => <li key={x} className="rounded-full border border-coral/40 px-2 py-0.5 text-xs text-sub">{x}</li>)}</ul>
                  </div>
                  <dl className="grid gap-2 rounded-2xl bg-ink-850 p-3 text-xs">
                    <div><dt className="text-mute">Age</dt><dd className="mt-0.5 text-sub">{L.age}</dd></div>
                    <div><dt className="text-mute">Wardrobe</dt><dd className="mt-0.5 text-sub">{L.wardrobe}</dd></div>
                    <div><dt className="text-mute">Voice</dt><dd className="mt-0.5 text-sub">{L.voice}</dd></div>
                  </dl>
                </div>
              )}
              {tab === 'Pack & terms' && (
                <div className="grid gap-3">
                  <div className="rounded-2xl bg-ink-850 p-3">
                    <p className="text-xs font-medium text-paper">Training pack, included with a subscription</p>
                    <ul className="mt-2 grid grid-cols-3 gap-1.5">
                      {L.packItems.map((k) => (
                        <li key={k} className="flex flex-col items-center gap-1 rounded-xl bg-ink-800 py-2 text-xs text-sub"><span className="text-ice"><PackIcon k={k} /></span>{k}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-mute">Reviewed by Castkey before it can be licensed.</p>
                  </div>
                  <dl className="divide-y divide-line rounded-2xl bg-ink-850 px-3 text-xs">
                    {[['Monthly license', L.price], ['Paid ads', 'Agreed share of spend'], ['Exclusivity', 'Category, premium set by Casius'], ['Usage', 'Reported monthly, audit rights']].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 py-2"><dt className="text-mute">{k}</dt><dd className="text-right text-sub">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* bottom action bar (illustrative) */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-line bg-ink-950/90 px-4 pb-7 pt-3 backdrop-blur">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-paper" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="h-4 w-4"><path d="M4 2h8v12l-4-3-4 3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            </span>
            <span className="flex h-10 flex-1 items-center justify-center rounded-full bg-coral text-sm font-semibold text-ink-950">Request license</span>
          </div>
          <span className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-paper/60" aria-hidden="true" />
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-mute">Tap the tabs to explore. Illustrative app screen.</figcaption>
    </figure>
  )
}

export function Listing() {
  return (
    <section id="listing" aria-labelledby="listing-h" className="band border-t border-line">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20" data-reveal>
        <div>
          <p className="kicker"><b>04</b>Your listing</p>
          <h2 id="listing-h" className="display-2 mt-3">This is what brands see.</h2>
          <p className="mt-4 max-w-[44ch] text-lg text-sub">Your photo, your rules and your price, on one page. Brands send a request; you decide.</p>
          <p className="mt-8"><span className="tag-ill">{L.badge}</span></p>
        </div>
        <Phone />
      </div>
    </section>
  )
}
