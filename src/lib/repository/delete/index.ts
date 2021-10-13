import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { EntityManager } from "@techmmunity/symbiosis";
import type { AfterDeleteParams } from "@techmmunity/symbiosis/lib/repository/methods/after-delete";
import type { BeforeDeleteParams } from "@techmmunity/symbiosis/lib/repository/methods/before-delete";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import type { ColumnExtraMetadata } from "../../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../../types/entity-extra-metadata";
import { validatePrimaryColumns } from "./helpers/validate-primary-columns";

// Used because of problems with `this` in extended classes
interface Context<Entity> {
	beforeDelete: (
		params: BeforeDeleteParams<Entity>,
	) => BeforeDeleteParams<DatabaseEntity>;
	afterDelete: (params: AfterDeleteParams<Entity>) => Promise<number>;
	entity: Entity;
	entityManager: EntityManager<EntityExtraMetadata, ColumnExtraMetadata>;
}

interface Injectables {
	tableName: string;
	connectionInstance: DynamoDBClient;
}

export const del = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{ tableName, connectionInstance }: Injectables,
	{ where: rawWhere, options: rawOptions }: BeforeDeleteParams<Entity>,
) => {
	const { where } = context.beforeDelete({
		where: rawWhere,
		options: rawOptions,
	});

	validatePrimaryColumns({
		entityMetadata: context.entityManager.getEntityMetadata(context.entity),
		primaryColumns: context.entityManager.getEntityPrimaryColumns(
			context.entity,
		),
		where,
	});

	const deleteItemCommand = new DeleteItemCommand({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		TableName: tableName,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		Key: marshall(where),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ReturnValues: "NONE",
	});

	await connectionInstance.send(deleteItemCommand);

	return context.afterDelete({
		dataToReturn: 1,
		where: rawWhere,
		options: rawOptions,
	});
};
