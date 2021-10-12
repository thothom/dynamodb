import { FindOperator } from "@techmmunity/symbiosis";
import { KeysMap, ValuesMap } from "./map-where";

interface GetConditionsExpressionParams {
	formattedWhere: Record<string, any>;
	keysMap: KeysMap;
	valuesMap: ValuesMap;
}

export const getConditionsExpression = ({
	formattedWhere,
	keysMap,
	valuesMap,
}: GetConditionsExpressionParams) =>
	Object.entries(formattedWhere)
		.map(([key, value]) => {
			const keyAlias = keysMap.get(key)!;

			if (value instanceof FindOperator) {
				// Handle this
				return "";
			}

			const valueAlias = valuesMap.get(key)!.get(value)!;

			return `(${keyAlias} = ${valueAlias})`;
		})
		.filter(Boolean)
		.join(" and ");
