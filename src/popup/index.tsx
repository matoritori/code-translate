import { createRoot } from 'react-dom/client'
import { App } from './App'
import './style.scss'

const root = document.getElementById('root')

if (root) {
	createRoot(root).render(<App />)
}
