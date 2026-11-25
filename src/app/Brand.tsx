import { useState } from 'react'
import { supabase, friendly, type Brand } from './supabase'

const SPEND = ['$0', 'Under $5K', '$5K–$25K', '$25K–$100K', '$100K–$500K', 'Over $500K']

export function BrandSetup({ uid, onDone }: { uid: string; onDone: () => Promise<void> }) {
  const [company, setCompany] = useState('')
  const [website, setWebsite] = useState('')
  const [spend, setSpend] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (company.trim().length < 2) return setErr('Add your company name.')
    setBusy(true)
    const { error } = await supabase.from('brands').insert({ id: uid, company: company.trim(), website: website.trim() || null, ad_spend: spend || null })
    if (error) { setBusy(false); return setErr(friendly(error)) }
    await onDone()
  }
  return (
    <div className="mx-auto max-w-[640px]">
      <p className="kicker"><b>03</b>Your company</p>
      <h1 className="display-2 mt-4">Tell us about your brand.</h1>
      <p className="mt-3 text-sub">We approve every brand before it can request creators or post open calls.</p>
      <form onSubmit={save} className="lit mt-8 grid gap-5 rounded-3xl p-6 sm:p-8" noValidate>
        <div><label htmlFor="b-co" className="field-label">Company</label><input id="b-co" className="field" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" /></div>
        <div><label htmlFor="b-web" className="field-label">Website</label><input id="b-web" className="field" value={website} onChange={(e) => setWebsite(e.target.value)} inputMode="url" placeholder="yourbrand.com" /></div>
        <div>
          <p className="field-label">Monthly paid ad spend</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Monthly paid ad spend">
            {SPEND.map((s) => <button key={s} type="button" aria-pressed={spend === s} onClick={() => setSpend(spend === s ? '' : s)} className={`press min-h-10 rounded-full border px-4 text-sm ${spend === s ? 'border-paper bg-paper text-ink-950' : 'border-line text-sub hover:border-paper/40'}`}>{s}</button>)}
          </div>
        </div>
        {err && <p className="field-err" role="alert">{err}</p>}
        <button type="submit" className="btn-primary press" disabled={busy}>{busy ? 'Saving…' : 'Submit for approval'}</button>
      </form>
    </div>
  )
}

export function BrandHome({ brand }: { brand: Brand }) {
  const live = brand.status === 'approved'
  return (
    <div className="mx-auto max-w-[760px]">
      <p className="kicker"><b>03</b>Dashboard</p>
      <h1 className="display-2 mt-4">{brand.company}</h1>
      <p className={`mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${live ? 'border-coral/50 bg-coral/10 text-coral' : 'border-ice/40 bg-ice/10 text-ice'}`}>
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{live ? 'Approved' : brand.status === 'declined' ? 'Not approved' : 'In review'}
      </p>
      <p className="mt-2 text-sub">{live ? 'Browsing creators and open calls opens Nov 28.' : 'We’ll email you when your brand is approved, usually within a day.'}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[['Browse verified creators', 'Search by look, voice, audience and price. Opens Nov 28.'], ['Post an open call', 'Share your budget and brief; creators apply. Opens Nov 29.']].map(([k, v]) => (
          <div key={k} className="lit rounded-2xl p-5"><p className="font-semibold">{k}</p><p className="mt-1 text-sm text-sub">{v}</p></div>
        ))}
      </div>
    </div>
  )
}
