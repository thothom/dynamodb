import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import type { BeforeDeleteInput } from "@thothom/core/lib/repository/methods/delete/before";

import { validatePrimaryColumns } from "./helpers/validate-primary-columns";

import type { Context } from "../../types/context";

export const del = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{ where: rawWhere, options: rawOptions }: BeforeDeleteInput<Entity>,
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
		TableName: context.tableName,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		Key: marshall(where),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ReturnValues: "NONE",
	});

	await context.connectionInstance.send(deleteItemCommand);

	return {
		data: await context.afterDelete({
			dataToReturn: 1,
			where: rawWhere,
			options: rawOptions,
		}),
	};
};
