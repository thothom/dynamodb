import { BaseConnection } from "@techmmunity/symbiosis";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { Repository } from "../repository";
import type { ColumnExtraMetadata } from "../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../types/entity-extra-metadata";
import type { IndexExtraMetadata } from "../types/index-extra-metadata";
import type { DynamoDbConnectionOptions } from "../types/connection-options";

export class Connection extends BaseConnection<
	DynamoDBClientConfig,
	EntityExtraMetadata,
	ColumnExtraMetadata,
	IndexExtraMetadata
> {
	private _connectionInstance: DynamoDBClient;

	public get connectionInstance() {
		return this._connectionInstance;
	}

	public constructor(options?: DynamoDbConnectionOptions) {
		super("@techmmunity/symbiosis-dynamodb", options);
	}

	// Disabled because the "connect" method must return a promise
	// eslint-disable-next-line require-await
	public async connect() {
		this._connectionInstance = new DynamoDBClient(
			this.options.databaseConfig || {},
		);
	}

	public getRepository<Entity>(entity: any) {
		return new Repository<Entity>(
			this.connectionInstance,
			this.entityManager,
			this.logger,
			entity as Entity,
		);
	}
}
