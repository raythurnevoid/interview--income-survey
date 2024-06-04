export class Issue<T extends Record<any, any>> {
	constructor(public readonly issue: T) {}
}
