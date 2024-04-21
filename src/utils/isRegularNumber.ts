export function isRegularNumber(e: any): e is number {
	return typeof e === 'number' && !isNaN(e)
}
