import { createClient } from '@supabase/supabase-js'

// Public settings: the publishable key can only do what the database's row rules allow.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

export const supabaseReady = !!(url && key)
export const supabase = createClient(url || 'https://invalid.supabase.co', key || 'missing', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
})

export type Role = 'creator' | 'brand' | 'manager' | 'admin'
export type Profile = { id: string; role: Role | null; full_name: string | null; email: string | null }
export type ReviewStatus = 'pending' | 'approved' | 'declined'
export type Creator = {
  id: string; display_name: string; handle: string | null; bio: string | null; social_url: string | null
  followers_range: string | null; licenses: string[]; inbound_minimum: number; flexible_open_calls: boolean
  confirmed_adult: boolean; referred_by_code: string | null; status: ReviewStatus
  require_approval: boolean; ad_spend_share: boolean
}
export type Brand = { id: string; company: string; website: string | null; ad_spend: string | null; status: ReviewStatus }

/** Plain-language version of a database error. */
export function friendly(e: unknown): string {
  const m = (e as { message?: string })?.message || String(e)
  if (/duplicate key.*handle/i.test(m)) return 'That handle is taken. Try another.'
  if (/below this creator/i.test(m)) return m
  if (/violates check constraint/i.test(m)) return 'One of the values is out of range. Check the numbers and try again.'
  if (/rate limit|too many/i.test(m)) return 'Too many tries. Wait a minute and try again.'
  return m
}
