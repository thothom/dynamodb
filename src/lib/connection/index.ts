import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BaseConnection } from "@thothom/core";

import { Repository } from "../repository";

import type { DynamoDbConnectionOptions } from "../types/connection-options";
import type { ExtraMetadata } from "../types/extra-metadata";

export class Connection extends BaseConnection<
	DynamoDBClientConfig,
	ExtraMetadata
> {
	private _connectionInstance: DynamoDBClient;

	public get connectionInstance() {
		return this._connectionInstance;
	}

	public constructor(options?: DynamoDbConnectionOptions) {
		super("@thothom/dynamodb", options);
	}

	// Disabled because the "connect" method must return a promise
	// eslint-disable-next-line require-await
	public async connect() {
		this._connectionInstance = new DynamoDBClient(
			this.options.databaseConfig || {},
		);

		return this;
	}

	// eslint-disable-next-line require-await
	public async validate() {
		this.basicValidate();
	}

	// Disabled because the "close" method must return a promise
	// eslint-disable-next-line require-await
	public async close() {}

	public getRepository<Entity>(entity: any) {
		return new Repository<Entity>(
			this.connectionInstance,
			this.entityManager,
			this.logger,
			entity as Entity,
		);
	}
}
