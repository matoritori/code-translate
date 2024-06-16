interface Props {
	enableUrl: string[]
	disableUrl: string[]
	currentUrl: string
}

export interface Returns {
	canExec: boolean
	reason: 'matchedEnableUrl' | 'matchedDisableUrl' | 'nothingMatched'
}

export function canExecInCurrentUrl(props: Props): Returns {
	const { enableUrl, disableUrl, currentUrl } = props

	for (const url of enableUrl) {
		if (new RegExp(url).test(currentUrl)) {
			return { canExec: true, reason: 'matchedEnableUrl' }
		}
	}

	if (isMatchedDisableUrl(currentUrl, disableUrl)) {
		return { canExec: false, reason: 'matchedDisableUrl' }
	}

	return { canExec: true, reason: 'nothingMatched' }
}

export function isMatchedDisableUrl(currentUrl: string, disableUrl: string[]): boolean {
	for (const url of disableUrl) {
		if (new RegExp(url).test(currentUrl)) {
			return true
		}
	}

	return false
}
