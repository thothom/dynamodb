/* eslint-disable @typescript-eslint/naming-convention */

import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { BeforeFindOneInput } from "@techmmunity/symbiosis/lib/repository/methods/find-one/before";

import { getFindCommand } from "../../utils/get-find-command";
import { getSelect } from "../../utils/get-select";
import { getWhereProperties } from "../../utils/get-where-properties";

import type { Context } from "../../types/context";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";

export const findOne = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{
		conditions: rawConditions,
		options: rawOptions,
	}: BeforeFindOneInput<Entity>,
) => {
	const { conditions } = context.beforeFindOne({
		conditions: rawConditions,
		options: rawOptions,
	});

	const { select, where, index } = conditions;

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
	const queryCommand = new FindCommandClass({
		TableName: context.tableName,
		ProjectionExpression,
		Limit: 1,
		IndexName: index,
		ExpressionAttributeNames: {
			...ExpressionAttributeNamesSelect,
			...ExpressionAttributeNamesWhere,
		},
		...whereProps,
	});

	const { Items } = await context.connectionInstance.send(queryCommand);

	const item = Items?.shift();

	const result = item ? unmarshall(item) : undefined;

	return {
		data: context.afterFindOne({
			dataToReturn: result as DatabaseEntity,
			conditions: rawConditions,
			options: rawOptions,
		}),
	};
};
