import { isArrayEvery } from '@utils/isArrayEvery'
import { isString } from '@utils/isString'

export interface StyleGetErrorLog {
	id: string
	messages: string[]
}

export function isStyleGetErrorLog(e: any): e is StyleGetErrorLog {
	return isString(e?.id) && isArrayEvery(e?.messages, isString)
}

export function isStyleGetErrorLogList(e: any): e is StyleGetErrorLog[] {
	return isArrayEvery(e, isStyleGetErrorLog)
}
