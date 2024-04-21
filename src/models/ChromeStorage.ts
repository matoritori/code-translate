import { isArrayEvery } from '@utils/isArrayEvery'
import { isString } from '@utils/isString'

export type ChromeStorage = {
	extractStyleKey: string[]
	extractAttributes: string[]
}

export type ChromeStorageKey = keyof ChromeStorage

export function isChromeStorage(e: any): e is ChromeStorage {
	return isArrayEvery(e, isString)
}

export function INITIAL_CHROME_STORAGE(): ChromeStorage {
	return {
		extractStyleKey: ['font', 'color', 'background', 'margin', 'padding'],
		extractAttributes: [],
	}
}

export const CHROME_STORAGE_KEYS: Readonly<ChromeStorageKey[]> = ['extractStyleKey', 'extractAttributes']

export function isChromeStorageKey(e: any): e is ChromeStorageKey {
	return CHROME_STORAGE_KEYS.includes(e)
}

export function isCorrectChromeStorageValue<K extends keyof ChromeStorage>(
	key: K,
	value: any
): value is ChromeStorage[K] {
	return (
		(key === 'extractStyleKey' && isArrayEvery(value, isString)) ||
		(key === 'extractAttributes' && isArrayEvery(value, isString))
	)
}
