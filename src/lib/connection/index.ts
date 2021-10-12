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
	public readonly connectionInstance: DynamoDBClient;

	public constructor(options: BaseConnectionOptions<DynamoDBClientConfig>) {
		super(options);

		this.connectionInstance = new DynamoDBClient(
			options.databaseConnectionConfig || {},
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
