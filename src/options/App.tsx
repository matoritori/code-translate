import { ChromeStorage } from '@models/ChromeStorage'
import { setChromeStorage } from '@storage/setChromeStorage'
import { ChangeEvent, useState } from 'react'
import './style.scss'
import { useChromeStorage } from '@storage/useChromeStorage'

interface Props {
	extractStyleKey: ChromeStorage['extractStyleKey']
	extractAttributes: ChromeStorage['extractAttributes']
}

const TEXTAREA_NEW_LINE = '\n'
const STYLE_KEY_EXAMPLE = ['font-size', 'background', 'color'].join('\n')
const ATTRIBUTES_EXAMPLE = ['id', 'style'].join('\n')

export function App(props: Props) {
	const { styleGetErrorLogList } = useChromeStorage()
	const [extractStyleKeyString, setExtractStyleKeyString] = useState(props.extractStyleKey.join(TEXTAREA_NEW_LINE))
	const [extractAttributesString, setExtractAttributesString] = useState(
		props.extractAttributes.join(TEXTAREA_NEW_LINE)
	)

	return (
		<>
			<h1>codeタグから抽出するスタイルのキー(一行ずつ)</h1>
			<div>例</div>
			<textarea className='example' defaultValue={STYLE_KEY_EXAMPLE} />
			<aside>"font"は指定されていない可能性があるので非推奨です。代わりに"font-size"などを使ってください。</aside>
			<label>
				codeタグから抽出するスタイルのキー(一行ずつ):
				<textarea className='main' value={extractStyleKeyString} onChange={handleStyleKeyChange} />
			</label>
			<button onClick={handleExtractStyleKeySaveClick}>保存</button>

			<h1>codeタグから抽出する属性のキー(一行ずつ)</h1>
			<div>例</div>
			<textarea className='example' defaultValue={ATTRIBUTES_EXAMPLE} />

			<label>
				codeタグから抽出するスタイルのキー(一行ずつ):
				<textarea className='main' value={extractAttributesString} onChange={handleAttributesChange} />
			</label>
			<button onClick={handleExtractAttributesSaveClick}>保存</button>

			<h1>補足されたスタイルのエラー</h1>
			<div>
				{styleGetErrorLogList.map((errorLog) => {
					return (
						<div className='error-row' key={errorLog.id}>
							{errorLog.messages.map((e, i) => (
								<div key={i}>{e}</div>
							))}
						</div>
					)
				})}
			</div>
		</>
	)

	function handleExtractStyleKeySaveClick() {
		const keys = extractStyleKeyString.split(TEXTAREA_NEW_LINE).filter((e) => e !== '')
		setChromeStorage('extractStyleKey', keys)
	}

	function handleExtractAttributesSaveClick() {
		const attributes = extractAttributesString.split(TEXTAREA_NEW_LINE).filter((e) => e !== '')
		setChromeStorage('extractAttributes', attributes)
	}

	function handleStyleKeyChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setExtractStyleKeyString(event.target.value)
	}

	function handleAttributesChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setExtractAttributesString(event.target.value)
	}
}
