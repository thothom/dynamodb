/**
 * ---------------------------------------------
 * // TODO Remove this after implement the methods!
 * ---------------------------------------------
 */
/* eslint-disable sonarjs/no-duplicate-string */

import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type {
	BaseQueryOptions,
	EntityManager,
	FindConditions,
	FindOneOptions,
	FindOptions,
	SaveData,
	SingleSaveData,
	ArraySaveData,
	Logger,
} from "@thothom/core";
import { BaseRepository, ThothError } from "@thothom/core";

import { del } from "./delete";
import { find } from "./find";
import { findOne } from "./find-one";
import { save } from "./save";
import { upsert } from "./upsert";

import { handleDatabaseError } from "../utils/handle-database-error";

import type { ExtraMetadata } from "../types/extra-metadata";
import type { CountOutput } from "../types/methods-outputs/count";
import type { DeleteOutput } from "../types/methods-outputs/delete";
import type { FindOutput } from "../types/methods-outputs/find";
import type { FindOneOutput } from "../types/methods-outputs/find-one";
import type { InsertOutput } from "../types/methods-outputs/insert";
import type { PerformativeCountOutput } from "../types/methods-outputs/performative-count";
import type { RecoverOutput } from "../types/methods-outputs/recover";
import type { SaveOutput } from "../types/methods-outputs/save";
import type { SoftDeleteOutput } from "../types/methods-outputs/soft-delete";
import type { UpdateOutput } from "../types/methods-outputs/update";
import type { UpsertOutput } from "../types/methods-outputs/upsert";

export class Repository<Entity> extends BaseRepository<Entity, ExtraMetadata> {
	public constructor(
		/**
		 * Used in the "context" parameter
		 */
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		private readonly connectionInstance: DynamoDBClient,
		entityManager: EntityManager<ExtraMetadata>,
		logger: Logger,
		entity: Entity,
	) {
		super(entityManager, logger, entity);
	}

	/**
	 * - This function **CREATE** a new record if a record **WITH THE SAME ID** doesn't
	 * exists, **BUT** also **REPLACE** a record if it has the same ID.
	 *
	 * - This function **DOES NOT** accept _SaveOperators_, if you want to use they,
	 * use the **upsert** function instead
	 *
	 * @param data The entity data that you want to save to the database
	 * @param options Options for this operation
	 * @returns The entity as it's saved on the database
	 */
	public save(
		data: SingleSaveData<Entity>,
		options?: BaseQueryOptions,
	): Promise<SaveOutput<Entity>>;
	public save(
		data: ArraySaveData<Entity>,
		options?: BaseQueryOptions,
	): Promise<SaveOutput<Array<Entity>>>;
	public save(
		data: SaveData<Entity>,
		options?: BaseQueryOptions,
	): Promise<SaveOutput<Array<Entity> | Entity>> {
		return save(this as any, {
			data,
			options,
		}).catch(err => {
			throw handleDatabaseError(this as any, err);
		});
	}

	/**
	 * ## NOT IMPLEMENTED!
	 */
	public insert(
		data: SingleSaveData<Entity>,
		options?: BaseQueryOptions,
	): Promise<InsertOutput<Entity>>;
	public insert(
		data: ArraySaveData<Entity>,
		options?: BaseQueryOptions,
	): Promise<InsertOutput<Array<Entity>>>;
	public insert(
		_data: SaveData<Entity>,
		_options?: BaseQueryOptions,
	): Promise<InsertOutput<Array<Entity> | Entity>> {
		// Delete this after the method is implemented
		throw new ThothError({
			code: "NOT_IMPLEMENTED",
			origin: "THOTHOM",
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
	public update(
		_conditions: FindConditions<Entity>,
		_data: SingleSaveData<Entity>,
		_options?: BaseQueryOptions,
	): Promise<UpdateOutput<Entity>> {
		// Delete this after the method is implemented
		throw new ThothError({
			code: "NOT_IMPLEMENTED",
			origin: "THOTHOM",
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
	public upsert(
		conditions: FindConditions<Entity>,
		data: SingleSaveData<Entity>,
		options?: BaseQueryOptions,
	): Promise<UpsertOutput<Entity>> {
		return upsert(this as any, {
			conditions,
			data,
			options,
		}).catch(err => {
			throw handleDatabaseError(this as any, err);
		});
	}

	public find(
		conditions: FindOptions<Entity>,
		options?: BaseQueryOptions,
	): Promise<FindOutput<Entity>> {
		return find(this as any, {
			conditions,
			options,
		}).catch(err => {
			throw handleDatabaseError(this as any, err);
		});
	}

	public findOne(
		conditions: FindOneOptions<Entity>,
		options?: BaseQueryOptions,
	): Promise<FindOneOutput<Entity>> {
		return findOne(this as any, {
			conditions,
			options,
		}).catch(err => {
			throw handleDatabaseError(this as any, err);
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
	): Promise<DeleteOutput> {
		return del(this as any, {
			where,
			options,
		}).catch(err => {
			throw handleDatabaseError(this as any, err);
		});
	}

	/**
	 * ## NOT IMPLEMENTED!
	 */
	public softDelete(
		_where: FindConditions<Entity>,
		_options?: BaseQueryOptions,
	): Promise<SoftDeleteOutput> {
		// Delete this after the method is implemented
		throw new ThothError({
			code: "NOT_IMPLEMENTED",
			origin: "THOTHOM",
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
	): Promise<RecoverOutput> {
		// Delete this after the method is implemented
		throw new ThothError({
			code: "NOT_IMPLEMENTED",
			origin: "THOTHOM",
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
	): Promise<CountOutput> {
		// Delete this after the method is implemented
		throw new ThothError({
			code: "NOT_IMPLEMENTED",
			origin: "THOTHOM",
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
	): Promise<PerformativeCountOutput> {
		// Delete this after the method is implemented
		throw new ThothError({
			code: "NOT_IMPLEMENTED",
			origin: "THOTHOM",
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
