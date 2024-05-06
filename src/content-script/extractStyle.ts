import { constructStyleValue } from './constructStyleValue'

interface ExtractStyleProps {
	codeElement: Element
	replaceElement: Element

	/**
	 * スタイルに紐づいたクラス名
	 */
	savedStylingClassname: string
}

function extractStyle(props: ExtractStyleProps) {
	const { codeElement, replaceElement, savedStylingClassname } = props

	const extractedCodeStyle = constructStyleValue({
		style: getComputedStyle(codeElement),
		extractKeys: extractStyleKey,
		errorLogSet: styleGetErrorLogSet,
	})

	if (savedStylingClassname !== undefined) {
		replaceElement.classList.add(savedStylingClassname)
	} else {
		const className = generateReplaceElementStyleClassname()
		replaceElement.classList.add(className)
		STYLE_MAP.set(extractedCodeStyle, className)
	}
}
