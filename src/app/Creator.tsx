import { useState } from 'react'
import { supabase, friendly, type Creator } from './supabase'
import { readRef } from '../lib/referral'
import { pricing } from '../content'

const FOLLOWERS = ['Under 10K', '10K–50K', '50K–250K', '250K–1M', 'Over 1M']
const NEVER = ['Alcohol', 'Politics', 'Gambling', 'Profanity', 'Swimwear', 'Medical claims', 'Competitor comparisons', 'Fake reviews']
const ALLOWED = ['Fashion', 'Beauty', 'Fitness', 'Product demos', 'App and tech', 'Paid social ads', 'Explainer videos', 'Food and drink', 'Travel']

function Chips({ options, value, onChange, label }: { options: string[]; value: string[]; onChange: (v: string[]) => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => {
        const on = value.includes(o)
        return (
          <button key={o} type="button" aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
            className={`press min-h-10 rounded-full border px-4 text-sm transition-colors duration-300 ${on ? 'border-paper bg-paper text-ink-950' : 'border-line text-sub hover:border-paper/40'}`}>{o}</button>
        )
      })}
    </div>
  )
}

function Section({ n, title, sub, children }: { n: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-6 first:border-0 first:pt-0">
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-coral text-sm font-semibold text-ink-950" aria-hidden="true">{n}</span>
        <div>
          <h2 className="font-sans text-lg font-semibold tracking-normal">{title}</h2>
          {sub && <p className="text-sm text-sub">{sub}</p>}
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:pl-10">{children}</div>
    </section>
  )
}

export function CreatorSetup({ uid, email, onDone }: { uid: string; email: string; onDone: () => Promise<void> }) {
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [social, setSocial] = useState('')
  const [followers, setFollowers] = useState('')
  const [licenses, setLicenses] = useState<string[]>(['face'])
  const [minimum, setMinimum] = useState(300)
  const [flexible, setFlexible] = useState(true)
  const [allowed, setAllowed] = useState<string[]>([])
  const [never, setNever] = useState<string[]>([])
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [audience, setAudience] = useState(18)
  const [adult, setAdult] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const h = handle.trim().toLowerCase().replace(/^@/, '')
    const lo = ageMin ? Number(ageMin) : null, hi = ageMax ? Number(ageMax) : null
    if (name.trim().length < 2) return setErr('Add the name brands will see.')
    if (h && !/^[a-z0-9._]{2,30}$/.test(h)) return setErr('Handles use letters, numbers, dots or underscores.')
    if (!licenses.length) return setErr('Choose face, voice or both.')
    if (!(minimum >= pricing.minLicense)) return setErr(`Your minimum has to be at least $${pricing.minLicense} a month.`)
    if ((lo !== null && lo < 18) || (hi !== null && hi < 18)) return setErr('Nobody can be shown as under 18.')
    if (lo !== null && hi !== null && hi < lo) return setErr('The oldest age has to be at least the youngest.')
    if (!adult) return setErr('Confirm you’re 18 or older to continue.')
    setBusy(true)
    const ref = readRef()
    const { error } = await supabase.from('creators').insert({
      id: uid, display_name: name.trim(), handle: h || null, social_url: social.trim() || null,
      followers_range: followers || null, licenses, inbound_minimum: Math.round(minimum), flexible_open_calls: flexible,
      confirmed_adult: true, referred_by_code: ref || null,
    })
    if (error) { setBusy(false); return setErr(friendly(error)) }
    const r = await supabase.from('creator_rules').insert({ creator_id: uid, allowed, never, shown_age_min: lo, shown_age_max: hi, audience_min_age: audience })
    if (r.error) { setBusy(false); return setErr(friendly(r.error)) }
    await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', uid)
    await onDone()
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <p className="kicker"><b>03</b>Your profile</p>
      <h1 className="display-2 mt-4">Set up what brands see.</h1>
      <p className="mt-3 text-sub">About three minutes. You can change all of it later. Signed in as {email}.</p>

      <form onSubmit={save} className="lit mt-8 grid gap-8 rounded-3xl p-6 sm:p-8" noValidate>
        <Section n={1} title="About you">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="c-name" className="field-label">Name brands will see</label><input id="c-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>
            <div><label htmlFor="c-handle" className="field-label">Handle <span className="text-mute">(optional)</span></label><input id="c-handle" className="field" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="yourname" /></div>
          </div>
          <div><label htmlFor="c-social" className="field-label">Link to your main account</label><input id="c-social" className="field" value={social} onChange={(e) => setSocial(e.target.value)} placeholder="instagram.com/yourname" inputMode="url" /></div>
          <div><p className="field-label">Followers</p><Chips label="Followers" options={FOLLOWERS} value={followers ? [followers] : []} onChange={(v) => setFollowers(v.filter((x) => x !== followers)[0] ?? '')} /></div>
        </Section>

        <Section n={2} title="What brands can license and your price" sub="Brands that reach out must offer at least your minimum. On open calls you can choose to go lower.">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Licenses">
            {[['face', 'Face'], ['voice', 'Voice']].map(([k, l]) => {
              const on = licenses.includes(k)
              return <button key={k} type="button" aria-pressed={on} onClick={() => setLicenses(on ? licenses.filter((x) => x !== k) : [...licenses, k])} className={`press min-h-10 rounded-full border px-5 text-sm font-medium ${on ? 'border-coral bg-coral text-ink-950' : 'border-line text-sub hover:border-paper/40'}`}>{l}</button>
            })}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="c-min" className="field-label">Monthly minimum, USD</label>
              <input id="c-min" type="number" min={pricing.minLicense} step={50} className="field" value={minimum} onChange={(e) => setMinimum(Number(e.target.value))} />
              <p className="mt-1 text-xs text-mute">At least ${pricing.minLicense}. You keep {pricing.keep}%.</p>
            </div>
            <label className="flex items-center justify-between gap-3 self-end rounded-xl border border-line px-4 py-3">
              <span className="text-sm">Flexible on open calls</span>
              <input type="checkbox" className="h-5 w-5 accent-[#E8774F]" checked={flexible} onChange={(e) => setFlexible(e.target.checked)} />
            </label>
          </div>
        </Section>

        <Section n={3} title="Your rules" sub="Brands see these on every request. Adult content is never allowed.">
          <div><p className="field-label">Happy to do</p><Chips label="Allowed uses" options={ALLOWED} value={allowed} onChange={setAllowed} /></div>
          <div><p className="field-label">Never</p><Chips label="Never allowed" options={NEVER} value={never} onChange={setNever} /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label htmlFor="c-amin" className="field-label">Shown as age, from</label><input id="c-amin" type="number" min={18} className="field" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder="18+" /></div>
            <div><label htmlFor="c-amax" className="field-label">to</label><input id="c-amax" type="number" min={18} className="field" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder="Any" /></div>
            <div>
              <label htmlFor="c-aud" className="field-label">Ads aimed at</label>
              <select id="c-aud" className="field" value={audience} onChange={(e) => setAudience(Number(e.target.value))}>
                <option value={18}>18 and over</option><option value={21}>21 and over</option><option value={25}>25 and over</option>
              </select>
            </div>
          </div>
        </Section>

        <section className="border-t border-line pt-6">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[#E8774F]" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
            <span className="text-sm text-sub">I’m 18 or older, this is my own face and voice, and I’ll confirm my identity before my profile goes live.</span>
          </label>
          {err && <p className="field-err" role="alert">{err}</p>}
          <button type="submit" className="btn-primary press mt-6" disabled={busy}>{busy ? 'Saving…' : 'Save my profile'}</button>
        </section>
      </form>
    </div>
  )
}

