import { SymbiosisError, SymbiosisErrorCodeEnum } from "@techmmunity/symbiosis";

export const handleDatabaseError = (err: any) => {
	const message = err.message;

	switch (true) {
		case err instanceof SymbiosisError:
			throw err;
		default:
			return new SymbiosisError({
				origin: "DATABASE",
				code: SymbiosisErrorCodeEnum.UNKNOWN,
				message: "Unknown error",
				details: [message],
			});
	}
};
