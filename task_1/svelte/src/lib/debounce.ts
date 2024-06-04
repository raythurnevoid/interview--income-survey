import { delay } from './delay';

const cancelMap = new WeakMap<object, DebounceState>();

/**
 *
 * @param key should be a value that is unique in memory, like a function or a symbol.
 * It's used to check if another call happened while the function was waiting on some other promise.
 * @param delay await for this amount of time before proceeding
 * @returns a promise that resolves to a function that returns `true` if the execution has been overlapped by another execution with the same key
 *
 * @example
 * ```js
 * async function myAsyncFn() {
 *     // wait 100ms
 *     const checkIfHasOverlap = await debounce({ key: myAsyncFn, delay: 100 });
 *     // return if another call to this function happened while waiting
 *     if (checkIfHasOverlap()) return;
 *     // fetch data
 *     const res = await fetch('https://example.com');
 *     // return if another call to this function happened while fetching the data
 *     if (checkIfHasOverlap()) return
 *     return res.json();
 * }
 * ```
 */
export function debounce(options: {
	key: Function | symbol | object;
	delay?: number;
}): PromiseLike<() => HasOverlap> {
	const p = new Promise<() => HasOverlap>(async (resolve) => {
		const key = (options.key ?? Symbol('debounce default key')) as any;

		if (cancelMap.has(key)) {
			const state = cancelMap.get(key)!;
			// an existing execution with the defined key already exists
			state.hasOverlap = true;
			state.resolve(() => state.hasOverlap);
			clearTimeout(state.timeout!);
		}

		const state: DebounceState = {
			resolve,
			hasOverlap: false
		};

		cancelMap.set(key, state);

		if (options.delay) {
			await delay(options.delay);
		}

		resolve(() => state.hasOverlap);
	});

	return p;
}

interface DebounceState {
	resolve: (v: () => HasOverlap) => void;
	timeout?: ReturnType<typeof setTimeout> | null;
	hasOverlap: HasOverlap;
}

export type HasOverlap = boolean;
