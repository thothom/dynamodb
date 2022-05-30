import type { BaseExtraMetadata } from "@thothom/core";

import type { ColumnExtraMetadata } from "./column";
import type { EntityExtraMetadata } from "./entity";
import type { IndexExtraMetadata } from "./indexes";
import type { RelationExtraMetadata } from "./relation";

export interface ExtraMetadata extends BaseExtraMetadata {
	column: ColumnExtraMetadata;
	entity: EntityExtraMetadata;
	index: IndexExtraMetadata;
	relation: RelationExtraMetadata;
}
