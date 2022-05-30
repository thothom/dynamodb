import { QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import type { EntityManager, FindConditions } from "@thothom/core";
import { getTypeof, isEmptyArray, isEmptyObject } from "@techmmunity/utils";

import type { ExtraMetadata } from "../../types/extra-metadata";
import type { DatabaseEntity } from "@thothom/core/lib/types/database-entity";

interface GetWhereCommandParams<Entity> {
	where?: FindConditions<DatabaseEntity>;
	context: {
		entity: Entity;
		entityManager: EntityManager<ExtraMetadata>;
	};
	skipSortKey?: boolean;
	index?: string;
}

export const getFindCommand = <Entity>({
	where,
	context,
	skipSortKey,
	index,
}: GetWhereCommandParams<Entity>) => {
	if (!where || isEmptyObject(where) || isEmptyArray(where)) {
		return ScanCommand;
	}

	if (index) return QueryCommand;

	const arrayWhere = Array.isArray(where) ? where : [where];

	const hasAllPrimaryKeys = context.entityManager
		.getEntityPrimaryColumns(context.entity)
		.map(col => {
			if (skipSortKey && col.extras?.sortKey) {
				// eslint-disable-next-line array-callback-return
				return;
			}

			return col.databaseName;
		})
		.filter(Boolean)
		.every(key =>
			arrayWhere.every(
				singleWhere =>
					getTypeof(singleWhere[key as keyof typeof singleWhere]) !==
					"undefined",
			),
		);

	if (hasAllPrimaryKeys) {
		return QueryCommand;
	}

	return ScanCommand;
};
