/**
 * ---------------------------------------------
 * // TODO Remove this after implement the methods!
 * ---------------------------------------------
 */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	EntityManager,
	FindConditions,
	FindOneOptions,
	FindOptions,
	Repository,
	SymbiosisError,
	SymbiosisErrorCodeEnum,
} from "@techmmunity/symbiosis";
import { BaseQueryOptions } from "../../../../symbiosis/dist/lib/repository/queries/types/query-options";

export class ExampleRepository<
	Entity,
	EntityExtraMetadata,
	ColumnExtraMetadata,
> extends Repository<Entity, EntityExtraMetadata, ColumnExtraMetadata> {
	public constructor(
		private readonly connectionInstance: DynamoDBClient,
		entityManager: EntityManager<EntityExtraMetadata, ColumnExtraMetadata>,
		entity: Entity,
	) {
		super(entityManager, entity);
	}

	public save(
		_data: Array<Partial<Entity>> | Partial<Entity>,
		_options?: BaseQueryOptions,
	): Promise<Array<Entity> | Entity> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `save` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeSave({
		 * 	data: _data,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterSave({
		 * 	data: dataFromDatabase,
		 * 	options: _options,
		 * });
		 */
	}

	public insert(
		_data: Array<Partial<Entity>> | Partial<Entity>,
		_options?: BaseQueryOptions,
	): Promise<Array<Entity> | Entity> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `insert` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeInsert({
		 * 	data: _data,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterInsert({
		 * 	data: dataFromDatabase,
		 * 	options: _options,
		 * });
		 */
	}

	public update(
		_conditions: FindConditions<Entity>,
		_data: Partial<Entity>,
		_options?: BaseQueryOptions,
	): Promise<Array<Entity> | Entity> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `update` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeUpdate({
		 * 	conditions: _conditions,
		 * 	data: _data,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterUpdate({
		 * 	data: dataFromDatabase,
		 * 	conditions: _conditions,
		 * 	options: _options,
		 * });
		 */
	}

	public upsert(
		_conditions: FindConditions<Entity>,
		_data: Partial<Entity>,
		_options?: BaseQueryOptions,
	): Promise<Array<Entity> | Entity> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `upsert` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeUpsert({
		 * 	conditions: _conditions,
		 * 	data: _data,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterUpsert({
		 * 	data: dataFromDatabase,
		 * 	conditions: _conditions,
		 * 	options: _options,
		 * });
		 */
	}

	public find(
		_conditions: FindOptions<Entity>,
		_options?: BaseQueryOptions,
	): Promise<Array<Entity>> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `find` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeFind({
		 * 	conditions: _conditions,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterFind({
		 * 	data: dataFromDatabase,
		 * 	conditions: _conditions,
		 * 	options: _options,
		 * });
		 */
	}

	public findOne(
		_conditions: FindOneOptions<Entity>,
		_options?: BaseQueryOptions,
	): Promise<Entity> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `findOne` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeFindOne({
		 * 	conditions: _conditions,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterFindOne({
		 * 	data: dataFromDatabase,
		 * 	conditions: _conditions,
		 * 	options: _options,
		 * });
		 */
	}

	public delete(
		_where: FindConditions<Entity>,
		_options?: BaseQueryOptions,
	): Promise<number> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `delete` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeDelete({
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterDelete({
		 * 	data: dataFromDatabase,
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 */
	}

	public softDelete(
		_where: FindConditions<Entity>,
		_options?: BaseQueryOptions,
	): Promise<number> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `softDelete` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeSoftDelete({
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterSoftDelete({
		 * 	data: dataFromDatabase,
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 */
	}

	public recover(
		_where: FindConditions<Entity>,
		_options?: BaseQueryOptions,
	): Promise<number> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `recover` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeRecover({
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterRecover({
		 * 	data: dataFromDatabase,
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 */
	}

	public count(
		_where: FindConditions<Entity>,
		_options?: BaseQueryOptions,
	): Promise<number> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: ["Method `count` is not implemented yet by this plugin"],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforeCount({
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterCount({
		 * 	data: dataFromDatabase,
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 */
	}

	public performativeCount(
		_where: FindConditions<Entity>,
		_options?: BaseQueryOptions,
	): Promise<number> {
		// Delete this after the method is implemented
		throw new SymbiosisError({
			code: SymbiosisErrorCodeEnum.NOT_IMPLEMENTED,
			origin: "SYMBIOSIS",
			details: [
				"Method `performativeCount` is not implemented yet by this plugin",
			],
			message: "Method not implemented",
		});

		/*
		 * // TODO Uncomment this when method implemented
		 *
		 * const dataInDatabaseFormat = this.beforePerformativeCount({
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 *
		 * // ...
		 *
		 * // Do Plugin Stuff Here
		 *
		 * // ...
		 *
		 *
		 * // Just an example, do not do this.
		 * const dataFromDatabase = dataInDatabaseFormat;
		 *
		 * return this.afterPerformativeCount({
		 * 	data: dataFromDatabase,
		 * 	where: _where,
		 * 	options: _options,
		 * });
		 */
	}
}
