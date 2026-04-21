import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './aloitus.css'
import Sovellus from './Sovellus.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sovellus />
  </StrictMode>,
)
