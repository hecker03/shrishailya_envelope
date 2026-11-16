import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))

if (import.meta.env.DEV && window.location.pathname === '/__styleguide') {
  import('./styleguide/Styleguide.jsx').then(({ default: Styleguide }) => {
    root.render(
      <StrictMode>
        <Styleguide />
      </StrictMode>,
    )
  })
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
