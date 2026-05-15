'use client'

import { useEffect } from 'react'
import { LINE_HEIGHT_VALUE, useLineHeightStore } from '@/features/line-height-toggle'

export function LineHeightProvider({ children }: { children: React.ReactNode }) {
  const lineHeight = useLineHeightStore((s) => s.lineHeight)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--content-line-height',
      String(LINE_HEIGHT_VALUE[lineHeight]),
    )
  }, [lineHeight])

  return <>{children}</>
}
