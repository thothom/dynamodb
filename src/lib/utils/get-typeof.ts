export type Type =
	| "array"
	| "boolean"
	| "function"
	| "number"
	| "object"
	| "string"
	| "symbol"
	| "undefined"
	| "unknown";

export const getTypeof = (value?: any) => {
	switch (typeof value) {
		case "object": {
			switch (true) {
				case value === null:
					return "undefined";

				case Array.isArray(value):
					return "array";

				default:
					return "object";
			}
		}

		case "string":
			return "string";

		case "number":
		case "bigint":
			if (isNaN(value as number)) return "unknown";

			return "number";

		case "boolean":
			return "boolean";

		case "function":
			return "function";

		case "symbol":
			return "symbol";

		case "undefined":
			return "undefined";

		default:
			return "unknown";
	}
};
