import { ChromeStorageKey } from '@models/ChromeStorage'
import { message } from '@root/message/message'
import { getChromeStorage } from '@storage/getChromeStorage'
import { isBoolean } from '@utils/isBoolean'

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
	const { tabId } = details

	chrome.tabs
		.sendMessage(tabId, message.historyChanged)
		.then(() => {})
		.catch(() => {})

	console.log('webNavigation.onHistoryStateUpdated', details)
})

getChromeStorage().then(({ execReplace }) => {
	changeIconByExecReplace(execReplace)
})

async function changeIconByExecReplace(execReplace: boolean) {
	const iconPath = execReplace ? '../icon16checked.png' : '../icon16.png'

	chrome.action.setIcon({
		path: iconPath,
	})
}

chrome.storage.local.onChanged.addListener((changes) => {
	const targetKey: ChromeStorageKey = 'execReplace'

	for (const [storageKey, storageChange] of Object.entries(changes)) {
		if (storageKey === targetKey) {
			const value = storageChange.newValue

			if (isBoolean(value)) {
				changeIconByExecReplace(storageChange.newValue)
			}
		}
	}
})
