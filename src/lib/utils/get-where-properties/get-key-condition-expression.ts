import { SymbiosisError, SymbiosisErrorCodeEnum } from "@techmmunity/symbiosis";
import { isEmptyObject } from "@techmmunity/utils";
import { getConditionsExpression } from "./helpers/get-conditions-expression";
import { KeysMap, ValuesMap } from "./helpers/map-where";

interface GetKeyConditionExpressionParams {
	arrayWhere: Array<Record<string, any>>;
	commonConditions: Record<string, any>;
	keysMap: KeysMap;
	valuesMap: ValuesMap;
}

export const getKeyConditionExpression = ({
	arrayWhere,
	commonConditions,
	keysMap,
	valuesMap,
}: GetKeyConditionExpressionParams) => {
	if (!arrayWhere) return;

	if (isEmptyObject(commonConditions)) {
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.INVALID_PARAM,
			origin: "SYMBIOSIS",
			message: "Invalid params",
			details: [
				"To make queries with OR condition with DynamoDB, you need to have at least 1 property in common between the conditions",
				"See more about it at: https://stackoverflow.com/questions/24275243/writing-dynamodb-or-condition-query#answer-52004052",
			],
		});
	}

	return getConditionsExpression({
		formattedWhere: commonConditions,
		keysMap,
		valuesMap,
	});
};
