import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { SymbiosisError } from "@techmmunity/symbiosis";
import type { BeforeUpsertParams } from "@techmmunity/symbiosis/lib/repository/methods/before-upsert";
import type { Context } from "../../types/context";
import { getDataProperties } from "../../utils/get-data-properties";

interface Injectables {
	tableName: string;
	connectionInstance: DynamoDBClient;
}

export const upsert = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{ tableName, connectionInstance }: Injectables,
	{
		conditions: rawConditions,
		data: rawData,
		options: rawOptions,
	}: BeforeUpsertParams<Entity>,
) => {
	const { conditions, data } = context.beforeUpsert({
		conditions: rawConditions,
		data: rawData,
		options: rawOptions,
	});

	const primaryColumnsKeys = context.entityManager
		.getEntityPrimaryColumns(context.entity)
		.map(col => col.databaseName);
	const conditionsKeys = Object.keys(conditions);

	const notPrimaryKeys = primaryColumnsKeys.some(
		key => !conditionsKeys.includes(key),
	);

	if (notPrimaryKeys) {
		throw new SymbiosisError({
			code: "INVALID_PARAM",
			origin: "SYMBIOSIS",
			message: "Invalid params",
			details: ["You only can upsert records by it's primary keys"],
		});
	}

	const dataWithoutPrimaryKeys = Object.entries(data).reduce(
		(acc, [key, value]) => {
			if (primaryColumnsKeys.includes(key)) return acc;

			acc[key] = value;

			return acc;
		},
		{} as Record<string, any>,
	);

	const updateProps = getDataProperties<Entity>({
		data: dataWithoutPrimaryKeys,
		context,
	});

	const updateItemCommand = new UpdateItemCommand({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		TableName: tableName,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		Key: marshall(conditions),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ReturnValues: "ALL_NEW",
		...updateProps,
	});

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { Attributes } = await connectionInstance.send(updateItemCommand);

	if (!Attributes) {
		throw new SymbiosisError({
			code: "OPERATION_FAILED",
			origin: "DATABASE",
			message: "Operation failed",
			details: ["Fail to update item using the primary keys:", rawData],
		});
	}

	return context.afterUpsert({
		conditions: rawConditions,
		data: unmarshall(Attributes),
		options: rawOptions,
	});
};
