import { StyleGetErrorLog, isStyleGetErrorLogList } from '@models/StyleGetErrorLog'
import { isArrayEvery } from '@utils/isArrayEvery'
import { isBoolean } from '@utils/isBoolean'
import { isString } from '@utils/isString'
import { ColorMode, isColorMode } from './ColorMode'

export type ChromeStorage = {
	execReplace: boolean
	extractAttributes: string[]
	extractStyleKey: string[]
	styleGetErrorLogList: StyleGetErrorLog[]
	disableUrl: string[]
	enableUrl: string[]
	extensionPageColorMode: ColorMode
}

export type ChromeStorageKey = keyof ChromeStorage

export function isChromeStorage(e: any): e is ChromeStorage {
	return (
		isBoolean(e?.execReplace) &&
		isArrayEvery(e?.extractStyleKey, isString) &&
		isArrayEvery(e?.extractAttributes, isString) &&
		isStyleGetErrorLogList(e?.styleGetErrorLogList) &&
		isArrayEvery(e?.disableUrl, isString) &&
		isArrayEvery(e?.enableUrl, isString) &&
		isColorMode(e?.extensionPageColorMode)
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
		styleGetErrorLogList: [],
		enableUrl: [],
		disableUrl: [],
		extensionPageColorMode: 'system',
	}
}

export const CHROME_STORAGE_KEYS: Readonly<ChromeStorageKey[]> = [
	'execReplace',
	'extractStyleKey',
	'extractAttributes',
	'styleGetErrorLogList',
	'enableUrl',
	'disableUrl',
	'extensionPageColorMode',
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
		(key === 'styleGetErrorLogList' && isStyleGetErrorLogList(value)) ||
		(key === 'enableUrl' && isArrayEvery(value, isString)) ||
		(key === 'disableUrl' && isArrayEvery(value, isString)) ||
		(key === 'extensionPageColorMode' && isColorMode(value))
	)
}
