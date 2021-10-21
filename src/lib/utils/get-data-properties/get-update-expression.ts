import { FindOperator } from "@techmmunity/symbiosis";
import { isNotEmptyArray } from "@techmmunity/utils";
import { Context } from "../../types/context";
import type {
	KeysMap,
	ValuesMap,
} from "../get-where-properties/helpers/map-where";
import { getColumnMetadata } from "./helpers/get-column-metadata";

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
	const val = {
		set: [] as Array<string>,
		remove: [] as Array<string>,
		delete: [] as Array<string>,
		add: [] as Array<string>,
	};

	Object.entries(formattedData).forEach(([key, value]) => {
		const columnMetadata = getColumnMetadata({
			key,
			context,
		});

		const keyAlias = keysMap.get(key)!;
		const valueAlias = valuesMap.get(key)!.get(value)!;

		if (value instanceof FindOperator) {
			// Handle this
			return "";
		}

		const onlyIfNotExists =
			columnMetadata.autoGenerate &&
			columnMetadata.autoGenerateOnlyOnEvents &&
			columnMetadata.autoGenerateOnlyOnEvents.includes("save");

		const valueFormatted = onlyIfNotExists
			? `if_not_exists(${keyAlias}, ${valueAlias})`
			: valueAlias;

		val.set.push(`${keyAlias} = ${valueFormatted}`);
	});

	return Object.entries(val)
		.reduce((acc, [key, value]) => {
			if (isNotEmptyArray(value)) {
				acc.push(`${key.toUpperCase()} ${value.join(", ")}`);
			}

			return acc;
		}, [] as Array<string>)
		.join(" ");
};
