import type { FindConditions } from "@thothom/core";
import { isOperator, ThothError } from "@thothom/core";
import { getTypeof, isEmptyObject } from "@techmmunity/utils";

import type { DatabaseEntity } from "@thothom/core/lib/types/database-entity";

interface HandleArrayParams {
	acc: Record<string, any>;
	key: string;
	value: Array<any>;
}

interface HandleObjectParams {
	acc: Record<string, any>;
	key: string;
	value: any;
}

const handleArray = ({ acc, key, value }: HandleArrayParams) => {
	const [firstValue] = value;

	const typeOfFirstValue = getTypeof(firstValue);

	if (typeOfFirstValue !== "object" || isEmptyObject(firstValue)) {
		throw new ThothError({
			code: "INVALID_PARAM",
			origin: "THOTHOM",
			message: "Invalid params",
			details: [
				'Invalid array filter. If you want to filter by what an array includes and not by it\'s children, you must you the `Includes` find operator, which is exported by "@thothom/core"',
			],
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	handleObject({
		acc,
		key: `${key}[]`,
		value: firstValue,
	});
};

const handleObject = ({ acc, key, value }: HandleObjectParams) => {
	if (isOperator(value)) {
		acc[key] = value;

		return;
	}

	Object.entries(value).forEach(([subKey, subValue]) => {
		switch (getTypeof(subValue)) {
			case "array":
				handleArray({
					acc,
					key: `${key}.${subKey}`,
					value: subValue as Array<any>,
				});
				break;

			case "object":
				handleObject({
					acc,
					key: `${key}.${subKey}`,
					value: subValue,
				});
				break;

			case "string":
			case "number":
			case "boolean":
			case "class":
				acc[`${key}.${subKey}`] = subValue;
				break;

			default:
				break;
		}
	});
};

/**
 * Format where to have keys with the complete path
 *
 * Ex:
 *
 * Input
 * ```
 * {
 *   foo: 1,
 *   bar: {
 *     xyz: 2,
 *     abc: {
 *       def: 3,
 *     }
 *   },
 *   ghi: [
 *     {
 *       jkl: 4,
 *     }
 *   ]
 * }
 * ```
 *
 * Output
 * ```
 * {
 *   foo: 1,
 *   "bar.xyz": 2,
 *   "bar.abc.def": 3,
 *   "ghi[].jkl": 4,
 * }
 * ```
 */
export const formatWhere = (where?: FindConditions<DatabaseEntity>) =>
	Object.entries(where || {}).reduce((acc, [key, value]) => {
		switch (getTypeof(value)) {
			case "array":
				handleArray({
					acc,
					key,
					value,
				});
				break;

			case "object":
				handleObject({
					acc,
					key,
					value,
				});
				break;

			case "string":
			case "number":
			case "boolean":
				acc[key] = value;
				break;

			default:
				break;
		}

		return acc;
	}, {} as Record<string, any>);

export const getArrayWhere = (where?: FindConditions<DatabaseEntity>) => {
	if (!where) return;

	const arrayWhere = (Array.isArray(where) ? where : [where]).map(formatWhere);

	return arrayWhere;
};
