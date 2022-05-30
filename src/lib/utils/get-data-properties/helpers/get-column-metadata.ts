import { MetadataUtil, ThothError } from "@thothom/core";
import { getTypeof } from "@techmmunity/utils";

import type { Context } from "../../../types/context";
import type { ColumnMetadata } from "@thothom/core/lib/entity-manager/types/column-metadata";

interface GetColumnMetadataParams {
	key: string;
	context: Context<any>;
}

export const getColumnMetadata = ({
	key,
	context,
}: GetColumnMetadataParams): ColumnMetadata => {
	const result = key
		.replace(/\[\]/, "")
		.split(".")
		.reduce(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			(acc, cur) => {
				const columnMetadata = context.entityManager.getColumnMetadata(
					acc,
					cur,
				);

				if (MetadataUtil.isCustomMetadataType(columnMetadata.type)) {
					return columnMetadata.type;
				}

				return columnMetadata;
			},
			context.entity,
		) as any;

	if (getTypeof(result) === "class") {
		throw new ThothError({
			code: "INVALID_PARAM",
			origin: "THOTHOM",
			message: "Invalid column",
			details: [`Invalid column: "${key}"`],
		});
	}

	return result as ColumnMetadata;
};
