import { getAlias } from "../get-alias";

const ARRAY_REGEX = /\[\]/g;

export const getSelect = (select?: Array<string>) => {
	if (!select) return {};

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const ProjectionExpression = select
		.map(rawKey =>
			rawKey
				.split(".")
				.map(key => getAlias(key, "#SELECT"))
				.join("."),
		)
		.join(", ")
		.replace(ARRAY_REGEX, "");

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const ExpressionAttributeNames = select.reduce((acc, rawCur) => {
		const cur = rawCur.replace(ARRAY_REGEX, "");

		if (cur.includes(".")) {
			cur.split(".").forEach(key => {
				acc[getAlias(key, "#SELECT")] = key;
			});

			return acc;
		}

		acc[getAlias(cur, "#SELECT")] = cur;

		return acc;
	}, {} as Record<string, string>);

	return {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ProjectionExpression,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ExpressionAttributeNames,
	};
};
