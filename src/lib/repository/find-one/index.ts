/* eslint-disable @typescript-eslint/naming-convention */

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { AfterFindOneParams } from "@techmmunity/symbiosis/lib/repository/methods/after-find-one";
import type { BeforeFindOneParams } from "@techmmunity/symbiosis/lib/repository/methods/before-find-one";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import { getSelect } from "../../utils/get-select";
import { getWhereProperties } from "../../utils/get-where-properties";

// Used because of problems with `this` in extended classes
interface Context<Entity> {
	beforeFindOne: (
		params: BeforeFindOneParams<Entity>,
	) => BeforeFindOneParams<DatabaseEntity>;
	afterFindOne: (params: AfterFindOneParams<Entity>) => Entity;
}

interface Injectables {
	tableName: string;
	connectionInstance: DynamoDBClient;
}

export const findOne = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{ tableName, connectionInstance }: Injectables,
	{
		conditions: rawConditions,
		options: rawOptions,
	}: BeforeFindOneParams<Entity>,
) => {
	const { conditions } = context.beforeFindOne({
		conditions: rawConditions,
		options: rawOptions,
	});

	const { select, where } = conditions;

	const {
		ProjectionExpression,
		ExpressionAttributeNames: ExpressionAttributeNamesSelect,
	} = getSelect(select);

	const {
		ExpressionAttributeNames: ExpressionAttributeNamesWhere,
		...whereProps
	} = getWhereProperties(where);

	const queryCommand = new QueryCommand({
		TableName: tableName,
		ProjectionExpression,
		Limit: 1,
		ExpressionAttributeNames: {
			...ExpressionAttributeNamesSelect,
			...ExpressionAttributeNamesWhere,
		},
		...whereProps,
	});

	const { Items } = await connectionInstance.send(queryCommand);

	const item = Items?.shift();

	const result = item ? unmarshall(item) : undefined;

	return context.afterFindOne({
		dataToReturn: result as Entity,
		conditions: rawConditions,
		options: rawOptions,
	});
};
