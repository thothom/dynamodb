import { BaseConnectionOptions, Connection } from "@techmmunity/symbiosis";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { ExampleRepository } from "../repository";
import { ColumnExtraMetadata } from "../types/column-extra-metadata";
import { EntityExtraMetadata } from "../types/entity-extra-metadata";

export class ExampleConnection extends Connection<
	DynamoDBClientConfig,
	EntityExtraMetadata,
	ColumnExtraMetadata
> {
	private readonly connectionInstance: DynamoDBClient;

	public constructor(options: BaseConnectionOptions<DynamoDBClientConfig>) {
		super(options);

		this.connectionInstance = new DynamoDBClient(
			options.databaseConnectionConfig || {},
		);
	}

	public getRepository<Entity>(entity: Entity) {
		return new ExampleRepository(
			this.connectionInstance,
			this.entityManager,
			entity,
		);
	}
}
