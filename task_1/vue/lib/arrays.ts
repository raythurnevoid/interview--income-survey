export function filterNonNullish<T>(arr: (T | null | undefined)[]): T[] {
	return arr.filter((item): item is T => item != null);
}
