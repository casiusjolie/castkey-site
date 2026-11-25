import { useEffect, useRef, useState } from 'react'
import { nav } from '../content'
import { useApply } from '../apply'
import { Wordmark } from './Logo'

export function Header() {
  const { open } = useApply()
  const [menu, setMenu] = useState(false)
  const [current, setCurrent] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Indicate the section in view.
  useEffect(() => {
    const els = ['top', ...nav.map((n) => n.id)].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!menu) return
    document.documentElement.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a,button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenu(false); toggleRef.current?.focus() }
      if (e.key === 'Tab' && panelRef.current) {
        const f = [...panelRef.current.querySelectorAll<HTMLElement>('a,button'), toggleRef.current!]
        const i = f.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus() }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus() }
      }
    }
    const onResize = () => window.innerWidth >= 1024 && setMenu(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [menu])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 pt-3 sm:pt-4">
      <a href="#main" className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink-950">
        Skip to content
      </a>
      <div className="nav-pill pointer-events-auto relative z-50 mx-3 flex h-14 items-center gap-4 rounded-full px-2 sm:mx-auto sm:w-fit sm:min-w-[600px] lg:min-w-0">
        <div className="flex flex-1 items-center">
          <a href="#top" className="flex h-10 shrink-0 items-center whitespace-nowrap rounded-full pl-2 pr-1" aria-label="Castkey, back to top" onClick={() => setMenu(false)}>
            <Wordmark />
          </a>
        </div>
        <nav aria-label="Primary" className="hidden shrink-0 lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={current === n.id ? 'location' : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 ${current === n.id ? 'bg-paper/10 text-paper' : 'text-sub hover:text-paper'}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <a href="/app/" className="hidden min-h-10 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium text-sub transition-colors duration-300 hover:text-paper sm:inline-flex">Log in</a>
          <button type="button" className="btn-primary press hidden min-h-10 shrink-0 whitespace-nowrap text-sm sm:inline-flex" onClick={() => open('creator')}>
            Apply
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="burger grid h-10 w-10 place-items-center rounded-full hover:bg-paper/10 lg:hidden"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            onClick={() => setMenu((m) => !m)}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span className="absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-paper" />
              <span className="absolute bottom-1 left-0 block h-0.5 w-5 rounded-full bg-paper" />
            </span>
          </button>
        </div>
      </div>

      {menu && (
        <div id="mobile-menu" ref={panelRef} className="menu-panel pointer-events-auto fixed inset-0 z-40 flex flex-col px-6 pb-10 pt-24 lg:hidden">
          <nav aria-label="Mobile">
            <ul className="grid gap-2">
              {nav.map((n, i) => (
                <li key={n.id} style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}>
                  <a href={`#${n.id}`} onClick={() => setMenu(false)} className="block py-3 font-display text-4xl font-light tracking-tight">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid gap-3">
            <button type="button" className="btn-primary press w-full" onClick={() => { setMenu(false); open('creator') }}>Apply</button>
            <a href="/app/" className="btn-ghost press w-full">Log in</a>
            <button type="button" className="btn-ghost press w-full" onClick={() => { setMenu(false); open('brand') }}>Brands: request an intro</button>
          </div>
        </div>
      )}
    </header>
  )
}
