export type ColorMode = 'dark' | 'light' | 'system'

export function isColorMode(e: any): e is ColorMode {
	return e === 'dark' || e === 'light' || e === 'system'
}
