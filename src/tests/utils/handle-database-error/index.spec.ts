import { ThothError } from "@thothom/core";

import { handleDatabaseError } from "../../../lib/utils/handle-database-error";

const ERROR_MESSAGE = "FAILED, SHOULD RETURN NOT THROW";

describe("handleDatabaseError", () => {
	const context = {
		tableName: "foo_bar",
	};

	describe("With ThothError", () => {
		it("should return the same error", () => {
			let result: any;

			const error = new ThothError({
				code: "AUTOMATION_FAILED",
				origin: "DATABASE",
				message: "Foo",
				details: ["bar"],
			});

			try {
				result = handleDatabaseError(context as any, error);
			} catch (err: any) {
				result = ERROR_MESSAGE;
			}

			expect(result).toStrictEqual(error);
		});
	});

	describe("With table not found", () => {
		it("should return an error", () => {
			let result: any;

			const error = new Error("Requested resource not found");

			try {
				result = handleDatabaseError(context as any, error);
			} catch (err: any) {
				result = ERROR_MESSAGE;
			}

			expect(result).toStrictEqual(
				new ThothError({
					code: "OPERATION_FAILED",
					origin: "DATABASE",
					message: "Table not found",
					details: [`Table "${context.tableName}" not found.`],
				}),
			);
		});
	});

	describe("With random error", () => {
		it('should return "UNKNOWN" error', () => {
			let result: any;

			try {
				result = handleDatabaseError(context as any, new Error("foo"));
			} catch (err: any) {
				result = ERROR_MESSAGE;
			}

			expect(result).toStrictEqual(
				new ThothError({
					code: "UNKNOWN",
					origin: "DATABASE",
					message: "Unknown error",
					details: ["foo"],
				}),
			);
		});
	});
});
