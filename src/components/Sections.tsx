import { useId, useState } from 'react'
import { faq, closing } from '../content'
import { useApply } from '../apply'
import { InviteSomeone } from './InviteSomeone'

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
          <p className="kicker"><b>09</b>FAQ</p>
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
    <section id="start" aria-labelledby="close-h" className="band bg-coral text-ink-950">
      <div className="wrap text-center" data-reveal>
        <h2 id="close-h" className="display-1 mx-auto max-w-[14ch]">{closing.title}</h2>
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" className="btn-dark press px-8 text-base" onClick={() => open('creator')}>Apply to list your likeness</button>
            <InviteSomeone tone="light" />
          </div>
          <button type="button" className="press inline-flex min-h-[44px] items-center text-sm underline underline-offset-4" onClick={() => open('brand')}>Brands and agencies: request an intro</button>
        </div>
      </div>
    </section>
  )
}

