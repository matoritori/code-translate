import { getChromeStorage } from '@storage/getChromeStorage'
import { message as messageProtocol } from '@root/message/message'
import { ChromeStorage, ChromeStorageKey } from '@models/ChromeStorage'
import { v4 as uuid } from 'uuid'
import { setChromeStorage } from '@storage/setChromeStorage'
import { isHtmlElement } from '@utils/isHtmlElement'

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

const CLASSNAME_PREFIX = 'code-translate-'
/**
 * ::beforeの中身用
 */
const TEXT_REFERENCE_ATTRIBUTE_NAME = 'data-text-content-' + uuid()
const INSERTED_STYLE_ELMENET_CLASSNAME = CLASSNAME_PREFIX + 'style'
const INSERTED_ELEMENT_CLASSNAME = CLASSNAME_PREFIX + 'inserted-element'

function generateReplaceElementStyleClassname() {
	return CLASSNAME_PREFIX + 'span-' + uuid()
}

changeCodeToSpan()

chrome.runtime.onMessage.addListener((message) => {
	if (message === messageProtocol.historyChanged) {
		changeCodeToSpan()
	}

	return undefined
})

chrome.storage.local.onChanged.addListener((changes) => {
	const changedDataKeys = Object.keys(changes)
	const targetKeys: ChromeStorageKey[] = ['extractAttributes', 'extractStyleKey', 'keepOriginalKeyword']

	if (targetKeys.some((e) => changedDataKeys.includes(e))) {
		changeCodeToSpan()
	}
})

async function changeCodeToSpan() {
	const { extractAttributes, extractStyleKey, keepOriginalKeyword } = await getChromeStorage()

	removeAllInsertedElement()

	/** キーがスタイルで、値がクラス名。スタイルが同じならクラス名は同じのを使う(節約のため)*/
	const STYLE_MAP = new Map<string, string>()

	const codeElements = [...document.querySelectorAll('code')]
	const codeElementsInSentence = codeElements.filter((codeElement) => codeElement.children.length === 0)

	codeElementsInSentence.forEach((codeElement) => {
		const replaceElement = document.createElement('span')
		replaceElement.classList.add(INSERTED_ELEMENT_CLASSNAME)
		const replaceElementStyle = constructStyleValue(getComputedStyle(codeElement), extractStyleKey)
		const replaceElementText = codeElement.textContent ?? ''

		if (STYLE_MAP.has(replaceElementStyle)) {
			const className = STYLE_MAP.get(replaceElementStyle)
			if (className !== undefined) {
				replaceElement.classList.add(className)
			}
		} else {
			const className = generateReplaceElementStyleClassname()
			replaceElement.classList.add(className)
			STYLE_MAP.set(replaceElementStyle, className)
		}

		replaceElement.textContent = replaceElementText
		replaceElement.setAttribute(TEXT_REFERENCE_ATTRIBUTE_NAME, replaceElementText)
		copyAttributes({ extractAttributes, from: codeElement, to: replaceElement })

		codeElement.style.setProperty('display', 'none')
		codeElement.insertAdjacentElement('afterend', replaceElement)
	})

	// 以前追加した<style>を削除
	;[...document.querySelectorAll('.' + INSERTED_STYLE_ELMENET_CLASSNAME)].forEach((e) => e.remove())

	// 集約したスタイルをドキュメントに挿入する
	STYLE_MAP.forEach((value, key) => {
		const [className, style] = [value, key]

		const styleElement = document.createElement('style')
		const styleElementContent = keepOriginalKeyword
			? `
			.${className}::before {
				content:attr(${TEXT_REFERENCE_ATTRIBUTE_NAME});
				${style}
			}
			.${className} {
				color: transparent;
				font-size: 0px;
			}`.replace(/^\t\t\t/gm, '')
			: `
			.${className} {
				${style}
			}`.replace(/^\t\t\t/gm, '')

		styleElement.textContent = styleElementContent
		styleElement.classList.add(INSERTED_STYLE_ELMENET_CLASSNAME)
		document.head.append(styleElement)
	})
}

function removeAllInsertedElement() {
	document.querySelectorAll(`.${INSERTED_ELEMENT_CLASSNAME}`).forEach((e) => e.remove())
}

function constructStyleValue(style: CSSStyleDeclaration, extractStyleKey: string[]) {
	const errorLog = new Set<string>()

	const result = extractStyleKey
		.flatMap((styleName) => {
			const styleValue = style.getPropertyValue(styleName)

			if (styleValue === '') {
				const errorMessage = `${styleName}がcode要素から取得できませんでした。このスタイルは置き換えられた要素に設定されません。`
				errorLog.add(errorMessage)
				return []
			} else {
				return `${styleName}: ${style.getPropertyValue(styleName)};`
			}
		})
		.join('\n\t')

	if (errorLog.size > 0) {
		getChromeStorage().then(({ styleGetErrorLog }) => {
			const log = [...errorLog, ...styleGetErrorLog].splice(0, 30)
			setChromeStorage('styleGetErrorLog', log)
		})
	}

	return result
}

function copyAttributes({ extractAttributes, from, to }: { extractAttributes: string[]; from: Element; to: Element }) {
	extractAttributes.forEach((attrName) => {
		const attrValue = from.getAttribute(attrName)

		if (attrValue !== null) {
			to.setAttribute(attrName, attrValue)
		}
	})
}
