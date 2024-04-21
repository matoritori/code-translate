import { ChromeStorage, ChromeStorageKey } from '@models/ChromeStorage'

export function setChromeStorage<T extends ChromeStorageKey>(
	key: T,
	value: ChromeStorage[T]
): void {
	chrome.storage.local.set({ [key]: value })
}

/**
 * 複数のキーとペアを一括で指定する
 */
export function setBulkChromeStorage<U extends ChromeStorageKey>(
	newState: Pick<ChromeStorage, U>
) {
	chrome.storage.local.set(newState)
}
