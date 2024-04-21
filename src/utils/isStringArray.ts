import { isString } from './isString'

export function isStringArray(input: any): input is string[] {
	return Array.isArray(input) && input.every((e) => isString(e))
}
