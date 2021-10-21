import { MetadataUtil } from "@techmmunity/symbiosis";
import { ColumnMetadata } from "@techmmunity/symbiosis/lib/entity-manager/types/column-metadata";
import { Context } from "../../../types/context";

interface GetColumnMetadataParams {
	key: string;
	context: Context<any>;
}

export const getColumnMetadata = ({
	key,
	context,
}: GetColumnMetadataParams): ColumnMetadata =>
	key
		.replace(/\[\]/, "")
		.split(".")
		.reduce(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			(acc, cur) => {
				const columnMetadata = context.entityManager.getColumnMetadata(
					acc.entity,
					cur,
				);

				if (MetadataUtil.isCustomMetadataType(columnMetadata.type)) {
					return {
						entity: columnMetadata.type,
					};
				}

				return columnMetadata;
			},
			{
				entity: context.entity,
			},
		) as any;
