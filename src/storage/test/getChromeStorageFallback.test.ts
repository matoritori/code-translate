import { getChromeStorageFallback } from '../getChromeStorageFallback'
import { INITIAL_CHROME_STORAGE } from '@models/ChromeStorage'

describe('StorageFallback', () => {
	test('空のオブジェクトはINITIAL_CHROME_STORAGEと同等になるか', () => {
		expect(getChromeStorageFallback({})).toStrictEqual(INITIAL_CHROME_STORAGE())
	})
})
