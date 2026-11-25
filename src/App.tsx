import { useEffect, useState } from 'react'
import { ApplyContext } from './apply'
import type { Audience } from './lib/submit'
import { legalLinks } from './lib/submit'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FAQ, Closing } from './components/Sections'
import { Invite } from './components/Invite'
import { Listing } from './components/Listing'
import { OpenCalls } from './components/OpenCalls'
import { HowItWorks } from './components/HowItWorks'
import { Earn, Refer } from './components/Earn'
import { FAST_TRACKS, fastTrackKey } from './lib/fasttrack'
import { useSpotlight } from './lib/motion'
import { Agencies } from './components/Agencies'
import { ApplicationDialog } from './components/ApplicationDialog'
import { Wordmark } from './components/Logo'
import { Intro } from './components/Intro'
import { BugReport } from './components/BugReport'
import { nav } from './content'

function Footer({ open }: { open: (a: Audience) => void }) {
  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-[48ch] text-sm text-mute">
            Castkey is in early access. Product previews, example profiles and demo records on this page are illustrative and not real listings, licenses or people.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-sub">
            {nav.map((n) => (
              <li key={n.id}><a className="hover:text-paper" href={`#${n.id}`}>{n.label}</a></li>
            ))}
            <li><button type="button" className="hover:text-paper" onClick={() => window.dispatchEvent(new Event('ck:intro'))}>Watch the intro</button></li>
            <li><button type="button" className="hover:text-paper" onClick={() => open('partner')}>Become a partner</button></li>
            <li><button type="button" className="hover:text-paper" onClick={() => open('brand')}>Brands: request a demo</button></li>
            <li><BugReport className="hover:text-paper" /></li>
            <li>{legalLinks.privacy ? <a className="hover:text-paper" href={legalLinks.privacy}>Privacy</a> : <span className="text-mute">Privacy (pending)</span>}</li>
            <li>{legalLinks.terms ? <a className="hover:text-paper" href={legalLinks.terms}>Terms</a> : <span className="text-mute">Terms (pending)</span>}</li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default function App() {
  const [audience, setAudience] = useState<Audience | null>(null)
  useSpotlight()
  // Scroll reveals: each [data-reveal] rises in once as it enters the viewport.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  // Creators go to the inline invitation (the centerpiece); brands get the demo-request sheet.
  const open = (a: Audience) => {
    if (a === 'creator') {
      setAudience(null)
      const el = document.getElementById('invite')
      el?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
      setTimeout(() => el?.querySelector<HTMLElement>('input, button')?.focus({ preventScroll: true }), 450)
    } else setAudience(a)
  }
  // Fast-track links (/apply, /brands, /agencies, /refer, /earn, /how, /faq, or the same as #hash).
  useEffect(() => {
    const go = () => {
      const key = fastTrackKey()
      if (!key) return
      const t = FAST_TRACKS[key]
      if (t.kind === 'dialog') { setAudience(t.audience); return }
      const el = document.getElementById(t.id)
      if (!el) return
      el.querySelectorAll<HTMLElement>('[data-reveal]').forEach((r) => r.classList.add('is-in'))
      el.scrollIntoView({ block: 'start' })
      if (t.focus) setTimeout(() => el.querySelector<HTMLElement>('input, button')?.focus({ preventScroll: true }), 300)
    }
    // Run after layout, then again once fonts and images settle, so the landing spot doesn't drift.
    let n = 0
    const settle = () => { if (n++ < 3) go() }
    const t = setTimeout(settle, 120)
    document.fonts?.ready.then(() => setTimeout(settle, 50))
    if (document.readyState === 'complete') setTimeout(settle, 400)
    else window.addEventListener('load', () => setTimeout(settle, 50), { once: true })
    window.addEventListener('hashchange', go)
    return () => { clearTimeout(t); window.removeEventListener('hashchange', go) }
  }, [])
  return (
    <ApplyContext.Provider value={{ open }}>
      <Intro />
      <Header />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Invite />
        <Listing />
        <OpenCalls />
        <Earn />
        <Agencies />
        <Refer />
        <FAQ />
        <Closing />
      </main>
      <Footer open={open} />
      <ApplicationDialog audience={audience} onClose={() => setAudience(null)} onSwitch={open} />
    </ApplyContext.Provider>
  )
}
