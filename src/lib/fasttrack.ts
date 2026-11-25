// Fast-track links: short addresses you can share that skip the intro and land on the right spot.
// Works as a path (getcastkey.netlify.app/apply). Section links also work as a hash (…/#apply), e.g. in previews.

export type FastTrack = { kind: 'section'; id: string; focus?: boolean } | { kind: 'dialog'; audience: 'brand' | 'partner' }

export const FAST_TRACKS: Record<string, FastTrack> = {
  apply: { kind: 'section', id: 'invite', focus: true },
  join: { kind: 'section', id: 'invite', focus: true },
  creators: { kind: 'section', id: 'invite', focus: true },
  brands: { kind: 'dialog', audience: 'brand' },
  demo: { kind: 'dialog', audience: 'brand' },
  agencies: { kind: 'dialog', audience: 'partner' },
  partners: { kind: 'dialog', audience: 'partner' },
  refer: { kind: 'section', id: 'refer' },
  earn: { kind: 'section', id: 'earn' },
  how: { kind: 'section', id: 'how' },
  faq: { kind: 'section', id: 'faq' },
}

/** The fast-track key in the current address, if any ("/apply", "/apply/", "#apply"). */
export function fastTrackKey(): string | null {
  const fromPath = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  if (fromPath && FAST_TRACKS[fromPath]) return fromPath
  const fromHash = location.hash.replace(/^#/, '').toLowerCase()
  // Hashes only scroll (nav links like #agencies must not pop a form open); dialogs need the path.
  if (fromHash && FAST_TRACKS[fromHash]?.kind === 'section') return fromHash
  return null
}
