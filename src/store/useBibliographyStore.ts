import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BibliographyStore {
  openItems: Record<string, boolean>
  _hydrated: boolean
  setHydrated: () => void
  toggle: (key: string) => void
  isOpen: (key: string) => boolean
}

export const useBibliographyStore = create<BibliographyStore>()(
  persist(
    (set, get) => ({
      openItems: {},
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),

      toggle: (key: string) =>
        set((state) => ({
          openItems: {
            ...state.openItems,
            [key]: !state.openItems[key],
          },
        })),

      isOpen: (key: string) => {
        const state = get()
        if (!state._hydrated) return false
        return state.openItems[key]
      },
    }),
    {
      name: 'bibliography-open-items',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
      partialize: (state) => ({ openItems: state.openItems }),
    }
  )
)
