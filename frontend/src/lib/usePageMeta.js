import { useEffect } from 'react'
import { SITE_NAME } from './routes.js'

export function usePageMeta(title, { noindex = false } = {}) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME

    if (!noindex) return undefined

    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    meta.dataset.routeRobots = ''
    document.head.append(meta)

    return () => meta.remove()
  }, [title, noindex])
}
