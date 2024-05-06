interface ConstructStyleValueProps {
	style: CSSStyleDeclaration
	extractKeys: string[]
	errorLogSet: Set<string>
}

export function constructStyleValue(props: ConstructStyleValueProps): string {
	const { style, extractKeys, errorLogSet } = props

	const result = extractKeys
		.flatMap((styleName) => {
			const styleValue = style.getPropertyValue(styleName)

			if (styleValue === '') {
				errorLogSet.add(
					`${styleName}がcode要素から取得できませんでした。このスタイルは置き換えられた要素に設定されません。` +
						'\n' +
						document.location.href
				)
				return []
			} else {
				return `${styleName}: ${style.getPropertyValue(styleName)};`
			}
		})
		.join('\n\t')

	return result
}
