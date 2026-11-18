import { describe, expect, it } from 'vitest'
import {
  getActiveNavId,
  goShortcuts,
  navItems,
  paletteCommands,
  publicRoutes,
} from './routes.js'

const specPublicPaths = [
  '/',
  '/work',
  '/work/:slug',
  '/tools',
  '/tools/prompt-scrubber',
  '/tools/cvss',
  '/about',
]

describe('route registry', () => {
  it('covers every public route from the spec', () => {
    expect(new Set(publicRoutes.map((route) => route.path))).toEqual(new Set(specPublicPaths))
  })

  it('lists every fixed public route in the palette', () => {
    const palettePaths = paletteCommands.map((command) => command.path)

    expect(palettePaths).toEqual(
      expect.arrayContaining(specPublicPaths.filter((path) => !path.includes(':'))),
    )
    expect(palettePaths).not.toContain('/work/:slug')
    expect(palettePaths.some((path) => path.startsWith('/ops'))).toBe(false)
  })

  it('keeps the rail in the spec order', () => {
    expect(navItems.map((item) => item.label)).toEqual(['about', 'work', 'tools'])
  })

  it('maps g-key shortcuts', () => {
    expect(goShortcuts).toMatchObject({
      gh: '/',
      ga: '/about',
      gw: '/work',
      gt: '/tools',
    })
  })

  it('marks the right rail item active for nested routes', () => {
    expect(getActiveNavId('/')).toBeUndefined()
    expect(getActiveNavId('/about')).toBe('about')
    expect(getActiveNavId('/work')).toBe('work')
    expect(getActiveNavId('/work/forensiq')).toBe('work')
    expect(getActiveNavId('/tools')).toBe('tools')
    expect(getActiveNavId('/tools/cvss')).toBe('tools')
    expect(getActiveNavId('/nope')).toBeUndefined()
  })
})
