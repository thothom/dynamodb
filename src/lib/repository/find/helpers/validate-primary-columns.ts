import {
	SingleFindConditions,
	SymbiosisError,
	SymbiosisErrorCodeEnum,
} from "@techmmunity/symbiosis";
import type { ColumnMetadata } from "@techmmunity/symbiosis/lib/entity-manager/types/column-metadata";
import type { EntityMetadata } from "@techmmunity/symbiosis/lib/entity-manager/types/entity-metadata";
import type { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import { getTypeof } from "@techmmunity/utils";
import type { ColumnExtraMetadata } from "../../../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../../../types/entity-extra-metadata";

interface ValidatePrimaryColumns {
	startFrom: Partial<DatabaseEntity>;
	primaryColumns: Array<ColumnMetadata<ColumnExtraMetadata>>;
	entityMetadata: EntityMetadata<EntityExtraMetadata, ColumnExtraMetadata>;
}

const throwDefaultError = (extraDetails?: Array<any>) => {
	throw new SymbiosisError({
		code: SymbiosisErrorCodeEnum.INVALID_PARAM,
		origin: "SYMBIOSIS",
		message: "Invalid Params",
		details: [
			"To use the startFrom option, you must specify ALL AND ONLY the primary columns of the last value of previous operation.",
			...(extraDetails || []),
		],
	});
};

const validateHasTheSameLength = (
	primaryColumns: Array<ColumnMetadata<ColumnExtraMetadata>>,
	startFromKeys: Array<string>,
	entityMetadata: EntityMetadata<EntityExtraMetadata, ColumnExtraMetadata>,
) => {
	if (startFromKeys.length !== primaryColumns.length) {
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
	startFromKeys: Array<string>,
	entityMetadata: EntityMetadata<EntityExtraMetadata, ColumnExtraMetadata>,
) => {
	const primaryColumnsKeys = primaryColumns.map(col => col.databaseName);

	const notAreTheSameKeys = primaryColumnsKeys.some(
		key => !startFromKeys.includes(key),
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

const validateValues = (startFrom: SingleFindConditions<DatabaseEntity>) => {
	Object.values(startFrom).forEach(val => {
		switch (getTypeof(val)) {
			case "number":
			case "string":
				return;
			default:
				return throwDefaultError([
					'The only types of values accepted for this method are "number" and "string"',
				]);
		}
	});
};

export const validatePrimaryColumns = ({
	startFrom,
	primaryColumns,
	entityMetadata,
}: ValidatePrimaryColumns) => {
	const startFromKeys = Object.keys(startFrom);

	validateHasTheSameLength(primaryColumns, startFromKeys, entityMetadata);

	validateAreTheSamePrimaryKeys(primaryColumns, startFromKeys, entityMetadata);

	validateValues(startFrom);
};
