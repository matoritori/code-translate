import { getChromeStorage } from '@storage/getChromeStorage'
import { message as messageProtocol } from '@root/message/message'
import { ChromeStorage } from '@models/ChromeStorage'
import { v4 as uuid } from 'uuid'

/*

<code>client</code>

があるとき、要素のスタイルが設定されて

<code style="display: none;">client</code>

になり、次に画面上の実際の表示を担当する要素

<span class="code-translate-span-ae20a887-1be5-4439-ae5d-588bba94cbbb" data-text-content="client">
	::before
	client
</span>

が追加される。翻訳されると、このspanの中の"client"は日本語に翻訳されたとき"クライアント"に翻訳されて、次のような

<span class="code-translate-span-ae20a887-1be5-4439-ae5d-588bba94cbbb" data-text-content="client">
	::before
	クライアント
</span>

になってしまうが、擬似要素beforeによって画面での表示は"client"のままになる。
スタイルは次のようになっていて、

.code-translate-span-ae20a887-1be5-4439-ae5d-588bba94cbbb::before {
	content:attr(data-text-content);
	font: 16.15px / 26.6475px SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; color: rgb(227, 227, 227); background: rgb(96, 103, 112) none repeat scroll 0% 0% / auto padding-box border-box; margin: 0px; padding: 1.7px 3.4px; ;
}
.code-translate-span-ae20a887-1be5-4439-ae5d-588bba94cbbb {
	color: transparent;
	font-size: 0px;
}

この中の

{
  ...省略...
  content: attr(data-text-content)
  ...省略...
}
によってbeforeは <span ...省略 data-text-content="client"> の値を読み取って表示するが、語句は日本語に置き換えられないので元のままで表示される。

*/

const classNamePrefix = 'code-translate-'
const textReferenceAttributeName = 'data-text-content'

getChromeStorage().then((storage) => {
	const { extractAttributes, extractStyleKey } = storage

	changeCodeToSpan({ extractAttributes, extractStyleKey })
})

chrome.runtime.onMessage.addListener((message) => {
	if (message === messageProtocol.historyChanged) {
		getChromeStorage().then((storage) => {
			const { extractAttributes, extractStyleKey } = storage

			changeCodeToSpan({ extractAttributes, extractStyleKey })
		})
	}

	return undefined
})

interface ChangeCodeToSpanProps {
	extractAttributes: ChromeStorage['extractAttributes']
	extractStyleKey: ChromeStorage['extractStyleKey']
}

function changeCodeToSpan({ extractStyleKey, extractAttributes }: ChangeCodeToSpanProps) {
	const codeElements = [...document.querySelectorAll('code')]
	const codeElementsInSentence = codeElements.filter((codeElement) => codeElement.children.length === 0)

	/** キーがスタイルで、値がクラス名。スタイルが同じならクラス名は同じのを使う(節約のため)*/
	const styleMap = new Map<string, string>()

	codeElementsInSentence.forEach((codeElement) => {
		const replaceElement = document.createElement('span')
		const replaceElementStyle = constructStyleValue(getComputedStyle(codeElement), extractStyleKey)
		const replaceElementText = codeElement.textContent ?? ''

		if (styleMap.has(replaceElementStyle)) {
			const className = styleMap.get(replaceElementStyle)
			if (className !== undefined) {
				replaceElement.classList.add(className)
			}
		} else {
			const className = classNamePrefix + 'span-' + uuid()
			replaceElement.classList.add(className)
			styleMap.set(replaceElementStyle, className)
		}

		replaceElement.textContent = replaceElementText
		replaceElement.setAttribute(textReferenceAttributeName, replaceElementText)
		copyAttributes({ extractAttributes, from: codeElement, to: replaceElement })

		codeElement.style.setProperty('display', 'none')
		codeElement.insertAdjacentElement('afterend', replaceElement)
	})

	// 集約したスタイルをドキュメントに挿入する
	styleMap.forEach((value, key) => {
		const [className, style] = [value, key]

		const styleElement = document.createElement('style')
		const styleElementContent = `
			.${className}::before {
				content:attr(${textReferenceAttributeName});
				${style}
			}
			.${className} {
				color: transparent;
				font-size: 0px;
			}`.replace(/^\t\t\t/gm, '')

		styleElement.textContent = styleElementContent
		styleElement.classList.add(classNamePrefix + 'style')
		document.head.append(styleElement)
	})
}

function constructStyleValue(style: CSSStyleDeclaration, extractStyleKey: string[]) {
	return extractStyleKey.map((e) => `${e}: ${style.getPropertyValue(e)};`).join('\n\t')
}

function copyAttributes({ extractAttributes, from, to }: { extractAttributes: string[]; from: Element; to: Element }) {
	extractAttributes.forEach((attrName) => {
		const attrValue = from.getAttribute(attrName)

		if (attrValue !== null) {
			to.setAttribute(attrName, attrValue)
		}
	})
}
