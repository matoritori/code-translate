import { message } from '@root/message/message'

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
	const { tabId } = details
	chrome.tabs.sendMessage(tabId, message.historyChanged).catch()
})
