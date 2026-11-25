import { whyBrands as W } from '../content'
import { useApply } from '../apply'

// Why brands pay, in plain words: one big trend stat, three simple reasons, one cost comparison.

export function WhyBrands() {
  const { open } = useApply()
  return (
    <section id="brands" aria-labelledby="brands-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <p className="kicker"><b>02</b>For brands</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <h2 id="brands-h" className="display-2 max-w-[16ch]">{W.title}</h2>
            <p className="lede mt-6">{W.lead}</p>
            <ul className="mt-8 grid gap-4">
              {W.points.map((p) => (
                <li key={p.k} className="flex gap-3">
                  <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-coral" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <p><span className="font-semibold">{p.k}.</span> <span className="text-sub">{p.v}</span></p>
                </li>
              ))}
            </ul>
            <button type="button" className="btn-primary press mt-8" onClick={() => open('brand')}>{W.cta}</button>
          </div>

          <div className="grid gap-3">
            <figure className="lit rounded-3xl p-6 sm:p-10" data-spot>
              <p className="font-display text-7xl leading-none tracking-[-0.04em] sm:text-8xl">{W.stat.n}</p>
              <p className="mt-4 max-w-[30ch] text-xl text-sub">{W.stat.k}</p>
              <a href={W.stat.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-mute underline-offset-4 hover:text-paper hover:underline">Source: {W.stat.src}</a>
            </figure>
            <div className="lit grid gap-px overflow-hidden rounded-3xl sm:grid-cols-2">
              <div className="p-5">
                <p className="text-sm text-sub">{W.compare.a}</p>
                <p className="mt-1 font-display text-3xl tracking-[-0.02em] text-paper/60 line-through decoration-paper/30">{W.compare.av}</p>
              </div>
              <div className="border-t border-line bg-coral/10 p-5 sm:border-l sm:border-t-0">
                <p className="text-sm text-sub">{W.compare.b}</p>
                <p className="mt-1 font-display text-3xl tracking-[-0.02em]">{W.compare.bv}</p>
              </div>
            </div>
            <a href={W.compare.url} target="_blank" rel="noopener noreferrer" className="px-1 font-mono text-[11px] uppercase tracking-[0.08em] text-mute underline-offset-4 hover:text-paper hover:underline">Video cost: {W.compare.src}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
