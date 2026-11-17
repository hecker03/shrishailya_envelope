import Kbd from '../components/Kbd.jsx'
import Panel from '../components/Panel.jsx'
import Tag from '../components/Tag.jsx'
import { publicRoutes } from '../lib/routes.js'
import { usePageMeta } from '../lib/usePageMeta.js'

const goRows = publicRoutes
  .filter((route) => route.shortcut)
  .map((route) => ({ id: route.id, label: route.label.toLowerCase(), key: route.shortcut }))

function KeyboardHints() {
  return (
    <Panel title="Move around" meta="keys">
      <dl className="shortcut-list">
        <div>
          <dt>
            <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
          </dt>
          <dd>open the command palette</dd>
        </div>
        {goRows.map((row) => (
          <div key={row.id}>
            <dt>
              <Kbd>g</Kbd> <Kbd>{row.key}</Kbd>
            </dt>
            <dd>{row.label}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}

function PlaceholderPage({ route }) {
  usePageMeta(route.label)

  return (
    <article className="page">
      <p className="section-kicker">
        {route.section} / {route.navLabel}
      </p>
      <h1>{route.label}</h1>
      <p className="page-lede">{route.summary}</p>

      {route.id === 'home' ? <KeyboardHints /> : null}

      <Panel className="page-placeholder" meta={<Tag>placeholder</Tag>}>
        <p>Route wired. Page content is not written yet.</p>
      </Panel>
    </article>
  )
}

export default PlaceholderPage
