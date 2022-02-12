import type { BaseFindOutput, ClassType } from "@techmmunity/symbiosis";

export interface FindOutput<T> extends BaseFindOutput<T> {
	cursor?: ClassType<T>;
}
