import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseReady, friendly, type Brand, type Creator, type Profile, type Role } from './supabase'
import { Wordmark } from '../components/Logo'
import { CreatorSetup, CreatorHome } from './Creator'
import { BrandSetup, BrandHome } from './Brand'

// The Castkey app at /app. Sign in by email link, pick a role once, then set up a creator or brand profile.

export function Shell({ children, email }: { children: ReactNode; email?: string | null }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <a href="/" aria-label="Castkey home" className="flex items-center"><Wordmark /></a>
          {email && (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden text-mute sm:inline">{email}</span>
              <button type="button" className="btn-ghost press min-h-10 px-3 text-sm" onClick={() => supabase.auth.signOut()}>Sign out</button>
            </div>
          )}
        </div>
      </header>
      <main id="main" className="wrap py-10 sm:py-14">{children}</main>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setState('error'); setMsg('Enter a valid email address.'); return }
    setState('sending')
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${location.origin}/app/` } })
    if (error) { setState('error'); setMsg(friendly(error)) } else setState('sent')
  }
  return (
    <div className="mx-auto max-w-[440px]">
      <p className="kicker"><b>01</b>Sign in</p>
      <h1 className="display-2 mt-4">Welcome to Castkey.</h1>
      {state === 'sent' ? (
        <div className="lit mt-8 rounded-3xl p-6" role="status">
          <p className="text-lg font-semibold">Check your email.</p>
          <p className="mt-2 text-sub">We sent a sign-in link to {email.trim()}. Open it on this device to continue. It expires in an hour.</p>
          <button type="button" className="btn-ghost press mt-6" onClick={() => setState('idle')}>Use a different email</button>
        </div>
      ) : (
        <form onSubmit={send} className="lit mt-8 rounded-3xl p-6" noValidate>
          <label htmlFor="login-email" className="field-label">Email</label>
          <input id="login-email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={state === 'error'} aria-describedby={state === 'error' ? 'login-err' : undefined} />
          {state === 'error' && <p id="login-err" className="field-err">{msg}</p>}
          <button type="submit" className="btn-primary press mt-6 w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}</button>
          <p className="mt-4 text-xs text-mute">No password needed. New here? The same link creates your account.</p>
        </form>
      )}
    </div>
  )
}

const ROLES: { id: Role; k: string; v: string }[] = [
  { id: 'creator', k: 'I’m a creator', v: 'License my face and voice to brands and get paid monthly.' },
  { id: 'brand', k: 'I’m a brand', v: 'License verified creators for AI ads and post open calls.' },
  { id: 'manager', k: 'I’m a manager or agency', v: 'Run deals for the creators I represent.' },
]

function RolePicker({ onPick }: { onPick: (r: Role) => Promise<void> }) {
  const [busy, setBusy] = useState<Role | null>(null)
  const [err, setErr] = useState('')
  return (
    <div className="mx-auto max-w-[640px]">
      <p className="kicker"><b>02</b>Your account</p>
      <h1 className="display-2 mt-4">How will you use Castkey?</h1>
      <p className="mt-3 text-sub">You pick this once. Message us if you need to change it later.</p>
      <div className="mt-8 grid gap-3">
        {ROLES.map((r) => (
          <button key={r.id} type="button" disabled={!!busy} onClick={async () => { setBusy(r.id); setErr(''); try { await onPick(r.id) } catch (e) { setErr(friendly(e)); setBusy(null) } }}
            className="lit press rounded-2xl p-5 text-left transition-colors duration-300 hover:border-coral" data-spot>
            <span className="block text-lg font-semibold">{busy === r.id ? 'Setting up…' : r.k}</span>
            <span className="mt-1 block text-sub">{r.v}</span>
          </button>
        ))}
      </div>
      {err && <p className="field-err mt-4" role="alert">{err}</p>}
    </div>
  )
}

function ManagerHome() {
  return (
    <div className="mx-auto max-w-[640px]">
      <p className="kicker"><b>02</b>Managers</p>
      <h1 className="display-2 mt-4">Your roster lives here.</h1>
      <p className="mt-4 text-sub">Creators add you from their profile and choose what you can do. Once they do, their deals show up here. Roster tools arrive Dec 1.</p>
    </div>
  )
}

type Loaded = { profile: Profile; creator: Creator | null; brand: Brand | null }

export function AppRoot() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [data, setData] = useState<Loaded | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const load = useCallback(async () => {
    if (!session) { setData(null); return }
    setErr('')
    const uid = session.user.id
    const [p, c, b] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
      supabase.from('creators').select('*').eq('id', uid).maybeSingle(),
      supabase.from('brands').select('*').eq('id', uid).maybeSingle(),
    ])
    const e = p.error || c.error || b.error
    if (e) { setErr(friendly(e)); return }
    if (!p.data) { setErr('Your account is still being created. Refresh in a moment.'); return }
    setData({ profile: p.data as Profile, creator: (c.data as Creator) ?? null, brand: (b.data as Brand) ?? null })
  }, [session])

  useEffect(() => { load() }, [load])

  if (!supabaseReady) return <Shell><p className="text-sub">The app isn’t connected to its database in this build.</p></Shell>
  if (session === undefined) return <Shell><Loading /></Shell>
  if (!session) return <Shell><Login /></Shell>
  const email = session.user.email
  if (err) return <Shell email={email}><p className="field-err" role="alert">{err}</p><button type="button" className="btn-ghost press mt-4" onClick={load}>Try again</button></Shell>
  if (!data) return <Shell email={email}><Loading /></Shell>

  const { profile, creator, brand } = data
  let body: ReactNode
  if (!profile.role) {
    body = <RolePicker onPick={async (r) => {
      const { error } = await supabase.from('profiles').update({ role: r }).eq('id', profile.id)
      if (error) throw error
      await load()
    }} />
  } else if (profile.role === 'creator') {
    body = creator ? <CreatorHome creator={creator} reload={load} /> : <CreatorSetup uid={profile.id} email={email ?? ''} onDone={load} />
  } else if (profile.role === 'brand') {
    body = brand ? <BrandHome brand={brand} /> : <BrandSetup uid={profile.id} onDone={load} />
  } else if (profile.role === 'manager') {
    body = <ManagerHome />
  } else {
    body = <p className="text-sub">Admin tools arrive with the review queue (Nov 27).</p>
  }
  return <Shell email={email}>{body}</Shell>
}

function Loading() {
  return (
    <div className="mx-auto max-w-[640px] animate-pulse" aria-label="Loading">
      <div className="h-4 w-32 rounded bg-ink-800" />
      <div className="mt-5 h-12 w-3/4 rounded bg-ink-800" />
      <div className="mt-8 h-40 rounded-3xl bg-ink-900" />
    </div>
  )
}
