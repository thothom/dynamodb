/* eslint-disable sonarjs/no-duplicate-string */

import { getExpressionAttributeNames } from "../../../lib/utils/get-data-properties/get-expression-attribute-names";
import { mapData } from "../../../lib/utils/get-data-properties/helpers/map-data";
import { formatWhere } from "../../../lib/utils/get-where-properties/helpers/get-array-where";

describe("getExpressionAttributeNames", () => {
	describe("With simple entity", () => {
		it("should return mapped keys and values", () => {
			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: "fooBar",
				barFoo: "barFoo",
			});

			const { keysMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeNames(keysMap);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				"#UPDATEbar": "bar",
				"#UPDATEbarfoo": "barFoo",
				"#UPDATEfoo": "foo",
				"#UPDATEfoobar": "fooBar",
			});
		});
	});

	describe("With nested entity", () => {
		it("should return mapped keys and values", () => {
			const formattedData = formatWhere({
				foo: {
					bar: "bar",
				},
				fooBar: {
					barFoo: "barFoo",
				},
			});

			const { keysMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeNames(keysMap);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				"#UPDATEbar": "bar",
				"#UPDATEbarfoo": "barFoo",
				"#UPDATEfoo": "foo",
				"#UPDATEfoobar": "fooBar",
			});
		});
	});
});
