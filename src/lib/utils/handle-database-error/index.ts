import { SymbiosisError } from "@techmmunity/symbiosis";
import { Context } from "../../types/context";

export const handleDatabaseError = (context: Context<any>, err: any) => {
	const message = err.message;

	switch (true) {
		case err instanceof SymbiosisError:
			return err;
		case message === "Requested resource not found":
			return new SymbiosisError({
				code: "OPERATION_FAILED",
				origin: "DATABASE",
				message: "Table not found",
				details: [`Table "${context.tableName}" not found.`],
			});
		default:
			return new SymbiosisError({
				code: "UNKNOWN",
				origin: "DATABASE",
				message: "Unknown error",
				details: [message],
			});
	}
};
