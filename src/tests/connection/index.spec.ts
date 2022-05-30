/* eslint-disable sonarjs/no-duplicate-string */

import type { BaseConnectionOptions } from "@thothom/core";
import { Entity, PrimaryColumn, Column, Logger } from "@thothom/core";

import { TestConnection } from "../constants/test-connection";

describe("Connection", () => {
	it("should get connection default config", async () => {
		@Entity()
		class TestEntity {
			@PrimaryColumn()
			public id: string;

			@Column()
			public foo: number;
		}

		const options: BaseConnectionOptions = {
			entities: [TestEntity],
		};

		const connection = new TestConnection("@techmmunity/utils", options);
		await connection.load();

		expect(connection.name).toBe("Default");
		expect(connection.options).toStrictEqual({
			plugin: "@techmmunity/utils",
		});
		expect(connection.entities).toStrictEqual(options.entities);
		expect(connection.options).not.toHaveProperty("entities");
		expect(connection.options).not.toHaveProperty("entitiesDir");
		expect(connection.logger instanceof Logger).toBeTruthy();
		expect(connection.entityManager.getAllEntitiesMetadata()).toStrictEqual({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			TestEntity: {
				columns: [
					{ databaseName: "id", name: "id", primary: true, type: String },
					{ databaseName: "foo", name: "foo", type: Number },
				],
				databaseName: "TestEntity",
				name: "TestEntity",
			},
		});
	});
});
