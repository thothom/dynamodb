import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { SymbiosisError } from "@techmmunity/symbiosis";
import type { BeforeSaveInput } from "@techmmunity/symbiosis/lib/repository/methods/save/before";

import type { Context } from "../../types/context";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";

export const save = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{ data: rawData, options: rawOptions }: BeforeSaveInput<Entity>,
) => {
	const { data, returnArray } = context.beforeSave({
		data: rawData,
		options: rawOptions,
	});

	const arrayData = Array.isArray(data) ? data : [data];

	const batchWriteItemCommand = new BatchWriteItemCommand({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		RequestItems: {
			[context.tableName]: arrayData.map(d => ({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				PutRequest: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Item: marshall(d),
				},
			})),
		},
	});

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { UnprocessedItems } = await context.connectionInstance.send(
		batchWriteItemCommand,
	);

	const unprocessedItems = UnprocessedItems?.[context.tableName];

	if (unprocessedItems) {
		const unsavedItems = unprocessedItems.map(item =>
			context.entityManager.convertDatabaseToEntity({
				entity: context.entity,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				data: unmarshall(item.PutRequest!.Item!),
			}),
		);

		throw new SymbiosisError({
			code: "UNKNOWN",
			origin: "DATABASE",
			message: "Fail to save the following items",
			details: unsavedItems,
		});
	}

	return context.afterSave({
		// Dynamo doesn't return the new values, so we have to return the same data that we receive
		data: [data as DatabaseEntity],
		returnArray,
		options: rawOptions,
	});
};
