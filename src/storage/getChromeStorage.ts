import { ChromeStorage, isChromeStorage } from '@models/ChromeStorage'
import { getChromeStorageFallback } from './getChromeStorageFallback'

export async function getChromeStorage(): Promise<ChromeStorage> {
	const storage = await chrome.storage.local.get()

	if (isChromeStorage(storage)) {
		return storage
	} else {
		return getChromeStorageFallback(storage)
	}
}
