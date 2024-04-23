import { setChromeStorage } from '@storage/setChromeStorage'
import { useChromeStorage } from '@storage/useChromeStorage'
import { ChangeEvent } from 'react'

interface Props {}

export function App(props: Props) {
	const {} = props
	const { keepOriginalKeyword } = useChromeStorage()

	return (
		<div id='container'>
			<div>
				<label>
					元のキーワードを保持する
					<input type='checkbox' checked={keepOriginalKeyword} onChange={handleChange} />
				</label>
			</div>
			<aside>
				補足説明:
				<br />
				英語のキーワードは稀に日本語に翻訳されますが、チェックを入れると元のまま表示されます。
				<br />
				ただし、チェックを入れた場合キーワードの選択が面倒になります。
				<br />
				キーワードを選択してコピーなどしたいときは、キーワードの前後の文章を含めてドラッグしてください。
				<br />
				(これはcode要素をspan要素とその擬似要素で置き換えて、擬似要素を画面に表示することで元の文章の表示を実現しているためです)
			</aside>
		</div>
	)

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setChromeStorage('keepOriginalKeyword', event.target.checked)
	}
}
