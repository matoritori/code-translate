import { ChromeStorage, isChromeStorage } from '@models/ChromeStorage'
import { getChromeStorageFallback } from './getChromeStorageFallback'
import { chromeAPI } from '@root/libs/chromeAPI'

export async function getChromeStorage(): Promise<ChromeStorage> {
	const storage = await chromeAPI.storage.local.get()

	if (isChromeStorage(storage)) {
		return storage
	} else {
		return getChromeStorageFallback(storage)
	}
}
