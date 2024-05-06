import { ChromeStorageKey } from '@models/ChromeStorage'
import { message as messageProtocol } from '@root/message/message'
import { getChromeStorage } from '@storage/getChromeStorage'
import { v4 as uuid } from 'uuid'
import { constructStyleValue } from './constructStyleValue'
import { copyAttributes } from './copyAttributes'
import { addStyleGetErrorLogToStorage } from './addStyleGetErrorLogToStorage'
import { isHTMLElement } from '@utils/isHTMLElement'

const NAME_PREFIX = 'code-translate-'

/**
 * 置き換え元(code)のtextContentを記憶するための属性。
 * <code>client</code>ならば、
 * <span {TEXT_REFERENCE_ATTRIBUTE_NAME}="client"/>になる。
 * ※例は置き換えた要素がspanの場合
 */
const TEXT_REFERENCE_ATTRIBUTE_NAME = NAME_PREFIX + 'data-text-content-' + uuid()

/**
 * codeを置き換えた要素(span)用の<style>要素のクラス名。削除するときに使う。
 */
const INSERTED_STYLE_ELMENET_CLASSNAME = NAME_PREFIX + 'style'

/**
 * 拡張機能が挿入したspan要素に付けるクラス名
 */
const REPLACE_ELEMENT_CLASSNAME = NAME_PREFIX + 'data-replace-element'

/**
 * 置き換えられたcode要素に付けるクラス名
 */
const REPLACED_CODE_CLASSNAME = NAME_PREFIX + 'replaced-code'

/**
 * 置き換えた要素(span)が置き換え元の要素(code)を見つけるための属性名
 */
const INDICATE_ORIGIN_ELEMENT_ATTRIBUTE_NAME = NAME_PREFIX + 'data-replaced'

/**
 * 置き換えた要素(span)が置き換え元の要素(code)を見つけるための属性名
 */
const INDICATE_REPLACED_ELEMENT_ATTRIBUTE_NAME = NAME_PREFIX + 'data-replaced-by'

/** キーがスタイルで、値がクラス名。スタイルが同じならクラス名は同じのを使う(節約のため)*/
const STYLE_MAP = new Map<string, string>()

function generateReplaceElementStyleClassname() {
	return NAME_PREFIX + 'span-' + uuid()
}

function generateReplacePairId() {
	return NAME_PREFIX + 'replace-pair-' + uuid()
}

getChromeStorage().then((storage) => {
	changeCodeToSpan(storage.execReplace)
})

chrome.runtime.onMessage.addListener((message) => {
	if (message === messageProtocol.historyChanged) {
		STYLE_MAP.clear()
		getChromeStorage().then((storage) => {
			changeCodeToSpan(storage.execReplace)
		})
	}

	return undefined
})

chrome.storage.local.onChanged.addListener((changes) => {
	const changedDataKeys = Object.keys(changes)
	const restyleKeys: ChromeStorageKey[] = ['extractAttributes', 'extractStyleKey']
	const execReplaceKey: ChromeStorageKey = 'execReplace'
	const isShouldRestyle = restyleKeys.some((e) => changedDataKeys.includes(e))
	const isExecReplaceChanged = changedDataKeys.includes(execReplaceKey)

	if (isShouldRestyle) {
		restyleReplaceElements()
	}
	if (isExecReplaceChanged) {
		getChromeStorage().then((storage) => {
			changeCodeToSpan(storage.execReplace)
		})
	}
})

/**
 * 抽出するスタイル/属性のキーのリストが変更された時に、置き換えた要素(span)のスタイル/属性を元の要素(code)から抽出し直す
 */
