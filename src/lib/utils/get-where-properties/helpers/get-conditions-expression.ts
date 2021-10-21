import { isOperator, SymbiosisError } from "@techmmunity/symbiosis";
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
			const valueAlias = valuesMap.get(key)!.get(value)!;

			if (isOperator(value)) {
				switch (value.type) {
					case "between":
						return `(${keyAlias} BETWEEN ${valueAlias}A AND ${valueAlias}B)`;
					case "lessThan":
						return `(${keyAlias} < ${valueAlias})`;
					case "lessThanOrEqual":
						return `(${keyAlias} <= ${valueAlias})`;
					case "moreThan":
						return `(${keyAlias} > ${valueAlias})`;
					case "moreThanOrEqual":
						return `(${keyAlias} >= ${valueAlias})`;
					case "startsWith":
						return `(begins_with(${keyAlias}, ${valueAlias}))`;
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
			}

			return `(${keyAlias} = ${valueAlias})`;
		})
		.filter(Boolean)
		.join(" and ");
