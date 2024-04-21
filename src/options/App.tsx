import { setChromeStorage } from '@storage/setChromeStorage'
import { useChromeStorage } from '@storage/useChromeStorage'
import { ChangeEvent } from 'react'
import './style.scss'

interface Props {}

const textareaNewLine = '\n'

const styleKeyExample = ['font', 'background', 'color'].join('\n')
const attributesExample = ['id', 'style'].join('\n')

export function App(props: Props) {
	const {} = props
	const { extractStyleKey, extractAttributes } = useChromeStorage()
	const extractStyleKeyString = extractStyleKey.join(textareaNewLine)
	const extractAttributesString = extractAttributes.join(textareaNewLine)

	return (
		<>
			<h1>codeタグから抽出するスタイルのキー(一行ずつ)</h1>
			<div>例</div>
			<textarea className='example' defaultValue={styleKeyExample}></textarea>
			<textarea className='main' value={extractStyleKeyString} onChange={handleStyleKeyChange}></textarea>

			<h1>codeタグから抽出する属性のキー(一行ずつ)</h1>
			<div>例</div>
			<textarea className='example' defaultValue={attributesExample}></textarea>
			<textarea className='main' value={extractAttributesString} onChange={handleAttributesChange}></textarea>
		</>
	)

	function handleStyleKeyChange(event: ChangeEvent<HTMLTextAreaElement>) {
		const keys = event.target.value.split(textareaNewLine).filter((e) => e !== '')

		setChromeStorage('extractStyleKey', keys)
	}

	function handleAttributesChange(event: ChangeEvent<HTMLTextAreaElement>) {
		const attributes = event.target.value.split(textareaNewLine).filter((e) => e !== '')

		setChromeStorage('extractAttributes', attributes)
	}
}
