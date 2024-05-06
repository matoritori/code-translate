export function initializeDisplayStyle(element: Element | HTMLElement) {
	if (element instanceof HTMLElement) {
		element.style.removeProperty('display')
	}
}
