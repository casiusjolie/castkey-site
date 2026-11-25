import { ecosystem, referral } from '../content'
import { ReferralKit } from './InviteSomeone'

// How the money moves: a brand pays, the creator keeps 80%, whoever referred the creator earns 5%
// (from Castkey's share, up to $10,000 per creator), Castkey keeps the rest.

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const SWATCH: Record<string, string> = { ice: 'bg-ice', coral: 'bg-coral', paper: 'bg-paper' }

export function Ecosystem() {
  const [brand, creator, referrer] = ecosystem.people
  const total = ecosystem.example
  const parts = [
    { k: 'Creator', amount: creator.amount, cls: 'bg-coral text-ink-950' },
    { k: 'Referrer', amount: referrer.amount, cls: 'bg-paper text-ink-950' },
    { k: 'Castkey', amount: ecosystem.castkey.amount, cls: 'bg-ink-700 text-paper' },
  ]
  return (
    <section id="refer" aria-labelledby="eco-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <div className="max-w-[720px]">
          <p className="eyebrow">{ecosystem.eyebrow}</p>
          <h2 id="eco-h" className="display-2 mt-3">{ecosystem.title}</h2>
          <p className="lede mt-6">{ecosystem.lead}</p>
        </div>

        {/* Where $1,000 goes */}
        <figure className="mt-12 rounded-3xl border border-line bg-ink-900 p-5 sm:p-8">
          <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-base font-semibold">{brand.k} pays {usd(total)} for one month</span>
            <span className="tag-ill">Example</span>
          </figcaption>
          <div className="mt-5 flex h-14 overflow-hidden rounded-2xl text-sm font-semibold" role="img" aria-label={`Of ${usd(total)}: creator ${usd(creator.amount)}, referrer ${usd(referrer.amount)}, Castkey ${usd(ecosystem.castkey.amount)}.`}>
            {parts.map((p) => (
              <div key={p.k} className={`flex min-w-[64px] items-center justify-center px-2 ${p.cls}`} style={{ width: `${(p.amount / total) * 100}%` }}>
                <span className="truncate">{usd(p.amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between gap-3 text-xs text-mute"><span>Creator keeps 80%</span><span>Referrer 5% · Castkey 15%</span></div>
        </figure>

        {/* The three people */}
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {ecosystem.people.map((p, i) => (
            <li key={p.k} className="rounded-3xl border border-line bg-ink-900 p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm text-sub"><i className={`h-2.5 w-2.5 rounded-full ${SWATCH[p.tone]}`} />{i + 1}. {p.k}</span>
                <span className="text-sm font-semibold">{p.role}</span>
              </div>
              <p className="mt-4 font-display text-5xl tracking-[-0.03em] tabular-nums">{usd(p.amount)}</p>
              <p className="mt-3 text-base text-sub">{p.v}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-mute"><span className="text-sub">{ecosystem.castkey.k}:</span> {ecosystem.castkey.v} {ecosystem.note}</p>

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
