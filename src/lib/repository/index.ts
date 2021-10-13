/* eslint-disable @typescript-eslint/naming-convention */

/**
 * ---------------------------------------------
 * // TODO Remove this after implement the methods!
 * ---------------------------------------------
 */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	BaseQueryOptions,
	ClassType,
	EntityManager,
	FindConditions,
	FindOneOptions,
	FindOptions,
	Repository,
	SymbiosisError,
	SymbiosisErrorCodeEnum,
} from "@techmmunity/symbiosis";
import { del } from "./delete";
import { find } from "./find";
import { findOne } from "./find-one";
import { save } from "./save";

export class DynamodbRepository<
	Entity,
	EntityExtraMetadata,
	ColumnExtraMetadata,
> extends Repository<Entity, EntityExtraMetadata, ColumnExtraMetadata> {
	private readonly tableName: string;

	public constructor(
		private readonly connectionInstance: DynamoDBClient,
		entityManager: EntityManager<EntityExtraMetadata, ColumnExtraMetadata>,
		entity: Entity,
	) {
		super(entityManager, entity);

		const entityMetadata = this.entityManager.getEntityMetadata(entity);

		this.tableName = entityMetadata.databaseName;
	}

	/**
	 * This function **CREATE** a new record if a record **WITH THE SAME ID** doesn't
	 * exists, **BUT** also **REPLACE** a record if it has the same ID.
	 *
	 * @param data The entity data that you want to save to the database
	 * @param options Options for this operation
	 * @returns The entity as it's saved on the database
	 */
	public save(
		data: Array<ClassType<Entity>> | ClassType<Entity>,
		options?: BaseQueryOptions,
	): Promise<Array<Entity> | Entity> {
		return save(
			this as any,
			{
				connectionInstance: this.connectionInstance,
				tableName: this.tableName,
			},
			{
				data,
				options,
			},
		);
	}

	public insert(
		_data: Array<ClassType<Entity>> | ClassType<Entity>,
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
		_data: ClassType<Entity>,
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
		_data: ClassType<Entity>,
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
		conditions: FindOptions<Entity>,
		options?: BaseQueryOptions,
	): Promise<Array<Entity>> {
		return find(
			this as any,
			{
				connectionInstance: this.connectionInstance,
				tableName: this.tableName,
			},
			{
				conditions,
				options,
			},
		);
	}

	public findOne(
		conditions: FindOneOptions<Entity>,
		options?: BaseQueryOptions,
	): Promise<Entity> {
		return findOne(
			this as any,
			{
				connectionInstance: this.connectionInstance,
				tableName: this.tableName,
			},
			{
				conditions,
				options,
			},
		);
	}

	/**
	 * This function delete a record **BY IT'S PRIMARY KEY(S)**.
	 * - It can only delete **ONE** record at time.
	 * - It only accepts "boolean", "number" and "string" types as values.
	 *
	 * @param where The PRIMARY KEYS of the record
	 * @param options Options for this operation
	 * @returns The count of records deleted
	 */
	public delete(
		where: FindConditions<Entity>,
		options?: BaseQueryOptions,
	): Promise<number> {
		return del(
			this as any,
			{
				connectionInstance: this.connectionInstance,
				tableName: this.tableName,
			},
			{
				where,
				options,
			},
		);
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
