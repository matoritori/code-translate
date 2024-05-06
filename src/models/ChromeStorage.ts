import { StyleGetErrorLog, isStyleGetErrorLogList } from '@models/StyleGetErrorLog'
import { isArrayEvery } from '@utils/isArrayEvery'
import { isBoolean } from '@utils/isBoolean'
import { isString } from '@utils/isString'

export type ChromeStorage = {
	execReplace: boolean
	extractAttributes: string[]
	extractStyleKey: string[]
	keepOriginalKeyword: boolean
	styleGetErrorLogList: StyleGetErrorLog[]
}

export type ChromeStorageKey = keyof ChromeStorage

export function isChromeStorage(e: any): e is ChromeStorage {
	return (
		isBoolean(e?.execReplace) &&
		isArrayEvery(e?.extractStyleKey, isString) &&
		isArrayEvery(e?.extractAttributes, isString) &&
		isStyleGetErrorLogList(e?.styleGetErrorLogList) &&
		isBoolean(e?.keepOriginalKeyword)
	)
}

export function INITIAL_CHROME_STORAGE(): ChromeStorage {
	return {
		execReplace: true,
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
		styleGetErrorLogList: [],
	}
}

export const CHROME_STORAGE_KEYS: Readonly<ChromeStorageKey[]> = [
	'execReplace',
	'extractStyleKey',
	'extractAttributes',
	'keepOriginalKeyword',
	'styleGetErrorLogList',
]

export function isChromeStorageKey(e: any): e is ChromeStorageKey {
	return CHROME_STORAGE_KEYS.includes(e)
}

export function isCorrectChromeStorageValue<K extends keyof ChromeStorage>(
	key: K,
	value: any
): value is ChromeStorage[K] {
	return (
		(key === 'execReplace' && isBoolean(value)) ||
		(key === 'extractStyleKey' && isArrayEvery(value, isString)) ||
		(key === 'extractAttributes' && isArrayEvery(value, isString)) ||
		(key === 'keepOriginalKeyword' && isBoolean(value)) ||
		(key === 'styleGetErrorLogList' && isStyleGetErrorLogList(value))
	)
}
