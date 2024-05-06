import { setChromeStorage } from '@storage/setChromeStorage'
import { useChromeStorage } from '@storage/useChromeStorage'
import { ChangeEvent, useState } from 'react'

export function App() {
	return (
		<div id='container'>
			<ExecReplaceInput />
		</div>
	)
}

function ExecReplaceInput() {
	const { execReplace } = useChromeStorage()
	const [onceCheckboxClicked, setOnceCheckboxClicked] = useState<boolean>(false)

	return (
		<div>
			<label>
				code要素をspan要素に置き換える
				<input type='checkbox' checked={execReplace} onChange={handleChange} />
			</label>

			{onceCheckboxClicked && execReplace === false && (
				<p className='warn-for-exec-replace'>
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
