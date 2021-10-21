import { SymbiosisError } from "@techmmunity/symbiosis";
import { handleDatabaseError } from "../../../lib/utils/handle-database-error";

describe("handleDatabaseError", () => {
	describe("With SymbiosisError", () => {
		it("should return the same error", () => {
			let result: any;

			const error = new SymbiosisError({
				code: "AUTOMATION_FAILED",
				origin: "DATABASE",
				message: "Foo",
				details: ["bar"],
			});

			try {
				result = handleDatabaseError(error);
			} catch (err: any) {
				result = "FAILED, SHOULD RETURN NOT THROW";
			}

			expect(result).toStrictEqual(error);
		});
	});

	describe("With random error", () => {
		it('should return "UNKNOWN" error', () => {
			let result: any;

			try {
				result = handleDatabaseError(new Error("foo"));
			} catch (err: any) {
				result = "FAILED, SHOULD RETURN NOT THROW";
			}

			expect(result).toStrictEqual(
				new SymbiosisError({
					code: "UNKNOWN",
					origin: "DATABASE",
					message: "Unknown error",
					details: ["foo"],
				}),
			);
		});
	});
});
