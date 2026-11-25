// Castkey mark: a keyhole that is also a person's silhouette, cut from a rounded tile.
// The coral square is the "consent bit". Original artwork; see /brand for exports.
export const MARK_PATH =
  'M26 0H74A26 26 0 0 1 100 26V74A26 26 0 0 1 74 100H26A26 26 0 0 1 0 74V26A26 26 0 0 1 26 0Z M43 53.27A15 15 0 1 1 57 53.27L64.2 80.2Q65 84 61 84H39Q35 84 35.8 80.2Z'
export const BIT_PATH = 'M70 16h12v12h-12z'

export function Mark({ className = '', ink = 'currentColor', bit = '#E8774F' }: { className?: string; ink?: string; bit?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <path fill={ink} fillRule="evenodd" d={MARK_PATH} />
      <path fill={bit} d={BIT_PATH} />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className="h-7 w-7" />
      <span className="font-display text-2xl font-normal leading-none tracking-[-0.02em]">Castkey</span>
    </span>
  )
}
