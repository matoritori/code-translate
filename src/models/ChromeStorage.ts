import { isArrayEvery } from '@utils/isArrayEvery'
import { isBoolean } from '@utils/isBoolean'
import { isString } from '@utils/isString'

export type ChromeStorage = {
	extractStyleKey: string[]
	extractAttributes: string[]
	keepOriginalKeyword: boolean
	styleGetErrorLog: string[]
}

export type ChromeStorageKey = keyof ChromeStorage

export function isChromeStorage(e: any): e is ChromeStorage {
	return (
		isArrayEvery(e?.extractStyleKey, isString) &&
		isArrayEvery(e?.extractAttributes, isString) &&
		isArrayEvery(e?.styleGetErrorLog, isString) &&
		isBoolean(e?.keepOriginalKeyword)
	)
}

export function INITIAL_CHROME_STORAGE(): ChromeStorage {
	return {
		extractStyleKey: [
			'font-size',
			'font-weight',
			'font-family',
			'color',
			'background',
			'margin',
			'padding',
			'display',
			'line-height',
			'overflow-wrap',
		],
		extractAttributes: [],
		keepOriginalKeyword: true,
		styleGetErrorLog: [],
	}
}

export const CHROME_STORAGE_KEYS: Readonly<ChromeStorageKey[]> = [
	'extractStyleKey',
	'extractAttributes',
	'keepOriginalKeyword',
	'styleGetErrorLog',
]

export function isChromeStorageKey(e: any): e is ChromeStorageKey {
	return CHROME_STORAGE_KEYS.includes(e)
}

export function isCorrectChromeStorageValue<K extends keyof ChromeStorage>(
	key: K,
	value: any
): value is ChromeStorage[K] {
	return (
		(key === 'extractStyleKey' && isArrayEvery(value, isString)) ||
		(key === 'extractAttributes' && isArrayEvery(value, isString)) ||
		(key === 'keepOriginalKeyword' && isBoolean(value)) ||
		(key === 'styleGetErrorLog' && isArrayEvery(value, isString))
	)
}
