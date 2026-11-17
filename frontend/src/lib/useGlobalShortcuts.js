import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

const PREFIX_TIMEOUT_MS = 1500

function isEditable(target) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

export function useGlobalShortcuts({ shortcuts, onPalette, goEnabled = true }) {
  const navigate = useNavigate()
  const pendingTimer = useRef(null)

  useEffect(() => {
    function clearPending() {
      if (pendingTimer.current === null) return
      window.clearTimeout(pendingTimer.current)
      pendingTimer.current = null
    }

    function startPending() {
      clearPending()
      pendingTimer.current = window.setTimeout(() => {
        pendingTimer.current = null
      }, PREFIX_TIMEOUT_MS)
    }

    function handleKeyDown(event) {
      if (event.defaultPrevented || event.isComposing) return

      const key = event.key.toLowerCase()

      if ((event.ctrlKey || event.metaKey) && !event.altKey && key === 'k') {
        event.preventDefault()
        onPalette()
        return
      }

      if (!goEnabled || event.ctrlKey || event.metaKey || event.altKey || event.repeat) return
      if (isEditable(event.target)) return

      if (pendingTimer.current !== null) {
        clearPending()

        if (key === 'g') {
          startPending()
          return
        }

        const path = shortcuts[`g${key}`]
        if (path) {
          event.preventDefault()
          navigate(path)
        }
        return
      }

      if (key === 'g') startPending()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearPending()
    }
  }, [goEnabled, navigate, onPalette, shortcuts])
}
