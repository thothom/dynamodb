import { ArrayFindConditions } from "@techmmunity/symbiosis";
import { DatabaseEntity } from "@techmmunity/symbiosis/lib/types/database-entity";
import { getTypeof } from "@techmmunity/utils";

export const getCommonConditions = (
	arrayWhere: ArrayFindConditions<DatabaseEntity>,
) => {
	const [firstWhere] = arrayWhere;

	const keyValueCommonProps = Object.keys(firstWhere)
		// eslint-disable-next-line array-callback-return
		.map(key => {
			const propIsInAllItems = arrayWhere
				.map(where => where[key])
				.every((cur, idx, arr) => {
					/*
					 * First item: nothing to compare with (and, single element arrays should return true)
					 * otherwise:  compare current value to previous value
					 */
					// eslint-disable-next-line @typescript-eslint/no-magic-numbers
					if (idx === 0) return true;

					// eslint-disable-next-line @typescript-eslint/no-magic-numbers
					const previousValue = arr[idx - 1];

					const typeofPreviousValue = getTypeof(previousValue);

					/**
					 * Objects and arrays cannot be compared directly,
					 * so we have to stringify these values before compare them
					 */
					if (["object", "array"].includes(typeofPreviousValue)) {
						return JSON.stringify(previousValue) === JSON.stringify(cur);
					}

					return previousValue === cur;
				});

			if (propIsInAllItems) {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				const value = arrayWhere[0][key];

				return [key, value];
			}
		})
		.filter(Boolean) as [string, any];

	return Object.fromEntries(keyValueCommonProps);
};
