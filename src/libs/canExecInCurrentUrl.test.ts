import { canExecInCurrentUrl, Returns } from './canExecInCurrentUrl'

describe('urlに条件がマッチするかどうか', () => {
	test('ブロック', () => {
		expect(
			canExecInCurrentUrl({
				currentUrl: 'https://www.bing.com/',
				disableUrl: ['^https://www.bing.com'],
				enableUrl: [],
			})
		).toStrictEqual({
			canExec: false,
			reason: 'matchedDisableUrl',
		} satisfies Returns)
	})

	test('ブロック複数', () => {
		expect(
			canExecInCurrentUrl({
				currentUrl: 'https://www.bing.com/',
				disableUrl: ['^https://www.bing.com', 'x'],
				enableUrl: [],
			})
		).toStrictEqual({ canExec: false, reason: 'matchedDisableUrl' } satisfies Returns)
	})

	test('許可', () => {
		expect(
			canExecInCurrentUrl({
				currentUrl: 'https://www.bing.com/',
				disableUrl: [],
				enableUrl: ['^https://www.bing.com'],
			})
		).toStrictEqual({
			canExec: true,
			reason: 'matchedEnableUrl',
		} satisfies Returns)
	})

	test('許可複数', () => {
		expect(
			canExecInCurrentUrl({
				currentUrl: 'https://www.bing.com/',
				disableUrl: [],
				enableUrl: ['^https://www.bing.com', 'x'],
			})
		).toStrictEqual({
			canExec: true,
			reason: 'matchedEnableUrl',
		} satisfies Returns)
	})

	test('ブロックを許可で上書きできるか', () => {
		expect(
			canExecInCurrentUrl({
				currentUrl: 'https://www.bing.com/',
				disableUrl: ['^https://www.bing.com'],
				enableUrl: ['bing'],
			})
		).toStrictEqual({
			canExec: true,
			reason: 'matchedEnableUrl',
		} satisfies Returns)
	})

	test('正規表現の.をエスケープしたらちゃんと不正規urlを弾けるか', () => {
		expect(
			canExecInCurrentUrl({
				currentUrl: 'https://www.bing.com/',
				disableUrl: ['^https://www.bing\\.com'],
				enableUrl: [],
			})
		).toStrictEqual({
			canExec: false,
			reason: 'matchedDisableUrl',
		} satisfies Returns)

		expect(
			canExecInCurrentUrl({
				currentUrl: 'https://www.bingXcom/',
				disableUrl: ['^https://www.bing\\.com'],
				enableUrl: [],
			})
		).toStrictEqual({
			canExec: true,
			reason: 'nothingMatched',
		} satisfies Returns)
	})
})
