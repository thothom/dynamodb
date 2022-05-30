import { In } from "@thothom/core";

import { getArrayWhere } from "../../../../lib/utils/get-where-properties/helpers/get-array-where";

describe("getArrayWhere Util", () => {
	describe("With basic where", () => {
		it("should return where formatted", () => {
			let result: any;

			try {
				result = getArrayWhere({
					foo: 1,
					bar: {
						xyz: 2,
						abc: {
							def: 3,
						},
					},
					ghi: [
						{
							jkl: 4,
						},
					],
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual([
				{
					"foo": 1,
					"bar.xyz": 2,
					"bar.abc.def": 3,
					"ghi[].jkl": 4,
				},
			]);
		});
	});

	describe("With multiple where", () => {
		it("should return where formatted", () => {
			let result: any;

			try {
				result = getArrayWhere([
					{
						foo: 1,
						bar: {
							xyz: 2,
							abc: {
								def: 3,
							},
						},
						ghi: [
							{
								jkl: 4,
							},
						],
					},
					{
						foo: 1,
						bar: {
							xyz: 2,
							abc: {
								def: 3,
							},
						},
						ghi: [
							{
								jkl: 4,
							},
						],
					},
				]);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual([
				{
					"foo": 1,
					"bar.xyz": 2,
					"bar.abc.def": 3,
					"ghi[].jkl": 4,
				},
				{
					"foo": 1,
					"bar.xyz": 2,
					"bar.abc.def": 3,
					"ghi[].jkl": 4,
				},
			]);
		});
	});

	describe("With find operators where", () => {
		it("should return where formatted with find operator", () => {
			let result: any;

			try {
				result = getArrayWhere({
					foo: 1,
					bar: {
						xyz: 2,
						abc: {
							def: In([1, 2]),
						},
					},
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual([
				{
					"foo": 1,
					"bar.xyz": 2,
					"bar.abc.def": In([1, 2]),
				},
			]);
		});
	});

	describe("Without params", () => {
		it("should return undefined", () => {
			let result: any;

			try {
				result = getArrayWhere();
			} catch (err: any) {
				result = err;
			}

			expect(result).toBeUndefined();
		});
	});
});
