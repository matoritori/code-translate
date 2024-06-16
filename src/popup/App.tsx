import { canExecInCurrentUrl, isMatchedDisableUrl } from '@root/libs/canExecInCurrentUrl'
import { message } from '@root/message/message'
import { setChromeStorage } from '@storage/setChromeStorage'
import { useChromeStorage } from '@storage/useChromeStorage'
import { ChangeEvent, useState } from 'react'
import { useCurrentTabUrl } from './useCurrentTabUrl'
import { useColorModeNameForTailwind } from '@root/hooks/useColorModeNameForTailwind'
import { Checkbox } from './components/Checkbox'
import { Button } from './components/Button'
import { Hr } from './components/Hr'
import { Textarea } from './components/Textarea'
import { Aside } from './components/Aside'

export function App() {
	const currentTabUrl = useCurrentTabUrl()
	const [colorMode] = useColorModeNameForTailwind()

	return (
		<div
			className={`
				${colorMode}
				min-w-[300px]
				text-base
				dark:bg-gray-900 dark:text-white
				px-4
				border
				border-gray-700 dark:border-gray-300
			`}
		>
			<ExecReplaceInput />
			<Hr />
			{currentTabUrl && <ConfigureExecutionByUrl currentTabUrl={currentTabUrl} />}
			<ExecuteNowOnly />
		</div>
	)
}

function ExecuteNowOnly() {
	const { enableUrl, disableUrl, execReplace } = useChromeStorage()
	const currentTabUrl = useCurrentTabUrl()

	if (currentTabUrl === undefined) return <></>

	const canExecInCurrentUrlResult = canExecInCurrentUrl({
		currentUrl: currentTabUrl,
		disableUrl,
		enableUrl,
	})

	// 今実行可能状態ならこのボタンは必要ないので表示しない
	if (execReplace && canExecInCurrentUrlResult.canExec) return <></>

	return (
		<>
			<Hr />
			<div className='p-4 flex'>
				<Button onClick={handleClick} className='mx-auto'>
					今だけ翻訳を修正する
				</Button>
			</div>
		</>
	)

	async function handleClick() {
		try {
			const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })

			if (tab.id) {
				chrome.tabs.sendMessage(tab.id, message.executeNowOnly)
			}
		} catch (e) {
			console.error(e)
		}
	}
}

function ExecReplaceInput() {
	const { execReplace } = useChromeStorage()
	const [onceCheckboxClicked, setOnceCheckboxClicked] = useState<boolean>(false)

	return (
		<div className='my-4'>
			<label className='flex items-center text-nowrap'>
				翻訳を修正する
				<Checkbox type='checkbox' checked={execReplace} onChange={handleChange} />
			</label>

			{onceCheckboxClicked && execReplace === false && (
				<p className='mt-1.5 ml-1.5 text-sm'>
					対象のページのcode要素がすでに置き換えられている場合、ページを再読み込みしてください。
				</p>
			)}
		</div>
	)

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setChromeStorage('execReplace', event.target.checked)
		setOnceCheckboxClicked(true)
	}
}

/**
 * @param currentTabUrl useCurrentTabUrlの返り値string|undefinedではなく、stringの状態で受け取りたい
 */
function ConfigureExecutionByUrl({ currentTabUrl }: { currentTabUrl: string }) {
	/**
	 * https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex#answer-6969486
	 */
	const transformedCurrentTabUrlForRegex = currentTabUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const { enableUrl, disableUrl } = useChromeStorage()
	const [textareaText, setTextareaText] = useState(transformedCurrentTabUrlForRegex)

	const canExecInCurrentUrlResult = canExecInCurrentUrl({
		currentUrl: currentTabUrl,
		disableUrl,
		enableUrl,
	})
	const textareaId = 'regexEdit'
	const containerClassName = 'my-4'

	if (!canExecInCurrentUrlResult.canExec) {
		return (
			<div className={containerClassName}>
				翻訳の修正は無効になっています。
				<Aside>このページは、翻訳の修正を無効にするURLの設定により、機能を停止しています。</Aside>
				<div className='mt-2'>
					<Button className='text-sm' onClick={cancelDisapproval}>
						不許可を取り消す
					</Button>
				</div>
				<div className='mt-2'>
					<Button className='text-sm' onClick={() => chrome.runtime.openOptionsPage()}>
						オプションページで詳しく設定する
					</Button>
				</div>
			</div>
		)
	} else if (canExecInCurrentUrlResult.reason === 'matchedEnableUrl') {
		if (isMatchedDisableUrl(currentTabUrl, disableUrl)) {
			return (
				<div className={containerClassName}>
					このページは翻訳の修正を<b>有効</b>にするURLに一致するため、
					<br />
					無効にするURLの設定を上書きして機能が有効になっています。
					<div className='mt-2'>
						<Button className='text-sm' onClick={cancelApproval}>
							許可を取り消す
						</Button>
					</div>
					<div className='mt-2'>
						<Button className='text-sm' onClick={() => chrome.runtime.openOptionsPage()}>
							オプションページで詳しく設定する
						</Button>
					</div>
				</div>
			)
		} else {
			return <></>
		}
	} else {
		return (
			<div className={containerClassName}>
				<label htmlFor={textareaId}>このURLで拡張機能を実行しないようにする</label>
				<Textarea
					className='w-full mt-2'
					id={textareaId}
					value={textareaText}
					onChange={handleTextareaChange}
					name='text'
				/>
				<Button className='mt-2 text-sm' onClick={handleAddToDisableUrl}>
					不許可URLとして追加
				</Button>
			</div>
		)
	}

	function cancelDisapproval() {
		const newDisableUrl = disableUrl.filter((e) => {
			if (new RegExp(e).test(currentTabUrl)) {
				return false
			} else {
				return true
			}
		})

		setChromeStorage('disableUrl', newDisableUrl)
	}

	function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setTextareaText(event.target.value)
	}

	function handleAddToDisableUrl() {
		const newDisableUrl = [...disableUrl, textareaText]
		setChromeStorage('disableUrl', newDisableUrl)
	}

	function cancelApproval() {
		const newEnableUrl = enableUrl.filter((e) => {
			if (new RegExp(e).test(currentTabUrl)) {
				return false
			} else {
				return true
			}
		})

		setChromeStorage('enableUrl', newEnableUrl)
	}
}
