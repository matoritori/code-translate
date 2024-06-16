import { ColorMode } from '@models/ColorMode'
import { TailwindColorMode } from '@models/TailwindColorMode'
import { setChromeStorage } from '@storage/setChromeStorage'
import { useChromeStorage } from '@storage/useChromeStorage'
import { useMemo } from 'react'

export function useColorModeNameForTailwind() {
	const { extensionPageColorMode } = useChromeStorage()
	const preferDarkMode = useMemo(
		() => window.matchMedia('(prefers-color-scheme: dark)').matches,
		[extensionPageColorMode]
	)
	const colorModeNameForTailwind: TailwindColorMode = useMemo(() => {
		if (extensionPageColorMode === 'system') {
			return preferDarkMode ? 'dark' : ''
		} else if (extensionPageColorMode === 'dark') {
			return 'dark'
		} else if (extensionPageColorMode === 'light') {
			return ''
		} else {
			console.error('extensionPageColorMode type invalid')
			return ''
		}
	}, [extensionPageColorMode])

	function setColorMode(colorMode: ColorMode) {
		setChromeStorage('extensionPageColorMode', colorMode)
	}

	return [colorModeNameForTailwind, setColorMode] as const
}
