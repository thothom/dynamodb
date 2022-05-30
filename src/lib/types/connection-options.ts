import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import type { BaseConnectionOptions } from "@thothom/core";

export type DynamoDbConnectionOptions = Omit<
	BaseConnectionOptions<DynamoDBClientConfig>,
	"plugin"
>;
