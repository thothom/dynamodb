import { Connection } from "@techmmunity/symbiosis";
import { ExampleRepository } from "../repository";
import { ColumnExtraMetadata } from "../types/column-extra-metadata";
import { EntityExtraMetadata } from "../types/entity-extra-metadata";

export class ExampleConnection extends Connection<
	EntityExtraMetadata,
	ColumnExtraMetadata
> {
	public getRepository<Entity>(entity: Entity) {
		return new ExampleRepository(entity);
	}
}
