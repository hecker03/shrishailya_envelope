import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Kbd from './Kbd.jsx'
import { filterCommands } from '../lib/palette.js'
import './CommandPalette.css'

function CommandPalette({ open, onClose, commands }) {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()
  const listId = useId()

  const results = useMemo(() => filterCommands(commands, query), [commands, query])
  const safeActiveIndex = results.length === 0 ? -1 : Math.min(activeIndex, results.length - 1)

  const optionId = (index) => `${listId}-option-${index}`

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) dialog.showModal()
      setQuery('')
      setActiveIndex(0)
      inputRef.current?.focus()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  function move(delta) {
    if (results.length === 0) return
    setActiveIndex((index) => {
      const current = Math.min(index, results.length - 1)
      return (current + delta + results.length) % results.length
    })
  }

  function select(command) {
    if (!command) return
    onClose()
    navigate(command.path)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      move(1)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      move(-1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(Math.max(results.length - 1, 0))
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      select(results[safeActiveIndex])
    }
  }

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Command palette"
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {open ? (
        <div className="palette-inner">
          <div className="palette-search">
            <span className="palette-prompt" aria-hidden="true">
              &gt;
            </span>
            <input
              ref={inputRef}
              className="palette-input"
              type="text"
              role="combobox"
              aria-label="Search pages and tools"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={safeActiveIndex >= 0 ? optionId(safeActiveIndex) : undefined}
              autoComplete="off"
              spellCheck={false}
              placeholder="Search pages and tools"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <p className="visually-hidden" aria-live="polite">
            {results.length} {results.length === 1 ? 'route' : 'routes'}
          </p>

          {results.length > 0 ? (
            <ul id={listId} className="palette-results" role="listbox" aria-label="Pages and tools">
              {results.map((command, index) => (
                <li
                  key={command.id}
                  id={optionId(index)}
                  className="palette-option"
                  role="option"
                  aria-selected={index === safeActiveIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(command)}
                >
                  <span className="palette-option-main">
                    <span className="palette-option-label">{command.label}</span>
                    <span className="palette-option-description">{command.description}</span>
                  </span>
                  <span className="palette-option-path">{command.path}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="palette-empty">No matching routes.</p>
          )}

          <footer className="palette-hints">
            <span>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> move
            </span>
            <span>
              <Kbd>Enter</Kbd> open
            </span>
            <span>
              <Kbd>Esc</Kbd> close
            </span>
          </footer>
        </div>
      ) : null}
    </dialog>
  )
}

export default CommandPalette
