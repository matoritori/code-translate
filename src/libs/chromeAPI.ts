import { INITIAL_CHROME_STORAGE, isChromeStorageKey } from '@models/ChromeStorage'
import { getRegularNumber } from '@utils/getRegularNumber'
import { isBoolean } from '@utils/isBoolean'
import { isNumber } from '@utils/isNumber'
import { isObject } from '@utils/isObject'
import { isString } from '@utils/isString'

const chromeStorageLocalOnChangedListeners = new Set<Function>()

const fallback = {
	storage: {
		local: {
			get: () => {
				const storage = structuredClone({ ...localStorage })
				const storageTypeReference = INITIAL_CHROME_STORAGE()

				for (const [key, value] of Object.entries(storage)) {
					const parsedValue = JSON.parse(value)

					if (isChromeStorageKey(key)) {
						if (isNumber(storageTypeReference[key])) {
							const num = getRegularNumber(parsedValue)

							if (num !== null) {
								storage[key] = num
							} else {
								throw new Error(
									`ローカルストレージの、キー"${key}"の値をnumber(NaNを含まない)に変換できませんでした。JSON.parseする前の値は"${value}"で、変換後は"${parsedValue}"でした。getRegularNumberによって得た値は${num}でした。`
								)
							}
						} else if (isBoolean(storageTypeReference[key])) {
							if (parsedValue === 'true') {
								storage[key] = true
							} else if (parsedValue === 'false') {
								storage[key] = false
							} else {
								throw new Error(
									`ローカルストレージの、キー"${key}"の値をbooleanに変換できませんでした。JSON.parseする前の値は"${value}"で、変換後は"${parsedValue}"でした。`
								)
							}
						} else if (isString(storageTypeReference[key]) && isString(parsedValue)) {
							storage[key] = parsedValue
						} else if (isObject(storageTypeReference) && isObject(parsedValue)) {
							storage[key] = parsedValue
						} else {
							throw new Error('ローカルストレージの値を正しく変換できませんでした。キャッチしていないエラーです。')
						}
					}
				}

				return storage
			},
			set: (items: { [name: string]: any }) => {
				for (const [key, value] of Object.entries(items)) {
					localStorage.setItem(key, JSON.stringify(value))
				}
				chromeStorageLocalOnChangedListeners.forEach((callback) => {
					callback()
				})
			},
		},
		onChanged: {
			addListener: (callback: Function) => {
				chromeStorageLocalOnChangedListeners.add(callback)
			},
			removeListener: (callback: Function) => {
				chromeStorageLocalOnChangedListeners.delete(callback)
			},
		},
	},
}

export const chromeAPI = chrome.storage === undefined ? fallback : chrome
