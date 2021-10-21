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
	BaseRepository,
	SymbiosisError,
	SymbiosisErrorCodeEnum,
} from "@techmmunity/symbiosis";
import type { ColumnExtraMetadata } from "../types/column-extra-metadata";
import type { EntityExtraMetadata } from "../types/entity-extra-metadata";
import type { IndexExtraMetadata } from "../types/index-extra-metadata";
import { handleDatabaseError } from "../utils/handle-database-error";
import { del } from "./delete";
import { find } from "./find";
import { findOne } from "./find-one";
import { save } from "./save";
import { upsert } from "./upsert";

export class Repository<Entity> extends BaseRepository<
	Entity,
	EntityExtraMetadata,
	ColumnExtraMetadata,
	IndexExtraMetadata
> {
	private readonly tableName: string;

	public constructor(
		private readonly connectionInstance: DynamoDBClient,
		entityManager: EntityManager<
			EntityExtraMetadata,
			ColumnExtraMetadata,
			IndexExtraMetadata
		>,
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
	public save<Result = Array<Entity> | Entity>(
		data: Array<ClassType<Entity>> | ClassType<Entity>,
		options?: BaseQueryOptions,
	): Promise<Result> {
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
		).catch(err => {
			throw handleDatabaseError(err);
		});
	}

	/**
	 * ## NOT IMPLEMENTED!
	 */
	public insert<Result = Array<Entity> | Entity>(
		_data: Array<ClassType<Entity>> | ClassType<Entity>,
		_options?: BaseQueryOptions,
	): Promise<Result> {
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

	/**
	 * ## NOT IMPLEMENTED!
	 */
	public update<Result = Array<Entity> | Entity>(
		_conditions: FindConditions<Entity>,
		_data: ClassType<Entity>,
		_options?: BaseQueryOptions,
	): Promise<Result> {
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

	/**
	 * This function **UPSERT** a record based on it's **PRIMARY KEYS**.
	 *
	 * @param conditions Primary keys of the object to be updated
	 * @param data Columns to be updated
	 * @param options Options for this operation
	 * @returns The updated record
	 */
	public upsert<Result = Array<Entity> | Entity>(
		conditions: FindConditions<Entity>,
		data: ClassType<Entity>,
		options?: BaseQueryOptions,
	): Promise<Result> {
		return upsert(
			this as any,
			{
				connectionInstance: this.connectionInstance,
				tableName: this.tableName,
			},
			{
				conditions,
				data,
				options,
			},
		).catch(err => {
			throw handleDatabaseError(err);
		});
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
		).catch(err => {
			throw handleDatabaseError(err);
		});
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
		).catch(err => {
			throw handleDatabaseError(err);
		});
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
		).catch(err => {
			throw handleDatabaseError(err);
		});
	}

	/**
	 * ## NOT IMPLEMENTED!
	 */
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

	/**
	 * ## NOT IMPLEMENTED!
	 */
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

	/**
	 * ## NOT IMPLEMENTED!
	 */
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

	/**
	 * ## NOT IMPLEMENTED!
	 */
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
