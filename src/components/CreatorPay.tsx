import { useId, useState } from 'react'
import { creatorPay, creators } from '../content'
import { useApply } from '../apply'

const COMMISSION = 0.2 // Castkey platform commission, fixed by product decision.
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo))

function NumberField({ label, value, onChange, prefix, suffix, hint, max }: {
  label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; hint?: string; max?: number
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label>
      <div className="flex items-center rounded-xl border border-line bg-ink-800 focus-within:border-ice">
        {prefix && <span className="pl-4 text-mute" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          inputMode="decimal"
          className="w-full bg-transparent px-3 py-3 text-base tabular-nums text-paper outline-none"
          value={value}
          aria-describedby={hint ? `${id}-h` : undefined}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, '')
            onChange(max !== undefined && Number(v) > max ? String(max) : v)
          }}
        />
        {suffix && <span className="pr-4 text-mute" aria-hidden="true">{suffix}</span>}
      </div>
      {hint && <p id={`${id}-h`} className="mt-2 text-xs text-mute">{hint}</p>}
    </div>
  )
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const id = useId()
  return (
    <div>
      <p id={id} className="mb-2 text-sm font-medium">{label}</p>
      <div role="group" aria-labelledby={id} className="flex items-center gap-2">
        <button type="button" className="grid h-12 w-12 place-items-center rounded-xl border border-line text-xl hover:border-paper/40 disabled:opacity-40" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Fewer: ${label}`}>−</button>
        <output className="grid h-12 min-w-[64px] place-items-center rounded-xl bg-ink-800 text-lg tabular-nums" aria-live="polite">{value}</output>
        <button type="button" className="grid h-12 w-12 place-items-center rounded-xl border border-line text-xl hover:border-paper/40 disabled:opacity-40" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`More: ${label}`}>+</button>
      </div>
    </div>
  )
}

function Calculator() {
  const [price, setPrice] = useState('750')
  const [brands, setBrands] = useState(2)
  const [paid, setPaid] = useState(false)
  const [adBrands, setAdBrands] = useState(1)
  const [spend, setSpend] = useState('5000')
  const [share, setShare] = useState('5')
  const [excl, setExcl] = useState<'Open' | 'Category' | 'Full'>('Open')
  const [premium, setPremium] = useState('')

  const p = clamp(Number(price), 0, 1_000_000)
  const nBrands = excl === 'Full' ? 1 : brands
  const ab = Math.min(adBrands, nBrands)
  const pr = clamp(Number(premium), 0, 1000)
  const sp = clamp(Number(spend), 0, 10_000_000)
  const sh = clamp(Number(share), 0, 100)

  const lines: { k: string; v: number }[] = Array.from({ length: nBrands }, (_, i) => ({ k: `Example brand ${String.fromCharCode(65 + i)} · monthly license`, v: p }))
  if (excl !== 'Open' && pr > 0) lines.push({ k: `Example brand A · ${excl === 'Full' ? 'full' : 'category'} exclusivity (+${pr}%)`, v: (p * pr) / 100 })
  if (paid && ab > 0) {
    for (let i = 0; i < ab; i++) lines.push({ k: `Example brand ${String.fromCharCode(65 + i)} · ad share (${sh}% of ${usd(sp)} reported)`, v: (sp * sh) / 100 })
  }
  const gross = lines.reduce((a, l) => a + l.v, 0)
  const fee = gross * COMMISSION
  const net = gross - fee

  return (
    <div className="grid overflow-hidden rounded-card border border-line lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="grid content-start gap-6 bg-ink-900 p-6 sm:p-8">
        <div>
          <h3 className="text-2xl">Try the math</h3>
          <p className="mt-1 text-sm text-sub">Use your own numbers. Nothing here is a quote or a promise.</p>
        </div>
        <NumberField label="Your monthly price per license" prefix="$" value={price} onChange={setPrice} hint="You set this. There is no Castkey price list." />
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Exclusivity for brand A</legend>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-ink-800 p-1">
            {(['Open', 'Category', 'Full'] as const).map((x) => (
              <button key={x} type="button" aria-pressed={excl === x} onClick={() => setExcl(x)} className={`press min-h-10 rounded-lg text-sm font-medium transition-colors duration-300 ${excl === x ? 'bg-paper text-ink-950' : 'text-sub hover:text-paper'}`}>{x}</button>
            ))}
          </div>
          {excl !== 'Open' && (
            <div className="rise mt-4">
              <NumberField label="Your exclusivity premium" suffix="%" value={premium} onChange={setPremium} max={1000} hint={excl === 'Full' ? 'On top of the monthly fee. Full exclusivity means one brand only.' : 'On top of the monthly fee. No competing brands in that category.'} />
            </div>
          )}
        </fieldset>
        {excl === 'Full' ? (
          <p className="text-sm text-sub">Brands licensing you: 1 (fully exclusive)</p>
        ) : (
          <Stepper label="Brands licensing you" value={brands} min={1} max={6} onChange={(n) => { setBrands(n); setAdBrands((a) => Math.min(a, n)) }} />
        )}
        <label className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border border-line px-4">
          <span className="text-sm">Include paid ads</span>
          <input type="checkbox" role="switch" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="h-5 w-5 accent-[#E8774F]" />
        </label>
        {paid && (
          <div className="rise grid gap-6 rounded-xl border border-line p-4">
            <Stepper label="Brands running you in paid ads" value={ab} min={1} max={nBrands} onChange={setAdBrands} />
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Monthly ad spend per brand" prefix="$" value={spend} onChange={setSpend} />
              <NumberField label="Agreed ad share" suffix="%" value={share} onChange={setShare} max={100} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col bg-ink-950 p-6 sm:p-8" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl">Example payout statement</p>
          <span className="tag-ill">Illustrative</span>
        </div>
        <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
          {lines.map((l, i) => (
            <li key={i} className="flex items-baseline justify-between gap-4 py-3">
              <span className="text-sub">{l.k}</span>
              <span className="shrink-0 tabular-nums">{usd(l.v)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-sub">Gross for the month</dt><dd className="tabular-nums">{usd(gross)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-sub">Castkey commission (20%)</dt><dd className="tabular-nums">−{usd(fee)}</dd></div>
        </dl>
        <div className="mt-6 flex h-3 overflow-hidden rounded-full" aria-hidden="true">
          <span className="bg-ice" style={{ width: '80%' }} />
          <span className="bg-coral" style={{ width: '20%' }} />
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-2 border-t border-line pt-6">
          <p className="text-sm text-sub">You receive this month</p>
          <p className="font-display text-5xl sm:text-6xl leading-none tabular-nums">{usd(net)}</p>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-mute">{creatorPay.calcNote}</p>
      </div>
    </div>
  )
}

export function CreatorPay() {
  const { open } = useApply()
  const c = creatorPay
  return (
    <section id="creator-pay" aria-labelledby="pay-h" className="band grain bg-ink-900">
      <div className="wrap" data-reveal>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <p className="eyebrow">Pay</p>
            <h2 id="pay-h" className="display-2 mt-3">{c.title}</h2>
          </div>
          <p className="font-display text-3xl font-light tracking-tight text-sub">{c.lede}</p>
        </div>

        <ol className="mt-10 grid gap-2 rounded-3xl border border-line bg-ink-950 p-2 md:grid-cols-3">
          {c.flow.map((f, i) => (
            <li key={f.k} className="rounded-2xl bg-ink-850 p-6">
              <div className="flex items-center gap-3">
                <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${i === 2 ? 'bg-coral text-ink-950' : 'border border-line text-paper'}`} aria-hidden="true">{i + 1}</span>
                {i === 1 && (
                  <span className="flex flex-wrap items-center gap-1" aria-hidden="true">
                    {['Accept', 'Adjust', 'Decline'].map((x) => (
                      <span key={x} className={`rounded-full px-2 py-0.5 text-xs font-medium ${x === 'Accept' ? 'bg-ice text-ink-950' : 'border border-line text-sub'}`}>{x}</span>
                    ))}
                    <span className="ml-1 inline-flex items-center gap-1 text-xs text-ice">
                      <svg viewBox="0 0 16 16" className="h-4 w-4"><rect x="2" y="3" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="6" cy="7.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M9.5 7h3M9.5 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                      Verified
                    </span>
                  </span>
                )}
              </div>
              <h3 className="mt-6 text-lg font-medium">{f.k}</h3>
              <p className="mt-2 text-sm text-sub">{f.v}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-sub">{c.adsNote}</p>

        <div className="mt-16">
          <h3 className="font-display text-4xl font-light tracking-tight">{c.exclusivity.title}</h3>
          <p className="mt-3 max-w-[60ch] text-base text-sub">{c.exclusivity.body}</p>
          <ul className="mt-8 grid gap-2 rounded-3xl border border-line bg-ink-950 p-2 md:grid-cols-3">
            {c.exclusivity.levels.map((l, i) => (
              <li key={l.k} className="rounded-2xl bg-ink-850 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((d) => <span key={d} className={`h-2 w-6 rounded-full ${d <= i ? 'bg-coral' : 'bg-ink-700'}`} />)}
                  </span>
                  <span className="text-xs text-mute">{l.tag}</span>
                </div>
                <p className="mt-6 text-lg font-medium">{l.k}</p>
                <p className="mt-2 text-sm text-sub">{l.v}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-mute">{c.exclusivity.note}</p>
        </div>

        <div className="mt-10">
          <Calculator />
        </div>
        <p className="mt-6 max-w-[70ch] text-sm text-sub"><span className="font-medium text-paper">{creators.fee}</span> {creators.feeNote}</p>
        <button type="button" className="btn-primary press mt-8" onClick={() => open('creator')}>Apply to list your likeness</button>

      </div>
    </section>
  )
}
