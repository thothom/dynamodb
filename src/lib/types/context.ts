import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { EntityManager, Logger } from "@techmmunity/symbiosis";
import type { AfterDeleteParams } from "@techmmunity/symbiosis/lib/repository/methods/delete/after";
import type {
	BeforeDeleteInput,
	BeforeDeleteOutput,
} from "@techmmunity/symbiosis/lib/repository/methods/delete/before";
import type { AfterFindOneParams } from "@techmmunity/symbiosis/lib/repository/methods/find-one/after";
import type {
	BeforeFindOneInput,
	BeforeFindOneOutput,
} from "@techmmunity/symbiosis/lib/repository/methods/find-one/before";
import type { AfterFindParams } from "@techmmunity/symbiosis/lib/repository/methods/find/after";
import type {
	BeforeFindInput,
	BeforeFindOutput,
} from "@techmmunity/symbiosis/lib/repository/methods/find/before";
import type { AfterSaveParams } from "@techmmunity/symbiosis/lib/repository/methods/save/after";
import type {
	BeforeSaveInput,
	BeforeSaveOutput,
} from "@techmmunity/symbiosis/lib/repository/methods/save/before";
import type { AfterUpsertParams } from "@techmmunity/symbiosis/lib/repository/methods/upsert/after";
import type {
	BeforeUpsertInput,
	BeforeUpsertOutput,
} from "@techmmunity/symbiosis/lib/repository/methods/upsert/before";

import type { ExtraMetadata } from "./extra-metadata";

// Used because of problems with `this` in extended classes
export interface Context<Entity> {
	beforeFind: (params: BeforeFindInput<Entity>) => BeforeFindOutput;
	afterFind: (params: AfterFindParams<Entity>) => Array<Entity>;
	beforeFindOne: (params: BeforeFindOneInput<Entity>) => BeforeFindOneOutput;
	afterFindOne: (params: AfterFindOneParams<Entity>) => Entity;
	beforeSave: (params: BeforeSaveInput<Entity>) => BeforeSaveOutput;
	afterSave: (params: AfterSaveParams) => any;
	beforeUpsert: (params: BeforeUpsertInput<Entity>) => BeforeUpsertOutput;
	afterUpsert: (params: AfterUpsertParams<Entity>) => any;
	beforeDelete: (params: BeforeDeleteInput<Entity>) => BeforeDeleteOutput;
	afterDelete: (params: AfterDeleteParams<Entity>) => Promise<number>;
	entityManager: EntityManager<ExtraMetadata>;
	entity: Entity;
	logger: Logger;
	tableName: string;
	connectionInstance: DynamoDBClient;
}
