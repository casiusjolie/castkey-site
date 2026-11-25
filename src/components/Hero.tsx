import { hero } from '../content'
import { useApply } from '../apply'
import { WorkflowArt } from './WorkflowArt'

export function Hero() {
  const { open } = useApply()
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="wrap pb-16 pt-24 text-center sm:pt-32 lg:pb-24 lg:pt-40">
        <p className="eyebrow text-coral">{hero.eyebrow}</p>
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
          <div className="relative overflow-hidden rounded-3xl border border-line">
            <WorkflowArt />
          </div>
        </div>
      </div>
    </section>
  )
}
