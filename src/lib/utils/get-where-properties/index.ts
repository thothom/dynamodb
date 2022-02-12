import type { FindConditions } from "@techmmunity/symbiosis";

import { getExpressionAttributeNames } from "./get-expression-attribute-names";
import { getExpressionAttributeValues } from "./get-expression-attribute-values";
import { getFilterExpression } from "./get-filter-expression";
import { getKeyConditionExpression } from "./get-key-condition-expression";
import { getArrayWhere } from "./helpers/get-array-where";
import { getCommonConditions } from "./helpers/get-common-conditions";
import { mapWhere } from "./helpers/map-where";

import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";

export const getWhereProperties = (where?: FindConditions<DatabaseEntity>) => {
	const arrayWhere = getArrayWhere(where);

	if (!arrayWhere) return {};

	const { keysMap, valuesMap } = mapWhere(arrayWhere);
	/*
	 * Need to find common conditions between arrays and use ONLY those keys to filter
	 * https://stackoverflow.com/questions/24275243/writing-dynamodb-or-condition-query#answer-52004052
	 */
	const commonConditions =
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		arrayWhere.length > 1
			? getCommonConditions(arrayWhere)
			: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			  arrayWhere.shift()!;

	return {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ExpressionAttributeValues: getExpressionAttributeValues(valuesMap),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ExpressionAttributeNames: getExpressionAttributeNames(keysMap),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		FilterExpression: getFilterExpression({
			arrayWhere,
			commonConditions,
			keysMap,
			valuesMap,
		}),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		KeyConditionExpression: getKeyConditionExpression({
			arrayWhere,
			commonConditions,
			keysMap,
			valuesMap,
		}),
	};
};
