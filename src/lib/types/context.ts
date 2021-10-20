import type { EntityManager } from "@techmmunity/symbiosis";
import type { AfterDeleteParams } from "@techmmunity/symbiosis/lib/repository/methods/after-delete";
import type { AfterFindParams } from "@techmmunity/symbiosis/lib/repository/methods/after-find";
import type { AfterFindOneParams } from "@techmmunity/symbiosis/lib/repository/methods/after-find-one";
import type { AfterSaveParams } from "@techmmunity/symbiosis/lib/repository/methods/after-save";
import type { BeforeDeleteParams } from "@techmmunity/symbiosis/lib/repository/methods/before-delete";
import type { BeforeFindParams } from "@techmmunity/symbiosis/lib/repository/methods/before-find";
import type { BeforeFindOneParams } from "@techmmunity/symbiosis/lib/repository/methods/before-find-one";
import type { BeforeSaveParams } from "@techmmunity/symbiosis/lib/repository/methods/before-save";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import type { ColumnExtraMetadata } from "./column-extra-metadata";
import type { EntityExtraMetadata } from "./entity-extra-metadata";
import type { IndexExtraMetadata } from "./index-extra-metadata";

// Used because of problems with `this` in extended classes
export interface Context<Entity> {
	beforeFind: (
		params: BeforeFindParams<Entity>,
	) => BeforeFindParams<DatabaseEntity>;
	afterFind: (params: AfterFindParams<Entity>) => Array<Entity>;
	beforeFindOne: (
		params: BeforeFindOneParams<Entity>,
	) => BeforeFindOneParams<DatabaseEntity>;
	afterFindOne: (params: AfterFindOneParams<Entity>) => Entity;
	beforeSave: (
		params: BeforeSaveParams<Entity>,
	) => BeforeSaveParams<DatabaseEntity>;
	afterSave: (params: AfterSaveParams) => any;
	beforeDelete: (
		params: BeforeDeleteParams<Entity>,
	) => BeforeDeleteParams<DatabaseEntity>;
	afterDelete: (params: AfterDeleteParams<Entity>) => Promise<number>;
	entityManager: EntityManager<
		EntityExtraMetadata,
		ColumnExtraMetadata,
		IndexExtraMetadata
	>;
	entity: Entity;
}
