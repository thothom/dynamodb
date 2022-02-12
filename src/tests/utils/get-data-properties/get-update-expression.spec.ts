/* eslint-disable sonarjs/no-duplicate-string */

import {
	Append,
	Column,
	Entity,
	IfNotExists,
	Min,
	Minus,
	Plus,
	Pop,
	PrimaryGeneratedColumn,
	Remove,
	SubEntity,
	SymbiosisError,
} from "@techmmunity/symbiosis";

import { TestConnection } from "../../constants/test-connection";

import { getUpdateExpression } from "../../../lib/utils/get-data-properties/get-update-expression";
import { mapData } from "../../../lib/utils/get-data-properties/helpers/map-data";
import { formatWhere } from "../../../lib/utils/get-where-properties/helpers/get-array-where";

describe("getUpdateExpression", () => {
	// eslint-disable-next-line sonarjs/cognitive-complexity
	describe("With simple entity", () => {
		it("should work with simple values", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: string;

				@Column()
				public barFoo: string;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: "fooBar",
				barFoo: "barFoo",
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar, #UPDATEfoobar = :UPDATEfoobar, #UPDATEbarfoo = :UPDATEbarfoo",
			);
		});

		it("should work with Append operator", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: string;

				@Column(String)
				public barFoo: Array<string>;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: "fooBar",
				barFoo: Append("append"),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar, #UPDATEfoobar = :UPDATEfoobar, #UPDATEbarfoo = list_append(if_not_exists(#UPDATEbarfoo, :emptyList), :UPDATEbarfoo)",
			);
		});

		it("should work with Plus operator", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: number;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: Plus(1),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar ADD #UPDATEfoobar :UPDATEfoobar",
			);
		});

		it("should work with Minus operator", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: number;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: Minus(1),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar ADD #UPDATEfoobar :UPDATEfoobar",
			);
		});

		it("should work with Pop operator (single item)", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: number;

				@Column(String)
				public barFoo: Array<string>;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: 1,
				barFoo: Pop(1),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar, #UPDATEfoobar = :UPDATEfoobar REMOVE #UPDATEbarfoo[1]",
			);
		});

		it("should work with Pop operator (multiple items)", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: number;

				@Column(String)
				public barFoo: Array<string>;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: 1,
				barFoo: Pop(1, 2, 3),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar, #UPDATEfoobar = :UPDATEfoobar REMOVE #UPDATEbarfoo[1], #UPDATEbarfoo[2], #UPDATEbarfoo[3]",
			);
		});

		it("should work with IfNotExists operator", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: number;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: IfNotExists(1),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar, #UPDATEfoobar = if_not_exists(#UPDATEfoobar, :UPDATEfoobar)",
			);
		});

		it("should work with Remove operator", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: number;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: Remove(),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar REMOVE #UPDATEfoobar",
			);
		});

		it("should work with auto-generated-columns", async () => {
			@Entity()
			class TestEntity {
				@PrimaryGeneratedColumn()
				public foo: string;

				@Column()
				public bar: number;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: 1,
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo = if_not_exists(#UPDATEfoo, :UPDATEfoo), #UPDATEbar = :UPDATEbar",
			);
		});
	});

	describe("With nested entity", () => {
		it("should return mapped keys and values", async () => {
			@SubEntity()
			class SubTest1Entity {
				@Column()
				public bar: string;
			}

			@SubEntity()
			class SubTest2Entity {
				@Column()
				public barFoo: string;
			}

			@Entity()
			class TestEntity {
				@Column(SubTest1Entity)
				public foo: SubTest1Entity;

				@Column(SubTest2Entity)
				public fooBar: SubTest2Entity;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: {
					bar: "bar",
				},
				fooBar: {
					barFoo: "barFoo",
				},
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toBe(
				"SET #UPDATEfoo.#UPDATEbar = :UPDATEfooBar, #UPDATEfoobar.#UPDATEbarfoo = :UPDATEfoobarBarfoo",
			);
		});
	});

	describe("General errors", () => {
		it("should throw error with Min operator", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: number;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: Min(1),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result instanceof SymbiosisError).toBeTruthy();
			expect(result.code).toBe("NOT_IMPLEMENTED");
			expect(result.origin).toBe("SYMBIOSIS");
			expect(result.message).toBe("Invalid SaveOperator");
			expect(result.details).toStrictEqual([
				'Dynamodb doesn\'t support SaveOperator "min"',
			]);
		});

		it("should throw error with Pop operator not invoked with numbers", async () => {
			@Entity()
			class TestEntity {
				@Column()
				public foo: string;

				@Column()
				public bar: string;

				@Column()
				public fooBar: number;

				@Column(String)
				public barFoo: Array<string>;
			}

			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			const repository = connection.getRepository(TestEntity);

			const formattedData = formatWhere({
				foo: "foo",
				bar: "bar",
				fooBar: 1,
				barFoo: Pop("1"),
			});

			const { keysMap, valuesMap } = mapData(formattedData);

			let result: any;

			try {
				result = getUpdateExpression({
					formattedData,
					keysMap,
					valuesMap,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result instanceof SymbiosisError).toBeTruthy();
			expect(result.code).toBe("INVALID_PARAM");
			expect(result.origin).toBe("SYMBIOSIS");
			expect(result.message).toBe("Invalid param");
			expect(result.details).toStrictEqual([
				"Dynamodb only accept remove items from lists by it's indexes",
				"Values received:",
				["1"],
			]);
		});
	});
});
