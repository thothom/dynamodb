import { getAlias } from "../../get-alias";

export const mapData = (data: Record<string, any>) => {
	const keysMap = new Map<string, string>();
	const valuesMap = new Map<string, Map<any, string>>();

	Object.entries(data).forEach(([key, value]) => {
		if (!keysMap.get(key)) {
			keysMap.set(
				key,
				key
					.split(".")
					.map(keySplitted => getAlias(keySplitted, "#UPDATE"))
					.join("."),
			);
		}

		if (!valuesMap.get(key)) {
			valuesMap.set(key, new Map<any, string>());
		}

		const mapOfValuesWithSameKey = valuesMap.get(key);

		if (!mapOfValuesWithSameKey?.get(value)) {
			mapOfValuesWithSameKey?.set(
				value,
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				`${getAlias(key, ":UPDATE")}${mapOfValuesWithSameKey.size + 1}`,
			);
		}
	});

	return { keysMap, valuesMap };
};

/**
 * Map<key, keyAlias>
 */
export type KeysMap = Map<string, string>;

/**
 * Map<key, Map<value, valueAlias>>
 */
export type ValuesMap = Map<string, Map<any, string>>;
