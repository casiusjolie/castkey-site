import { useId, useState } from 'react'
import { problem, brands, creators, trust, faq, closing, pillars, pillarsTitle, creatorPay, everyone } from '../content'
import { useApply, ApplyButtons } from '../apply'
import { InviteSomeone } from './InviteSomeone'
import { Demo } from './Demo'

const Check = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={`h-4 w-4 shrink-0 ${className}`} aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Statement() {
  return (
    <section aria-labelledby="statement-h" className="pb-16 sm:pb-24">
      <div className="wrap">
        <h2 id="statement-h" className="display-2" data-reveal>{pillarsTitle}</h2>
        <ul id="creators" className="mt-10 grid gap-4 md:grid-cols-3" data-reveal>
          {pillars.map((p) => (
            <li key={p.k} className={`rounded-3xl p-8 ${p.tone === 'coral' ? 'bg-coral text-ink-950' : p.tone === 'ice' ? 'bg-ice text-ink-950' : 'bg-paper text-ink-950'}`}>
              <h3 className="font-display text-4xl font-light tracking-tight">{p.k}</h3>
              <p className="mt-16 text-base leading-[1.5] text-ink-900">{p.v}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Problem() {
  return (
    <section aria-labelledby="problem-h" className="band border-t border-line bg-ink-900">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 id="problem-h" className="h2">{problem.title}</h2>
          <p className="lede mt-6">{problem.body}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...problem.sides].reverse().map((s, i) => (
            <div key={s.who} className="card p-6 sm:p-8">
              <p className={`text-xs font-medium ${i === 0 ? 'text-coral' : 'text-ice'}`}>{s.who}</p>
              <p className="mt-3 font-display text-2xl leading-[1.15]">{s.line}</p>
              <ul className="mt-6 grid gap-3 border-t border-line pt-6 text-sm text-sub">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Check className={`mt-1 ${i === 0 ? 'text-coral' : 'text-ice'}`} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Everyone() {
  const { open } = useApply()
  return (
    <section id="everyone" aria-labelledby="everyone-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <h2 id="everyone-h" className="display-2">{everyone.title}</h2>
        <p className="lede mt-4">{everyone.body}</p>
        <ul className="mt-10 grid gap-2 rounded-3xl border border-line bg-ink-900 p-2 lg:grid-cols-3">
          {everyone.sides.map((s, i) => (
            <li key={s.who} className={`flex flex-col rounded-2xl p-6 sm:p-8 ${i === 0 ? 'bg-coral text-ink-950' : 'bg-ink-850'}`}>
              <p className={`text-sm font-medium ${i === 0 ? 'text-ink-900' : i === 1 ? 'text-ice' : 'text-coral'}`}>{s.who}</p>
              <h3 className="mt-3 font-display text-3xl font-light tracking-tight">{s.line}</h3>
              <ul className={`mt-6 grid gap-3 text-sm ${i === 0 ? 'text-ink-900' : 'text-sub'}`}>
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {p}
                  </li>
                ))}
              </ul>
              <button type="button" className={`${i === 0 ? 'btn-dark' : 'btn-ghost'} press mt-8 self-start`} onClick={() => open(s.action as 'creator' | 'brand' | 'partner')}>{s.cta}</button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-mute">{everyone.note}</p>
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-h" className="band grain border-t border-line">
      <div className="wrap" data-reveal>
        <p className="eyebrow">How it works</p>
        <h2 id="how-h" className="display-2 mt-3">From application to payout.</h2>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {creatorPay.steps.map((s, i) => (
            <li key={s.k} className="bg-ink-950 p-6">
              <span className="font-display text-4xl leading-none text-coral" aria-hidden="true">{i + 1}</span>
              <h3 className="mt-6 font-sans text-base font-medium tracking-normal"><span className="sr-only">Step {i + 1}: </span>{s.k}</h3>
              <p className="mt-2 text-sm text-sub">{s.v}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-mute">{creatorPay.stepsNote}</p>
        <details className="group mt-10 rounded-card border border-line">
          <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 px-6 text-base font-medium [&::-webkit-details-marker]:hidden">
            <span>See the whole workflow <span className="ml-2 text-sm font-normal text-mute">Interactive demo · sample data</span></span>
            <span className="text-xl text-mute transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <div className="border-t border-line px-4 pb-6 sm:px-6">
            <Demo />
          </div>
        </details>
      </div>
    </section>
  )
}

export function Brands() {
  const { open } = useApply()
  return (
    <section id="brands" aria-labelledby="brands-h" className="band border-t border-line">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <p className="eyebrow">For brands and agencies</p>
            <h2 id="brands-h" className="display-2 mt-3">{brands.title}</h2>
          </div>
          <p className="lede">{brands.body}</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {brands.audiences.map((a) => (
            <div key={a.k} className="rounded-card bg-greige p-6 text-ink-950 sm:p-8">
              <h3 className="text-3xl">{a.k}</h3>
              <p className="mt-10 text-sm text-ink-900">{a.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-mute">{brands.audiencesNote}</p>
        <dl className="mt-16 grid gap-x-10 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {brands.benefits.map((b) => (
            <div key={b.k}>
              <dt className="flex items-center gap-2 text-base font-medium">
                <Check className="text-coral" />
                {b.k}
              </dt>
              <dd className="mt-2 text-sm text-sub">{b.v}</dd>
            </div>
          ))}
        </dl>
        <button type="button" className="btn-primary press mt-12" onClick={() => open('brand')}>
          Request a demo
        </button>
      </div>
    </section>
  )
}

export function Creators() {
  const { open } = useApply()
  return (
    <section id="creators" aria-labelledby="creators-h" className="band bg-paper text-ink-950">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div>
          <p className="text-xs font-medium text-[#8a3a1e]">For creators</p>
          <h2 id="creators-h" className="h2 mt-3">{creators.title}</h2>
          <p className="mt-6 max-w-[56ch] text-base text-ink-800">{creators.body}</p>
          <div className="mt-8 rounded-card bg-ink-950 p-6 text-paper">
            <p className="font-display text-xl leading-snug">{creators.fee}</p>
            <p className="mt-3 text-xs text-mute">{creators.feeNote}</p>
          </div>
          <button type="button" className="btn-dark mt-8" onClick={() => open('creator')}>
            Apply as a creator
          </button>
        </div>
        <div>
          <ul className="grid gap-px overflow-hidden rounded-card border border-ink-950/15 bg-ink-950/15">
            {creators.options.map((o, i) => (
              <li key={o.k} className="grid gap-2 bg-paper p-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6">
                <h3 className="flex items-center gap-3 font-sans text-base font-medium tracking-normal">
                  <span className="flex gap-1" aria-hidden="true">
                    <span className={`h-2.5 w-2.5 rounded-sm ${i !== 1 ? 'bg-coral' : 'bg-ink-950/15'}`} />
                    <span className={`h-2.5 w-2.5 rounded-sm ${i !== 0 ? 'bg-ink-950' : 'bg-ink-950/15'}`} />
                  </span>
                  {o.k}
                </h3>
                <p className="text-sm text-ink-800">{o.v}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-card border border-ink-950/15 p-6">
            <h3 className="font-sans text-base font-medium tracking-normal">Paid ads</h3>
            <p className="mt-2 text-sm text-ink-800">{creators.paid}</p>
            <a href="#creator-pay" className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium underline underline-offset-4">See how creators get paid <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Trust() {
  return (
    <section id="trust" aria-labelledby="trust-h" className="band bg-ink-900">
      <div className="wrap" data-reveal>
        <p className="eyebrow">Trust</p>
        <h2 id="trust-h" className="display-2 mt-3 max-w-[20ch]">{trust.title}</h2>
        <ul className="mt-10 grid gap-x-10 border-t border-line sm:grid-cols-2">
          {trust.items.map((t) => (
            <li key={t.k} className="border-b border-line py-6">
              <h3 className="font-sans text-base font-medium tracking-normal">{t.k}</h3>
              <p className="mt-2 text-sm text-sub">{t.v}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[68ch] text-sm"><span className="font-medium">No nudity or sexually explicit content, ever.</span> <span className="text-sub">Vice brands like alcohol, cannabis and betting can use Castkey, but only reach creators who opt in, and only inside the law for their category.</span></p>
        <div className="mt-8 rounded-card border border-coral/40 bg-coral/[0.07] p-6 sm:p-8">
          <p className="text-xs font-medium text-coral">Important limitation</p>
          <p className="mt-3 max-w-[60ch] font-display text-xl leading-[1.25] sm:text-2xl">{trust.limit}</p>
        </div>
      </div>
    </section>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [openState, setOpen] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-line">
      <h3 className="font-sans text-base font-medium tracking-normal">
        <button
          type="button"
          className="flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left"
          aria-expanded={openState}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          {q}
          <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
            <span className="absolute left-0 top-1/2 h-px w-4 bg-paper" />
            <span className={`absolute left-1/2 top-0 h-4 w-px bg-paper transition-transform ${openState ? 'scale-y-0' : ''}`} />
          </span>
        </button>
      </h3>
      <div id={id} hidden={!openState} className="pb-6 pr-10 text-base text-sub">
        <p className="max-w-[68ch]">{a}</p>
      </div>
    </li>
  )
}

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="band border-t border-line">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16" data-reveal>
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-h" className="display-2 mt-3">Questions, answered.</h2>
        </div>
        <ul className="border-t border-line">
          {faq.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Closing() {
  const { open } = useApply()
  return (
    <section id="apply" aria-labelledby="close-h" className="band bg-coral text-ink-950">
      <div className="wrap text-center" data-reveal>
        <h2 id="close-h" className="display-1 mx-auto max-w-[14ch]">{closing.title}</h2>
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" className="btn-dark press px-8 text-base" onClick={() => open('creator')}>Apply to list your likeness</button>
            <InviteSomeone tone="light" />
          </div>
          <button type="button" className="press inline-flex min-h-[44px] items-center text-sm underline underline-offset-4" onClick={() => open('brand')}>Brands and agencies: request a demo</button>
        </div>
      </div>
    </section>
  )
}

export { ApplyButtons }
