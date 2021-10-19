import { QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { EntityManager, FindConditions } from "@techmmunity/symbiosis";
import { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import { getTypeof, isEmptyArray, isEmptyObject } from "@techmmunity/utils";
import { ColumnExtraMetadata } from "../../types/column-extra-metadata";
import { EntityExtraMetadata } from "../../types/entity-extra-metadata";

interface GetWhereCommandParams<Entity> {
	where?: FindConditions<DatabaseEntity>;
	context: {
		entity: Entity;
		entityManager: EntityManager<EntityExtraMetadata, ColumnExtraMetadata>;
	};
	skipSortKey?: boolean;
}

export const getFindCommand = <Entity>({
	where,
	context,
	skipSortKey,
}: GetWhereCommandParams<Entity>) => {
	if (!where || isEmptyObject(where) || isEmptyArray(where)) {
		return ScanCommand;
	}

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
