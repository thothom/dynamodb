import {
	FindConditions,
	SingleFindConditions,
	SymbiosisError,
	SymbiosisErrorCodeEnum,
} from "@techmmunity/symbiosis";
import type { ColumnMetadata } from "@techmmunity/symbiosis/lib/entity-manager/types/column-metadata";
import type { EntityMetadata } from "@techmmunity/symbiosis/lib/entity-manager/types/entity-metadata";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import type { ColumnExtraMetadata } from "../../../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../../../types/entity-extra-metadata";
import { getTypeof } from "../../../utils/get-typeof";

interface ValidatePrimaryColumns {
	where: FindConditions<DatabaseEntity>;
	primaryColumns: Array<ColumnMetadata<ColumnExtraMetadata>>;
	entityMetadata: EntityMetadata<EntityExtraMetadata, ColumnExtraMetadata>;
}

const throwDefaultError = (extraDetails?: Array<any>) => {
	throw new SymbiosisError({
		code: SymbiosisErrorCodeEnum.INVALID_PARAM,
		origin: "SYMBIOSIS",
		message: "Invalid Params",
		details: [
			"To delete a item in DynamoDB, you must specify ALL AND ONLY the primary columns.",
			...(extraDetails || []),
		],
	});
};

const validateHasTheSameLength = (
	primaryColumns: Array<ColumnMetadata<ColumnExtraMetadata>>,
	whereKeys: Array<string>,
	entityMetadata: EntityMetadata<EntityExtraMetadata, ColumnExtraMetadata>,
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
	primaryColumns: Array<ColumnMetadata<ColumnExtraMetadata>>,
	whereKeys: Array<string>,
	entityMetadata: EntityMetadata<EntityExtraMetadata, ColumnExtraMetadata>,
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
