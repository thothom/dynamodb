/* eslint-disable @typescript-eslint/no-unused-vars */

import type { EntityManager } from "@techmmunity/symbiosis";

// eslint-disable-next-line @typescript-eslint/naming-convention
export class TestRepository {
	public constructor(public entityManager: EntityManager, public entity: any) {}
}
