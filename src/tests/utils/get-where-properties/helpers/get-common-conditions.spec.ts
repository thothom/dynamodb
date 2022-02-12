import { In } from "@techmmunity/symbiosis";

import { getCommonConditions } from "../../../../lib/utils/get-where-properties/helpers/get-common-conditions";

describe("getCommonConditions Util", () => {
	describe("With basic where", () => {
		it("should return where common conditions", () => {
			let result: any;

			try {
				result = getCommonConditions([
					{
						"foo": 1,
						"bar.xyz": 2,
						"ghi[].jkl": 4,
					},
					{
						"foo": 1,
						"bar.abc.def": 3,
						"ghi[].jkl": 4,
					},
				]);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				"foo": 1,
				"ghi[].jkl": 4,
			});
		});
	});

	describe("With find operators where", () => {
		it("should return common conditions", () => {
			let result: any;

			try {
				result = getCommonConditions([
					{
						"foo": In([1, 2]),
						"bar.xyz": 2,
						"ghi[].jkl": 4,
					},
					{
						"foo": In([1, 2]),
						"bar.abc.def": 3,
						"ghi[].jkl": 4,
					},
				]);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				"foo": In([1, 2]),
				"ghi[].jkl": 4,
			});
		});
	});
});
