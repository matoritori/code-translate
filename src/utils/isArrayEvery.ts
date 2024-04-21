import { isArray } from './isArray'

export function isArrayEvery<T>(
	e: any[],
	typeGuard: (e: any) => e is T
): e is T[] {
	return isArray(e) && e.every(typeGuard)
}
