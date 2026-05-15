import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WikiNavStore {
  openItems: Record<string, boolean>
  _hydrated: boolean
  setHydrated: () => void
  toggle: (key: string) => void
  isOpen: (key: string) => boolean
}

export const useWikiNavStore = create<WikiNavStore>()(
  persist(
    (set, get) => ({
      openItems: {},
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),

      toggle: (key: string) =>
        set((state) => {
          const wasOpen = !!state.openItems[key]
          if (wasOpen) {
            // collapse self and all descendants
            const next: Record<string, boolean> = {}
            const prefix = `${key}__`
            for (const [k, v] of Object.entries(state.openItems)) {
              if (k === key || k.startsWith(prefix)) continue
              next[k] = v
            }
            return { openItems: next }
          }
          return {
            openItems: { ...state.openItems, [key]: true },
          }
        }),

      isOpen: (key: string) => {
        const state = get()
        if (!state._hydrated) return false
        return state.openItems[key]
      },
    }),
    {
      name: 'wiki-nav-open-items',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
      partialize: (state) => ({ openItems: state.openItems }),
    },
  ),
)
