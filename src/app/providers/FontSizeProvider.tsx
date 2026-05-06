'use client'

import { useEffect } from 'react'
import { FONT_SIZE_PX, useFontSizeStore } from '@/features/font-size-toggle'

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const fontSize = useFontSizeStore((s) => s.fontSize)

  useEffect(() => {
    document.documentElement.style.setProperty('--p-font-size', `${FONT_SIZE_PX[fontSize]}px`)
  }, [fontSize])

  return <>{children}</>
}
