import { BaseConnection } from "@techmmunity/symbiosis";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import type { CustomClass } from "@techmmunity/symbiosis/lib/entity-manager/types/metadata-type";
import { Repository } from "../repository";
import type { ColumnExtraMetadata } from "../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../types/entity-extra-metadata";
import { DynamoDbConnectionOptions } from "../types/connection-options";
import { IndexExtraMetadata } from "../types/index-extra-metadata";

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

	public constructor(options: DynamoDbConnectionOptions) {
		super(options);
	}

	// Disabled because the "connect" method must return a promise
	// eslint-disable-next-line require-await
	public async connect() {
		this._connectionInstance = new DynamoDBClient(
			this.options.databaseConfig || {},
		);
	}

	public getRepository<Entity>(entity: CustomClass) {
		return new Repository(
			this.connectionInstance,
			this.entityManager,
			entity as Entity,
		);
	}
}
