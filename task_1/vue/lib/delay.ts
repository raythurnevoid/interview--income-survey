/**
 * Returns a promise that resolves after a delay
 */
export function delay(ms: number) {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});
}
