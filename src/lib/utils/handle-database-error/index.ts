import { SymbiosisError } from "@techmmunity/symbiosis";

export const handleDatabaseError = (err: any) => {
	const message = err.message;

	switch (true) {
		case err instanceof SymbiosisError:
			return err;
		default:
			return new SymbiosisError({
				code: "UNKNOWN",
				origin: "DATABASE",
				message: "Unknown error",
				details: [message],
			});
	}
};
