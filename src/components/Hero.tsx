import { hero } from '../content'
import { useApply } from '../apply'
import { HeroWeb } from './HeroWeb'

export function Hero() {
  const { open } = useApply()
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap relative z-[1] pb-16 pt-24 text-center sm:pt-32 lg:pb-24 lg:pt-40">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-900/60 px-3 py-1 font-mono text-xs uppercase tracking-[0.08em] text-sub backdrop-blur"><span className="live-dot h-1.5 w-1.5 rounded-full bg-coral" aria-hidden="true" />{hero.eyebrow}</p>
        <h1 className="display-1 text-hero mx-auto mt-6 max-w-[680px]">Get paid<br />for your face.</h1>
        <p className="mx-auto mt-6 max-w-[680px] text-lg text-sub sm:text-xl">{hero.body}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <button type="button" className="btn-primary press px-6" onClick={() => open('creator')}>Apply to list your likeness</button>
          <button type="button" className="link-arrow press" onClick={() => open('brand')}>
            {hero.small}: request a demo <span aria-hidden="true">›</span>
          </button>
        </div>

        <p className="mt-6 text-sm text-mute">Free to apply · Verified profiles only · About two minutes</p>

        <div className="relative mx-auto mt-16 max-w-[1100px] sm:mt-20" data-reveal>
          <div className="lit relative overflow-hidden rounded-3xl" data-spot>
            <HeroWeb />
          </div>
        </div>
      </div>
    </section>
  )
}
