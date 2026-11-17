import { describe, expect, it } from 'vitest'
import { filterCommands } from './palette.js'

const commands = [
  {
    id: 'work',
    label: 'Work',
    path: '/work',
    description: 'Projects and case studies.',
  },
  {
    id: 'cvss',
    label: 'CVSS calculator',
    path: '/tools/cvss',
    description: 'Base-score calculator.',
    keywords: ['severity', 'v3.1'],
  },
]

describe('filterCommands', () => {
  it('returns every command for an empty query', () => {
    expect(filterCommands(commands, '')).toEqual(commands)
  })

  it('matches labels, paths and keywords case-insensitively', () => {
    expect(filterCommands(commands, 'work')).toEqual([commands[0]])
    expect(filterCommands(commands, '/tools')).toEqual([commands[1]])
    expect(filterCommands(commands, 'SEVERITY')).toEqual([commands[1]])
  })

  it('returns no matches for an unknown query', () => {
    expect(filterCommands(commands, 'ops')).toEqual([])
  })
})
