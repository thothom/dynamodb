/* eslint-disable sonarjs/no-duplicate-string */

import {
	Append,
	IfNotExists,
	Min,
	Minus,
	Plus,
	Pop,
	Remove,
	SymbiosisError,
} from "@techmmunity/symbiosis";
import { mapData } from "../../../lib/utils/get-data-properties/helpers/map-data";
import { getExpressionAttributeValues } from "../../../lib/utils/get-data-properties/get-expression-attribute-values";
import { formatWhere } from "../../../lib/utils/get-where-properties/helpers/get-array-where";

describe("getExpressionAttributeValues", () => {
	describe("With simple entity", () => {
		it("should return mapped keys and values", () => {
			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: "fooBar",
				barFoo: "barFoo",
			});

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				":UPDATEbar": { S: "bar" },
				// eslint-disable-next-line @typescript-eslint/naming-convention
				":UPDATEbarfoo": { S: "barFoo" },
				// eslint-disable-next-line @typescript-eslint/naming-convention
				":UPDATEfoo": { S: "foo" },
				// eslint-disable-next-line @typescript-eslint/naming-convention
				":UPDATEfoobar": { S: "fooBar" },
			});
		});

		it("should return mapped keys and values (Append SaveOperator)", () => {
			const formattedData = formatWhere({
				bar: Append(1, 2),
			});

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				":UPDATEbar": { L: [{ N: "1" }, { N: "2" }] },
			});
		});

		it("should return mapped keys and values (IfNotExists SaveOperator)", () => {
			const formattedData = formatWhere({
				bar: IfNotExists(1),
			});

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			// eslint-disable-next-line @typescript-eslint/naming-convention
			expect(result).toStrictEqual({ ":UPDATEbar": { N: "1" } });
		});

		it("should return mapped keys and values (Plus SaveOperator)", () => {
			const formattedData = formatWhere({
				bar: Plus(1),
			});

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			// eslint-disable-next-line @typescript-eslint/naming-convention
			expect(result).toStrictEqual({ ":UPDATEbar": { N: "1" } });
		});

		it("should return mapped keys and values (Minus SaveOperator)", () => {
			const formattedData = formatWhere({
				bar: Minus(1),
			});

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			// eslint-disable-next-line @typescript-eslint/naming-convention
			expect(result).toStrictEqual({ ":UPDATEbar": { N: "-1" } });
		});

		it("should return mapped keys and values (Remove SaveOperator)", () => {
			const formattedData = formatWhere({
				bar: Remove(),
			});

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({});
		});

		it("should return mapped keys and values (Pop SaveOperator)", () => {
			const formattedData = formatWhere({
				bar: Pop(1),
			});

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({});
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

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				":UPDATEfooBar": { S: "bar" },
				// eslint-disable-next-line @typescript-eslint/naming-convention
				":UPDATEfoobarBarfoo": { S: "barFoo" },
			});
		});
	});

	describe("General errors", () => {
		it("should throw error with Min operator", () => {
			const formattedData = formatWhere({
				bar: Min(1),
			});

			const { valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getExpressionAttributeValues(valuesMap);
			} catch (err: any) {
				result = err;
			}

			expect(result instanceof SymbiosisError).toBeTruthy();
			expect(result.code).toBe("NOT_IMPLEMENTED");
			expect(result.origin).toBe("SYMBIOSIS");
			expect(result.message).toBe("Invalid SaveOperator");
			expect(result.details).toStrictEqual([
				'Dynamodb doesn\'t support SaveOperator "min"',
			]);
		});
	});
});
