import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppShell } from './App.jsx'

const publicRouteCases = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/work/example', 'Case study: example'],
  ['/tools', 'Tools'],
  ['/tools/prompt-scrubber', 'Prompt Scrubber'],
  ['/tools/cvss', 'CVSS calculator'],
  ['/about', 'About'],
]

const opsRouteCases = [
  ['/ops/login', 'Sign in'],
  ['/ops', 'Consistency dashboard'],
  ['/ops/log', 'Daily log'],
]

function renderAt(pathname) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <AppShell />
    </MemoryRouter>,
  )
}

function openPalette() {
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
  return screen.getByRole('combobox', { name: 'Search pages and tools' })
}

describe('public routes', () => {
  it.each(publicRouteCases)('renders %s', (pathname, heading) => {
    renderAt(pathname)

    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeTruthy()
    expect(document.title).toBe(`${heading} · Shrishailya Keskar`)
  })

  it('renders the 404 page inside the public shell', () => {
    renderAt('/missing')

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeTruthy()
    expect(screen.getAllByRole('navigation', { name: 'Primary' }).length).toBeGreaterThan(0)
  })
})

describe('command palette', () => {
  it('opens on Ctrl+K, focuses search and lists every public route', () => {
    renderAt('/')
    const input = openPalette()

    expect(document.activeElement).toBe(input)

    const listbox = screen.getByRole('listbox', { name: 'Pages and tools' })
    for (const label of ['Home', 'About', 'Work', 'Tools', 'Prompt Scrubber', 'CVSS calculator']) {
      expect(within(listbox).getByText(label)).toBeTruthy()
    }

    expect(within(listbox).queryByText('/ops')).toBeNull()
    expect(screen.queryByText('Sign in')).toBeNull()
  })

  it('does not expose private routes when searching', () => {
    renderAt('/')
    const input = openPalette()

    fireEvent.change(input, { target: { value: 'ops' } })

    expect(screen.getByText('No matching routes.')).toBeTruthy()
  })

  it('navigates with arrow keys and Enter, then focuses main', async () => {
    renderAt('/')
    const input = openPalette()

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeTruthy()
    await waitFor(() => {
      expect(document.activeElement).toBe(document.getElementById('main'))
    })
  })

  it('closes on Escape', () => {
    renderAt('/')
    const input = openPalette()

    fireEvent.keyDown(input, { key: 'Escape' })

    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('toggles closed on Ctrl+K', () => {
    renderAt('/')
    openPalette()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    expect(screen.queryByRole('combobox')).toBeNull()
  })
})

describe('g-key shortcuts', () => {
  it('navigates with g then w and focuses main', async () => {
    renderAt('/')

    fireEvent.keyDown(window, { key: 'g' })
    fireEvent.keyDown(window, { key: 'w' })

    expect(screen.getByRole('heading', { level: 1, name: 'Work' })).toBeTruthy()
    await waitFor(() => {
      expect(document.activeElement).toBe(document.getElementById('main'))
    })
  })

  it('ignores shortcuts while typing in a field', () => {
    renderAt('/')
    const input = document.createElement('input')
    document.body.append(input)
    input.focus()

    fireEvent.keyDown(input, { key: 'g' })
    fireEvent.keyDown(input, { key: 'w' })

    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeTruthy()
    input.remove()
  })
})

describe('private routes', () => {
  it.each(opsRouteCases)('marks %s noindex', (pathname, heading) => {
    renderAt(pathname)

    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeTruthy()
    expect(document.querySelector('meta[name="robots"]')?.content).toBe('noindex, nofollow')
  })

  it('does not mark public routes noindex', () => {
    renderAt('/about')

    expect(document.querySelector('meta[name="robots"]')).toBeNull()
  })
})
