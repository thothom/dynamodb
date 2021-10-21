import { Column, Entity, SymbiosisError } from "@techmmunity/symbiosis";
import { getColumnMetadata } from "../../../../lib/utils/get-data-properties/helpers/get-column-metadata";
import { TestConnection } from "../../../constants/test-connection";

describe("getColumnMetadata", () => {
	describe("With simple entity", () => {
		@Entity()
		class TestEntity {
			@Column()
			public foo: string;
		}

		const connection = new TestConnection({
			entities: [TestEntity],
		});

		const repository = connection.getRepository(TestEntity);

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
		@Entity({
			isSubEntity: true,
		})
		class SubTestEntity {
			@Column()
			public subFoo: string;
		}

		@Entity()
		class TestEntity {
			@Column(SubTestEntity)
			public foo: SubTestEntity;
		}

		const connection = new TestConnection({
			entities: [TestEntity],
		});

		const repository = connection.getRepository(TestEntity);

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

			expect(result instanceof SymbiosisError).toBeTruthy();
			expect(result.details).toStrictEqual(['Invalid column: "foo"']);
		});
	});
});
