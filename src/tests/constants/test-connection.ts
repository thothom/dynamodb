/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BaseConnection } from "@techmmunity/symbiosis";
import { TestRepository } from "./test-repository";

export class TestConnection extends BaseConnection {
	// eslint-disable-next-line require-await
	public async connect(): Promise<this> {
		throw new Error("Method not implemented.");
	}

	public validate(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public close(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public getRepository(entity: any) {
		return new TestRepository(this.entityManager, entity) as any;
	}
}
