import { useEffect, useRef, useState } from 'react'
import { getSubmitter, legalLinks, type Audience, type BrandFields, type CreatorFields } from '../lib/submit'
import { Mark } from './Logo'

const submitter = getSubmitter()

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
function validUrl(v: string) {
  if (!v) return true
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
    return /\.[a-z]{2,}$/i.test(u.hostname)
  } catch {
    return false
  }
}

const emptyBrand: BrandFields = { name: '', email: '', company: '', website: '', brandType: '', intendedUse: '', adSpend: '', creatorSpend: '', paysUsage: '', aiTools: '' }
const SPEND = ['$0', 'Under $5K', '$5K–$25K', '$25K–$100K', '$100K–$500K', 'Over $500K']
const ROSTER = ['1–10', '11–50', '51–200', '200+']
const AI_TOOLS = ['Higgsfield', 'Arcads', 'HeyGen', 'Creatify', 'MakeUGC', 'Synthesia', 'Runway', 'Other', 'None yet']
const chip = (on: boolean) => `press min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${on ? 'border-coral bg-coral text-ink-950' : 'border-line text-sub hover:border-paper/40'}`
const emptyCreator: CreatorFields = { name: '', email: '', profileUrl: '', followers: '', licensing: '', neverAllowed: '', note: '', invitedBy: '', inviteCode: '' }
type Status = 'idle' | 'sending' | 'demo' | 'received' | 'error'

function Field(props: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: (a: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; 'aria-required'?: boolean }) => React.ReactNode
}) {
  const { id, label, required, error, hint } = props
  const desc = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}{' '}
        {required ? <span className="font-normal text-mute">(required)</span> : <span className="font-normal text-mute">(optional)</span>}
      </label>
      {props.children({ id, 'aria-invalid': !!error, 'aria-describedby': desc, 'aria-required': required || undefined })}
      {hint && <p id={`${id}-hint`} className="mt-2 text-xs text-mute">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-err">{error}</p>}
    </div>
  )
}

