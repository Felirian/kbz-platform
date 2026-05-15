import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ContentWidth = 'narrow' | 'wide' | 'full'

export const CONTENT_WIDTH_VALUE: Record<ContentWidth, string> = {
  narrow: '40rem',
  wide: '60rem',
  full: '100%',
}

interface ContentWidthState {
  contentWidth: ContentWidth
  setContentWidth: (v: ContentWidth) => void
}

export const useContentWidthStore = create<ContentWidthState>()(
  persist(
    (set) => ({
      contentWidth: 'full',
      setContentWidth: (contentWidth) => set({ contentWidth }),
    }),
    { name: 'content-width-storage' },
  ),
)
