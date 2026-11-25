import { useEffect, useMemo, useRef, useState } from 'react'
import { Mark } from './Logo'

// Interactive walkthrough of the intended workflow. Everything here is sample data held in memory:
// nothing is saved, sent, verified or licensed.

type Assets = 'Likeness' | 'Voice' | 'Likeness and voice'
type Scope = 'Organic content' | 'Paid ads' | 'Organic and paid'
type Row = { id: number; channel: string; kind: 'Organic' | 'Paid'; spend: number }

const RULES = {
  topics: ['Alcohol', 'Politics', 'Gambling', 'Profanity', 'Competitor comparisons'],
  claims: ['Medical or health claims', 'Financial claims', 'Before-and-after claims'],
  wardrobe: ['Third-party logos', 'Swimwear', 'Uniforms of real organizations'],
}
const FORMULA = [
  'Identity consistency with the verified person',
  'Coverage: enough photos, talking video, voice where licensed',
  'Quality: resolution, lighting, audio clarity',
  'Guidelines are consistent and specific enough to enforce',
  'Hard rule screen: no nudity or explicit content',
  'Rights: assets are of and by the applicant',
  'Plain language summary reads as the creator intends',
]
const CHANNELS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Meta ads', 'TikTok ads', 'Brand website', 'In app']
const STEPS = [
  { k: 'rules', t: 'Set the rules', who: 'Creator' },
  { k: 'review', t: 'Review the pack', who: 'Castkey' },
  { k: 'license', t: 'License within scope', who: 'Brand' },
  { k: 'report', t: 'Report use', who: 'Brand → Creator' },
] as const

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-[40px] rounded-full border px-4 text-sm transition-colors ${
        on ? 'border-coral bg-coral/15 text-paper' : 'border-line text-sub hover:border-paper/40'
      }`}
    >
      <span aria-hidden="true" className="mr-2 inline-block w-3">{on ? '✕' : '+'}</span>
      {label}
    </button>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs text-mute">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

export function Demo() {
  const [step, setStep] = useState(0)
  const [assets, setAssets] = useState<Assets>('Likeness and voice')
  const [rules, setRules] = useState<Set<string>>(new Set(['Alcohol', 'Politics', 'Medical or health claims', 'Third-party logos']))
  const [reviewed, setReviewed] = useState(0) // items checked so far
  const [running, setRunning] = useState(false)
  const [scope, setScope] = useState<Scope>('Organic and paid')
  const [signed, setSigned] = useState(false)
  const [rows, setRows] = useState<Row[]>([
    { id: 1, channel: 'Instagram Reels', kind: 'Organic', spend: 0 },
    { id: 2, channel: 'Meta ads', kind: 'Paid', spend: 4200 },
  ])
  const [draft, setDraft] = useState({ channel: 'TikTok ads', kind: 'Paid' as 'Paid' | 'Organic', spend: '' })
  const [share, setShare] = useState('')
  const [announce, setAnnounce] = useState('')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const timer = useRef<number | undefined>(undefined)

  const ruleList = [...rules]
  const coherent = ruleList.length > 0
  const passed = reviewed >= FORMULA.length && coherent
  const failedAt = !coherent ? 3 : -1

  // Any rule change creates a new pack version that must be reviewed again.
  useEffect(() => {
    setReviewed(0)
    setSigned(false)
  }, [rules, assets])
  useEffect(() => () => window.clearInterval(timer.current), [])

  const summary = useMemo(() => {
    const what = assets === 'Likeness and voice' ? 'my likeness and voice' : assets === 'Likeness' ? 'my likeness' : 'my voice'
    const sentence = (arr: string[]) => arr.map((x) => x.toLowerCase()).join(', ')
    const t = RULES.topics.filter((x) => rules.has(x))
    const c = RULES.claims.filter((x) => rules.has(x))
    const w = RULES.wardrobe.filter((x) => rules.has(x))
    const parts: string[] = []
    if (t.length) parts.push(`touch on ${sentence(t)}`)
    if (c.length) parts.push(`make ${sentence(c)}`)
    if (w.length) parts.push(`show me wearing ${sentence(w)}`)
    return { what, parts }
  }, [assets, rules])

  const toggleRule = (r: string) =>
    setRules((s) => {
      const n = new Set(s)
      if (n.has(r)) n.delete(r)
      else n.add(r)
      return n
    })

  const runReview = () => {
    window.clearInterval(timer.current)
    setRunning(true)
    setReviewed(0)
    setAnnounce('Review started')
    const stop = coherent ? FORMULA.length : failedAt
    if (reduced()) {
      setReviewed(stop)
      setRunning(false)
      setAnnounce(coherent ? 'Sample pack approved' : 'Returned: guidelines need at least one rule')
      return
    }
    let i = 0
    timer.current = window.setInterval(() => {
      i += 1
      setReviewed(i)
      if (i >= stop) {
        window.clearInterval(timer.current)
        setRunning(false)
        setAnnounce(coherent ? 'Sample pack approved' : 'Returned: guidelines need at least one rule')
      }
    }, 320)
  }

  const go = (i: number, focus = false) => {
    setStep(i)
    if (focus) tabs.current[i]?.focus()
  }
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const n = STEPS.length
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go((i + 1) % n, true) }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go((i - 1 + n) % n, true) }
    if (e.key === 'Home') { e.preventDefault(); go(0, true) }
    if (e.key === 'End') { e.preventDefault(); go(n - 1, true) }
  }

  const paid = scope !== 'Organic content'
  const paidSpend = rows.filter((r) => r.kind === 'Paid').reduce((a, r) => a + r.spend, 0)
  const pct = Number(share)
  const validPct = share !== '' && pct > 0 && pct <= 100
  const invoice = validPct ? (paidSpend * pct) / 100 : 0

  const addRow = (e: React.FormEvent) => {
    e.preventDefault()
    const spend = draft.kind === 'Paid' ? Math.max(0, Math.round(Number(draft.spend) || 0)) : 0
    setRows((r) => [...r, { id: Date.now(), channel: draft.channel, kind: draft.kind, spend }])
    setDraft((d) => ({ ...d, spend: '' }))
    setAnnounce(`Report line added: ${draft.channel}`)
  }

  return (
    <div id="demo" className="mt-16 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl sm:text-4xl">Try the workflow</h3>
          <p className="mt-2 max-w-[60ch] text-base text-sub">Set rules as a creator, run the review, license as a brand, then file a usage report. A demo with sample data: nothing is saved, sent or licensed.</p>
        </div>
        <span className="tag-ill">Interactive demo · illustrative</span>
      </div>

      <div className="mt-8 overflow-hidden rounded-card border border-line bg-ink-900 shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)]">
        {/* window bar */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 text-xs text-mute">
            <Mark className="h-4 w-4 text-paper/80" />
            <span>Castkey · demo workspace</span>
          </div>
          <span className="hidden text-xs text-mute sm:block">Sample data only</span>
        </div>

        <div className="grid lg:grid-cols-[250px_minmax(0,1fr)]">
          <div role="tablist" aria-label="Demo steps" className="grid grid-cols-2 gap-1 border-b border-line p-2 lg:flex lg:flex-col lg:border-b-0 lg:border-r lg:p-3">
            {STEPS.map((s, i) => (
              <button
                key={s.k}
                ref={(el) => { tabs.current[i] = el }}
                role="tab"
                id={`tab-${s.k}`}
                aria-selected={step === i}
                aria-controls={`panel-${s.k}`}
                tabIndex={step === i ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`flex min-h-[52px] shrink-0 items-center gap-3 rounded-xl px-3 text-left transition-colors ${
                  step === i ? 'bg-ink-800 text-paper' : 'text-sub hover:bg-ink-850'
                }`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs ${step === i ? 'border-coral text-coral' : 'border-line'}`}>{i + 1}</span>
                <span>
                  <span className="block text-sm font-medium leading-tight sm:text-sm">{s.t}</span>
                  <span className="block text-xs text-mute">{s.who}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="min-h-[520px] p-6 sm:p-8">
            {/* 1. RULES */}
            <div role="tabpanel" id="panel-rules" aria-labelledby="tab-rules" hidden={step !== 0} tabIndex={0}>
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                <div className="grid gap-6">
                  <Group title="What you license">
                    {(['Likeness', 'Voice', 'Likeness and voice'] as Assets[]).map((a) => (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={assets === a}
                        onClick={() => setAssets(a)}
                        className={`min-h-[40px] rounded-full border px-4 text-sm ${assets === a ? 'border-paper bg-paper text-ink-950' : 'border-line text-sub hover:border-paper/40'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </Group>
                  <Group title="Off-limits topics">{RULES.topics.map((r) => <Toggle key={r} label={r} on={rules.has(r)} onClick={() => toggleRule(r)} />)}</Group>
                  <Group title="No claims of this kind">{RULES.claims.map((r) => <Toggle key={r} label={r} on={rules.has(r)} onClick={() => toggleRule(r)} />)}</Group>
                  <Group title="Wardrobe: never show me in">{RULES.wardrobe.map((r) => <Toggle key={r} label={r} on={rules.has(r)} onClick={() => toggleRule(r)} />)}</Group>
                  <p className="flex items-center gap-2 text-sm text-mute">
                    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                    Nudity and sexually explicit content are always prohibited. A platform rule, not a setting.
                  </p>
                </div>
                <div className="rounded-card border border-line bg-ink-950 p-6">
                  <p className="text-xs text-ice">Plain language preview</p>
                  <p className="mt-3 font-display text-xl leading-[1.3]">
                    Brands may use {summary.what} for uses inside the license I agree to.
                    {summary.parts.length > 0 ? <> They may not {summary.parts.join('; ')}.</> : <span className="text-coral-hi"> No restrictions set yet.</span>}
                  </p>
                  <p className="mt-4 text-xs text-mute">Creators confirm this summary before review. Changing a rule creates a new pack version.</p>
                  <button type="button" className="btn-primary mt-6 w-full" onClick={() => go(1)}>
                    Send to review
                  </button>
                </div>
              </div>
            </div>

            {/* 2. REVIEW */}
            <div role="tabpanel" id="panel-review" aria-labelledby="tab-review" hidden={step !== 1} tabIndex={0}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-mute">Training pack · version 1 · sample</p>
                  <p className="mt-1 text-base">{assets} · {ruleList.length} rule{ruleList.length === 1 ? '' : 's'}</p>
                </div>
                <button type="button" className="btn-primary" onClick={runReview} disabled={running}>
                  {running ? 'Reviewing…' : reviewed ? 'Run review again' : 'Run review (simulated)'}
                </button>
              </div>
              <ol className="mt-6 grid gap-2">
                {FORMULA.map((f, i) => {
                  const done = i < reviewed
                  const fail = done && i === failedAt
                  const pending = !done && running && i === reviewed
                  return (
                    <li key={f} className={`flex min-h-[48px] items-center gap-3 rounded-xl border px-4 text-sm ${fail ? 'border-coral/60 bg-coral/10' : 'border-line bg-ink-950'}`}>
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${done ? (fail ? 'bg-coral text-ink-950' : 'bg-ice text-ink-950') : 'border border-line text-mute'}`} aria-hidden="true">
                        {done ? (fail ? '!' : '✓') : i + 1}
                      </span>
                      <span className={done ? 'text-paper' : 'text-sub'}>{f}</span>
                      <span className="ml-auto text-xs text-mute">{fail ? 'Returned' : done ? 'Pass' : pending ? 'Checking' : ''}</span>
                    </li>
                  )
                })}
              </ol>
              {passed && (
                <div className="rise mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ice/40 bg-ice/10 p-4">
                  <p className="text-sm">Sample pack approved. Only this exact version can be licensed.</p>
                  <button type="button" className="btn-ghost min-h-[42px]" onClick={() => go(2)}>Continue to license</button>
                </div>
              )}
              {reviewed > failedAt && failedAt >= 0 && !running && (
                <p className="rise mt-6 rounded-xl border border-coral/50 bg-coral/10 p-4 text-sm">Returned to the creator: add at least one rule so the guidelines can be enforced. <button type="button" className="underline underline-offset-4" onClick={() => go(0)}>Edit rules</button></p>
              )}
              <p className="mt-6 text-xs text-mute">At launch, a Castkey reviewer signs off on each item by hand. The checks above are simulated.</p>
            </div>

            {/* 3. LICENSE */}
            <div role="tabpanel" id="panel-license" aria-labelledby="tab-license" hidden={step !== 2} tabIndex={0}>
              <div className="grid gap-8 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
                <div className="grid content-start gap-6">
                  <p className="text-sm text-sub">You are signed in as <span className="text-paper">Example DTC brand</span>, a vetted buyer (sample).</p>
                  <fieldset>
                    <legend className="mb-3 text-xs text-mute">Scope of use</legend>
                    <div className="grid gap-2">
                      {(['Organic content', 'Paid ads', 'Organic and paid'] as Scope[]).map((s) => (
                        <label key={s} className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm ${scope === s ? 'border-paper bg-ink-800' : 'border-line'}`}>
                          <input type="radio" name="scope" className="h-4 w-4 accent-[#E8774F]" checked={scope === s} onChange={() => { setScope(s); setSigned(false) }} />
                          {s}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {!passed && <p className="rounded-xl border border-line p-4 text-sm text-sub">This pack hasn’t passed review yet. <button type="button" className="text-paper underline underline-offset-4" onClick={() => go(1)}>Run the review</button> to license it.</p>}
                  <button type="button" className="btn-primary" disabled={!passed || signed} onClick={() => { setSigned(true); setAnnounce('Usage request sent and accepted by the creator (simulated)') }}>
                    {signed ? 'Accepted by creator (sample)' : 'Send usage request'}
                  </button>
                </div>

                <article aria-label="Sample license record" className="rounded-card border border-line bg-ink-950 p-6 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-xl">License record</p>
                    <span className={signed ? 'tag-ill' : 'chip'}>{signed ? 'Accepted · sample, not a real license' : 'Request draft · sample'}</span>
                  </div>
                  <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
                    {[
                      ['Creator', 'Example creator (sample)'],
                      ['Buyer', 'Example DTC brand (sample)'],
                      ['Licensed assets', assets],
                      ['Pack version', passed ? 'v1 · reviewed' : 'v1 · awaiting review'],
                      ['Scope', scope],
                      ['Term', 'Monthly, renewing'],
                      ['Monthly fee', 'Set by the creator'],
                      ['Ad-spend share', paid ? 'Agreed for this license' : 'Not applicable: organic only'],
                      ['Usage reporting', 'Monthly, by the buyer · creator audit rights'],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 py-3">
                        <dt className="text-mute">{k}</dt>
                        <dd className="text-sub">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4">
                    <p className="text-xs text-mute">Rules attached verbatim</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {ruleList.length ? ruleList.map((r) => <li key={r} className="rounded-full border border-line px-3 py-1 text-xs text-sub">No {r.toLowerCase()}</li>) : <li className="text-xs text-coral-hi">No rules set</li>}
                      <li className="rounded-full border border-line px-3 py-1 text-xs text-sub">No nudity or explicit content</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs text-mute">How payments split</p>
                    <div className="mt-2 flex h-9 overflow-hidden rounded-lg text-xs font-medium">
                      <div className="flex w-[80%] items-center bg-ice px-3 text-ink-950">Creator 80%</div>
                      <div className="flex w-[20%] items-center justify-center bg-coral text-ink-950">20%</div>
                    </div>
                    <p className="mt-2 text-xs text-mute">Castkey’s 20% platform commission applies to license fees and any ad spend share.</p>
                  </div>
                  {signed && (
                    <div className="rise mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line p-4">
                      <p className="text-sm text-sub">In the product, the reviewed pack would be delivered here as a ZIP for the active license. Nothing downloads in this demo.</p>
                      <button type="button" className="btn-ghost min-h-[42px]" onClick={() => go(3)}>File a usage report</button>
                    </div>
                  )}
                </article>
              </div>
            </div>

            {/* 4. REPORT */}
            <div role="tabpanel" id="panel-report" aria-labelledby="tab-report" hidden={step !== 3} tabIndex={0}>
              <form onSubmit={addRow} className="grid gap-3 rounded-card border border-line bg-ink-950 p-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <label htmlFor="d-ch" className="mb-2 block text-xs text-mute">Channel</label>
                  <select id="d-ch" className="field py-3" value={draft.channel} onChange={(e) => setDraft({ ...draft, channel: e.target.value })}>
                    {CHANNELS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="d-kind" className="mb-2 block text-xs text-mute">Placement</label>
                  <select id="d-kind" className="field py-3" value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as 'Paid' | 'Organic' })}>
                    <option>Paid</option>
                    <option>Organic</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="d-sp" className="mb-2 block text-xs text-mute">Ad spend (USD)</label>
                  <input id="d-sp" className="field py-3" inputMode="numeric" placeholder={draft.kind === 'Paid' ? '0' : 'n/a'} disabled={draft.kind === 'Organic'} value={draft.spend} onChange={(e) => setDraft({ ...draft, spend: e.target.value.replace(/[^\d]/g, '') })} />
                </div>
                <button type="submit" className="btn-primary min-h-[48px]">Add line</button>
              </form>

              <div className="mt-6 overflow-x-auto rounded-card border border-line">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <caption className="sr-only">Sample usage report, reported by the buyer</caption>
                  <thead className="text-xs text-mute">
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 font-normal">Channel</th>
                      <th className="px-4 py-3 font-normal">Placement</th>
                      <th className="px-4 py-3 text-right font-normal">Reported spend</th>
                      <th className="px-4 py-3 font-normal">Source</th>
                      <th className="px-4 py-3"><span className="sr-only">Remove</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-line last:border-0">
                        <td className="px-4 py-3">{r.channel}</td>
                        <td className="px-4 py-3 text-sub">{r.kind}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{r.kind === 'Paid' ? money(r.spend) : '—'}</td>
                        <td className="px-4 py-3"><span className="tag-ill whitespace-nowrap">Buyer reported</span></td>
                        <td className="px-2 py-1 text-right">
                          <button type="button" className="h-10 w-10 rounded-full text-mute hover:bg-ink-800 hover:text-paper" aria-label={`Remove ${r.channel} line`} onClick={() => setRows((x) => x.filter((y) => y.id !== r.id))}>✕</button>
                        </td>
                      </tr>
                    ))}
                    {!rows.length && <tr><td colSpan={5} className="px-4 py-6 text-center text-mute">No lines yet. Add a placement above.</td></tr>}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-card border border-line p-6">
                  <p className="text-xs text-mute">Reported paid spend this month</p>
                  <p className="mt-1 font-display text-4xl leading-none tabular-nums">{money(paidSpend)}</p>
                  <label htmlFor="d-share" className="mt-6 block text-xs text-mute">Try an agreed ad spend share (%)</label>
                  <input id="d-share" className="field mt-2 max-w-[160px] py-3" inputMode="decimal" placeholder="e.g. a number you choose" value={share} onChange={(e) => setShare(e.target.value.replace(/[^\d.]/g, ''))} />
                  {validPct && (
                    <dl className="mt-4 grid gap-2 text-sm">
                      <div className="flex justify-between"><dt className="text-sub">Ad-share invoice</dt><dd className="tabular-nums">{money(invoice)}</dd></div>
                      <div className="flex justify-between"><dt className="text-sub">Creator (80%)</dt><dd className="tabular-nums">{money(invoice * 0.8)}</dd></div>
                      <div className="flex justify-between"><dt className="text-sub">Castkey (20%)</dt><dd className="tabular-nums">{money(invoice * 0.2)}</dd></div>
                    </dl>
                  )}
                  <p className="mt-3 text-xs text-mute">Arithmetic on numbers you enter. Not Castkey pricing: the share is agreed per license.</p>
                </div>
                <div className="rounded-card border border-line p-6">
                  <p className="text-xs text-ice">What the creator sees</p>
                  <p className="mt-2 text-sm text-sub">Every report on their licenses, line by line, with audit rights in the agreement to ask for supporting evidence.</p>
                  <p className="mt-4 text-sm text-sub">At launch, placements and spend are reported by the buyer. Castkey does not detect placements or read ad accounts automatically; integrations are planned, not live.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>
    </div>
  )
}
