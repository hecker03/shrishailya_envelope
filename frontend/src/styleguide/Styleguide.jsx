import Button from '../components/Button.jsx'
import Kbd from '../components/Kbd.jsx'
import Layout from '../components/Layout.jsx'
import Link from '../components/Link.jsx'
import Panel from '../components/Panel.jsx'
import Rule from '../components/Rule.jsx'
import Tag from '../components/Tag.jsx'
import './Styleguide.css'

const navItems = [
  { id: 'tokens', label: 'tokens', href: '#sg-tokens' },
  { id: 'type', label: 'type', href: '#sg-type' },
  { id: 'components', label: 'components', href: '#sg-components' },
]

const tokens = [
  ['--bg', '#0a0c0f'],
  ['--surface', '#10141a'],
  ['--border', '#1f2630'],
  ['--text', '#d7dee7'],
  ['--muted', '#7d8896'],
  ['--accent', '#4ade80'],
  ['--warn', '#f5b83d'],
  ['--danger', '#f87171'],
]

const demoStatus = {
  branch: 'main',
  sha: 'abcdef0',
  built: '2026-01-01',
  lastCommit: '2d ago',
}

function Section({ id, number, title, children }) {
  return (
    <section className="sg-section" id={id} aria-labelledby={`${id}-heading`}>
      <h2 className="sg-heading" id={`${id}-heading`}>
        <span className="sg-number">{number}</span> / {title}
      </h2>
      {children}
    </section>
  )
}

function Styleguide() {
  return (
    <Layout brand="~/styleguide" items={navItems} active="tokens" status={demoStatus}>
      <h1 id="top">Design system</h1>
      <p className="sg-lede">
        Tokens, type and components from the portfolio spec. This page is dev-only and excluded
        from production builds.
      </p>

      <Rule />

      <Section id="sg-tokens" number="01" title="tokens">
        <div className="sg-swatches">
          {tokens.map(([name, value]) => (
            <div className="sg-swatch" key={name}>
              <span className="sg-swatch-chip" style={{ background: `var(${name})` }} />
              <code>{name}</code>
              <span className="sg-swatch-value">{value}</span>
            </div>
          ))}
        </div>
        <p className="sg-note">
          1px borders, 2px radius, 8px spacing grid, 960px max width. Dark only, no shadows and
          no gradients.
        </p>
      </Section>

      <Rule />

      <Section id="sg-type" number="02" title="type">
        <p className="sg-label">Inter / body / 16px / 1.6</p>
        <p>
          Body copy uses Inter. Keep sentences specific and short; no stock illustrations and no
          decorative cards.
        </p>
        <p className="sg-label">JetBrains Mono / headings, chrome, code</p>
        <h3>02 / work</h3>
        <p>
          <code>npm run build</code>
        </p>
      </Section>

      <Rule />

      <Section id="sg-components" number="03" title="components">
        <div className="sg-stack">
          <div>
            <p className="sg-label">Button</p>
            <div className="sg-row">
              <Button>default</Button>
              <Button variant="primary">primary</Button>
              <Button variant="danger">danger</Button>
              <Button disabled>disabled</Button>
            </div>
          </div>

          <div>
            <p className="sg-label">Tag</p>
            <div className="sg-row">
              <Tag>neutral</Tag>
              <Tag tone="accent">accent</Tag>
              <Tag tone="warn">warn</Tag>
              <Tag tone="danger">danger</Tag>
            </div>
          </div>

          <div>
            <p className="sg-label">Kbd</p>
            <div className="sg-row">
              <span>
                <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <Kbd>g</Kbd> <Kbd>w</Kbd>
              </span>
            </div>
          </div>

          <div>
            <p className="sg-label">Link</p>
            <div className="sg-row">
              <Link href="#sg-tokens">internal sample</Link>
              <Link href="https://example.com" external>
                external sample
              </Link>
            </div>
          </div>

          <div>
            <p className="sg-label">Panel</p>
            <Panel title="Panel title" meta="meta">
              <p>
                Panels use the surface token, a 1px border and a 2px radius. Content keeps the
                same 8px rhythm.
              </p>
            </Panel>
          </div>

          <div>
            <p className="sg-label">Rule</p>
            <Rule label="labeled rule" />
          </div>

          <div>
            <p className="sg-label">StatusBar</p>
            <p className="sg-note">
              Rendered at the bottom of this layout with demo values. Real build data arrives in
              T08.
            </p>
          </div>

          <div>
            <p className="sg-label">Focus</p>
            <p className="sg-note">
              Keyboard focus uses a 2px accent ring with a 2px offset. Press Tab from the top of
              the page to see it on the skip link and navigation.
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  )
}

export default Styleguide
