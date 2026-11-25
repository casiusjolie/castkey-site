import { useEffect, useRef, useState } from 'react'

// "Report a bug": goes to the Bugs tab of the Castkey applications sheet and emails the founder.
// Works on the landing site and in the app. Page and device are filled in automatically.

const ENDPOINT = import.meta.env.VITE_SUBMISSION_MODE === 'endpoint' ? (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) : undefined

function device() {
  const ua = navigator.userAgent
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : 'Other'
  const browser = /Edg\//.test(ua) ? 'Edge' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other'
  return `${os} · ${browser} · ${window.innerWidth}×${window.innerHeight}`
}

export function BugReport({ label = 'Report a bug', className = '', email = '', account = '' }: { label?: string; className?: string; email?: string; account?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [what, setWhat] = useState('')
  const [steps, setSteps] = useState('')
  const [mail, setMail] = useState(email)
  const [trap, setTrap] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  useEffect(() => setMail(email), [email])

  const open = () => { setState('idle'); setMsg(''); ref.current?.showModal() }
  const close = () => ref.current?.close()

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (what.trim().length < 5) { setState('error'); setMsg('Tell us what went wrong in a few words.'); return }
    if (mail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.trim())) { setState('error'); setMsg('That email doesn’t look right. You can leave it empty.'); return }
    if (!ENDPOINT) { setState('error'); setMsg('This preview isn’t connected, so the report wasn’t sent.'); return }
    setState('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ audience: 'bug', fields: { what: what.trim(), steps: steps.trim(), email: mail.trim(), account, page: location.pathname + location.hash, device: device(), company_url_2: trap } }),
      })
      const data = await res.json().catch(() => null)
      if (data?.received) { setState('sent'); setWhat(''); setSteps('') }
      else { setState('error'); setMsg('It didn’t go through. Try again in a minute.') }
    } catch { setState('error'); setMsg('Network problem. Your report is still here, so you can try again.') }
  }

  return (
    <>
      <button type="button" className={className} onClick={open}>{label}</button>
      <dialog ref={ref} className="sheet m-auto w-[min(520px,calc(100vw-24px))] rounded-3xl bg-transparent p-0 text-paper backdrop:bg-black/70" aria-labelledby="bug-h" onClick={(e) => { if (e.target === ref.current) close() }}>
        <div className="material rounded-3xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="bug-h" className="font-display text-3xl tracking-[-0.02em]">Report a bug</h2>
            <button type="button" onClick={close} className="press grid h-10 w-10 place-items-center rounded-full border border-line text-sub hover:text-paper" aria-label="Close">✕</button>
          </div>
          {state === 'sent' ? (
            <div role="status" className="mt-4">
              <p className="text-lg font-semibold">Thanks, it’s with the team.</p>
              <p className="mt-1 text-sub">We read every report{mail ? ' and may email you if we need more detail' : ''}.</p>
              <button type="button" className="btn-ghost press mt-6" onClick={close}>Done</button>
            </div>
          ) : (
            <form onSubmit={send} noValidate className="mt-4 grid gap-4">
              <div>
                <label htmlFor="bug-what" className="field-label">What went wrong?</label>
                <textarea id="bug-what" rows={3} className="field" value={what} onChange={(e) => setWhat(e.target.value)} placeholder="The Apply button didn’t do anything" />
              </div>
              <div>
                <label htmlFor="bug-steps" className="field-label">What were you doing? <span className="text-mute">(optional)</span></label>
                <textarea id="bug-steps" rows={2} className="field" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Filled in the form on my phone, then tapped Apply" />
              </div>
              <div>
                <label htmlFor="bug-mail" className="field-label">Your email <span className="text-mute">(optional, so we can follow up)</span></label>
                <input id="bug-mail" type="email" className="field" value={mail} onChange={(e) => setMail(e.target.value)} autoComplete="email" />
              </div>
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={trap} onChange={(e) => setTrap(e.target.value)} />
              <p className="text-xs text-mute">We also send the page you’re on and your device type, nothing else.</p>
              {state === 'error' && <p className="field-err" role="alert">{msg}</p>}
              <button type="submit" className="btn-primary press" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send report'}</button>
            </form>
          )}
        </div>
      </dialog>
    </>
  )
}
