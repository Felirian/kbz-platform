import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontSize = 'small' | 'medium' | 'large'

export const TEXT_SCALE: Record<FontSize, number> = {
  small: 0.875,
  medium: 1,
  large: 1.25,
}

interface FontSizeState {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}

export const useFontSizeStore = create<FontSizeState>()(
  persist(
    (set) => ({
      fontSize: 'medium',
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'font-size-storage',
    },
  ),
)
