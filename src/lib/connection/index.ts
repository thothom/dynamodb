import { BaseConnectionOptions, Connection } from "@techmmunity/symbiosis";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import type { CustomClass } from "@techmmunity/symbiosis/lib/entity-manager/types/metadata-type";
import { DynamodbRepository } from "../repository";
import type { ColumnExtraMetadata } from "../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../types/entity-extra-metadata";

export class DynamodbConnection extends Connection<
	DynamoDBClientConfig,
	EntityExtraMetadata,
	ColumnExtraMetadata
> {
	private _connectionInstance: DynamoDBClient;

	public get connectionInstance() {
		return this._connectionInstance;
	}

	public constructor(options: BaseConnectionOptions<DynamoDBClientConfig>) {
		super(options);
	}

	// Disabled because the "connect" method must return a promise
	// eslint-disable-next-line require-await
	public async connect() {
		this._connectionInstance = new DynamoDBClient(
			this.options.databaseConnectionConfig || {},
		);
	}

	public getRepository<Entity>(entity: CustomClass) {
		return new DynamodbRepository(
			this.connectionInstance,
			this.entityManager,
			entity as Entity,
		);
	}
}
