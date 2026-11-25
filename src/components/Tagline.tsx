import { useEffect, useRef } from 'react'

// Large statement whose words light up one at a time as they cross a trigger line.
const LINES = ['Your face works.', 'You get paid.']

export function Tagline() {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const words = [...(ref.current?.querySelectorAll<HTMLSpanElement>('.tw') ?? [])]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => w.classList.add('on'))
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const trigger = window.innerHeight * 0.62
      words.forEach((w) => w.classList.toggle('on', w.getBoundingClientRect().top < trigger))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <section aria-label="Statement" className="band">
      <div className="wrap">
        <h2 ref={ref} className="mx-auto max-w-[680px] text-center font-display text-5xl font-light leading-none tracking-tight sm:text-6xl">
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.split(' ').map((w, i) => (
                <span key={i} className="tw">{w}{i < line.split(' ').length - 1 ? ' ' : ''}</span>
              ))}
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}
