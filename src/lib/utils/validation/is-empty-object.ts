export const isEmptyObject = (value: any) =>
	typeof value === "object" &&
	!Array.isArray(value) &&
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	Object.keys(value).length < 1;
