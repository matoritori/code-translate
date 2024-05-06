import { setChromeStorage } from '@storage/setChromeStorage'
import { useChromeStorage } from '@storage/useChromeStorage'
import { ChangeEvent, useState } from 'react'

export function App() {
	return (
		<div id='container'>
			<ExecReplaceInput />
			<hr />
			<KeepOriginalKeywordInput />
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

function KeepOriginalKeywordInput() {
	const { keepOriginalKeyword } = useChromeStorage()

	return (
		<div>
			<div>
				<label>
					元のキーワードを保持する
					<input
						type='checkbox'
						checked={keepOriginalKeyword}
						onChange={handleChange}
						aria-describedby='元のキーワードを保持するについて'
					/>
				</label>
			</div>
			<details>
				<summary>元のキーワードを保持するの説明</summary>
				<p id='元のキーワードを保持するについて'>
					英語のキーワードは稀に日本語に翻訳されますが、チェックを入れると元のまま表示されます。
					<br />
					ただし、チェックを入れた場合キーワードの選択が面倒になります。
					<br />
					キーワードを選択してコピーなどしたいときは、キーワードの前後の文章を含めてドラッグしてください。
					<br />
					(これはcode要素をspan要素とその擬似要素で置き換えて、擬似要素を画面に表示することで元の文章の表示を実現しているためです)
				</p>
			</details>
		</div>
	)

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setChromeStorage('keepOriginalKeyword', event.target.checked)
	}
}
