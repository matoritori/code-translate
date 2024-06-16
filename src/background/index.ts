import { ChromeStorageKey } from '@models/ChromeStorage'
import { message } from '@root/message/message'
import { getChromeStorage } from '@storage/getChromeStorage'
import { changeIcon } from './changeIcon'

async function pageLoadListener(details: { tabId: number; url: string; frameType: chrome.extensionTypes.FrameType }) {
	const { tabId, url, frameType } = details

	if (frameType !== 'outermost_frame') return

	const storage = await getChromeStorage()

	changeIcon({
		tabUrl: url,
		tabId,
		disableUrl: storage.disableUrl,
		enableUrl: storage.enableUrl,
		execReplace: storage.execReplace,
	})
}

chrome.webNavigation.onCommitted.addListener(pageLoadListener)
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
	const { tabId, url } = details

	chrome.tabs.sendMessage(tabId, message.historyChanged).catch(() => {})

	const storage = await getChromeStorage()

	changeIcon({
		tabUrl: url,
		tabId,
		disableUrl: storage.disableUrl,
		enableUrl: storage.enableUrl,
		execReplace: storage.execReplace,
	})
})

chrome.storage.local.onChanged.addListener(async (changes) => {
	const isExecReplaceChanged = (['execReplace', 'disableUrl', 'enableUrl'] satisfies ChromeStorageKey[]).some((key) =>
		Object.keys(changes).includes(key)
	)
	if (!isExecReplaceChanged) return

	const storage = await getChromeStorage()
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
	if (tab.url === undefined || tab.id === undefined) return

	changeIcon({
		tabUrl: tab.url,
		tabId: tab.id,
		disableUrl: storage.disableUrl,
		enableUrl: storage.enableUrl,
		execReplace: storage.execReplace,
	})
})

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
	const storage = await getChromeStorage()
	const tab = await chrome.tabs.get(tabId)

	if (tab.url === undefined || tab.id === undefined) return

	changeIcon({
		tabUrl: tab.url,
		tabId: tab.id,
		disableUrl: storage.disableUrl,
		enableUrl: storage.enableUrl,
		execReplace: storage.execReplace,
	})
})
