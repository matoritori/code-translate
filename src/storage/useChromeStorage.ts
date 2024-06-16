import { ChromeStorage } from '@models/ChromeStorage'
import { useSyncExternalStore } from 'react'
import { getChromeStorage } from './getChromeStorage'
import { chromeAPI } from '@root/libs/chromeAPI'

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

	chromeAPI.storage.onChanged.addListener(listener)

	return () => {
		chromeAPI.storage.onChanged.removeListener(listener)
	}
}

function getSnapshot() {
	return storage
}
