import { describe, expect, it } from 'vitest'
import robots from '../../public/robots.txt?raw'

describe('robots.txt', () => {
  it('disallows the private console', () => {
    expect(robots).toMatch(/^User-agent: \*$/m)
    expect(robots).toMatch(/^Disallow: \/ops$/m)
  })
})
