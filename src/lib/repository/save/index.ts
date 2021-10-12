import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import type { AfterSaveParams } from "@techmmunity/symbiosis/lib/repository/methods/after-save";
import type { BeforeSaveParams } from "@techmmunity/symbiosis/lib/repository/methods/before-save";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";

// Used because of problems with `this` in extended classes
interface Context<Entity> {
	beforeSave: (
		params: BeforeSaveParams<Entity>,
	) => BeforeSaveParams<DatabaseEntity>;
	afterSave: (params: AfterSaveParams) => Array<Entity> | Entity;
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
	const { data, options } = context.beforeSave({
		data: rawData,
		options: rawOptions,
	});

	const putItemCommand = new PutItemCommand({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		TableName: tableName,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		Item: marshall(data),
	});

	await connectionInstance.send(putItemCommand);

	return context.afterSave({
		data, // Dynamo doesn't return the new values, so we have to return the same data that we receive
		options,
	});
};
