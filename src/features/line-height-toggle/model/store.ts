import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LineHeight = 'compact' | 'normal' | 'relaxed'

export const LINE_HEIGHT_VALUE: Record<LineHeight, number> = {
  compact: 1.4,
  normal: 1.7,
  relaxed: 2.0,
}

interface LineHeightState {
  lineHeight: LineHeight
  setLineHeight: (v: LineHeight) => void
}

export const useLineHeightStore = create<LineHeightState>()(
  persist(
    (set) => ({
      lineHeight: 'normal',
      setLineHeight: (lineHeight) => set({ lineHeight }),
    }),
    { name: 'line-height-storage' },
  ),
)
