import { getConditionsExpression } from "./helpers/get-conditions-expression";
import type { KeysMap, ValuesMap } from "./helpers/map-where";

interface GetFilterExpressionParams {
	arrayWhere: Array<Record<string, any>>;
	commonConditions: Record<string, any>;
	keysMap: KeysMap;
	valuesMap: ValuesMap;
}

export const getFilterExpression = ({
	arrayWhere,
	commonConditions,
	keysMap,
	valuesMap,
}: GetFilterExpressionParams) => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	if (!arrayWhere || arrayWhere.length <= 1) return;

	const commonConditionsKeys = Object.keys(commonConditions);

	return arrayWhere
		.map(singleWhere => {
			const filteredConditionsEntries = Object.entries(singleWhere).filter(
				([key]) => !commonConditionsKeys.includes(key),
			);
			const filteredConditions = Object.fromEntries(filteredConditionsEntries);

			const conditionExpression = getConditionsExpression({
				formattedWhere: filteredConditions,
				keysMap,
				valuesMap,
			});

			return `(${conditionExpression})`;
		})
		.join(" or ");
};
