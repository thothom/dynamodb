/* eslint-disable @typescript-eslint/naming-convention */

import { getSelect } from "../../lib/utils/get-select";

describe("getSelect Util", () => {
	describe("With all types of fields (array, nested, normal)", () => {
		it("should return parameters formatted", () => {
			let result: any;

			try {
				result = getSelect(["foo", "bar.xyz", "bar.abc.def", "ghi[].jkl"]);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				ExpressionAttributeNames: {
					"#SELECTabc": "abc",
					"#SELECTbar": "bar",
					"#SELECTdef": "def",
					"#SELECTfoo": "foo",
					"#SELECTghi": "ghi",
					"#SELECTjkl": "jkl",
					"#SELECTxyz": "xyz",
				},
				ProjectionExpression:
					"#SELECTfoo, #SELECTbar.#SELECTxyz, #SELECTbar.#SELECTabc.#SELECTdef, #SELECTghi.#SELECTjkl",
			});
		});
	});
});
