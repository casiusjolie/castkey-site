import { useState } from 'react'
import { earn, pricing, referral } from '../content'
import { EarningsScreen } from './AppScreens'
import { useTween } from '../lib/motion'
import { ReferralKit } from './InviteSomeone'

// How creators get paid: pick a plan, toggle a manager and a referral, see the split of one license.
// Math (license L): creator share = L × (1 − plan fee). No brand fee.
// Manager takes up to 20% of the creator's share. Referrer earns 5% of L, paid out of Castkey's fee.

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
function Amount({ value, className }: { value: number; className: string }) {
  const v = useTween(value, 600)
  return <span className={className}>{usd(v)}</span>
}
const L = 1000

function Toggle({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className="press inline-flex min-h-11 items-center gap-3 rounded-full border border-line px-4 text-sm font-medium hover:border-paper/40">
      <span className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${on ? 'bg-coral' : 'bg-ink-700'}`}>
        <span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-paper transition-transform duration-300 ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </span>
      {label}
    </button>
  )
}

export function Earn() {
  const [hasManager, setHasManager] = useState(false)
  const [split, setSplit] = useState(10)
  const [referred, setReferred] = useState(true)

  const creatorShare = L * (pricing.keep / 100)
  const manager = hasManager ? creatorShare * (split / 100) : 0
  const creator = creatorShare - manager
  const referrer = referred ? L * (pricing.referral / 100) : 0

  const rows = [
    { k: 'You', amount: creator, bar: 'bg-coral' },
    { k: 'Your manager', amount: manager, bar: 'bg-ice' },
    { k: 'Who referred you', amount: referrer, bar: 'bg-paper', note: 'paid by Castkey' },
  ]

  return (
      <section id="earn" aria-labelledby="earn-h" className="band border-t border-line">
        <div className="wrap" data-reveal>
          <div className="max-w-[680px]">
            <p className="kicker"><b>06</b>Earnings</p>
            <h2 id="earn-h" className="display-2 mt-4">{earn.title}</h2>
            <p className="lede mt-6">{earn.lead}</p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
            <div className="lit rounded-3xl p-4 sm:p-8" data-spot>
              {/* The split */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-coral bg-coral/10 p-4 shadow-[0_0_40px_-12px_rgba(232,119,79,0.6)]">
                <div className="min-w-0">
                  <p className="font-semibold">You keep {pricing.keep}% of every license.</p>
                  <p className="mt-1 text-sm text-sub">Castkey’s {pricing.fee}% covers payments, verification and the deals team. Licenses start at ${pricing.minLicense}/month.</p>
                </div>
                <span className="shrink-0 font-display text-5xl tracking-[-0.03em]">{pricing.keep}%</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Toggle on={hasManager} set={setHasManager} label="I have a manager" />
                <Toggle on={referred} set={setReferred} label="Someone referred me" />
              </div>
              {hasManager && (
                <div className="mt-3 flex flex-wrap items-center gap-4 rounded-2xl border border-line px-4 py-3">
                  <label htmlFor="earn-split" className="text-sm font-medium">Manager’s split</label>
                  <input id="earn-split" type="range" min={0} max={pricing.managerCap} step={1} value={split} onChange={(e) => setSplit(Number(e.target.value))} className="w-40 accent-[#E8774F]" aria-valuetext={`${split} percent of your share`} />
                  <span className="font-semibold tabular-nums">{split}%</span>
                  <span className="text-xs text-mute">Never more than {pricing.managerCap}%.</span>
                </div>
              )}

              {/* Result */}
              <div className="mt-6 border-t border-line pt-6" aria-live="polite">
                <p className="text-sm text-sub">A brand licenses you for <span className="text-paper">{usd(L)}/month</span>.</p>
                <ul className="mt-4 grid gap-3">
                  {rows.map((r) => (
                    <li key={r.k} className={`transition-opacity duration-300 ${r.amount === 0 ? 'opacity-40' : ''}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-sm font-medium"><i className={`h-2.5 w-2.5 rounded-full ${r.bar}`} />{r.k}{r.note && <span className="text-xs text-mute">· {r.note}</span>}</span>
                        <Amount value={r.amount} className={`font-display tabular-nums tracking-[-0.02em] ${r.k === 'You' ? 'text-4xl' : 'text-2xl'}`} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-sub">{earn.extras}</p>
              </div>
            </div>
            <EarningsScreen />
          </div>
        </div>
      </section>
  )
}

// Refer band: sits near the bottom of the page, above the FAQ.
export function Refer() {
  return (
      <section id="refer" aria-labelledby="refer-h" className="bg-coral text-ink-950">
        <div className="wrap grid gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center" data-reveal>
          <div>
            <p className="kicker !text-ink-900/70 [&>b]:!text-ink-950 after:!bg-ink-950/30"><b>08</b>Referrals</p>
            <h2 id="refer-h" className="display-2 mt-4 max-w-[16ch]">{referral.headline}</h2>
            <p className="mt-4 max-w-[44ch] text-lg text-ink-900/80">{referral.short}</p>
            <p className="mt-3 max-w-[50ch] text-sm text-ink-900/70">{referral.rules.join(' ')} {referral.note}</p>
          </div>
          <div className="rounded-2xl bg-paper p-5 sm:p-6">
            <p className="mb-4 text-lg font-semibold">Get your referral link</p>
            <ReferralKit tone="light" />
          </div>
        </div>
      </section>
  )
}
