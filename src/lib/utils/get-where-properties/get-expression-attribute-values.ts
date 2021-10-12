import { marshall } from "@aws-sdk/util-dynamodb";
import { ValuesMap } from "./helpers/map-where";

export const getExpressionAttributeValues = (valuesMap: ValuesMap) => {
	const valuesEntriesToReturn: Array<[string, any]> = [];

	valuesMap.forEach(valueMap => {
		valueMap.forEach((valueAlias, value) => {
			valuesEntriesToReturn.push([valueAlias, value]);
		});
	});

	return marshall(Object.fromEntries(valuesEntriesToReturn));
};
