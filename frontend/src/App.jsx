import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from 'react-router'
import CommandPalette from './components/CommandPalette.jsx'
import Layout from './components/Layout.jsx'
import {
  getActiveNavId,
  goShortcuts,
  navItems,
  paletteCommands,
  publicRoutes,
} from './lib/routes.js'
import { useGlobalShortcuts } from './lib/useGlobalShortcuts.js'
import { useRouteFocus } from './lib/useRouteFocus.js'
import CaseStudyPage from './pages/CaseStudyPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import OpsPlaceholder from './pages/OpsPlaceholder.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'
import './pages/pages.css'

function PublicShell() {
  const { pathname } = useLocation()

  return (
    <Layout
      brand={
        <Link className="brand-link" to="/">
          shrishailya
        </Link>
      }
      items={navItems}
      active={getActiveNavId(pathname)}
      linkComponent={Link}
    >
      <Outlet />
    </Layout>
  )
}

function PublicRoute({ route }) {
  return route.id === 'work-case-study' ? <CaseStudyPage /> : <PlaceholderPage route={route} />
}

function AppShell() {
  const { pathname } = useLocation()
  const [paletteOpen, setPaletteOpen] = useState(false)

  const togglePalette = useCallback(() => setPaletteOpen((open) => !open), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  useGlobalShortcuts({
    shortcuts: goShortcuts,
    onPalette: togglePalette,
    goEnabled: !paletteOpen,
  })
  useRouteFocus()

  useEffect(() => {
    setPaletteOpen(false)
  }, [pathname])

  return (
    <>
      <Routes>
        <Route element={<PublicShell />}>
          {publicRoutes.map((route) => (
            <Route key={route.id} path={route.path} element={<PublicRoute route={route} />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          path="/ops/login"
          element={<OpsPlaceholder title="Sign in" summary="Private console sign-in." />}
        />
        <Route
          path="/ops"
          element={
            <OpsPlaceholder
              title="Consistency dashboard"
              summary="Private view of study blocks, commits and the daily log."
            />
          }
        />
        <Route
          path="/ops/log"
          element={<OpsPlaceholder title="Daily log" summary="Private daily log." />}
        />
      </Routes>

      <CommandPalette open={paletteOpen} onClose={closePalette} commands={paletteCommands} />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export { AppShell }
export default App
