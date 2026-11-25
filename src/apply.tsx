import { createContext, useContext } from 'react'
import type { Audience } from './lib/submit'

/** Any CTA calls open('brand' | 'creator'); the dialog keeps that audience choice. */
export const ApplyContext = createContext<{ open: (a: Audience) => void }>({ open: () => {} })
export const useApply = () => useContext(ApplyContext)

export function ApplyButtons({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  const { open } = useApply()
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <button type="button" className="btn-primary" onClick={() => open('creator')}>
        Apply as a creator
      </button>
      <button type="button" className={dark ? 'btn-dark' : 'btn-ghost'} onClick={() => open('brand')}>
        Request an intro
      </button>
    </div>
  )
}
