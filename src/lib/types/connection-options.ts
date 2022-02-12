import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import type { BaseConnectionOptions } from "@techmmunity/symbiosis";

export type DynamoDbConnectionOptions = Omit<
	BaseConnectionOptions<DynamoDBClientConfig>,
	"plugin"
>;
