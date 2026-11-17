import { Link } from 'react-router'
import Kbd from '../components/Kbd.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'

function NotFoundPage() {
  usePageMeta('Not found')

  return (
    <article className="page">
      <p className="section-kicker">404 / not found</p>
      <h1>Page not found</h1>
      <p className="page-lede">No route matches this address.</p>
      <p>
        <Link to="/">Go home</Link>
      </p>
      <p className="page-hint">
        Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to jump to a page.
      </p>
    </article>
  )
}

export default NotFoundPage
