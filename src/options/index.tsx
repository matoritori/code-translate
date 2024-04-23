import { createRoot } from 'react-dom/client'
import { App } from './App'
import { getChromeStorage } from '@storage/getChromeStorage'

const root = document.getElementById('root')

if (root) {
	getChromeStorage().then((storage) => {
		const { extractAttributes, extractStyleKey } = storage
		createRoot(root).render(<App extractAttributes={extractAttributes} extractStyleKey={extractStyleKey} />)
	})
}
