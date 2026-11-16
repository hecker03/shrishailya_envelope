import './Link.css'

function Link({ href, external = false, children, ...rest }) {
  const externalProps = external ? { target: '_blank', rel: 'noreferrer' } : {}

  return (
    <a className="link" href={href} {...externalProps} {...rest}>
      {children}
      {external ? (
        <>
          <span className="link-external" aria-hidden="true">
            ↗
          </span>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  )
}

export default Link
