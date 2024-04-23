import { setChromeStorage } from '@storage/setChromeStorage'
import { useChromeStorage } from '@storage/useChromeStorage'
import { ChangeEvent, useState } from 'react'
import './style.scss'
import { ChromeStorage } from '@models/ChromeStorage'

interface Props {
	extractStyleKey: ChromeStorage['extractStyleKey']
	extractAttributes: ChromeStorage['extractAttributes']
}

const textareaNewLine = '\n'

const styleKeyExample = ['font-size', 'background', 'color'].join('\n')
const attributesExample = ['id', 'style'].join('\n')

export function App(props: Props) {
	const [extractStyleKeyString, setExtractStyleKeyString] = useState(props.extractStyleKey.join(textareaNewLine))
	const [extractAttributesString, setExtractAttributesString] = useState(props.extractAttributes.join(textareaNewLine))

	return (
		<>
			<h1>codeタグから抽出するスタイルのキー(一行ずつ)</h1>
			<div>例</div>
			<textarea className='example' defaultValue={styleKeyExample}></textarea>
			<aside>"font"は指定されていない可能性があるので非推奨です。代わりに"font-size"などを使ってください。</aside>
			<textarea className='main' value={extractStyleKeyString} onChange={handleStyleKeyChange}></textarea>

			<h1>codeタグから抽出する属性のキー(一行ずつ)</h1>
			<div>例</div>
			<textarea className='example' defaultValue={attributesExample}></textarea>
			<textarea className='main' value={extractAttributesString} onChange={handleAttributesChange}></textarea>
		</>
	)

	function handleStyleKeyChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setExtractStyleKeyString(event.target.value)

		const keys = event.target.value.split(textareaNewLine).filter((e) => e !== '')
		setChromeStorage('extractStyleKey', keys)
	}

	function handleAttributesChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setExtractAttributesString(event.target.value)

		const attributes = event.target.value.split(textareaNewLine).filter((e) => e !== '')
		setChromeStorage('extractAttributes', attributes)
	}
}
