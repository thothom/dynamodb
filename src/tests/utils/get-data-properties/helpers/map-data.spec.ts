/* eslint-disable sonarjs/no-duplicate-string */

import { mapData } from "../../../../lib/utils/get-data-properties/helpers/map-data";
import { formatWhere } from "../../../../lib/utils/get-where-properties/helpers/get-array-where";

describe("getColumnMetadata", () => {
	describe("With simple entity", () => {
		it("should return mapped keys and values", () => {
			let result: any;

			try {
				const formattedData = formatWhere({
					foo: "foo",
					bar: "bar",
					fooBar: "fooBar",
					barFoo: "barFoo",
				});

				result = mapData(formattedData);
			} catch (err: any) {
				result = err;
			}

			const keysMap = new Map();
			keysMap.set("foo", "#UPDATEfoo");
			keysMap.set("bar", "#UPDATEbar");
			keysMap.set("fooBar", "#UPDATEfoobar");
			keysMap.set("barFoo", "#UPDATEbarfoo");

			const valuesMap = new Map();
			valuesMap.set("foo", ":UPDATEfoo");
			valuesMap.set("bar", ":UPDATEbar");
			valuesMap.set("fooBar", ":UPDATEfoobar");
			valuesMap.set("barFoo", ":UPDATEbarfoo");

			expect(result).toStrictEqual({
				keysMap,
				valuesMap,
			});
		});
	});

	describe("With nested entity", () => {
		it("should return mapped keys and values", () => {
			let result: any;

			try {
				const formattedData = formatWhere({
					foo: {
						bar: "bar",
					},
					fooBar: {
						barFoo: "barFoo",
					},
				});

				result = mapData(formattedData);
			} catch (err: any) {
				result = err;
			}

			const keysMap = new Map();
			keysMap.set("foo.bar", "#UPDATEfoo.#UPDATEbar");
			keysMap.set("fooBar.barFoo", "#UPDATEfoobar.#UPDATEbarfoo");

			const valuesMap = new Map();
			valuesMap.set("bar", ":UPDATEfooBar");
			valuesMap.set("barFoo", ":UPDATEfoobarBarfoo");

			expect(result).toStrictEqual({
				keysMap,
				valuesMap,
			});
		});

		it("should return mapped keys and values (with multiple values sub-entity)", () => {
			let result: any;

			try {
				const formattedData = formatWhere({
					foo: {
						bar: "bar",
					},
					fooBar: {
						barFoo: "barFoo",
						fooFoo: "fooFoo",
					},
				});

				result = mapData(formattedData);
			} catch (err: any) {
				result = err;
			}

			const keysMap = new Map();
			keysMap.set("foo.bar", "#UPDATEfoo.#UPDATEbar");
			keysMap.set("fooBar.barFoo", "#UPDATEfoobar.#UPDATEbarfoo");
			keysMap.set("fooBar.fooFoo", "#UPDATEfoobar.#UPDATEfoofoo");

			const valuesMap = new Map();
			valuesMap.set("bar", ":UPDATEfooBar");
			valuesMap.set("barFoo", ":UPDATEfoobarBarfoo");
			valuesMap.set("fooFoo", ":UPDATEfoobarFoofoo");

			expect(result).toStrictEqual({
				keysMap,
				valuesMap,
			});
		});
	});
});
