import { useState } from 'react'
import { assets, ecosystem, referral } from '../content'
import { ReferralKit } from './InviteSomeone'

// How the money moves, as an interactive diagram: brand → Castkey → creator, manager or agency,
// referrer and Castkey's fee. The management split is set by the creator and capped at 20%.

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const pct = (n: number, of: number) => `${Math.round((n / of) * 1000) / 10}%`

function Arrow() {
  return (
    <div className="flex items-center justify-center py-1 text-mute lg:py-0" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-6 w-6 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
    </div>
  )
}

function Toggle({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className="press inline-flex min-h-11 items-center gap-3 rounded-full border border-line px-4 text-sm font-medium hover:border-paper/40">
      <span className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${on ? 'bg-coral' : 'bg-ink-700'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-transform duration-300 ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </span>
      {label}
    </button>
  )
}

export function Ecosystem() {
  const [hasManager, setHasManager] = useState(true)
  const [split, setSplit] = useState(ecosystem.maxSplit)
  const [referred, setReferred] = useState(true)

  const total = ecosystem.example
  const creatorShare = total * 0.8
  const manager = hasManager ? creatorShare * (split / 100) : 0
  const creator = creatorShare - manager
  const referrer = referred ? total * 0.05 : 0
  const castkey = total * 0.2 - referrer
  const [roleBrand, roleCreator, roleManager, roleReferrer] = ecosystem.roles

  const rows = [
    { k: 'Creator', amount: creator, v: roleCreator.v, bar: 'bg-coral', show: true },
    { k: 'Manager or agency', amount: manager, v: hasManager ? `${split}% of the creator’s share, set by the creator. Never more than 20%.` : 'No manager on this deal. The creator keeps the full 80%.', bar: 'bg-ice', show: true },
    { k: 'Referrer', amount: referrer, v: referred ? '5% of the deal, paid from Castkey’s share, up to $10,000 per creator.' : 'Nobody referred this creator, so Castkey keeps the full 20%.', bar: 'bg-paper', show: true },
    { k: 'Castkey', amount: castkey, v: 'Runs the marketplace, the deals team, verification and payments.', bar: 'bg-ink-700', show: true },
  ]

  return (
    <section id="refer" aria-labelledby="eco-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <div className="max-w-[760px]">
          <p className="eyebrow">{ecosystem.eyebrow}</p>
          <h2 id="eco-h" className="display-2 mt-3">{ecosystem.title}</h2>
          <p className="lede mt-6">{ecosystem.lead}</p>
        </div>

        {/* Interactive money flow */}
        <div className="mt-12 rounded-3xl border border-line bg-ink-900 p-4 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Toggle on={hasManager} set={setHasManager} label="Creator has a manager or agency" />
            <Toggle on={referred} set={setReferred} label="Creator was referred" />
            <span className="tag-ill ml-auto">Example · $1,000 license</span>
          </div>
          {hasManager && (
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-line px-4 py-3">
              <label htmlFor="eco-split" className="text-sm font-medium">Management split</label>
              <input id="eco-split" type="range" min={0} max={ecosystem.maxSplit} step={1} value={split} onChange={(e) => setSplit(Number(e.target.value))} className="w-48 accent-[#E8774F]" aria-valuetext={`${split} percent of the creator’s share`} />
              <span className="font-semibold tabular-nums">{split}%</span>
              <span className="text-xs text-mute">Capped at 20% by Castkey to protect creators.</span>
            </div>
          )}

          <div className="mt-6 grid items-stretch gap-2 lg:grid-cols-[minmax(0,3fr)_auto_minmax(0,3fr)_auto_minmax(0,6fr)]" aria-live="polite">
            {/* Brand */}
            <div className="flex flex-col justify-center rounded-2xl border border-ice/40 bg-ice/10 p-5">
              <p className="text-sm text-sub">{roleBrand.k} pays</p>
              <p className="mt-1 font-display text-5xl tracking-[-0.03em] tabular-nums">{usd(total)}</p>
              <p className="mt-1 text-sm text-sub">per month, for one license</p>
              <p className="mt-3 text-sm">Gets the creator’s training pack (photos, talking videos, voice) and the rights to use it.</p>
              <p className="mt-3 text-xs text-mute">{roleBrand.v}</p>
            </div>
            <Arrow />
            {/* Castkey hub */}
            <div className="flex flex-col justify-center rounded-2xl border border-coral/50 bg-ink-850 p-5">
              <p className="text-sm font-semibold text-coral">Castkey</p>
              <ul className="mt-3 space-y-2 text-sm text-sub">
                <li>Holds the payment</li>
                <li>Checks the use is inside the creator’s rules</li>
                <li>Splits it automatically</li>
                <li>Pays everyone monthly</li>
              </ul>
            </div>
            <Arrow />
            {/* Who gets paid */}
            <ul className="grid gap-2">
              {rows.map((r) => (
                <li key={r.k} className={`rounded-2xl border border-line p-4 transition-opacity duration-300 ${r.amount === 0 ? 'opacity-45' : ''}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold"><i className={`h-2.5 w-2.5 rounded-full ${r.bar}`} />{r.k}</span>
                    <span className="font-display text-3xl tracking-[-0.02em] tabular-nums">{usd(r.amount)} <span className="font-sans text-xs text-mute">{pct(r.amount, total)}</span></span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-ink-800"><div className={`h-1.5 rounded-full ${r.bar} transition-[width] duration-500`} style={{ width: `${(r.amount / total) * 100}%` }} /></div>
                  <p className="mt-2 text-xs text-mute">{r.v}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Whole-deal bar */}
          <div className="mt-6 flex h-3 overflow-hidden rounded-full" role="img" aria-label={`Of ${usd(total)}: creator ${usd(creator)}, manager ${usd(manager)}, referrer ${usd(referrer)}, Castkey ${usd(castkey)}.`}>
            {rows.map((r) => <div key={r.k} className={`${r.bar} transition-[width] duration-500`} style={{ width: `${(r.amount / total) * 100}%` }} />)}
          </div>
          <p className="mt-3 text-xs text-mute">{ecosystem.note}</p>
        </div>

        {/* What brands are buying */}
        <div className="mt-4 rounded-3xl border border-line bg-ink-900 p-6 sm:p-8">
          <p className="eyebrow">{assets.eyebrow}</p>
          <h3 className="mt-3 max-w-[30ch] font-display text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">{assets.title}</h3>
          <p className="mt-4 max-w-[70ch] text-base text-sub">{assets.lead}</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-ink-850 p-5">
              <p className="flex items-center justify-between text-sm font-semibold"><span>The training pack</span><span className="rounded-full bg-coral px-2.5 py-0.5 text-xs text-ink-950">Required for every profile</span></p>
              <ul className="mt-4 space-y-3">
                {assets.pack.map((a) => (
                  <li key={a.k}><p className="text-base font-semibold">{a.k}</p><p className="text-sm text-sub">{a.v}</p></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-ink-850 p-5">
              <p className="text-sm font-semibold">The rights that come with it</p>
              <ul className="mt-4 space-y-3">
                {assets.rights.map((a) => (
                  <li key={a.k}><p className="text-base font-semibold">{a.k}</p><p className="text-sm text-sub">{a.v}</p></li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs text-mute">{assets.note}</p>
        </div>

        {/* Permissions and who can be who */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-ink-900 p-6">
            <h3 className="font-sans text-lg font-semibold">{ecosystem.permissions.title}</h3>
            <ul className="mt-4 space-y-2">
              {ecosystem.permissions.items.map((p) => (
                <li key={p.k} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 text-sm">
                  <span>{p.k}</span>
                  <span className={`relative h-5 w-9 shrink-0 rounded-full ${p.on ? 'bg-coral' : 'bg-ink-700'}`} aria-label={p.on ? 'Allowed' : 'Not allowed'} role="img">
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper ${p.on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-mute">{ecosystem.permissions.note}</p>
          </div>
          <div className="grid gap-4">
            {[roleCreator, roleManager, roleReferrer].map((r) => (
              <div key={r.k} className="rounded-3xl border border-line bg-ink-900 p-6">
                <h3 className="font-sans text-lg font-semibold">{r.k}</h3>
                <p className="mt-2 text-sm text-sub">{r.v}</p>
              </div>
            ))}
            <p className="rounded-3xl border border-coral/40 bg-coral/10 p-6 text-sm">An agency can be both: its management split comes from the creator’s share (up to 20%), and its 5% referral reward comes from Castkey’s share.</p>
          </div>
        </div>

        {/* Refer and earn */}
        <div className="mt-12 grid gap-8 rounded-3xl bg-coral p-6 text-ink-950 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <h3 className="font-display text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl">{referral.headline}</h3>
            <p className="mt-4 text-lg">{referral.body}</p>
            <ul className="mt-6 space-y-2 text-base">
              {referral.rules.map((r) => (
                <li key={r} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-950" />{r}</li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-ink-950/70">{referral.note}</p>
          </div>
          <div className="rounded-2xl bg-paper p-5 sm:p-6">
            <p className="mb-4 text-lg font-semibold">Get your referral link</p>
            <ReferralKit tone="light" />
          </div>
        </div>
      </div>
    </section>
  )
}
