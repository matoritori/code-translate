import { ChromeStorageKey } from '@models/ChromeStorage'
import { StyleGetErrorLog } from '@models/StyleGetErrorLog'
import { message as messageProtocol } from '@root/message/message'
import { getChromeStorage } from '@storage/getChromeStorage'
import { setChromeStorage } from '@storage/setChromeStorage'
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

const NAME_PREFIX = 'code-translate-'
/**
 * ::beforeの中身用
 */
const TEXT_REFERENCE_ATTRIBUTE_NAME = NAME_PREFIX + 'data-text-content-' + uuid()
const INSERTED_STYLE_ELMENET_CLASSNAME = NAME_PREFIX + 'style'
const REPLACE_ELEMENT_ATTRIBUTE_NAME = NAME_PREFIX + 'data-replace-element'
const REPLACED_CODE_CLASSNAME = NAME_PREFIX + 'replaced-code'
const INDICATE_ORIGIN_ELEMENT_ATTRIBUTE_NAME = NAME_PREFIX + 'data-replaced'
const INDICATE_REPLACED_ELEMENT_ATTRIBUTE_NAME = NAME_PREFIX + 'data-replaced-by'

/** キーがスタイルで、値がクラス名。スタイルが同じならクラス名は同じのを使う(節約のため)*/
const STYLE_MAP = new Map<string, string>()

function generateReplaceElementStyleClassname() {
	return NAME_PREFIX + 'span-' + uuid()
}

function generateReplacePairId() {
	return NAME_PREFIX + 'replace-pair-' + uuid()
}

changeCodeToSpan()

chrome.runtime.onMessage.addListener((message) => {
	if (message === messageProtocol.historyChanged) {
		STYLE_MAP.clear()
		changeCodeToSpan()
	}

	return undefined
})

chrome.storage.local.onChanged.addListener((changes) => {
	const changedDataKeys = Object.keys(changes)
	const restyleKeys: ChromeStorageKey[] = ['extractAttributes', 'extractStyleKey']
	const changeKeppOriginalKey: ChromeStorageKey = 'keepOriginalKeyword'
	const isKeepOriginalChanged = changedDataKeys.includes(changeKeppOriginalKey)

	if (restyleKeys.some((e) => changedDataKeys.includes(e))) {
		restyleReplaceElements()
	}
	if (isKeepOriginalChanged) {
		handleChangeKeepOriginalKeyword()
	}
})

async function restyleReplaceElements() {
	STYLE_MAP.clear()
	removeAllOldStyleElement()

	const styleGetErrorLogSet = new Set<string>()

	const { extractAttributes, extractStyleKey, keepOriginalKeyword } = await getChromeStorage()

	const replaceElements = document.querySelectorAll(`[${REPLACE_ELEMENT_ATTRIBUTE_NAME}]`)

	replaceElements.forEach((replaceElement) => {
		replaceElement.setAttribute('class', '')
		replaceElement.setAttribute(REPLACE_ELEMENT_ATTRIBUTE_NAME, '')

		const originCodeElementId = replaceElement.getAttribute(INDICATE_ORIGIN_ELEMENT_ATTRIBUTE_NAME)
		if (originCodeElementId === null) {
			return
		}

		const codeElement = document.querySelector(`[${INDICATE_REPLACED_ELEMENT_ATTRIBUTE_NAME}="${originCodeElementId}"]`)
		if (codeElement === null || !(codeElement instanceof HTMLElement)) {
			return
		}

		codeElement.style.removeProperty('display')

		const extractedCodeStyle = constructStyleValue(getComputedStyle(codeElement), extractStyleKey, styleGetErrorLogSet)
		const savedStylingClassname = STYLE_MAP.get(extractedCodeStyle)

		if (savedStylingClassname !== undefined) {
			replaceElement.classList.add(savedStylingClassname)
		} else {
			const className = generateReplaceElementStyleClassname()
			replaceElement.classList.add(className)
			STYLE_MAP.set(extractedCodeStyle, className)
		}

		codeElement.style.setProperty('display', 'none')

		copyAttributes({ extractAttributes, from: codeElement, to: replaceElement })
	})

	setStyle({ keepOriginalKeyword: keepOriginalKeyword })

	addStyleGetErrorLogToStorage(styleGetErrorLogSet)
}

async function handleChangeKeepOriginalKeyword() {
	const { keepOriginalKeyword } = await getChromeStorage()

	removeAllOldStyleElement()

	setStyle({ keepOriginalKeyword: keepOriginalKeyword })

	document.querySelectorAll(`[${REPLACE_ELEMENT_ATTRIBUTE_NAME}]`).forEach((insertedElement) => {
		const originalKeyword = insertedElement.getAttribute(TEXT_REFERENCE_ATTRIBUTE_NAME)

		if (originalKeyword === null) {
			return
		}

		insertedElement.textContent = originalKeyword
	})
}

