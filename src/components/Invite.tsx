import { useEffect, useRef, useState } from 'react'
import { invite } from '../content'
import { getSubmitter, legalLinks, makeInviteCode, readInviteCode, type CreatorFields } from '../lib/submit'
import { CodeInput, CodeStatus, InviteActions, InviteSomeone, useCodeCheck } from './InviteSomeone'
import { normCode, refLink, saveMyCode, suggestCode } from '../lib/referral'
import { referral } from '../content'

// The creator application: one short page, three plain questions.
// Identity is verified later, when an approved creator sets up their profile.

const submitter = getSubmitter()
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const validUrl = (v: string) => {
  try {
    return /\.[a-z]{2,}$/i.test(new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`).hostname)
  } catch {
    return false
  }
}
const LICENSE = [
  { v: 'Face', d: 'Your look, in photos and video' },
  { v: 'Voice', d: 'Your voice only' },
  { v: 'Face and voice', d: 'Both, under one set of rules' },
]
type Status = 'idle' | 'sending' | 'demo' | 'received' | 'error'

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-8 first:border-t-0 first:pt-0">
      <legend className="flex w-full items-start gap-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral text-sm font-semibold text-ink-950" aria-hidden="true">{n}</span>
        <span>
          <span className="block text-xl font-semibold">{title}</span>
          {hint && <span className="mt-1 block text-sm text-sub">{hint}</span>}
        </span>
      </legend>
      <div className="mt-4 sm:pl-12">{children}</div>
    </fieldset>
  )
}

const chip = (on: boolean) =>
  `press min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${on ? 'border-coral bg-coral text-ink-950' : 'border-line text-sub hover:border-paper/40'}`

export function Invite() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState('')
  const [followers, setFollowers] = useState('')
  const [licensing, setLicensing] = useState('')
  const [never, setNever] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [honey, setHoney] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [invitedBy, setInvitedBy] = useState('')
  const [myCode, setMyCode] = useState('')
  const [want, setWant] = useState('')
  const [wantTouched, setWantTouched] = useState(false)
  const check = useCodeCheck(want)
  const firstInput = useRef(0) // when the person first typed or tapped in the form
  const doneRef = useRef<HTMLHeadingElement>(null)

  // Arriving through someone's invite link or the shared application page: remember who invited them.
  useEffect(() => {
    const code = readInviteCode()
    const invitePage = /\/(invited?|r\/[^/]+)\/?$/.test(location.pathname)
    if (!code && !invitePage) return
    if (code) setInvitedBy(code)
    setTimeout(() => document.getElementById('invite')?.scrollIntoView({ block: 'start' }), 600)
  }, [])

  // Suggest a referral link from their social handle or name until they type their own.
  useEffect(() => { if (!wantTouched) setWant(suggestCode(profile, name)) }, [profile, name, wantTouched])

  const done = status === 'demo' || status === 'received'
  useEffect(() => { if (done) doneRef.current?.focus() }, [done])

  const clear = (k: string) => setErrors(({ [k]: _x, ...rest }) => rest)
  const toggle = (x: string) => setNever((l) => (l.includes(x) ? l.filter((y) => y !== x) : [...l, x]))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const er: Record<string, string> = {}
    if (!name.trim()) er.name = 'Enter your name.'
    if (!email.trim()) er.email = 'Enter your email.'
    else if (!EMAIL.test(email.trim())) er.email = 'Enter an email like name@example.com.'
    if (!profile.trim()) er.profile = 'Add the link to your main account.'
    else if (!validUrl(profile.trim())) er.profile = 'Enter a link like instagram.com/yourname.'
    if (!licensing) er.licensing = 'Choose what brands could use.'
    if (want && check === 'taken') er.want = 'That link is taken. Try another, or clear it and we’ll make one for you.'
    setErrors(er)
    if (Object.keys(er).length) {
      const first = Object.keys(er)[0]
      document.getElementById(`ap-${first}`)?.focus()
      setMessage(`Please fix ${Object.keys(er).length} thing${Object.keys(er).length > 1 ? 's' : ''} above.`)
      return
    }
    if (honey) { setStatus('demo'); return }
    if (!firstInput.current || Date.now() - firstInput.current < 1000) {
      firstInput.current = Date.now() - 1000
      setMessage('Please check your answers, then press the button again.')
      return
    }
    const code = normCode(want)
    setStatus('sending')
    setMessage('Sending your application…')
    const fields: CreatorFields = {
      name: name.trim(),
      email: email.trim(),
      profileUrl: profile.trim(),
      followers,
      licensing,
      neverAllowed: never.join(', '),
      note: note.trim(),
      invitedBy,
      inviteCode: code,
    }
    const res = await submitter.submit({ audience: 'creator', fields })
    if (res.kind === 'received') {
      const issued = res.code || code || makeInviteCode(name)
      setMyCode(issued); saveMyCode(issued)
      setStatus('received'); setMessage('Application received.')
    } else if (res.kind === 'demo') { setMyCode(code || makeInviteCode(name)); setStatus('demo'); setMessage('Preview only: your application was not sent.') }
    else { setStatus('error'); setMessage(res.message) }
  }

  const first = name.trim().split(/\s+/)[0]
  const myLink = refLink(myCode)

  return (
    <section id="invite" aria-labelledby="invite-h" className="band relative overflow-hidden">
      <div className="wrap relative">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">{invite.eyebrow}</p>
          <h2 id="invite-h" className="display-2 mt-3">{invite.title}</h2>
          <p className="lede mx-auto mt-6">{invite.body}</p>
        </div>

        <div className="mx-auto mt-12 max-w-[760px] rounded-3xl border border-line bg-ink-900 p-6 shadow-[0_60px_140px_-50px_rgba(0,0,0,.9)] sm:p-10">
          {done ? (
            <div className="step-in-fwd" role="status">
              <h3 ref={doneRef} tabIndex={-1} className="font-display text-4xl leading-tight tracking-[-0.02em] outline-none">
                {status === 'demo' ? 'Preview only: this application was not sent.' : `You’re in the queue${first ? `, ${first}` : ''}.`}
              </h3>
              <p className="mt-4 max-w-[50ch] text-base text-sub">
                {status === 'demo'
                  ? 'This copy of the page isn’t connected to the application sheet yet, so nothing you entered left this page.'
                  : 'We read every application. If you’re a fit, we’ll email you to verify your profile and set your price.'}
              </p>
              <div className="mt-10 rounded-2xl border border-line bg-ink-850 p-5 sm:p-6">
                <p className="text-lg font-semibold">{referral.headline}</p>
                <p className="mt-1 text-sm text-sub">{referral.short} Share your link; the message is written for you.</p>
                <p className="mt-4 break-all font-mono text-base">{myLink.replace(/^https?:\/\//, '')}</p>
                <div className="mt-4"><InviteActions link={myLink} personal /></div>
              </div>
              <button type="button" className="btn-ghost press mt-8" onClick={() => setStatus('idle')}>Edit my answers</button>
            </div>
          ) : (
            <form noValidate onSubmit={submit} onInput={() => { if (!firstInput.current) firstInput.current = Date.now() }} onClick={() => { if (!firstInput.current) firstInput.current = Date.now() }} className="space-y-8">
              {invitedBy && <p className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm">A Castkey creator invited you. Welcome.</p>}
              {submitter.mode === 'demo' && (
                <p className="rounded-xl border border-ice/30 bg-ice/10 px-4 py-3 text-sm text-ice">Preview: this copy of the page doesn’t send applications yet.</p>
              )}

              <Step n={1} title="About you">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ap-name" className="field-label">Your name</label>
                    <input id="ap-name" className="field" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); clear('name') }} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ap-name-err' : undefined} />
                    {errors.name && <p id="ap-name-err" className="field-err">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="ap-email" className="field-label">Email</label>
                    <input id="ap-email" type="email" className="field" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); clear('email') }} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'ap-email-err' : undefined} />
                    {errors.email && <p id="ap-email-err" className="field-err">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ap-profile" className="field-label">Link to your main account</label>
                    <input id="ap-profile" className="field" inputMode="url" autoCapitalize="none" placeholder="instagram.com/yourname" value={profile} onChange={(e) => { setProfile(e.target.value); clear('profile') }} aria-invalid={!!errors.profile} aria-describedby={errors.profile ? 'ap-profile-err' : undefined} />
                    {errors.profile && <p id="ap-profile-err" className="field-err">{errors.profile}</p>}
                  </div>
                </div>
                <p className="field-label mt-5" id="ap-followers-l">Followers <span className="font-normal text-mute">(optional)</span></p>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="ap-followers-l">
                  {invite.worth.audiences.map((a) => (
                    <button key={a} type="button" aria-pressed={followers === a} onClick={() => setFollowers(followers === a ? '' : a)} className={chip(followers === a)}>{a}</button>
                  ))}
                </div>
                <label htmlFor="ap-want" className="field-label mt-5">Pick your referral link <span className="font-normal text-mute">(optional)</span></label>
                <CodeInput id="ap-want" value={want} onChange={(v) => { setWantTouched(true); setWant(v); clear('want') }} />
                {errors.want ? <p id="ap-want-status" className="field-err">{errors.want}</p> : <CodeStatus state={check} id="ap-want-status" />}
                <p className="text-xs text-mute">{referral.short}</p>
              </Step>

              <Step n={2} title="What could brands use?" hint="You can change this later.">
                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-describedby={errors.licensing ? 'ap-licensing-err' : undefined}>
                  {LICENSE.map((o, i) => (
                    <button
                      key={o.v}
                      id={i === 0 ? 'ap-licensing' : undefined}
                      type="button"
                      role="radio"
                      aria-checked={licensing === o.v}
                      onClick={() => { setLicensing(o.v); clear('licensing') }}
                      className={`press rounded-2xl border p-4 text-left transition-colors ${licensing === o.v ? 'border-coral bg-coral/10' : 'border-line hover:border-paper/40'}`}
                    >
                      <span className="block text-base font-semibold">{o.v}</span>
                      <span className="mt-1 block text-sm text-sub">{o.d}</span>
                    </button>
                  ))}
                </div>
                {errors.licensing && <p id="ap-licensing-err" className="field-err">{errors.licensing}</p>}
              </Step>

              <Step n={3} title="Anything you’d never do?" hint="Tap any that apply. Brands in these areas won’t be able to request you.">
                <div className="flex flex-wrap gap-2">
                  {invite.boundaries.map((b) => (
                    <button key={b} type="button" aria-pressed={never.includes(b)} onClick={() => toggle(b)} className={chip(never.includes(b))}>{b}</button>
                  ))}
                </div>
                <label htmlFor="ap-note" className="field-label mt-5">Anything else we should know? <span className="font-normal text-mute">(optional)</span></label>
                <textarea id="ap-note" rows={2} maxLength={600} className="field resize-y" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. no fast food brands" />
                <p className="mt-3 text-xs text-mute">Nudity is never allowed on Castkey, so you don’t need to add it.</p>
              </Step>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="ap-company">Company</label>
                <input id="ap-company" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
              </div>

              <div className="border-t border-line pt-8">
                <button type="submit" className="btn-primary press w-full text-lg sm:w-auto sm:px-10" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : status === 'error' ? 'Try again' : 'Apply to list your likeness'}
                </button>
                <p className="mt-3 text-sm text-mute">Free · No commitment · You approve every brand</p>
                <p className={`mt-3 text-sm ${status === 'error' || Object.keys(errors).length ? 'text-coral' : 'text-sub'}`} aria-live="polite">{message}</p>
                <p className="mt-4 max-w-[60ch] text-xs text-mute">
                  By applying you agree to our <a className="underline underline-offset-4" href={legalLinks.privacy || '/privacy/'}>privacy notice</a>. We use your answers to review your application, and we share only anonymous totals across all applicants with investors.
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="mt-10 text-center">
          <p className="mb-3 text-sm text-sub">Not applying yourself? You can still refer creators and earn.</p>
          <InviteSomeone label="Get a referral link" />
        </div>
      </div>
    </section>
  )
}
