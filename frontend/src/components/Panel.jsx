import './Panel.css'

function Panel({ title, meta, className = '', children }) {
  return (
    <section className={`panel ${className}`.trim()}>
      {title || meta ? (
        <header className="panel-head">
          {title ? <h2 className="panel-title">{title}</h2> : null}
          {meta ? <span className="panel-meta">{meta}</span> : null}
        </header>
      ) : null}
      <div className="panel-body">{children}</div>
    </section>
  )
}

export default Panel
