import { Link } from 'react-router'
import Panel from '../components/Panel.jsx'
import Tag from '../components/Tag.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'

function OpsPlaceholder({ title, summary }) {
  usePageMeta(title, { noindex: true })

  return (
    <div className="ops">
      <main id="main" className="ops-main" tabIndex={-1}>
        <p className="section-kicker">ops / private</p>
        <h1>{title}</h1>
        <p className="page-lede">{summary}</p>

        <Panel meta={<Tag>private</Tag>}>
          <p>Private console placeholder. Authentication and data are added in a later task.</p>
          <p>
            <Link to="/">Back to the public site</Link>
          </p>
        </Panel>
      </main>
    </div>
  )
}

export default OpsPlaceholder
