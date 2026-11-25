import { StrictMode, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Mark } from './components/Logo'
import { getSubmitter } from './lib/submit'

// Privacy notice plus a form to ask to see, correct or delete your information.

const EFFECTIVE = 'November 25, 2026'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const submitter = getSubmitter()

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-sans text-2xl font-semibold tracking-[-0.01em]">{children}</h2>
}

function RequestForm() {
  const [email, setEmail] = useState('')
  const [request, setRequest] = useState('')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'demo' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const first = useRef(0)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!EMAIL.test(email.trim())) { setMsg('Enter the email you applied with, like name@example.com.'); return }
    if (!request) { setMsg('Choose what you’d like us to do.'); return }
    if (!first.current || Date.now() - first.current < 1000) { first.current = Date.now() - 1000; setMsg('Please check your answers, then press the button again.'); return }
    setStatus('sending'); setMsg('Sending…')
    const r = await submitter.submit({ audience: 'privacy', fields: { email: email.trim(), request, details: details.trim() } })
    if (r.kind === 'received') { setStatus('sent'); setMsg('') }
    else if (r.kind === 'demo') { setStatus('demo'); setMsg('') }
    else { setStatus('error'); setMsg(r.message) }
  }

  if (status === 'sent' || status === 'demo') {
    return (
      <div className="rounded-card border border-line bg-ink-900 p-6" role="status">
        <p className="font-display text-3xl">{status === 'sent' ? 'Request received.' : 'Not sent: this copy of the page is a preview.'}</p>
        {status === 'sent' && <p className="mt-3 text-sub">We’ll reply to {email.trim()} within 30 days, usually much sooner.</p>}
      </div>
    )
  }
  return (
    <form noValidate onSubmit={submit} onInput={() => { if (!first.current) first.current = Date.now() }} onClick={() => { if (!first.current) first.current = Date.now() }} className="grid gap-5 rounded-card border border-line bg-ink-900 p-6">
      <div>
        <label htmlFor="pr-email" className="field-label">The email you applied with</label>
        <input id="pr-email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <fieldset>
        <legend className="field-label">What would you like us to do?</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {['Show me my information', 'Correct my information', 'Delete my information', 'Something else'].map((v) => (
            <button key={v} type="button" role="radio" aria-checked={request === v} onClick={() => setRequest(v)} className={`press min-h-11 rounded-full border px-4 text-sm font-medium ${request === v ? 'border-coral bg-coral text-ink-950' : 'border-line text-sub hover:border-paper/40'}`}>{v}</button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="pr-details" className="field-label">Anything else? <span className="font-normal text-mute">(optional)</span></label>
        <textarea id="pr-details" rows={3} maxLength={1000} className="field resize-y" value={details} onChange={(e) => setDetails(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary press" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send request'}</button>
        <p className={`text-sm ${status === 'error' || msg ? 'text-coral' : 'text-sub'}`} aria-live="polite">{msg}</p>
      </div>
    </form>
  )
}

function Privacy() {
  return (
    <main className="wrap max-w-[760px] py-10 sm:py-14">
      <a href="/" className="inline-flex items-center gap-3"><Mark className="h-8 w-8" /><span className="font-display text-2xl">Castkey</span></a>
      <h1 className="mt-12 font-display text-5xl leading-none tracking-[-0.03em]">Privacy notice</h1>
      <p className="mt-4 text-sm text-mute">Effective {EFFECTIVE}</p>

      <div className="mt-8 space-y-4 text-base leading-7 text-sub [&_strong]:text-paper">
        <p>Castkey is in early access. This notice explains what we collect through this website, why, and the choices you have. Plain version: we use your answers to review your application, and we show investors <strong>anonymous totals</strong>, never you individually.</p>

        <H>What we collect</H>
        <p><strong>Creator applications:</strong> your name, email, a link to your main social account, your follower range, what you’d license (face, voice or both), topics you’d never do, any notes, and the invite code you arrived with or were given.</p>
        <p><strong>Brand demo requests:</strong> your name, work email, company, website, brand type, how you’d use Castkey, rough monthly ranges for paid ad spend and for spend on UGC creators and influencers, whether you pay for usage rights today, and which AI ad tools you use.</p>
        <p><strong>Partner applications and privacy requests:</strong> what you type into those forms.</p>
        <p>We don’t ask for ID documents, selfies or voice files on this website. If you’re accepted as a creator, identity verification happens later through a verification partner, under its own notice.</p>
        <p>The website has no advertising trackers or analytics cookies. Our host (Netlify) keeps standard server logs, and fonts load from Google Fonts, which sees your IP address.</p>

        <H>Why we collect it</H>
        <ul className="list-disc space-y-2 pl-5">
          <li>To review your application or demo request and contact you about it.</li>
          <li>To plan the product: which creators and brands to onboard first, and what to build.</li>
          <li><strong>To show demand to current and prospective investors.</strong> We share combined, anonymous figures such as how many creators and brands have applied, follower and spend ranges added together, and percentages (for example, how many brands already use AI ad tools). Spend totals are only shown once at least three brands have answered, so they can’t point to one brand.</li>
        </ul>
        <p>We do not share your name, email, links, company or a single brand’s answers with investors or anyone else without asking you first. We don’t sell your information, and we won’t add you to a marketing list.</p>

        <H>Where it’s kept</H>
        <p>Applications are stored in a private Google Sheet in our Google account, and we get an email notification for each one. The website is hosted by Netlify. Only the Castkey team can see individual applications.</p>

        <H>How long we keep it</H>
        <p>Until you ask us to delete it, or 24 months after we last heard from you if we don’t end up working together, whichever comes first.</p>

        <H>Your choices</H>
        <p>You can ask to see, correct or delete your information at any time using the form below. Deleting your application also removes you from future totals. We reply within 30 days. Depending on where you live, you may have further rights under laws such as the GDPR or state privacy laws; we’ll honour those requests through the same form.</p>

        <H>Age</H>
        <p>Castkey is for people aged 18 and over. Please don’t apply if you’re younger.</p>

        <H>Changes</H>
        <p>If we change how we use your information, we’ll update this page and its date. If a change affects information you’ve already given us, we’ll ask before applying it to you.</p>
      </div>

      <section className="mt-12" aria-labelledby="req-h">
        <h2 id="req-h" className="font-sans text-2xl font-semibold">Make a request</h2>
        <p className="mt-2 mb-6 text-sub">See, correct or delete what you’ve sent us.</p>
        <RequestForm />
      </section>

      <p className="mt-12 text-sm"><a href="/" className="link-arrow">← Back to Castkey</a></p>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Privacy />
  </StrictMode>,
)
