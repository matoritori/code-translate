import { ChromeStorage, ChromeStorageKey } from '@models/ChromeStorage'
import { chromeAPI } from '@root/libs/chromeAPI'

export function setChromeStorage<T extends ChromeStorageKey>(key: T, value: ChromeStorage[T]): void {
	chromeAPI.storage.local.set({ [key]: value })
}

/**
 * 複数のキーとペアを一括で指定する
 */
export function setBulkChromeStorage<U extends ChromeStorageKey>(newState: Pick<ChromeStorage, U>) {
	chromeAPI.storage.local.set(newState)
}
