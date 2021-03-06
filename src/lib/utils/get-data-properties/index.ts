import { formatWhere } from "../get-where-properties/helpers/get-array-where";

import { getExpressionAttributeNames } from "./get-expression-attribute-names";
import { getExpressionAttributeValues } from "./get-expression-attribute-values";
import { getUpdateExpression } from "./get-update-expression";
import { mapData } from "./helpers/map-data";

import type { Context } from "../../types/context";

interface GetDataPropertiesParams<Entity> {
	data: Record<string, any>;
	context: Context<Entity>;
}

export const getDataProperties = <Entity = any>({
	data,
	context,
}: GetDataPropertiesParams<Entity>) => {
	if (!data) return {};

	const formattedData = formatWhere(data);

	const { keysMap, valuesMap } = mapData(formattedData);

	return {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ExpressionAttributeValues: getExpressionAttributeValues(valuesMap),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ExpressionAttributeNames: getExpressionAttributeNames(keysMap),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		UpdateExpression: getUpdateExpression<Entity>({
			context,
			formattedData,
			keysMap,
			valuesMap,
		}),
	};
};
