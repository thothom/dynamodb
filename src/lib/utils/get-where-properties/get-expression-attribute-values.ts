import { marshall } from "@aws-sdk/util-dynamodb";
import { isOperator, SymbiosisError } from "@techmmunity/symbiosis";
import { ValuesMap } from "./helpers/map-where";

export const getExpressionAttributeValues = (valuesMap: ValuesMap) => {
	const valuesEntriesToReturn: Array<[string, any]> = [];

	valuesMap.forEach(valueMap => {
		valueMap.forEach((valueAlias, value) => {
			if (isOperator(value)) {
				switch (value.type) {
					case "between": {
						const [val1, val2] = value.values;
						valuesEntriesToReturn.push([`${valueAlias}A`, val1]);
						valuesEntriesToReturn.push([`${valueAlias}B`, val2]);
						break;
					}
					case "lessThan":
					case "lessThanOrEqual":
					case "moreThan":
					case "moreThanOrEqual":
					case "startsWith": {
						const [val] = value.values;
						valuesEntriesToReturn.push([valueAlias, val]);
						break;
					}
					default:
						throw new SymbiosisError({
							code: "NOT_IMPLEMENTED",
							origin: "SYMBIOSIS",
							message: "Invalid FindOperator",
							details: [
								`Dynamodb doesn't support FindOperator "${value.type}"`,
							],
						});
				}
			} else {
				valuesEntriesToReturn.push([valueAlias, value]);
			}
		});
	});

	return marshall(Object.fromEntries(valuesEntriesToReturn));
};
