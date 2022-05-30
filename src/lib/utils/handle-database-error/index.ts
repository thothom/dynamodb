import { ThothError } from "@thothom/core";

import type { Context } from "../../types/context";

export const handleDatabaseError = (context: Context<any>, err: any) => {
	const message = err.message;

	switch (true) {
		case err instanceof ThothError:
			return err;
		case message === "Requested resource not found":
			return new ThothError({
				code: "OPERATION_FAILED",
				origin: "DATABASE",
				message: "Table not found",
				details: [`Table "${context.tableName}" not found.`],
			});
		default:
			return new ThothError({
				code: "UNKNOWN",
				origin: "DATABASE",
				message: "Unknown error",
				details: [message],
			});
	}
};
