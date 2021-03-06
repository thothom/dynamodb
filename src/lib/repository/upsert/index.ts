import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ThothError } from "@thothom/core";
import type { BeforeUpsertInput } from "@thothom/core/lib/repository/methods/upsert/before";

import { getDataProperties } from "../../utils/get-data-properties";

import type { Context } from "../../types/context";

export const upsert = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{
		conditions: rawConditions,
		data: rawData,
		options: rawOptions,
	}: BeforeUpsertInput<Entity>,
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
		throw new ThothError({
			code: "INVALID_PARAM",
			origin: "THOTHOM",
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
		TableName: context.tableName,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		Key: marshall(conditions),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ReturnValues: "ALL_NEW",
		...updateProps,
	});

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { Attributes } = await context.connectionInstance.send(
		updateItemCommand,
	);

	if (!Attributes) {
		throw new ThothError({
			code: "OPERATION_FAILED",
			origin: "DATABASE",
			message: "Operation failed",
			details: ["Fail to update item using the primary keys:", rawConditions],
		});
	}

	return {
		data: context.afterUpsert({
			conditions: rawConditions,
			data: unmarshall(Attributes),
			options: rawOptions,
		}),
	};
};
