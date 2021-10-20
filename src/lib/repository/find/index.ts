/* eslint-disable @typescript-eslint/naming-convention */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { BeforeFindParams } from "@techmmunity/symbiosis/lib/repository/methods/before-find";
import type { Context } from "../../types/context";
import { getFindCommand } from "../../utils/get-find-command";
import { getSelect } from "../../utils/get-select";
import { getWhereProperties } from "../../utils/get-where-properties";
import { getStartFrom } from "./helpers/get-start-from";

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

	const { where, select, take, startFrom, index } = conditions;

	const {
		ProjectionExpression,
		ExpressionAttributeNames: ExpressionAttributeNamesSelect,
	} = getSelect(select);

	const {
		ExpressionAttributeNames: ExpressionAttributeNamesWhere,
		...whereProps
	} = getWhereProperties(where);

	const FindCommandClass = getFindCommand<Entity>({
		where,
		context,
		index,
		skipSortKey: true,
	});

	const findCommand = new FindCommandClass({
		TableName: tableName,
		ProjectionExpression,
		Limit: take,
		IndexName: index,
		ExclusiveStartKey: getStartFrom<Entity>({
			startFrom,
			context,
		}),
		ExpressionAttributeNames: {
			...ExpressionAttributeNamesSelect,
			...ExpressionAttributeNamesWhere,
		},
		...whereProps,
	});

	const { Items } = await connectionInstance.send(findCommand);

	const result = Items?.map(item => unmarshall(item)) || [];

	return context.afterFind({
		dataToReturn: result as Array<Entity>,
		conditions: rawConditions,
		options: rawOptions,
	});
};
