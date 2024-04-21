export function getRegularNumber(e: string): number | null {
	const parsed = parseInt(e)

	if (isNaN(parsed)) {
		return null
	}

	return parsed
}
