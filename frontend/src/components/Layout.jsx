import './Layout.css'
import StatusBar from './StatusBar.jsx'

function NavItems({ items, active, className, linkComponent: LinkComponent = 'a' }) {
  return (
    <nav className={className} aria-label="Primary">
      {items.map((item, index) => {
        const id = item.id ?? item.href
        const linkProps = LinkComponent === 'a' ? { href: item.href } : { to: item.href }
        return (
          <LinkComponent
            key={id}
            className="layout-link"
            {...linkProps}
            aria-current={active === id ? 'page' : undefined}
          >
            <span className="layout-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="layout-label">{item.label}</span>
          </LinkComponent>
        )
      })}
    </nav>
  )
}

function Layout({ brand, items = [], active, status, linkComponent, children }) {
  return (
    <div className="layout">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        {brand ? <div className="topbar-brand">{brand}</div> : null}
        <NavItems
          items={items}
          active={active}
          className="topbar-nav"
          linkComponent={linkComponent}
        />
      </header>
      <div className="layout-frame">
        <aside className="rail">
          {brand ? <div className="rail-brand">{brand}</div> : null}
          <NavItems
            items={items}
            active={active}
            className="rail-nav"
            linkComponent={linkComponent}
          />
        </aside>
        <main id="main" className="main" tabIndex={-1}>
          {children}
        </main>
      </div>
      {status ? <StatusBar {...status} /> : null}
    </div>
  )
}

export default Layout
