const getValueAlias = (key: string) =>
	key
		.replace(/\./g, "_")
		.replace(/\[\]/g, "")
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

export const mapWhere = (arrayWhere: Array<Record<string, any>>) => {
	const keysMap = new Map<string, string>();
	const valuesMap = new Map<string, Map<any, string>>();

	arrayWhere.forEach(singleWhere =>
		Object.entries(singleWhere).forEach(([key, value]) => {
			if (!keysMap.get(key)) {
				keysMap.set(
					key,
					key
						.split(".")
						.map(keySplitted => `#${keySplitted}`)
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
					`:${getValueAlias(key)}${mapOfValuesWithSameKey.size + 1}`,
				);
			}
		}),
	);

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
