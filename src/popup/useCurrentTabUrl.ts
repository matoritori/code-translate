import { useEffect, useState } from 'react'

export function useCurrentTabUrl() {
	const [currentTabUrl, setCurrentTabUrl] = useState<string | undefined>()

	useEffect(() => {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
			if (chrome.runtime.lastError) console.error(chrome.runtime.lastError)

			setCurrentTabUrl(tab.url)
		})
	}, [])

	return currentTabUrl
}
