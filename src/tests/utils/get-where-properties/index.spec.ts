/* eslint-disable @typescript-eslint/naming-convention */

import { getWhereProperties } from "../../../lib/utils/get-where-properties";

describe("getWhereProperties Util", () => {
	describe("With basic conditions", () => {
		it("should return condition expression formatted", () => {
			let result: any;

			try {
				result = getWhereProperties({
					"foo": 1,
					"bar.xyz": 2,
					"bar.abc.def": 3,
					"ghi[].jkl": 4,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				ExpressionAttributeNames: {
					"#abc": "abc",
					"#bar": "bar",
					"#def": "def",
					"#foo": "foo",
					"#ghi": "ghi",
					"#jkl": "jkl",
					"#xyz": "xyz",
				},
				ExpressionAttributeValues: {
					":barAbcDef1": { N: "3" },
					":barXyz1": { N: "2" },
					":foo1": { N: "1" },
					":ghiJkl1": { N: "4" },
				},
				FilterExpression: undefined,
				KeyConditionExpression:
					"(#foo = :foo1) and (#bar.#xyz = :barXyz1) and (#bar.#abc.#def = :barAbcDef1) and (#ghi[].#jkl = :ghiJkl1)",
			});
		});
	});

	describe("With multiple basic conditions", () => {
		it("should return condition expression formatted", () => {
			let result: any;

			try {
				result = getWhereProperties([
					{
						"foo": 1,
						"bar.xyz": 2,
						"bar.abc.def": 3,
						"ghi[].jkl": 4,
					},
					{
						"foo": 1,
						"ghi[].jkl": 4,
					},
				]);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				ExpressionAttributeNames: {
					"#abc": "abc",
					"#bar": "bar",
					"#def": "def",
					"#foo": "foo",
					"#ghi": "ghi",
					"#jkl": "jkl",
					"#xyz": "xyz",
				},
				ExpressionAttributeValues: {
					":barAbcDef1": { N: "3" },
					":barXyz1": { N: "2" },
					":foo1": { N: "1" },
					":ghiJkl1": { N: "4" },
				},
				FilterExpression:
					"((#bar.#xyz = :barXyz1) and (#bar.#abc.#def = :barAbcDef1)) or ()",
				KeyConditionExpression: "(#foo = :foo1) and (#ghi[].#jkl = :ghiJkl1)",
			});
		});
	});

	describe("With find operators", () => {
		it.todo("should return where formatted with find operator");
	});

	describe("With multiple find operators", () => {
		it.todo("should return where formatted with find operator");
	});
});
