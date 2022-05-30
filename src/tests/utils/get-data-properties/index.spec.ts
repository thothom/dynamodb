/* eslint-disable sonarjs/no-duplicate-string */

import { Column, Entity } from "@thothom/core";

import { TestConnection } from "../../constants/test-connection";

import { getDataProperties } from "../../../lib/utils/get-data-properties";

describe("getDataProperties", () => {
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

			let result: any;

			try {
				result = getDataProperties({
					data: {
						foo: "foo",
						bar: "bar",
						fooBar: "fooBar",
						barFoo: "barFoo",
					},
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				ExpressionAttributeNames: {
					"#UPDATEbar": "bar",
					"#UPDATEbarfoo": "barFoo",
					"#UPDATEfoo": "foo",
					"#UPDATEfoobar": "fooBar",
				},
				// eslint-disable-next-line @typescript-eslint/naming-convention
				ExpressionAttributeValues: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					":UPDATEbar": { S: "bar" },
					// eslint-disable-next-line @typescript-eslint/naming-convention
					":UPDATEbarfoo": { S: "barFoo" },
					// eslint-disable-next-line @typescript-eslint/naming-convention
					":UPDATEfoo": { S: "foo" },
					// eslint-disable-next-line @typescript-eslint/naming-convention
					":UPDATEfoobar": { S: "fooBar" },
				},
				// eslint-disable-next-line @typescript-eslint/naming-convention
				UpdateExpression:
					"SET #UPDATEfoo = :UPDATEfoo, #UPDATEbar = :UPDATEbar, #UPDATEfoobar = :UPDATEfoobar, #UPDATEbarfoo = :UPDATEbarfoo",
			});
		});

		it("should return an empty object without data", async () => {
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

			let result: any;

			try {
				result = getDataProperties({
					data: undefined as any,
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({});
		});
	});
});
