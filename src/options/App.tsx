import { ChromeStorage } from '@models/ChromeStorage'
import { ExtractValueOfStringArray } from '@models/ExtractValueOfStringArray'
import { setChromeStorage } from '@storage/setChromeStorage'
import { useChromeStorage } from '@storage/useChromeStorage'
import { ChangeEvent, useState } from 'react'
import { Aside } from './components/Aside'
import { Button } from './components/Button'
import { H2 } from './components/H2'
import { Link } from './components/Link'
import { Textarea } from './components/Textarea'
import { useColorModeNameForTailwind } from '../hooks/useColorModeNameForTailwind'

interface Props {
	extractStyleKey: ChromeStorage['extractStyleKey']
	extractAttributes: ChromeStorage['extractAttributes']
	disableUrl: ChromeStorage['disableUrl']
	enableUrl: ChromeStorage['enableUrl']
}

const TEXTAREA_NEW_LINE = '\n'
const STYLE_KEY_EXAMPLE = ['font-size', 'background', 'color'].join('\n')
const ATTRIBUTES_EXAMPLE = ['id', 'style'].join('\n')
const REGEX_URL_EXAMPLE = 'https://example\\.com/\\?query=0'

export function App(props: Props) {
	const { styleGetErrorLogList } = useChromeStorage()
	const [colorMode, setColorMode] = useColorModeNameForTailwind()
	const [extractStyleKeyString, setExtractStyleKeyString] = useState(props.extractStyleKey.join(TEXTAREA_NEW_LINE))
	const [extractAttributesString, setExtractAttributesString] = useState(
		props.extractAttributes.join(TEXTAREA_NEW_LINE)
	)
	const [disableUrlString, setDisableUrlString] = useState(props.disableUrl.join(TEXTAREA_NEW_LINE))
	const [enableUrlString, setEnableUrlString] = useState(props.enableUrl.join(TEXTAREA_NEW_LINE))

	return (
		<div className={`${colorMode} dark:bg-gray-900 dark:text-white pt-7 pl-3 pb-10 text-base`}>
			<h1 className='text-3xl'>プログラミングのドキュメントの翻訳を修正 の設定</h1>

			<section className='mt-20'>
				<H2>カラーモードの設定</H2>
				<div className='flex gap-3'>
					<Button onClick={() => setColorMode('light')} className='mt-4'>
						ライトモードに切り替え
					</Button>
					<Button onClick={() => setColorMode('system')} className='mt-4'>
						システム設定を使用
					</Button>
					<Button onClick={() => setColorMode('dark')} className='mt-4'>
						ダークモードに切り替え
					</Button>
				</div>
			</section>

			<nav className='mt-20'>
				<H2>目次</H2>
				<ul className='list-disc ml-6'>
					<li>
						<Link href='#codeタグから抽出するCSSのプロパティ名'>codeタグから抽出するCSSのプロパティ名</Link>
					</li>
					<li>
						<Link href='#codeタグから抽出する属性のキー'>codeタグから抽出する属性のキー</Link>
					</li>
					<li>
						<Link href='#補足されたスタイルのエラー'>補足されたスタイルのエラー</Link>
					</li>
					<li>
						<Link href='#翻訳の修正を無効にするURL'>翻訳の修正を無効にするURL</Link>
					</li>
					<li>
						<Link href='#翻訳の修正を有効にするURL'>翻訳の修正を有効にするURL</Link>
					</li>
				</ul>
			</nav>

			<section className='mt-20'>
				<H2 id='codeタグから抽出するCSSのプロパティ名'>codeタグから抽出するCSSのプロパティ名</H2>

				<div className='mt-4 ml-4'>
					<label className='block w-fit mt-2'>例:</label>
					<Textarea forExample className='w-[200px] h-[80px]' defaultValue={STYLE_KEY_EXAMPLE} />

					<Aside>"font"は指定されていない可能性があるので非推奨です。代わりに"font-size"などを使ってください。</Aside>

					<label className='block w-fit mt-4 fit-content'>
						codeタグから抽出するCSSのプロパティ名(一行ずつ):
						<Textarea
							className='w-[400px] h-[200px]'
							value={extractStyleKeyString}
							onChange={handleTextareaChange(setExtractStyleKeyString)}
						/>
					</label>

					<Button
						className='mt-2'
						onClick={() => handleSaveClick({ storageKey: 'extractStyleKey', textareaValue: extractStyleKeyString })}
					>
						保存
					</Button>
				</div>
			</section>

			<section className='mt-20'>
				<H2 id='codeタグから抽出する属性のキー'>codeタグから抽出する属性のキー</H2>

				<div className='mt-4 ml-4'>
					<label className='block w-fit mt-2'>例:</label>
					<Textarea forExample className='w-[200px] h-[80px]' defaultValue={ATTRIBUTES_EXAMPLE} />

					<label className='block w-fit mt-4'>
						codeタグから抽出する属性のキー(一行ずつ):
						<Textarea
							className='w-[400px] h-[200px]'
							value={extractAttributesString}
							onChange={handleTextareaChange(setExtractAttributesString)}
						/>
					</label>

					<Button
						className='mt-2'
						onClick={() =>
							handleSaveClick({
								storageKey: 'extractAttributes',
								textareaValue: extractAttributesString,
							})
						}
					>
						保存
					</Button>
				</div>
			</section>

			<section className='mt-20'>
				<H2 id='補足されたスタイルのエラー'>補足されたスタイルのエラー</H2>

				<div className='mt-4 ml-4'>
					<Button className='mt-2' onClick={deleteStyleGetErrorLog}>
						エラーのログをすべて削除
					</Button>

					<div className='mt-4'>
						{styleGetErrorLogList.length === 0 && <div className='ml-1 mt-1'>エラーは記録されていません。</div>}

						<div className='border border-gray-700 rounded-md dark:border-gray-300 w-fit'>
							{styleGetErrorLogList.map((errorLog) => {
								return (
									<div
										className={`
										p-2
										border-b
										border-gray-700
										dark:border-gray-300
										w-fit

										last:border-b-0
									`}
										key={errorLog.id}
									>
										{errorLog.messages.map((e, i) => (
											<div key={i}>{e}</div>
										))}
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</section>

			<section className='mt-20'>
				<H2 id='翻訳の修正を無効にするURL'>翻訳の修正を無効にするURL</H2>

				<div className='mt-4 ml-4'>
					<Aside className='mt-4'>
						文字列は正規表現に変換されます。
						<br />
						特殊文字{'.*+?^${}()|[]\\'}
						をエスケープする場合は\を文字の前に挿入してください。
						<br />
						特に?がURLに含まれている時は\?にしてください。
					</Aside>

					<label className='block w-fit mt-4'>例:</label>
					<Textarea forExample className='w-[300px] h-[36px]' defaultValue={REGEX_URL_EXAMPLE} />
					<p>
						<span>https://example.com/?query=0</span>に一致します。
					</p>

					<label className='block w-full mt-8'>
						翻訳の修正を無効にするURL(一行ずつ):
						<Textarea
							className='w-[calc(100%-2em)] h-[200px]'
							value={disableUrlString}
							onChange={handleTextareaChange(setDisableUrlString)}
						></Textarea>
					</label>

					<Button
						className='mt-2'
						onClick={() =>
							handleSaveClick({
								storageKey: 'disableUrl',
								textareaValue: disableUrlString,
							})
						}
					>
						保存
					</Button>
				</div>
			</section>

			<section className='mt-20'>
				<H2 id='翻訳の修正を有効にするURL'>翻訳の修正を有効にするURL</H2>

				<div className='mt-4 ml-4'>
					<ul className='list-disc ml-5'>
						<li className='mt-2'>
							<Aside className='mt-4'>「翻訳の修正を無効にするURL」の設定より優先されます。</Aside>
						</li>

						<li className='mt-4'>
							<Aside className='mt-4'>
								文字列は正規表現に変換されます。
								<br />
								特殊文字{'.*+?^${}()|[]\\'}
								をエスケープする場合は\を文字の前に挿入してください。
								<br />
								特に?がURLに含まれている時は\?にしてください。
							</Aside>

							<label className='block w-fit mt-4'>例:</label>
							<Textarea forExample className='w-[300px] h-[36px]' defaultValue={REGEX_URL_EXAMPLE} />
							<p>
								<span>https://example.com/?query=0</span>に一致します。
							</p>
						</li>
					</ul>

					<label className='block w-full mt-8'>
						翻訳の修正を有効にするURL(一行ずつ):
						<Textarea
							className='w-[calc(100%-2em)] h-[200px]'
							value={enableUrlString}
							onChange={handleTextareaChange(setEnableUrlString)}
						></Textarea>
					</label>

					<Button
						className='mt-2'
						onClick={() => handleSaveClick({ storageKey: 'enableUrl', textareaValue: enableUrlString })}
					>
						保存
					</Button>
				</div>
			</section>
		</div>
	)

	function handleSaveClick(props: {
		storageKey: keyof ExtractValueOfStringArray<ChromeStorage>
		textareaValue: string
	}) {
		const { storageKey, textareaValue } = props

		const array = textareaValue.split(TEXTAREA_NEW_LINE).filter((e) => e !== '')
		setChromeStorage(storageKey, array)
	}

	function handleTextareaChange(setter: React.Dispatch<React.SetStateAction<string>>) {
		return (event: ChangeEvent<HTMLTextAreaElement>) => {
			setter(event.target.value)
		}
	}

	function deleteStyleGetErrorLog() {
		setChromeStorage('styleGetErrorLogList', [])
	}
}
