import { how } from '../content'
import { RequestScreen } from './AppScreens'

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-h" className="band border-t border-line">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20" data-reveal>
        <div>
          <p className="kicker"><b>01</b>How it works</p>
          <h2 id="how-h" className="display-2 mt-4">{how.title}</h2>
          <ol className="mt-10 grid gap-6">
            {how.steps.map((s, i) => (
              <li key={s.k} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral text-sm font-semibold text-ink-950" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="font-sans text-lg font-semibold">{s.k}</h3>
                  <p className="mt-1 max-w-[46ch] text-sub">{s.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <RequestScreen />
      </div>
    </section>
  )
}
