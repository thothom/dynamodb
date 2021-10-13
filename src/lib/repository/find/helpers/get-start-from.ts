import { marshall } from "@aws-sdk/util-dynamodb";
import { EntityManager } from "@techmmunity/symbiosis";
import { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import type { ColumnExtraMetadata } from "../../../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../../../types/entity-extra-metadata";
import { validatePrimaryColumns } from "./validate-primary-columns";

export interface GetStartFromParams<Entity> {
	startFrom?: Partial<DatabaseEntity>;
	context: {
		entity: Entity;
		entityManager: EntityManager<EntityExtraMetadata, ColumnExtraMetadata>;
	};
}

export const getStartFrom = <Entity>({
	startFrom,
	context,
}: GetStartFromParams<Entity>) => {
	if (!startFrom) return;

	const entityMetadata = context.entityManager.getEntityMetadata(
		context.entity,
	);
	const primaryColumns = context.entityManager.getEntityPrimaryColumns(
		context.entity,
	);

	validatePrimaryColumns({
		startFrom,
		entityMetadata,
		primaryColumns,
	});

	return marshall(startFrom);
};
