import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

export function useRouteFocus() {
  const { pathname } = useLocation()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current === pathname) return undefined
    previousPathname.current = pathname

    // Let the palette finish closing (and restoring focus) before moving focus.
    const timer = window.setTimeout(() => {
      document.getElementById('main')?.focus()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [pathname])
}