export function ApplicationDialog({ audience, onClose, onSwitch }: { audience: Audience | null; onClose: () => void; onSwitch: (a: Audience) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const [brand, setBrand] = useState(emptyBrand)
  const [creator, setCreator] = useState(emptyCreator)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [honey, setHoney] = useState('')
  const firstInput = useRef(0) // when the person first typed or tapped in the form

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (audience && !d.open) {
      returnTo.current = document.activeElement as HTMLElement
      d.showModal()
      firstInput.current = 0
      document.documentElement.style.overflow = 'hidden'
    } else if (!audience && d.open) {
      d.close()
    }
  }, [audience])

  useEffect(() => {
    // New audience: clear transient state but keep typed values for each form.
    setErrors({})
    setStatus('idle')
    setMessage('')
  }, [audience])

  const handleClose = () => {
    document.documentElement.style.overflow = ''
    onClose()
    // Restore focus to the control that opened the dialog.
    setTimeout(() => returnTo.current?.focus(), 0)
  }

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (audience === 'brand' || audience === 'partner') {
      if (!brand.name.trim()) e.name = 'Enter your name.'
      if (!brand.email.trim()) e.email = 'Enter your work email.'
      else if (!EMAIL.test(brand.email.trim())) e.email = 'Enter an email like name@company.com.'
      if (!brand.company.trim()) e.company = 'Enter your company name.'
      if (!validUrl(brand.website.trim())) e.website = 'Enter a web address like company.com.'
      if (audience === 'brand' && !brand.brandType) e.brandType = 'Choose the option closest to you.'
      if (audience === 'partner' && !brand.rosterSize) e.rosterSize = 'Choose a range.'
      if (audience === 'brand' && !brand.adSpend) e.adSpend = 'Choose a range. A rough guess is fine.'
      if (audience === 'brand' && !brand.creatorSpend) e.creatorSpend = 'Choose a range. A rough guess is fine.'
      if (!brand.intendedUse.trim()) e.intendedUse = audience === 'partner' ? 'Tell us briefly who you represent.' : 'Tell us briefly how you would use licensed likeness or voice.'
    } else {
      if (!creator.name.trim()) e.name = 'Enter your name.'
      if (!creator.email.trim()) e.email = 'Enter your email.'
      else if (!EMAIL.test(creator.email.trim())) e.email = 'Enter an email like name@example.com.'
      if (!validUrl(creator.profileUrl.trim())) e.profileUrl = 'Enter a link like instagram.com/yourname.'
      if (!creator.licensing) e.licensing = 'Choose what you would license.'
    }
    return e
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (status === 'sending') return // duplicate clicks
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0]
      formRef.current?.querySelector<HTMLElement>(`#${audience}-${first}`)?.focus()
      setMessage(`Please fix ${Object.keys(e).length} field${Object.keys(e).length > 1 ? 's' : ''}.`)
      return
    }
    // Spam check: a hidden field filled in means a bot; fail quietly.
    if (honey) { setStatus('demo'); return }
    // Filled and sent in under a second: likely a bot, but ask a person to press again rather than drop it.
    if (!firstInput.current || Date.now() - firstInput.current < 1000) {
      firstInput.current = Date.now() - 1000
      setMessage('Please check your answers, then press the button again.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setMessage(audience === 'brand' ? 'Sending your demo request…' : 'Submitting your application…')
    const trim = <T extends Record<string, string>>(o: T) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.trim()])) as T
    const result =
      audience === 'brand'
        ? await submitter.submit({ audience: 'brand', fields: trim(brand) })
        : audience === 'partner'
        ? await submitter.submit({ audience: 'partner', fields: trim({ ...brand, brandType: 'Partner' }) })
        : await submitter.submit({ audience: 'creator', fields: trim(creator) })
    if (result.kind === 'received') {
      setStatus('received')
      setMessage(audience === 'brand' ? 'Demo request received.' : 'Application received.')
    } else if (result.kind === 'demo') {
      setStatus('demo')
      setMessage(`Demo only: your ${audience === 'brand' ? 'request' : 'application'} was not sent.`)
    } else {
      setStatus('error')
      setMessage(result.message)
    }
    setTimeout(() => statusRef.current?.focus(), 0)
  }

  const isPartner = audience === 'partner'
  const isBrand = audience === 'brand' || isPartner
  const noun = isPartner ? 'partner application' : audience === 'brand' ? 'demo request' : 'application'
  const done = status === 'demo' || status === 'received'
  const prefix = audience ?? 'brand'

  return (
    <dialog
      ref={ref}
      aria-labelledby="apply-title"
      onClose={handleClose}
      onClick={(e) => { if (e.target === ref.current) ref.current?.close() }}
      className="sheet m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 sm:m-auto sm:h-auto sm:max-h-[92dvh] sm:w-[min(640px,92vw)]"
    >
      <div className="flex h-full flex-col overflow-hidden border border-line bg-ink-900 sm:rounded-card">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Mark className="h-8 w-8 shrink-0 text-paper" />
            <div>
              <h2 id="apply-title" className="font-display text-2xl leading-tight tracking-[-0.01em] sm:text-3xl">{isPartner ? 'Bring your roster to Castkey.' : isBrand ? 'Get access to the world’s best faces.' : 'Apply as a creator'}</h2>
              <p className="text-xs text-mute">{isPartner ? 'For agencies, managers and scouts. Upload your roster, keep your split, earn 5% on every creator you bring.' : isBrand ? 'Verified creators, licensed on clear terms. Request a demo for early access.' : 'Early access waitlist'}</p>
            </div>
          </div>
          <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line hover:bg-ink-800" aria-label="Close" onClick={() => ref.current?.close()}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {submitter.mode === 'demo' && !done && (
            <p className="mb-6 rounded-xl border border-ice/40 bg-ice/10 px-4 py-3 text-sm text-ice">
              Preview mode: this form checks your answers but does not send them anywhere yet.
            </p>
          )}

          {done ? (
            <div ref={statusRef} tabIndex={-1} className="rise py-6" role="status">
              {status === 'demo' ? (
                <>
                  <p className="text-xs font-medium text-ice">Not sent</p>
                  <p className="mt-2 font-display text-3xl leading-tight">Your {noun} was not sent.</p>
                  <p className="mt-3 text-sm text-sub">Nothing you typed has left this page.</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-coral">Received</p>
                  <p className="mt-2 font-display text-3xl leading-tight">Thanks. Your {noun} was received.</p>
                  <p className="mt-3 text-sm text-sub">{isPartner ? 'We’ll be in touch to plan your roster onboarding and set up your referral link.' : isBrand ? 'We’ll be in touch to schedule a demo.' : 'We review creator applications by hand and will be in touch as onboarding opens.'}</p>
                </>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="btn-ghost" onClick={() => ref.current?.close()}>Close</button>
                <button type="button" className="btn-ghost" onClick={() => setStatus('idle')}>Back to my answers</button>
              </div>
            </div>
          ) : (
            <form ref={formRef} noValidate onSubmit={submit} onInput={() => { if (!firstInput.current) firstInput.current = Date.now() }} onClick={() => { if (!firstInput.current) firstInput.current = Date.now() }} className="grid gap-6">
              <p className="text-sm text-sub">
                A creator?{' '}
                <button type="button" className="text-paper underline underline-offset-4" onClick={() => { ref.current?.close(); onSwitch('creator') }}>Apply to list your likeness instead</button>
              </p>

              {isBrand ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id={`${prefix}-name`} label="Contact name" required error={errors.name}>
                      {(a) => <input {...a} className="field" autoComplete="name" value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} />}
                    </Field>
                    <Field id={`${prefix}-email`} label="Work email" required error={errors.email}>
                      {(a) => <input {...a} type="email" className="field" autoComplete="email" value={brand.email} onChange={(e) => setBrand({ ...brand, email: e.target.value })} />}
                    </Field>
                    <Field id={`${prefix}-company`} label={isPartner ? 'Agency or company' : 'Company'} required error={errors.company}>
                      {(a) => <input {...a} className="field" autoComplete="organization" value={brand.company} onChange={(e) => setBrand({ ...brand, company: e.target.value })} />}
                    </Field>
                    <Field id={`${prefix}-website`} label="Website" error={errors.website}>
                      {(a) => <input {...a} className="field" inputMode="url" autoComplete="url" placeholder="company.com" value={brand.website} onChange={(e) => setBrand({ ...brand, website: e.target.value })} />}
                    </Field>
                  </div>
                  {!isPartner && (
                  <Field id={`${prefix}-brandType`} label="Brand type" required error={errors.brandType}>
                    {(a) => (
                      <select {...a} className="field" value={brand.brandType} onChange={(e) => setBrand({ ...brand, brandType: e.target.value })}>
                        <option value="">Choose one</option>
                        <option>Tech</option>
                        <option>Ecommerce / DTC</option>
                        <option>CPG</option>
                        <option>Agency</option>
                        <option>Other</option>
                      </select>
                    )}
                  </Field>
                  )}
                  {isPartner && (
                    <>
                      <fieldset aria-describedby={errors.rosterSize ? 'partner-rosterSize-err' : undefined}>
                        <legend className="field-label">How many creators do you represent? <span className="font-normal text-mute">(required)</span></legend>
                        <div id="partner-rosterSize" tabIndex={-1} className="flex flex-wrap gap-2" role="radiogroup">
                          {ROSTER.map((v) => <button key={v} type="button" role="radio" aria-checked={brand.rosterSize === v} className={chip(brand.rosterSize === v)} onClick={() => setBrand({ ...brand, rosterSize: v })}>{v}</button>)}
                        </div>
                        {errors.rosterSize && <p id="partner-rosterSize-err" className="field-err">{errors.rosterSize}</p>}
                      </fieldset>
                      <fieldset>
                        <legend className="field-label">Do you handle brand deals for them today?</legend>
                        <div className="flex flex-wrap gap-2" role="radiogroup">
                          {['Yes', 'Some of them', 'No'].map((v) => <button key={v} type="button" role="radio" aria-checked={brand.managesDeals === v} className={chip(brand.managesDeals === v)} onClick={() => setBrand({ ...brand, managesDeals: brand.managesDeals === v ? '' : v })}>{v}</button>)}
                        </div>
                      </fieldset>
                    </>
                  )}
                  {!isPartner && (
                    <>
                      <fieldset aria-describedby={errors.adSpend ? 'brand-adSpend-err' : undefined}>
                        <legend className="field-label">About how much do you spend on paid ads each month? <span className="font-normal text-mute">(required)</span></legend>
                        <div id="brand-adSpend" tabIndex={-1} className="flex flex-wrap gap-2" role="radiogroup">
                          {SPEND.map((v) => <button key={v} type="button" role="radio" aria-checked={brand.adSpend === v} className={chip(brand.adSpend === v)} onClick={() => setBrand({ ...brand, adSpend: v })}>{v}</button>)}
                        </div>
                        {errors.adSpend && <p id="brand-adSpend-err" className="field-err">{errors.adSpend}</p>}
                      </fieldset>
                      <fieldset aria-describedby={errors.creatorSpend ? 'brand-creatorSpend-err' : undefined}>
                        <legend className="field-label">And on UGC creators and influencers, including usage rights? <span className="font-normal text-mute">(required)</span></legend>
                        <div id="brand-creatorSpend" tabIndex={-1} className="flex flex-wrap gap-2" role="radiogroup">
                          {SPEND.map((v) => <button key={v} type="button" role="radio" aria-checked={brand.creatorSpend === v} className={chip(brand.creatorSpend === v)} onClick={() => setBrand({ ...brand, creatorSpend: v })}>{v}</button>)}
                        </div>
                        {errors.creatorSpend && <p id="brand-creatorSpend-err" className="field-err">{errors.creatorSpend}</p>}
                        <p className="mt-2 text-xs text-mute">Monthly, rough ranges are fine. We only report totals across all brands, never yours on its own.</p>
                      </fieldset>
                      <fieldset>
                        <legend className="field-label">Do you pay creators for usage rights or whitelisting today?</legend>
                        <div className="flex flex-wrap gap-2" role="radiogroup">
                          {['Yes', 'No', 'Not sure'].map((v) => <button key={v} type="button" role="radio" aria-checked={brand.paysUsage === v} className={chip(brand.paysUsage === v)} onClick={() => setBrand({ ...brand, paysUsage: brand.paysUsage === v ? '' : v })}>{v}</button>)}
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="field-label">Which AI tools do you use to make ads? <span className="font-normal text-mute">(tap all that apply)</span></legend>
                        <div className="flex flex-wrap gap-2">
                          {AI_TOOLS.map((v) => {
                            const list = brand.aiTools ? brand.aiTools.split(', ') : []
                            const on = list.includes(v)
                            const next = v === 'None yet' ? (on ? [] : ['None yet']) : on ? list.filter((x) => x !== v) : [...list.filter((x) => x !== 'None yet'), v]
                            return <button key={v} type="button" aria-pressed={on} className={chip(on)} onClick={() => setBrand({ ...brand, aiTools: next.join(', ') })}>{v}</button>
                          })}
                        </div>
                      </fieldset>
                    </>
                  )}
                  <Field id={`${prefix}-intendedUse`} label={isPartner ? 'Tell us about your roster' : 'What would you use it for?'} required error={errors.intendedUse} hint={isPartner ? 'Niches, platforms, and a link to your roster or site if you have one.' : 'A sentence or two is plenty, for example product explainers for our app. We’ll shape the demo around it.'}>
                    {(a) => <textarea {...a} rows={3} maxLength={600} className="field resize-y" value={brand.intendedUse} onChange={(e) => setBrand({ ...brand, intendedUse: e.target.value })} />}
                  </Field>
                </>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id={`${prefix}-name`} label="Name" required error={errors.name}>
                      {(a) => <input {...a} className="field" autoComplete="name" value={creator.name} onChange={(e) => setCreator({ ...creator, name: e.target.value })} />}
                    </Field>
                    <Field id={`${prefix}-email`} label="Email" required error={errors.email}>
                      {(a) => <input {...a} type="email" className="field" autoComplete="email" value={creator.email} onChange={(e) => setCreator({ ...creator, email: e.target.value })} />}
                    </Field>
                  </div>
                  <Field id={`${prefix}-profileUrl`} label="Public profile or portfolio link" error={errors.profileUrl}>
                    {(a) => <input {...a} className="field" inputMode="url" placeholder="instagram.com/yourname" value={creator.profileUrl} onChange={(e) => setCreator({ ...creator, profileUrl: e.target.value })} />}
                  </Field>
                  <fieldset aria-describedby={errors.licensing ? `${prefix}-licensing-err` : undefined}>
                    <legend className="field-label">Interested in licensing <span className="font-normal text-mute">(required)</span></legend>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {['Likeness', 'Voice', 'Both'].map((v, i) => (
                        <label key={v} className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm ${creator.licensing === v ? 'border-paper bg-ink-800' : 'border-line'}`}>
                          <input id={i === 0 ? `${prefix}-licensing` : undefined} type="radio" name="licensing" className="h-4 w-4 accent-[#E8774F]" checked={creator.licensing === v} onChange={() => setCreator({ ...creator, licensing: v })} />
                          {v}
                        </label>
                      ))}
                    </div>
                    {errors.licensing && <p id={`${prefix}-licensing-err`} className="field-err">{errors.licensing}</p>}
                  </fieldset>
                  <Field id={`${prefix}-note`} label="Interests or boundaries" hint="Anything you already know you would or wouldn’t do.">
                    {(a) => <textarea {...a} rows={3} maxLength={600} className="field resize-y" value={creator.note} onChange={(e) => setCreator({ ...creator, note: e.target.value })} />}
                  </Field>
                  <p className="rounded-xl border border-line px-4 py-3 text-xs text-mute">Don’t send ID, selfies, voice files or training material here. Verification happens later, in a separate secure onboarding step.</p>
                </>
              )}

              {/* Honeypot: hidden from people and assistive tech. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
              </div>

              <p className="text-xs text-mute">
                By sending this you agree to our{' '}
                <a className="underline underline-offset-4" href={legalLinks.privacy || '/privacy/'}>privacy notice</a>. We use your answers to review your {noun} and contact you, and we share only anonymous totals across all applicants with investors. We won’t add you to a marketing list.
              </p>

              <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className={status === 'error' ? 'rounded-xl border border-coral/60 bg-coral/10 px-4 py-3 text-sm' : 'sr-only'}>
                {message}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className="btn-primary min-w-[200px]" disabled={status === 'sending'} aria-disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" aria-hidden="true" />Submitting…</>
                  ) : status === 'error' ? 'Try again' : isPartner ? 'Send roster details' : isBrand ? 'Request a demo' : 'Join the waitlist'}
                </button>
                <button type="button" className="btn-ghost" onClick={() => ref.current?.close()}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  )
}
