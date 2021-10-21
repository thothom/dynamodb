import { MetadataUtil, SymbiosisError } from "@techmmunity/symbiosis";
import { ColumnMetadata } from "@techmmunity/symbiosis/lib/entity-manager/types/column-metadata";
import { getTypeof } from "@techmmunity/utils";
import { Context } from "../../../types/context";

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
		throw new SymbiosisError({
			code: "INVALID_PARAM",
			origin: "SYMBIOSIS",
			message: "Invalid column",
			details: [`Invalid column: "${key}"`],
		});
	}

	return result as ColumnMetadata;
};
