import { ChromeStorage } from '@models/ChromeStorage'
import { canExecInCurrentUrl } from '@root/libs/canExecInCurrentUrl'

interface Props {
	enableUrl: ChromeStorage['enableUrl']
	disableUrl: ChromeStorage['disableUrl']
	tabUrl: string
	tabId: number
	execReplace: ChromeStorage['execReplace']
}

export function changeIcon(props: Props) {
	console.trace('changeIcon', props)
	const { enableUrl, disableUrl, tabUrl, tabId, execReplace } = props

	if (!execReplace) {
		chrome.action.setIcon({
			path: '../icon16.png',
			tabId: tabId,
		})
		return
	}

	const canExecInCurrentUrlResult = canExecInCurrentUrl({
		currentUrl: tabUrl,
		disableUrl,
		enableUrl,
	})

	if (canExecInCurrentUrlResult.canExec) {
		chrome.action.setIcon({
			path: '../icon16checked.png',
			tabId: tabId,
		})
	} else {
		chrome.action.setIcon({
			path: '../icon16disabledByUrl.png',
			tabId: tabId,
		})
	}
}