async function changeCodeToSpan() {
	const { extractAttributes, extractStyleKey, keepOriginalKeyword } = await getChromeStorage()

	const codeElementsInSentence = [...document.querySelectorAll(`code:not(.${REPLACED_CODE_CLASSNAME})`)]
		.filter((e): e is HTMLElement => e instanceof HTMLElement)
		.filter((codeElement) => codeElement.children.length === 0)

	/**
	 * 改行したほうが見やすそうな場合は\nで区切る。後で\nでsplitしてstring[]にする
	 */
	const styleGetErrorLogSet = new Set<string>()

	codeElementsInSentence.forEach((codeElement) => {
		const replaceElement = document.createElement('span')
		const replacePairId = generateReplacePairId()
		const extractedCodeStyle = constructStyleValue(getComputedStyle(codeElement), extractStyleKey, styleGetErrorLogSet)
		const codeTextContent = codeElement.textContent ?? ''
		const savedStylingClassname = STYLE_MAP.get(extractedCodeStyle)

		codeElement.classList.add(REPLACED_CODE_CLASSNAME)
		codeElement.style.setProperty('display', 'none')
		codeElement.insertAdjacentElement('afterend', replaceElement)
		codeElement.setAttribute(INDICATE_REPLACED_ELEMENT_ATTRIBUTE_NAME, replacePairId)

		replaceElement.setAttribute(REPLACE_ELEMENT_ATTRIBUTE_NAME, '')
		replaceElement.textContent = codeTextContent
		replaceElement.setAttribute(TEXT_REFERENCE_ATTRIBUTE_NAME, codeTextContent)
		replaceElement.setAttribute(INDICATE_ORIGIN_ELEMENT_ATTRIBUTE_NAME, replacePairId)

		if (savedStylingClassname !== undefined) {
			replaceElement.classList.add(savedStylingClassname)
		} else {
			const className = generateReplaceElementStyleClassname()
			replaceElement.classList.add(className)
			STYLE_MAP.set(extractedCodeStyle, className)
		}

		copyAttributes({ extractAttributes, from: codeElement, to: replaceElement })
	})

	// 以前追加した<style>を削除
	removeAllOldStyleElement()

	setStyle({ keepOriginalKeyword: keepOriginalKeyword })

	addStyleGetErrorLogToStorage(styleGetErrorLogSet)
}

function removeAllOldStyleElement() {
	const styleElements = [...document.querySelectorAll('.' + INSERTED_STYLE_ELMENET_CLASSNAME)]

	styleElements.forEach((e) => e.remove())
}

/**
 *
 * @param errorLogSet stringは改行したほうが見やすそうな場合は\nで区切る。後で\nでsplitしてstring[]にする
 */
function addStyleGetErrorLogToStorage(errorLogSet: Set<string>) {
	if (errorLogSet.size > 0) {
		const asStorageErrorLog: StyleGetErrorLog[] = [...errorLogSet].map((str) => {
			return {
				id: uuid(),
				messages: str.split('\n'),
			}
		})

		getChromeStorage().then(({ styleGetErrorLogList }) => {
			const log = [...asStorageErrorLog, ...styleGetErrorLogList].splice(0, 30)
			setChromeStorage('styleGetErrorLogList', log)
		})
	}
}

function setStyle({ keepOriginalKeyword }: { keepOriginalKeyword: boolean }) {
	// 集約したスタイルをドキュメントに挿入する
	STYLE_MAP.forEach((value, key) => {
		const [className, style] = [value, key]

		const styleElement = document.createElement('style')
		const styleElementContent: string = (() => {
			if (keepOriginalKeyword) {
				return `
					.${className}::before {
						content:attr(${TEXT_REFERENCE_ATTRIBUTE_NAME});
						${style}
					}
					.${className} {
						color: transparent;
						font-size: 0px;
					}
			`
			} else {
				return `
					.${className} {
						${style}
					}
				`
			}
		})().replace(/^\t{5}/gm, '')

		styleElement.textContent = styleElementContent
		styleElement.classList.add(INSERTED_STYLE_ELMENET_CLASSNAME)
		document.head.append(styleElement)
	})
}

function constructStyleValue(style: CSSStyleDeclaration, extractStyleKey: string[], errorLogSet: Set<string>) {
	const result = extractStyleKey
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

function copyAttributes({ extractAttributes, from, to }: { extractAttributes: string[]; from: Element; to: Element }) {
	extractAttributes.forEach((attrName) => {
		const attrValue = from.getAttribute(attrName)

		if (attrValue !== null) {
			to.setAttribute(attrName, attrValue)
		}
	})
}
