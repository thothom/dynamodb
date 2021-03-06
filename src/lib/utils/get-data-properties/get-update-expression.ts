import { isOperator, ThothError } from "@thothom/core";
import { getTypeof, isNotEmptyArray } from "@techmmunity/utils";

import { getColumnMetadata } from "./helpers/get-column-metadata";
import type { KeysMap, ValuesMap } from "./helpers/map-data";

import type { Context } from "../../types/context";

interface GetConditionsExpressionParams<Entity> {
	formattedData: Record<string, any>;
	keysMap: KeysMap;
	valuesMap: ValuesMap;
	context: Context<Entity>;
}

export const getUpdateExpression = <Entity>({
	formattedData,
	keysMap,
	valuesMap,
	context,
}: GetConditionsExpressionParams<Entity>) => {
	const expressions = {
		set: [] as Array<string>,
		remove: [] as Array<string>,
		delete: [] as Array<string>,
		add: [] as Array<string>,
	};

	Object.entries(formattedData).forEach(([key, value]) => {
		const keyAlias = keysMap.get(key)!;
		const valueAlias = valuesMap.get(value)!;

		if (isOperator(value)) {
			switch (value.type) {
				case "plus":
				case "minus":
					expressions.add.push(`${keyAlias} ${valueAlias}`);
					break;

				case "append":
					expressions.set.push(
						`${keyAlias} = list_append(if_not_exists(${keyAlias}, :emptyList), ${valueAlias})`,
					);
					break;

				case "pop": {
					const [val] = value.values;

					if (getTypeof(val) !== "number") {
						throw new ThothError({
							code: "INVALID_PARAM",
							origin: "THOTHOM",
							message: "Invalid param",
							details: [
								"Dynamodb only accept remove items from lists by it's indexes",
								"Values received:",
								value.values,
							],
						});
					}

					expressions.remove.push(
						...(value.values as Array<number>).map(
							idx => `${keyAlias}[${idx}]`,
						),
					);
					break;
				}

				case "ifNotExists":
					expressions.set.push(
						`${keyAlias} = if_not_exists(${keyAlias}, ${valueAlias})`,
					);
					break;

				case "remove":
					expressions.remove.push(`${keyAlias}`);
					break;

				default:
					throw new ThothError({
						code: "NOT_IMPLEMENTED",
						origin: "THOTHOM",
						message: "Invalid SaveOperator",
						details: [`Dynamodb doesn't support SaveOperator "${value.type}"`],
					});
			}

			return;
		}

		const columnMetadata = getColumnMetadata({
			key,
			context,
		});

		const onlyIfNotExists =
			columnMetadata.autoGenerate &&
			columnMetadata.autoGenerateOnlyOnEvents &&
			columnMetadata.autoGenerateOnlyOnEvents.includes("insert") &&
			!columnMetadata.autoGenerateOnlyOnEvents.includes("update");

		if (onlyIfNotExists) {
			expressions.set.push(
				`${keyAlias} = if_not_exists(${keyAlias}, ${valueAlias})`,
			);

			return;
		}

		expressions.set.push(`${keyAlias} = ${valueAlias}`);
	});

	return Object.entries(expressions)
		.reduce((acc, [key, value]) => {
			if (isNotEmptyArray(value)) {
				acc.push(`${key.toUpperCase()} ${value.join(", ")}`);
			}

			return acc;
		}, [] as Array<string>)
		.join(" ");
};
