import { marshall } from "@aws-sdk/util-dynamodb";
import { isOperator, SymbiosisError } from "@techmmunity/symbiosis";
import { ValuesMap } from "./helpers/map-data";

export const getExpressionAttributeValues = (valuesMap: ValuesMap) => {
	const valuesEntriesToReturn: Array<[string, any]> = [];

	valuesMap.forEach((valueAlias, value) => {
		if (isOperator(value)) {
			switch (value.type) {
				case "ifNotExists":
				case "plus": {
					const [val] = value.values;
					valuesEntriesToReturn.push([valueAlias, val]);

					return;
				}
				case "minus": {
					const [val] = value.values;
					// eslint-disable-next-line @typescript-eslint/no-magic-numbers
					valuesEntriesToReturn.push([valueAlias, val * -1]);

					return;
				}
				case "append": {
					valuesEntriesToReturn.push([valueAlias, value.values]);

					return;
				}
				case "remove":
				case "pop":
					return;
				default:
					throw new SymbiosisError({
						code: "NOT_IMPLEMENTED",
						origin: "SYMBIOSIS",
						message: "Invalid SaveOperator",
						details: [`Dynamodb doesn't support SaveOperator "${value.type}"`],
					});
			}
		}

		valuesEntriesToReturn.push([valueAlias, value]);
	});

	return marshall(Object.fromEntries(valuesEntriesToReturn));
};
