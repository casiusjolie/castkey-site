import { useEffect, useRef, useState } from 'react'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ease = (t: number) => 1 - Math.pow(1 - t, 4) // decelerates into place

/** Animates a number toward `target` whenever it changes, starting from the value on screen now. */
export function useTween(target: number, ms = 700) {
  const [v, setV] = useState(target)
  const from = useRef(target)
  const cur = useRef(target)
  useEffect(() => {
    if (reduced()) { cur.current = target; setV(target); return }
    from.current = cur.current
    const t0 = performance.now()
    let raf = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      cur.current = from.current + (target - from.current) * ease(p)
      setV(cur.current)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

/** Counts up from 0 the first time the element scrolls into view. */
export function useCountUpOnView<T extends HTMLElement>(target: number, ms = 1200) {
  const ref = useRef<T>(null)
  const [goal, setGoal] = useState(reduced() ? target : 0)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGoal(target); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])
  return [ref, useTween(goal, ms)] as const
}

/** Pointer spotlight: sets --mx/--my on whichever [data-spot] surface the pointer is over. */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-spot]') as HTMLElement | null
      if (!el) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])
}

/** True once the element has scrolled into view (stays true). */
export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}
