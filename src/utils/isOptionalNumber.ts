import { isNumber } from './isNumber'
import { isUndefined } from './isUndefined'

export function isOptionalNumber(e: any) {
	return isUndefined(e) || isNumber(e)
}
