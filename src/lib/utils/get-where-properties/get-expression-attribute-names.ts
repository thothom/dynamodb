import { KeysMap } from "./helpers/map-where";

export const getExpressionAttributeNames = (keysMap: KeysMap) => {
	const objects: Array<Record<string, string>> = [];

	keysMap.forEach((keyAlias, key) => {
		const keysSplitted = key.replace(/\[\]/g, "").split(".");
		const keysAliasesSplitted = keyAlias.replace(/\[\]/g, "").split(".");

		const objKeyValue = Object.fromEntries(
			keysAliasesSplitted.map((val, idx) => [val, keysSplitted[idx]]),
		);

		objects.push(objKeyValue);
	});

	return objects.reduce((acc, cur) => ({
		...acc,
		...cur,
	}));
};
