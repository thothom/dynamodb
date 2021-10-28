/* eslint-disable @typescript-eslint/no-unused-vars */

import { BaseConnection } from "@techmmunity/symbiosis";
import { TestRepository } from "./test-repository";

export class TestConnection extends BaseConnection {
	public connect(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public getRepository(entity: any) {
		return new TestRepository(this.entityManager, entity) as any;
	}
}
