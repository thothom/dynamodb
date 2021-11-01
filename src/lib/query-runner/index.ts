/* eslint-disable sonarjs/no-duplicate-string */

import {
	BaseQueryRunner,
	CreateColumnParams,
	CreateEntityParams,
	CreateEnumParams,
	CreateIndexParams,
} from "@techmmunity/symbiosis-cli";
import { Connection } from "../connection";

export class QueryRunner extends BaseQueryRunner<Connection> {
	public readonly queries: Array<any>;

	public createEntity(_p: CreateEntityParams): void {
		throw new Error("Method not implemented.");
	}

	public createEnum(_p: CreateEnumParams): void {
		throw new Error("Method not implemented.");
	}

	public createColumn(_p: CreateColumnParams) {
		throw new Error("Method not implemented.");
	}

	public createIndex(_p: CreateIndexParams) {
		throw new Error("Method not implemented.");
	}

	public run(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
