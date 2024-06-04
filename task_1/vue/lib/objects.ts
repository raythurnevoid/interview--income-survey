export function excludePropertiesFromArray<T extends Record<string, unknown>>(arr: T[], ...props: (keyof T)[]): T[] {
	return arr.map((obj) => {
		const copy = { ...obj };
		for (const prop of props) {
			delete copy[prop];
		}
		return copy;
	});
}
