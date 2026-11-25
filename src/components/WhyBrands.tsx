import { whyBrands as W } from '../content'
import { useApply } from '../apply'

// Why brands pay: the trend (sourced figures), what a license gives them, and a sourced cost example.
// Written for brands who land here, and for creators wondering why a brand would pay.

export function WhyBrands() {
  const { open } = useApply()
  return (
    <section id="brands" aria-labelledby="brands-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[680px]">
            <p className="kicker"><b>02</b>For brands</p>
            <h2 id="brands-h" className="display-2 mt-4">{W.title}</h2>
            <p className="lede mt-6">{W.lead}</p>
          </div>
          <button type="button" className="btn-ghost press" onClick={() => open('brand')}>{W.cta}</button>
        </div>

        {/* The trend */}
        <ul className="mt-12 grid gap-3 sm:grid-cols-3" aria-label="The trend">
          {W.stats.map((s) => (
            <li key={s.n} className="lit rounded-3xl p-6" data-spot>
              <p className="font-display text-5xl sm:text-6xl tracking-[-0.03em] text-paper">{s.n}</p>
              <p className="mt-3 text-sub">{s.k}</p>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-mute underline-offset-4 hover:text-paper hover:underline">Source: {s.src}</a>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* What a license gives them */}
          <ol className="lit grid gap-5 rounded-3xl p-6 sm:p-8">
            {W.points.map((p, i) => (
              <li key={p.k} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral text-sm font-semibold text-ink-950" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="font-sans text-lg font-semibold tracking-normal">{p.k}</h3>
                  <p className="mt-1 text-sub">{p.v}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Cost example */}
          <figure className="lit rounded-3xl p-6 sm:p-8" aria-labelledby="brands-ex">
            <figcaption id="brands-ex" className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">{W.example.title}</figcaption>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-line p-5">
                <p className="text-sm text-sub">{W.example.ugc.k}</p>
                <p className="mt-1 font-display text-4xl sm:text-5xl tracking-[-0.03em] text-paper/70 line-through decoration-paper/30">{W.example.ugc.v}</p>
                <p className="mt-2 text-xs text-mute">{W.example.ugc.note}</p>
              </div>
              <div className="rounded-2xl border border-coral bg-coral/10 p-5 shadow-[0_0_40px_-12px_rgba(232,119,79,0.6)]">
                <p className="text-sm text-sub">{W.example.castkey.k}</p>
                <p className="mt-1 font-display text-4xl sm:text-5xl tracking-[-0.03em]">{W.example.castkey.v}</p>
                <p className="mt-2 text-xs text-mute">{W.example.castkey.note}</p>
              </div>
            </div>
            <a href={W.example.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-mute underline-offset-4 hover:text-paper hover:underline">Source: {W.example.src}</a>
          </figure>
        </div>
      </div>
    </section>
  )
}
