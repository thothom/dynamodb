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
					"#WHEREabc": "abc",
					"#WHEREbar": "bar",
					"#WHEREdef": "def",
					"#WHEREfoo": "foo",
					"#WHEREghi": "ghi",
					"#WHEREjkl": "jkl",
					"#WHERExyz": "xyz",
				},
				ExpressionAttributeValues: {
					":WHEREbarAbcDef1": { N: "3" },
					":WHEREbarXyz1": { N: "2" },
					":WHEREfoo1": { N: "1" },
					":WHEREghiJkl1": { N: "4" },
				},
				FilterExpression: undefined,
				KeyConditionExpression:
					"(#WHEREfoo = :WHEREfoo1) and (#WHEREbar.#WHERExyz = :WHEREbarXyz1) and (#WHEREbar.#WHEREabc.#WHEREdef = :WHEREbarAbcDef1) and (#WHEREghi[].#WHEREjkl = :WHEREghiJkl1)",
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
					"#WHEREabc": "abc",
					"#WHEREbar": "bar",
					"#WHEREdef": "def",
					"#WHEREfoo": "foo",
					"#WHEREghi": "ghi",
					"#WHEREjkl": "jkl",
					"#WHERExyz": "xyz",
				},
				ExpressionAttributeValues: {
					":WHEREbarAbcDef1": { N: "3" },
					":WHEREbarXyz1": { N: "2" },
					":WHEREfoo1": { N: "1" },
					":WHEREghiJkl1": { N: "4" },
				},
				FilterExpression:
					"((#WHEREbar.#WHERExyz = :WHEREbarXyz1) and (#WHEREbar.#WHEREabc.#WHEREdef = :WHEREbarAbcDef1)) or ()",
				KeyConditionExpression:
					"(#WHEREfoo = :WHEREfoo1) and (#WHEREghi[].#WHEREjkl = :WHEREghiJkl1)",
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
