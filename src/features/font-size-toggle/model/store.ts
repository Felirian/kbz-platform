import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontSize = 'small' | 'medium' | 'large'

export const FONT_SIZE_PX: Record<FontSize, number> = {
  small: 14,
  medium: 16,
  large: 20,
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
