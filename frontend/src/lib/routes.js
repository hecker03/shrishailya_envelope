import { matchPath } from 'react-router'

export const SITE_NAME = 'Shrishailya Keskar'

export const publicRoutes = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    section: '00',
    navLabel: 'home',
    summary: 'Who I am, what I am working on, platform links and recent activity.',
    palette: true,
    shortcut: 'h',
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    section: '01',
    navLabel: 'about',
    navOrder: 1,
    summary: 'Background, education, contact and resume.',
    palette: true,
    shortcut: 'a',
  },
  {
    id: 'work',
    path: '/work',
    label: 'Work',
    section: '02',
    navLabel: 'work',
    navOrder: 2,
    summary: 'Projects and case studies, each with an honest status and my role.',
    palette: true,
    shortcut: 'w',
  },
  {
    id: 'tools',
    path: '/tools',
    label: 'Tools',
    section: '03',
    navLabel: 'tools',
    navOrder: 3,
    summary: 'Small interactive tools. Everything runs in the browser.',
    palette: true,
    shortcut: 't',
  },
  {
    id: 'prompt-scrubber',
    path: '/tools/prompt-scrubber',
    label: 'Prompt Scrubber',
    section: '03',
    navLabel: 'tools',
    navId: 'tools',
    summary: 'Redacts sensitive text before it reaches an AI prompt, with a diff preview.',
    keywords: ['redact', 'secrets', 'pii', 'diff', 'playground'],
    palette: true,
  },
  {
    id: 'cvss',
    path: '/tools/cvss',
    label: 'CVSS calculator',
    section: '03',
    navLabel: 'tools',
    navId: 'tools',
    summary: 'CVSS v3.1 base-score calculator with vector import and export.',
    keywords: ['severity', 'score', 'v3.1', 'vector'],
    palette: true,
  },
  {
    id: 'work-case-study',
    path: '/work/:slug',
    label: 'Case study',
    section: '02',
    navLabel: 'work',
    navId: 'work',
    summary: 'Problem, architecture, stack, role, status, links and lessons.',
    palette: false,
  },
]

export const navItems = publicRoutes
  .filter((route) => route.navOrder)
  .sort((a, b) => a.navOrder - b.navOrder)
  .map((route) => ({ id: route.id, href: route.path, label: route.label.toLowerCase() }))

export const paletteCommands = publicRoutes
  .filter((route) => route.palette)
  .map((route) => ({
    id: route.id,
    path: route.path,
    label: route.label,
    description: route.summary,
    keywords: route.keywords,
  }))

export const goShortcuts = Object.fromEntries(
  publicRoutes
    .filter((route) => route.shortcut)
    .map((route) => [`g${route.shortcut}`, route.path]),
)

export function getActiveNavId(pathname) {
  const route = publicRoutes.find((candidate) =>
    matchPath({ path: candidate.path, end: true }, pathname),
  )
  return route?.navId ?? (route?.navOrder ? route.id : undefined)
}
