import {
	DynamoDBClient,
	BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
	EntityManager,
	SymbiosisError,
	SymbiosisErrorCodeEnum,
} from "@techmmunity/symbiosis";
import type { AfterSaveParams } from "@techmmunity/symbiosis/lib/repository/methods/after-save";
import type { BeforeSaveParams } from "@techmmunity/symbiosis/lib/repository/methods/before-save";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import type { ColumnExtraMetadata } from "../../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../../types/entity-extra-metadata";

// Used because of problems with `this` in extended classes
interface Context<Entity> {
	beforeSave: (
		params: BeforeSaveParams<Entity>,
	) => BeforeSaveParams<DatabaseEntity>;
	afterSave: (params: AfterSaveParams) => Array<Entity> | Entity;
	entityManager: EntityManager<EntityExtraMetadata, ColumnExtraMetadata>;
	entity: Entity;
}

interface Injectables {
	tableName: string;
	connectionInstance: DynamoDBClient;
}

export const save = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{ tableName, connectionInstance }: Injectables,
	{ data: rawData, options: rawOptions }: BeforeSaveParams<Entity>,
) => {
	const { data } = context.beforeSave({
		data: rawData,
		options: rawOptions,
	});

	const arrayData = Array.isArray(data) ? data : [data];

	const batchWriteItemCommand = new BatchWriteItemCommand({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		RequestItems: {
			[tableName]: arrayData.map(d => ({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				PutRequest: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Item: marshall(d),
				},
			})),
		},
	});

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { UnprocessedItems } = await connectionInstance.send(
		batchWriteItemCommand,
	);

	if (UnprocessedItems) {
		const unsavedItems = UnprocessedItems[tableName].map(item =>
			context.entityManager.convertDatabaseToEntity({
				entity: context.entity,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				data: unmarshall(item.PutRequest!.Item!),
			}),
		);

		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.UNKNOWN,
			origin: "DATABASE",
			message: "Fail to save the following items",
			details: unsavedItems,
		});
	}

	const formattedData = arrayData.map(d =>
		context.entityManager.convertDatabaseToEntity({
			entity: context.entity,
			data: d,
		}),
	);

	return context.afterSave({
		data: formattedData, // Dynamo doesn't return the new values, so we have to return the same data that we receive
		options: rawOptions,
	});
};
