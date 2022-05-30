/* eslint-disable @typescript-eslint/naming-convention */

import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { ClassType } from "@thothom/core";
import type { BeforeFindInput } from "@thothom/core/lib/repository/methods/find/before";
import { isNotEmptyObject } from "@techmmunity/utils";

import { getStartFrom } from "./helpers/get-start-from";

import { getFindCommand } from "../../utils/get-find-command";
import { getSelect } from "../../utils/get-select";
import { getWhereProperties } from "../../utils/get-where-properties";

import type { Context } from "../../types/context";

export const find = async <Entity>(
	context: Context<Entity>, // Cannot destruct this!!!
	{ conditions: rawConditions, options: rawOptions }: BeforeFindInput<Entity>,
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

	const ExpressionAttributeNames = {
		...ExpressionAttributeNamesSelect,
		...ExpressionAttributeNamesWhere,
	};

	const findCommand = new FindCommandClass({
		TableName: context.tableName,
		ProjectionExpression,
		Limit: take,
		IndexName: index,
		ExclusiveStartKey: getStartFrom<Entity>({
			startFrom,
			context,
		}),
		ExpressionAttributeNames: isNotEmptyObject(ExpressionAttributeNames)
			? ExpressionAttributeNames
			: undefined,
		...whereProps,
	});

	const { Items, LastEvaluatedKey } = await context.connectionInstance.send(
		findCommand,
	);

	const result = Items?.map(item => unmarshall(item)) || [];

	return {
		data: context.afterFind({
			dataToReturn: result as Array<Entity>,
			conditions: rawConditions,
			options: rawOptions,
		}),
		...(LastEvaluatedKey
			? {
					cursor: unmarshall(LastEvaluatedKey) as ClassType<Entity>,
			  }
			: {}),
	};
};
