import { StyleGetErrorLog } from '@models/StyleGetErrorLog'
import { getChromeStorage } from '@storage/getChromeStorage'
import { setChromeStorage } from '@storage/setChromeStorage'
import { v4 as uuid } from 'uuid'

/**
 *
 * @param errorLogSet stringは改行したほうが見やすそうな場合は\nで区切る。後で\nでsplitしてstring[]にする
 */
export function addStyleGetErrorLogToStorage(errorLogSet: Set<string>) {
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
