import {
	ChromeStorage,
	INITIAL_CHROME_STORAGE,
	isChromeStorageKey,
	isCorrectChromeStorageValue,
} from '@models/ChromeStorage'

export function getChromeStorageFallback(
	possiblyIncompleteStorage: any
): ChromeStorage {
	// このオブジェクトはpossiblyIncompleteStorageの値の型が正常ならばその値によって上書きされる
	let resultingValue: ChromeStorage = INITIAL_CHROME_STORAGE()

	if (typeof possiblyIncompleteStorage === 'object') {
		Object.entries(possiblyIncompleteStorage).forEach(([key, value]) => {
			if (isChromeStorageKey(key) && isCorrectChromeStorageValue(key, value)) {
				resultingValue = { ...resultingValue, [key]: value }
			}
		})
	}

	return resultingValue
}
