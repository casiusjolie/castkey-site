import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Mark } from './components/Logo'

// Private investor portal: live, anonymous demand totals read from the intake script.
// Opened with a link like /investors/#k=KEY. The key is checked by the script; without it nothing loads.

type Dist = Record<string, number>
type Spend = { low: number; high: number; brands: number } | { hidden: true; brands: number }
type Stats = {
  ok: true
  updatedAt: string
  creators: { total: number; last7: number; invited: number; followers: Dist; licensing: Dist; reach: { low: number; high: number; answered: number } }
  brands: { total: number; last7: number; types: Dist; adSpend: Spend; creatorSpend: Spend; paysUsage: Dist; aiTools: Dist; usesAi: { yes: number; answered: number } }
  partners: { total: number; roster?: { low: number; high: number } }
  referrals?: { links: number; opens: number; approved: number }
  weeks: { start: string; creators: number; brands: number }[]
}

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
const REFRESH_MS = 60_000
const FOLLOWER_ORDER = ['Under 10K', '10K–50K', '50K–250K', '250K–1M', 'Over 1M']

const money = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${n}`)
const people = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : `${n}`)
const range = (lo: number, hi: number, f: (n: number) => string) => (lo === hi ? f(lo) : `${f(lo)}–${f(hi)}`)

function readKey() {
  const m = location.hash.match(/k=([A-Za-z0-9_-]{8,80})/)
  return m ? m[1] : ''
}

function Tile({ label, value, note, accent }: { label: string; value: string; note?: string; accent?: boolean }) {
  return (
    <div className={`rounded-card border p-5 ${accent ? 'border-coral/50 bg-coral/10' : 'border-line bg-ink-900'}`}>
      <p className="text-sm text-sub">{label}</p>
      <p className="mt-2 font-display text-4xl tracking-[-0.02em] tabular-nums">{value}</p>
      {note && <p className="mt-2 text-xs text-mute">{note}</p>}
    </div>
  )
}

function Bars({ title, data, order, empty }: { title: string; data: Dist; order?: string[]; empty: string }) {
  const keys = (order ?? Object.keys(data).sort((a, b) => data[b] - data[a])).filter((k) => data[k])
  const max = Math.max(1, ...keys.map((k) => data[k]))
  const total = keys.reduce((s, k) => s + data[k], 0)
  return (
    <section className="rounded-card border border-line bg-ink-900 p-5">
      <h3 className="font-sans text-base font-semibold">{title}</h3>
      {keys.length === 0 ? (
        <p className="mt-4 text-sm text-mute">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {keys.map((k) => (
            <li key={k}>
              <div className="flex justify-between text-sm"><span className="text-sub">{k}</span><span className="tabular-nums">{data[k]} <span className="text-mute">· {Math.round((data[k] / total) * 100)}%</span></span></div>
              <div className="mt-1.5 h-2 rounded-full bg-ink-800"><div className="h-2 rounded-full bg-coral" style={{ width: `${(data[k] / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Weekly({ weeks }: { weeks: Stats['weeks'] }) {
  const max = Math.max(1, ...weeks.map((w) => w.creators + w.brands))
  return (
    <section className="rounded-card border border-line bg-ink-900 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-sans text-base font-semibold">New applications per week</h3>
        <p className="flex gap-4 text-xs text-sub"><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-coral" />Creators</span><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-ice" />Brands</span></p>
      </div>
      <div className="mt-5 flex h-40 items-end gap-1.5" role="img" aria-label={`Applications per week for the last ${weeks.length} weeks: ${weeks.map((w) => `${w.creators} creators and ${w.brands} brands`).join('; ')}`}>
        {weeks.map((w) => (
          <div key={w.start} className="flex h-full flex-1 flex-col justify-end gap-px" title={`Week of ${w.start}: ${w.creators} creators, ${w.brands} brands`}>
            <div className="rounded-t-sm bg-ice" style={{ height: `${(w.brands / max) * 100}%` }} />
            <div className={`bg-coral ${w.brands ? '' : 'rounded-t-sm'}`} style={{ height: `${(w.creators / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-mute"><span>12 weeks ago</span><span>This week</span></div>
    </section>
  )
}

function spendValue(s: Spend) {
  return 'hidden' in s ? 'Soon' : range(s.low, s.high, money)
}
function spendNote(s: Spend) {
  return 'hidden' in s ? `Shown once 3 or more brands answer (${s.brands} so far)` : `Per month, from ${s.brands} brands' answers`
}

function Portal() {
  const [key] = useState(readKey)
  const [data, setData] = useState<Stats | null>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'denied' | 'error'>('loading')

  const load = useCallback(async () => {
    if (!key || !ENDPOINT) { setState('denied'); return }
    try {
      const res = await fetch(`${ENDPOINT}?stats=1&key=${encodeURIComponent(key)}`)
      const json = await res.json()
      if (json && json.ok) { setData(json); setState('ok') }
      else setState('denied')
    } catch {
      setState((s) => (s === 'ok' ? 'ok' : 'error'))
    }
  }, [key])

  useEffect(() => {
    load()
    const t = setInterval(() => { if (document.visibilityState === 'visible') load() }, REFRESH_MS)
    return () => clearInterval(t)
  }, [load])

  const updated = data ? new Date(data.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''

  return (
    <main className="wrap py-10 sm:py-14">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <a href="/" className="inline-flex items-center gap-3"><Mark className="h-8 w-8" /><span className="font-display text-2xl">Castkey</span></a>
        {state === 'ok' && (
          <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-sub" aria-live="polite">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60 motion-reduce:hidden" /><span className="relative inline-flex h-2 w-2 rounded-full bg-coral" /></span>
            Live · updated {updated}
          </p>
        )}
      </header>

      <div className="mt-12 max-w-[680px]">
        <p className="eyebrow">Investor update</p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-[-0.03em] sm:text-6xl">Demand, live.</h1>
        <p className="mt-5 text-lg text-sub">Brands making AI ads are stuck using fake AI people. Castkey is the marketplace where they license real creators’ faces and voices instead, paid monthly. Every deal pays everyone who made it happen: the brand pays the license plus a 10% brand fee, the creator keeps 80% (90% if they license exclusively through Castkey for 12 months), their manager or agency is paid automatically (capped at 20% of the creator’s share), and whoever referred the creator earns 5% from Castkey’s share. These numbers come straight from applications as they arrive.</p>
      </div>

      {state === 'loading' && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-card bg-ink-900" />)}
        </div>
      )}
      {state === 'denied' && (
        <p className="mt-12 rounded-card border border-line bg-ink-900 p-6 text-sub">This link isn’t valid or has expired. Ask Casius for a current investor link.</p>
      )}
      {state === 'error' && (
        <p className="mt-12 rounded-card border border-coral/50 bg-coral/10 p-6">Couldn’t load the latest numbers. Check your connection; this page tries again every minute.</p>
      )}

      {state === 'ok' && data && (
        <>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Tile accent label="Creator applicants" value={String(data.creators.total)} note={`${data.creators.last7} in the last 7 days`} />
            <Tile label="Combined creator reach" value={data.creators.reach.answered ? `${range(data.creators.reach.low, data.creators.reach.high, people)}` : '—'} note={data.creators.reach.answered ? `Followers, from ${data.creators.reach.answered} creators who shared a range` : 'No follower ranges shared yet'} />
            <Tile label="Came through a creator invite" value={data.creators.total ? `${Math.round((data.creators.invited / data.creators.total) * 100)}%` : '—'} note="Applicants who used another creator’s invite link" />
            <Tile accent label="Brand demo requests" value={String(data.brands.total)} note={`${data.brands.last7} in the last 7 days · ${data.partners.total} partner applications`} />
            <Tile label="Brands’ paid ad spend" value={spendValue(data.brands.adSpend)} note={spendNote(data.brands.adSpend)} />
            <Tile label="Brands’ creator & UGC spend" value={spendValue(data.brands.creatorSpend)} note={spendNote(data.brands.creatorSpend)} />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Tile label="Referral links created" value={String(data.referrals?.links ?? 0)} note={`${data.referrals?.opens ?? 0} link opens so far`} />
            <Tile label="Approved through referrals" value={String(data.referrals?.approved ?? 0)} note="Creators marked approved who came in on someone’s link" />
            <Tile label="Creators represented by agencies" value={data.partners.roster && data.partners.roster.high ? range(data.partners.roster.low, data.partners.roster.high, people) : '—'} note={`From ${data.partners.total} agency and manager applications, self-reported in ranges`} />
          </div>

          <div className="mt-4"><Weekly weeks={data.weeks} /></div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Bars title="Creators by follower count" data={data.creators.followers} order={FOLLOWER_ORDER} empty="No follower ranges yet." />
            <Bars title="What creators want to license" data={data.creators.licensing} empty="No answers yet." />
            <Bars title="AI tools brands already use for ads" data={data.brands.aiTools} empty="No brand answers yet." />
            <Bars title="Brands that pay creators for usage rights today" data={data.brands.paysUsage} empty="No brand answers yet." />
            <Bars title="Brand types" data={data.brands.types} empty="No brand requests yet." />
            <section className="rounded-card border border-line bg-ink-900 p-5">
              <h3 className="font-sans text-base font-semibold">Brands already making ads with AI</h3>
              <p className="mt-4 font-display text-5xl tabular-nums">{data.brands.usesAi.answered ? `${Math.round((data.brands.usesAi.yes / data.brands.usesAi.answered) * 100)}%` : '—'}</p>
              <p className="mt-2 text-sm text-sub">{data.brands.usesAi.answered ? `${data.brands.usesAi.yes} of ${data.brands.usesAi.answered} brands that answered use at least one AI ad tool.` : 'Shown once brands answer.'}</p>
            </section>
          </div>
        </>
      )}

      <footer className="mt-12 border-t border-line pt-6 text-xs text-mute">
        <p className="max-w-[80ch]">All figures are live, anonymous totals across every application. Spend and follower figures are self-reported in ranges, so they’re shown as low to high. Test and spam entries are left out. No individual applicant or brand is identified on this page. Confidential: please don’t share this link.</p>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Portal />
  </StrictMode>,
)