async function restyleReplaceElements() {
	STYLE_MAP.clear()
	removeAllOldStyleElement()

	/**
	 * getComputedStyle(code要素)して、"font"などを参照して値がないとき、エラーとして記録する
	 * options_pageから参照できる
	 */
	const styleGetErrorLogSet = new Set<string>()

	const { extractAttributes, extractStyleKey } = await getChromeStorage()

	const replaceElements = document.querySelectorAll(`.${REPLACE_ELEMENT_CLASSNAME}`)

	replaceElements.forEach((replaceElement) => {
		replaceElement.setAttribute('class', '')

		const originCodeElementId = replaceElement.getAttribute(INDICATE_ORIGIN_ELEMENT_ATTRIBUTE_NAME)
		if (originCodeElementId === null) {
			return
		}

		const codeElement = document.querySelector(`[${INDICATE_REPLACED_ELEMENT_ATTRIBUTE_NAME}="${originCodeElementId}"]`)
		if (codeElement === null || !isHTMLElement(codeElement)) {
			return
		}

		codeElement.style.removeProperty('display')

		const extractedCodeStyle = constructStyleValue({
			style: getComputedStyle(codeElement),
			extractKeys: extractStyleKey,
			errorLogSet: styleGetErrorLogSet,
		})

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

	setStyle()

	addStyleGetErrorLogToStorage(styleGetErrorLogSet)
}

async function changeCodeToSpan(execReplace: boolean) {
	if (!execReplace) return

	const { extractAttributes, extractStyleKey } = await getChromeStorage()

	const codeElementsInSentence = [...document.querySelectorAll(`code:not(.${REPLACED_CODE_CLASSNAME})`)]
		.filter(isHTMLElement)
		.filter((codeElement) => codeElement.children.length === 0)

	/**
	 * 改行したほうが見やすそうな場合は\nで区切る。後で\nでsplitしてstring[]にする
	 */
	const styleGetErrorLogSet = new Set<string>()

	codeElementsInSentence.forEach((codeElement) => {
		const replaceElement = document.createElement('span')
		const replacePairId = generateReplacePairId()
		const extractedCodeStyle = constructStyleValue({
			style: getComputedStyle(codeElement),
			extractKeys: extractStyleKey,
			errorLogSet: styleGetErrorLogSet,
		})
		const codeTextContent = codeElement.textContent ?? ''

		codeElement.classList.add(REPLACED_CODE_CLASSNAME)
		codeElement.style.setProperty('display', 'none')
		codeElement.insertAdjacentElement('afterend', replaceElement)
		codeElement.setAttribute(INDICATE_REPLACED_ELEMENT_ATTRIBUTE_NAME, replacePairId)

		replaceElement.classList.add(REPLACE_ELEMENT_CLASSNAME)
		replaceElement.textContent = codeTextContent
		replaceElement.setAttribute(TEXT_REFERENCE_ATTRIBUTE_NAME, codeTextContent)
		replaceElement.setAttribute(INDICATE_ORIGIN_ELEMENT_ATTRIBUTE_NAME, replacePairId)

		const savedStylingClassname = STYLE_MAP.get(extractedCodeStyle)

		if (savedStylingClassname !== undefined) {
			replaceElement.classList.add(savedStylingClassname)
		} else {
			const className = generateReplaceElementStyleClassname()
			replaceElement.classList.add(className)
			STYLE_MAP.set(extractedCodeStyle, className)
		}

		copyAttributes({ extractAttributes, from: codeElement, to: replaceElement })

		new MutationObserver((mutations) => {
			const [mutation] = mutations
			const { attributeName, target: element } = mutation

			if (attributeName === '_istranslated' && element instanceof HTMLElement) {
				const originTextContent = element.getAttribute(TEXT_REFERENCE_ATTRIBUTE_NAME)

				// translate="no"なしでtextContentを置き換えると、瞬時に再翻訳される
				element.setAttribute('translate', 'no')

				element.textContent = originTextContent
			}
		}).observe(replaceElement, { attributes: true })
	})

	// 以前追加した<style>を削除
	removeAllOldStyleElement()

	setStyle()

	addStyleGetErrorLogToStorage(styleGetErrorLogSet)
}

function removeAllOldStyleElement() {
	const styleElements = [...document.querySelectorAll('.' + INSERTED_STYLE_ELMENET_CLASSNAME)]

	styleElements.forEach((e) => e.remove())
}

function setStyle() {
	// 集約したスタイルをドキュメントに挿入する
	STYLE_MAP.forEach((value, key) => {
		const [className, style] = [value, key]

		const styleElement = document.createElement('style')
		const styleElementContent: string = `
				.${className} {
					${style}
				}`.replace(/^\t{4}/gm, '')

		styleElement.textContent = styleElementContent
		styleElement.classList.add(INSERTED_STYLE_ELMENET_CLASSNAME)
		document.head.append(styleElement)
	})
}
