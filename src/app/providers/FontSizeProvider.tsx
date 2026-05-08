'use client'

import { useEffect } from 'react'
import { TEXT_SCALE, useFontSizeStore } from '@/features/font-size-toggle'

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const fontSize = useFontSizeStore((s) => s.fontSize)

  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', String(TEXT_SCALE[fontSize]))
  }, [fontSize])

  return <>{children}</>
}
