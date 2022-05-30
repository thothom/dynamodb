import { Column, Entity, SubEntity, ThothError } from "@thothom/core";

import { TestConnection } from "../../../constants/test-connection";

import { getColumnMetadata } from "../../../../lib/utils/get-data-properties/helpers/get-column-metadata";

describe("getColumnMetadata", () => {
	describe("With simple entity", () => {
		@Entity()
		class TestEntity {
			@Column()
			public foo: string;
		}

		let repository: any;

		beforeAll(async () => {
			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			repository = connection.getRepository(TestEntity);
		});

		it("should return column metadata", () => {
			let result: any;

			try {
				result = getColumnMetadata({
					key: "foo",
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				databaseName: "foo",
				name: "foo",
				type: String,
			});
		});
	});

	describe("With nested entity", () => {
		@SubEntity()
		class SubTestEntity {
			@Column()
			public subFoo: string;
		}

		@Entity()
		class TestEntity {
			@Column(SubTestEntity)
			public foo: SubTestEntity;
		}

		let repository: any;

		// eslint-disable-next-line sonarjs/no-identical-functions
		beforeAll(async () => {
			const connection = new TestConnection("@techmmunity/utils", {
				entities: [TestEntity],
			});
			await connection.load();

			repository = connection.getRepository(TestEntity);
		});

		it("should return column metadata", () => {
			let result: any;

			try {
				result = getColumnMetadata({
					key: "foo.subFoo",
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result).toStrictEqual({
				databaseName: "subFoo",
				name: "subFoo",
				type: String,
			});
		});

		it("should throw an error with incomplete path", () => {
			let result: any;

			try {
				result = getColumnMetadata({
					key: "foo",
					context: repository,
				});
			} catch (err: any) {
				result = err;
			}

			expect(result instanceof ThothError).toBeTruthy();
			expect(result.details).toStrictEqual(['Invalid column: "foo"']);
		});
	});
});
