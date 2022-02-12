import { marshall } from "@aws-sdk/util-dynamodb";
import type { EntityManager } from "@techmmunity/symbiosis";
import { cleanObj, isEmptyObject } from "@techmmunity/utils";

import { validatePrimaryColumns } from "./validate-primary-columns";

import type { ExtraMetadata } from "../../../types/extra-metadata";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";

export interface GetStartFromParams<Entity> {
	startFrom?: Partial<DatabaseEntity>;
	context: {
		entity: Entity;
		entityManager: EntityManager<ExtraMetadata>;
	};
}

export const getStartFrom = <Entity>({
	startFrom,
	context,
}: GetStartFromParams<Entity>) => {
	if (!startFrom) return;

	const cleanedStartFrom = cleanObj(startFrom);

	if (isEmptyObject(cleanedStartFrom)) return;

	const entityMetadata = context.entityManager.getEntityMetadata(
		context.entity,
	);
	const primaryColumns = context.entityManager.getEntityPrimaryColumns(
		context.entity,
	);

	validatePrimaryColumns({
		startFrom: cleanedStartFrom,
		entityMetadata,
		primaryColumns,
	});

	return marshall(cleanedStartFrom);
};
