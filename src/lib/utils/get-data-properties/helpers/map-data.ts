import { getAlias } from "../../get-alias";

export const mapData = (formattedData: Record<string, any>) => {
	const keysMap = new Map<string, string>();
	const valuesMap = new Map<any, string>();

	Object.entries(formattedData).forEach(([key, value]) => {
		keysMap.set(
			key,
			key
				.split(".")
				.map(keySplitted => getAlias(keySplitted, "#UPDATE"))
				.join("."),
		);

		valuesMap.set(value, getAlias(key, ":UPDATE"));
	});

	return { keysMap, valuesMap };
};

/**
 * Map<key, keyAlias>
 */
export type KeysMap = Map<string, string>;

/**
 * Map<value, valueAlias>
 */
export type ValuesMap = Map<any, string>;
