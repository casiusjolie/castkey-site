import { calls } from '../content'
import { useApply } from '../apply'
import { MinimumScreen } from './AppScreens'

// Open calls: brands pin paid briefs to a bulletin board; creators browse and apply.
// Next to it, the creator's inbound minimum. Board entries are illustrative, not real brands.

// Full class names so Tailwind generates them.
const TILT = ['sm:-rotate-[1.5deg]', 'sm:rotate-[1deg]', 'sm:-rotate-[0.5deg]', 'sm:rotate-[1.5deg]', 'sm:-rotate-[1deg]', 'sm:rotate-[0.5deg]']
const PIN: Record<string, string> = { coral: 'bg-coral', ice: 'bg-ice', paper: 'bg-paper' }

export function OpenCalls() {
  const { open } = useApply()
  return (
    <section id="calls" aria-labelledby="calls-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[680px]">
            <p className="kicker"><b>04</b>Open calls</p>
            <h2 id="calls-h" className="display-2 mt-4">{calls.title}</h2>
            <p className="lede mt-6">{calls.lead}</p>
          </div>
          <button type="button" className="btn-ghost press" onClick={() => open('brand')}>{calls.brandCta}</button>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
          {/* Bulletin board */}
          <div className="lit rounded-3xl p-4 sm:p-6" data-spot>
            <div className="mb-4 flex items-center justify-between gap-3 px-1">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-sub">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-coral" aria-hidden="true" />Open calls board
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">Illustrative</span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2" aria-label="Example open calls from brands">
              {calls.board.map((c, i) => (
                <li key={c.brand} className={`relative rounded-2xl border border-line bg-ink-850 p-4 pt-5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 ${TILT[i]} sm:hover:rotate-0 ${i > 3 ? 'hidden sm:block' : ''}`}>
                  <span className={`absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${PIN[c.pin]} shadow-[0_2px_6px_rgba(0,0,0,0.6)]`} aria-hidden="true" />
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold">{c.brand}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-mute">{c.need}</p>
                  </div>
                  <p className="mt-3 font-display text-3xl tracking-[-0.02em]">{c.pay}<span className="font-sans text-sm text-sub"> / month</span></p>
                  <p className="mt-2 text-sm text-sub">{c.use} · {c.length}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="chip">{c.tag}</span>
                    <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-950" aria-hidden="true">Apply</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <MinimumScreen />
            <div className="mx-auto mt-6 max-w-[340px]">
              <p className="font-semibold">{calls.minimum.k}</p>
              <p className="mt-1 text-sm text-sub">{calls.minimum.v}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