const STATUS: Record<Creator['status'], { k: string; v: string; tone: string }> = {
  pending: { k: 'In review', v: 'We review every profile before brands can see it.', tone: 'border-ice/40 bg-ice/10 text-ice' },
  approved: { k: 'Live', v: 'Approved brands can find and request you.', tone: 'border-coral/50 bg-coral/10 text-coral' },
  declined: { k: 'Not approved', v: 'Message us and we’ll explain what to change.', tone: 'border-line text-sub' },
}

export function CreatorHome({ creator }: { creator: Creator; reload: () => Promise<void> }) {
  const s = STATUS[creator.status]
  const steps = [
    { k: 'Profile and rules', done: true, v: 'Saved. Edit any time.' },
    { k: 'Training pack', done: false, v: 'Photos, talking videos and voice notes. Opens Nov 27.' },
    { k: 'Identity check', done: false, v: 'A quick ID and selfie check. Opens Nov 27.' },
    { k: 'Go live', done: creator.status === 'approved', v: 'Brands can find you and send requests.' },
  ]
  return (
    <div className="mx-auto max-w-[760px]">
      <p className="kicker"><b>03</b>Dashboard</p>
      <h1 className="display-2 mt-4">Hi, {creator.display_name.split(' ')[0]}.</h1>
      <p className={`mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${s.tone}`}><span className="live-dot h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{s.k}</p>
      <p className="mt-2 text-sub">{s.v}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[['Monthly minimum', `$${creator.inbound_minimum.toLocaleString('en-US')}`], ['Licenses', creator.licenses.map((l) => l[0].toUpperCase() + l.slice(1)).join(' + ')], ['Open calls', creator.flexible_open_calls ? 'Flexible' : 'Minimum applies']].map(([k, v]) => (
          <div key={k} className="lit rounded-2xl p-4"><p className="text-xs text-mute">{k}</p><p className="mt-1 font-display text-3xl tracking-[-0.02em]">{v}</p></div>
        ))}
      </div>

      <ol className="lit mt-4 rounded-3xl p-6">
        {steps.map((st, i) => (
          <li key={st.k} className="flex gap-4 border-t border-line py-4 first:border-0 first:pt-0 last:pb-0">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${st.done ? 'bg-coral text-ink-950' : 'border border-line text-mute'}`} aria-hidden="true">{st.done ? '✓' : i + 1}</span>
            <div><p className="font-medium">{st.k}{st.done && <span className="sr-only"> (done)</span>}</p><p className="text-sm text-sub">{st.v}</p></div>
          </li>
        ))}
      </ol>
    </div>
  )
}
