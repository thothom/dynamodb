/* eslint-disable @typescript-eslint/naming-convention */

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { AfterFindParams } from "@techmmunity/symbiosis/lib/repository/methods/after-find";
import type { BeforeFindParams } from "@techmmunity/symbiosis/lib/repository/methods/before-find";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import { getWhereProperties } from "../../utils/get-where-properties";

// Used because of problems with `this` in extended classes
interface Context<Entity> {
	beforeFind: (
		params: BeforeFindParams<Entity>,
	) => BeforeFindParams<DatabaseEntity>;
	afterFind: (params: AfterFindParams<Entity>) => Array<Entity>;
}

interface Injectables {
	tableName: string;
	connectionInstance: DynamoDBClient;
}

export const find = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{ tableName, connectionInstance }: Injectables,
	{ conditions: rawConditions, options: rawOptions }: BeforeFindParams<Entity>,
) => {
	const { conditions } = context.beforeFind({
		conditions: rawConditions,
		options: rawOptions,
	});

	const { where, select, take } = conditions;

	const queryCommand = new QueryCommand({
		TableName: tableName,
		AttributesToGet: select,
		Limit: take,
		...getWhereProperties(where),
	});

	const { Items } = await connectionInstance.send(queryCommand);

	const result = Items?.map(item => unmarshall(item));

	return context.afterFind({
		dataToReturn: result as Array<Entity>,
		conditions: rawConditions,
		options: rawOptions,
	});
};
