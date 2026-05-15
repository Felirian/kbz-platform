'use client'

import { useEffect } from 'react'
import { CONTENT_WIDTH_VALUE, useContentWidthStore } from '@/features/content-width-toggle'

export function ContentWidthProvider({ children }: { children: React.ReactNode }) {
  const contentWidth = useContentWidthStore((s) => s.contentWidth)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--content-max-width',
      CONTENT_WIDTH_VALUE[contentWidth],
    )
  }, [contentWidth])

  return <>{children}</>
}
