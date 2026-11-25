import { agencies } from '../content'
import { useApply } from '../apply'

// Agencies and managers: roster upload, one dashboard, management split paid automatically, plus referral reward.
export function Agencies() {
  const { open } = useApply()
  return (
    <section id="agencies" aria-labelledby="ag-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="eyebrow">{agencies.eyebrow}</p>
            <h2 id="ag-h" className="display-2 mt-3">{agencies.title}</h2>
            <p className="lede mt-6">{agencies.lead}</p>
            <button type="button" className="btn-primary press mt-8" onClick={() => open('partner')}>{agencies.cta}</button>
            <p className="mt-4 max-w-[46ch] text-xs text-mute">{agencies.note}</p>
          </div>
          <div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {agencies.points.map((p, i) => (
                <li key={p.k} className="rounded-3xl border border-line bg-ink-900 p-6">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-coral text-sm font-semibold text-ink-950" aria-hidden="true">{i + 1}</span>
                  <h3 className="mt-4 font-sans text-lg font-semibold">{p.k}</h3>
                  <p className="mt-2 text-sm text-sub">{p.v}</p>
                </li>
              ))}
            </ol>
            <p className="mt-3 rounded-2xl border border-line px-5 py-4 text-sm text-sub">{agencies.example}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
