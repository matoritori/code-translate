interface CopyAttributesProps {
	extractAttributes: string[]
	from: Element
	to: Element
}

export function copyAttributes(props: CopyAttributesProps) {
	const { extractAttributes, from, to } = props

	extractAttributes.forEach((attrName) => {
		const attrValue = from.getAttribute(attrName)

		if (attrValue !== null) {
			to.setAttribute(attrName, attrValue)
		}
	})
}
