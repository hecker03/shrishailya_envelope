import './Button.css'

function Button({ variant = 'default', type = 'button', children, ...rest }) {
  return (
    <button type={type} className={`button button-${variant}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
