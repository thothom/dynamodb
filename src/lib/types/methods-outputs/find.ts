import type { BaseFindOutput, ClassType } from "@thothom/core";

export interface FindOutput<T> extends BaseFindOutput<T> {
	cursor?: ClassType<T>;
}
