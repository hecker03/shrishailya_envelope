import { Link, useParams } from 'react-router'
import Panel from '../components/Panel.jsx'
import Tag from '../components/Tag.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'

function CaseStudyPage() {
  const { slug } = useParams()
  const title = slug ? `Case study: ${slug}` : 'Case study'
  usePageMeta(title)

  return (
    <article className="page">
      <p className="section-kicker">02 / work</p>
      <h1>{title}</h1>
      <p className="page-lede">
        Case studies will render from project content: problem, architecture, stack, role, status
        and lessons.
      </p>

      <Panel meta={<Tag>placeholder</Tag>}>
        <p>Route wired. Project content is not written yet.</p>
      </Panel>

      <p className="page-back">
        <Link to="/work">Back to work</Link>
      </p>
    </article>
  )
}

export default CaseStudyPage
