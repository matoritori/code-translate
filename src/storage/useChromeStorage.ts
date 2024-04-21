import { ChromeStorage } from '@models/ChromeStorage'
import { useSyncExternalStore } from 'react'
import { getChromeStorage } from './getChromeStorage'

export function useChromeStorage() {
	const storage = useSyncExternalStore(subscribe, getSnapshot)

	return storage
}

let storage: ChromeStorage = await getChromeStorage()

function subscribe(callback: () => void) {
	function listener() {
		getChromeStorage().then((result) => {
			storage = result
			callback()
		})
	}

	chrome.storage.onChanged.addListener(listener)

	return () => {
		chrome.storage.onChanged.removeListener(listener)
	}
}

function getSnapshot() {
	return storage
}
