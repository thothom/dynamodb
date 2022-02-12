import type {
	FindConditions,
	SingleFindConditions,
} from "@techmmunity/symbiosis";
import { SymbiosisError } from "@techmmunity/symbiosis";
import { getTypeof } from "@techmmunity/utils";

import type { ExtraMetadata } from "../../../types/extra-metadata";
import type { ColumnMetadata } from "@techmmunity/symbiosis/lib/entity-manager/types/column-metadata";
import type { EntityMetadata } from "@techmmunity/symbiosis/lib/entity-manager/types/entity-metadata";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";

interface ValidatePrimaryColumns {
	where: FindConditions<DatabaseEntity>;
	primaryColumns: Array<ColumnMetadata<ExtraMetadata["column"]>>;
	entityMetadata: EntityMetadata<ExtraMetadata>;
}

const throwDefaultError = (extraDetails?: Array<any>) => {
	throw new SymbiosisError({
		code: "INVALID_PARAM",
		origin: "SYMBIOSIS",
		message: "Invalid Params",
		details: [
			"To delete a item in DynamoDB, you must specify ALL AND ONLY the primary columns.",
			...(extraDetails || []),
		],
	});
};

const validateHasTheSameLength = (
	primaryColumns: Array<ColumnMetadata<ExtraMetadata["column"]>>,
	whereKeys: Array<string>,
	entityMetadata: EntityMetadata<ExtraMetadata>,
) => {
	if (whereKeys.length !== primaryColumns.length) {
		return throwDefaultError([
			`In the entity "${
				entityMetadata.name
			}", the primary columns are: ${primaryColumns
				.map(column => column.name)
				.join(", ")}`,
		]);
	}
};

const validateAreTheSamePrimaryKeys = (
	primaryColumns: Array<ColumnMetadata<ExtraMetadata["column"]>>,
	whereKeys: Array<string>,
	entityMetadata: EntityMetadata<ExtraMetadata>,
) => {
	const primaryColumnsKeys = primaryColumns.map(col => col.databaseName);

	const notAreTheSameKeys = primaryColumnsKeys.some(
		key => !whereKeys.includes(key),
	);

	if (notAreTheSameKeys) {
		return throwDefaultError([
			`In the entity "${
				entityMetadata.name
			}", the primary columns are: ${primaryColumns
				.map(column => column.name)
				.join(", ")}`,
		]);
	}
};

const validateValues = (where: SingleFindConditions<DatabaseEntity>) => {
	Object.values(where).forEach(val => {
		switch (getTypeof(val)) {
			case "boolean":
			case "number":
			case "string":
				return;
			default:
				return throwDefaultError([
					'The only types of values accepted for this method are "boolean", "number" and "string"',
				]);
		}
	});
};

export const validatePrimaryColumns = ({
	where,
	primaryColumns,
	entityMetadata,
}: ValidatePrimaryColumns) => {
	if (Array.isArray(where)) {
		return throwDefaultError(["You can only delete one record at time."]);
	}

	const whereKeys = Object.keys(where);

	validateHasTheSameLength(primaryColumns, whereKeys, entityMetadata);

	validateAreTheSamePrimaryKeys(primaryColumns, whereKeys, entityMetadata);

	validateValues(where);
};
