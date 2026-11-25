import { why, exampleListing } from '../content'
import mayaPhoto from '../assets/maya.jpg'
import jordanPhoto from '../assets/jordan.jpg'
import { useApply } from '../apply'

// Mock brand search showing a creator's listing surfacing in results. Planned capability, illustrative.
const RESULTS = [
  { k: 'Casius Jones', meta: 'Founder of Castkey · 60K+ followers', you: true, look: '', photo: '' },
  { k: 'Maya Okafor', meta: 'AI example · Beauty · 142K followers', you: false, look: 'beauty', photo: mayaPhoto as string },
  { k: 'Jordan Reyes', meta: 'AI example · Fitness · 86.4K followers', you: false, look: 'fitness', photo: jordanPhoto as string },
]

/** Illustrated, clearly not photographic, avatars for the fictional example creators. */
function Avatar({ look }: { look: string }) {
  const fitness = look === 'fitness'
  return (
    <svg viewBox="0 0 48 56" className="h-14 w-12 shrink-0 rounded-lg" aria-hidden="true">
      <rect width="48" height="56" fill={fitness ? '#B6D1EE' : '#E9D7CF'} />
      {fitness ? (
        <>
          <circle cx="24" cy="13" r="8" fill="#2a2420" />{/* hair bun */}
          <path d="M8 56c1-12 7-18 16-18s15 6 16 18z" fill="#E8774F" />{/* tank top */}
          <circle cx="24" cy="24" r="9" fill="#8a5a3c" />
          <path d="M15 22c1-6 5-9 9-9s8 3 9 9c-3-3-6-4-9-4s-6 1-9 4z" fill="#2a2420" />
        </>
      ) : (
        <>
          <path d="M11 40c0-16 5-26 13-26s13 10 13 26z" fill="#4a2f26" />{/* long hair */}
          <path d="M9 56c1-11 7-16 15-16s14 5 15 16z" fill="#262320" />
          <circle cx="24" cy="25" r="9" fill="#c98f6e" />
          <path d="M15 24c1-7 5-10 9-10s8 3 9 10c-2-4-6-6-9-6s-7 2-9 6z" fill="#4a2f26" />
        </>
      )}
    </svg>
  )
}

export function Why() {
  const { open } = useApply()
  return (
    <section id="why" aria-labelledby="why-h" className="band border-t border-line">
      <div className="wrap" data-reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="why-h" className="display-2">{why.title}</h2>
            <p className="mt-3 font-display text-3xl font-light tracking-tight text-sub">{why.lead}</p>
          </div>
          <button type="button" className="btn-primary press" onClick={() => open('creator')}>Apply to list your likeness</button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-2 rounded-3xl border border-line bg-ink-900 p-2 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div className="rounded-2xl bg-ink-850 p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-coral px-3 py-1 text-xs font-semibold text-ink-950">{why.feature.tag}</span>
            <h3 className="mt-4 font-display text-4xl font-light tracking-tight">{why.feature.k}</h3>
            <p className="mt-3 max-w-[52ch] text-base text-sub">{why.feature.v}</p>
          </div>

          {/* Illustrative brand search */}
          <div className="rounded-2xl bg-ink-950 p-4 sm:p-6" role="img" aria-label="Illustration: a brand searches for creators. Results: Casius Jones, founder of Castkey, 60K+ followers; Maya Okafor, AI-generated example beauty creator, 142K followers; Jordan Reyes, AI-generated example fitness creator, 86.4K followers.">
            <div className="flex items-center justify-between">
              <p className="text-xs text-mute">Brand view</p>
              <span className="tag-ill">Illustrative · examples are AI-generated</span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-ink-850 px-3 py-2 text-sm text-sub">
              <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-mute" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <span className="truncate">Creators · ages 25–34 · likeness and voice</span>
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-2">
              {RESULTS.map((r, i) => (
                <li key={i} className={`flex items-center gap-3 rounded-xl border p-2 ${r.you ? 'border-coral/60 bg-coral/10' : 'border-line'}`}>
                  {r.you && exampleListing.photo ? (
                    <img src={exampleListing.photo} alt="Casius Jones" className="h-14 w-12 shrink-0 rounded-lg object-cover" />
                  ) : r.photo ? (
                    <img src={r.photo} alt={`${r.k}, AI-generated example creator`} className="h-14 w-12 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <Avatar look={r.look} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{r.k}</p>
                    <p className="truncate text-xs text-mute">{r.meta}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.you ? 'bg-paper text-ink-950' : 'border border-line text-sub'}`}>Request</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-2 grid gap-2 md:grid-cols-3">
          {why.reasons.map((r) => (
            <li key={r.k} className="rounded-2xl border border-line p-6">
              <h3 className="text-lg font-medium">{r.k}</h3>
              <p className="mt-2 text-sm text-sub">{r.v}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
