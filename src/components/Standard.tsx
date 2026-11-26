import { standard as S } from '../content'

// The Castkey Standard: the rules every deal follows. Linkable at /standard and #standard.

export function Standard() {
  return (
    <section id="standard" aria-labelledby="standard-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <p className="kicker"><b>09</b>The standard</p>
            <h2 id="standard-h" className="display-2 mt-3">{S.title}</h2>
            <p className="lede mt-6 max-w-[38ch]">{S.lead}</p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {S.rules.map((r, i) => (
              <li key={r.k} className={`bg-ink-900 p-5 ${i === S.rules.length - 1 && S.rules.length % 2 === 1 ? 'sm:col-span-2' : ''}`}>
                <p className="font-mono text-xs text-coral">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-2 font-semibold text-paper">{r.k}</p>
                <p className="mt-1 text-sm text-sub">{r.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
