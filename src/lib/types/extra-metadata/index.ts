import { BaseExtraMetadata } from "@techmmunity/symbiosis";
import { ColumnExtraMetadata } from "./column";
import { EntityExtraMetadata } from "./entity";
import { IndexExtraMetadata } from "./indexes";
import { RelationExtraMetadata } from "./relation";

export interface ExtraMetadata extends BaseExtraMetadata {
	column: ColumnExtraMetadata;
	entity: EntityExtraMetadata;
	index: IndexExtraMetadata;
	relation: RelationExtraMetadata;
}
