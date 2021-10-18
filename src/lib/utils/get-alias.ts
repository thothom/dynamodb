const CHARACTERS =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const REPLACEMENT_ALIAS_LENGTH = 4;

export const getAlias = (key: string, prefix: string) => {
	const isArray = key.endsWith("[]");

	const preferableAlias = key
		.replace(/\./g, "_")
		.replace(/\[\]/g, "")
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()) // Convert to camelCase
		.replace(/[^a-z0-9]/gi, ""); // Remove Non-Alphanumeric;

	if (preferableAlias) {
		return `${prefix}${preferableAlias}${isArray ? "[]" : ""}`;
	}

	/**
	 * If theres nothing left from the alias (ex: all the characters are non-alphanumeric),
	 * generate a random replacement
	 */
	const replacementRandomAlias = Array(REPLACEMENT_ALIAS_LENGTH)
		.fill("")
		.reduce(
			acc =>
				acc + CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)),
			"",
		);

	return `${prefix}${replacementRandomAlias}${isArray ? "[]" : ""}`;
};
