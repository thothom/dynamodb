import { arrayUniqueValues } from "../array-unique-values";
import { KeysMap } from "./helpers/map-where";

export const getExpressionAttributeNames = (keysMap: KeysMap) => {
	const keys: Array<string> = [];
	keysMap.forEach((_, key) =>
		keys.push(...key.replace(/\[\]/g, "").split(".")),
	);

	const uniqueKeys = arrayUniqueValues(keys);

	const keysEntriesToReturn = uniqueKeys.map(key => [`#${key}`, key]);

	return Object.fromEntries(keysEntriesToReturn);
};
