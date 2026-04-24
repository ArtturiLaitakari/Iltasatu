import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Sovellus from './Sovellus.jsx'
import './aloitus.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sovellus />
  </StrictMode>,
)