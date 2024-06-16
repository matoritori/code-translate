import { createRoot } from 'react-dom/client'
import { App } from './App'
import { getChromeStorage } from '@storage/getChromeStorage'
import './main.css'

const root = document.getElementById('root')

if (root) {
	getChromeStorage().then((storage) => {
		const { extractAttributes, extractStyleKey, enableUrl, disableUrl } = storage
		createRoot(root).render(
			<App
				extractAttributes={extractAttributes}
				extractStyleKey={extractStyleKey}
				enableUrl={enableUrl}
				disableUrl={disableUrl}
			/>
		)
	})
}
