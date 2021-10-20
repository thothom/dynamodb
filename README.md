<div align="center">

<img src="https://github.com/techmmunity/symbiosis/raw/master/resources/logo.gif" width="300" height="300">

# Techmmunity - Symbiosis DynamoDB

<a href="https://github.com/techmmunity/eslint-config">
	<img src="https://img.shields.io/badge/style%20guide-Techmmunity-01d2ce?style=for-the-badge" alt="Style Guide: Techmmunity">
</a>
<a href="https://www.codefactor.io/repository/github/techmmunity/symbiosis-dynamodb">
	<img src="https://www.codefactor.io/repository/github/techmmunity/symbiosis-dynamodb/badge?style=for-the-badge" alt="CodeFactor">
</a>
<a href="https://coveralls.io/github/techmmunity/symbiosis-dynamodb?branch=master">
	<img src="https://img.shields.io/coveralls/github/techmmunity/symbiosis-dynamodb/master?style=for-the-badge" alt="Coveralls">
</a>
<a href="https://github.com/techmmunity/symbiosis-dynamodb/actions/workflows/coverage.yml">
	<img src="https://img.shields.io/github/workflow/status/techmmunity/symbiosis-dynamodb/tests?label=tests&logo=github&style=for-the-badge" alt="Tests">
</a>
<a href="https://www.npmjs.com/package/@techmmunity/symbiosis-dynamodb">
	<img src="https://img.shields.io/npm/v/@techmmunity/symbiosis-dynamodb.svg?color=CC3534&style=for-the-badge" alt="Npm">
</a>
<a href="https://www.npmjs.com/package/@techmmunity/symbiosis-dynamodb">
	<img src="https://img.shields.io/npm/dw/@techmmunity/symbiosis-dynamodb.svg?style=for-the-badge" alt="Downloads">
</a>

<br>
<br>

</div>

This is a DynamoDB plugin for [@techmmunity/symbiosis](https://github.com/techmmunity/symbiosis).

## Installation

With yarn

```
yarn add @techmmunity/symbiosis reflect-metadata @techmmunity/symbiosis-dynamodb
```

With npm

```
npm i --save @techmmunity/symbiosis reflect-metadata @techmmunity/symbiosis-dynamodb
```

## Usage

```ts
import { Connection,Repository } from "@techmmunity/symbiosis-dynamodb";
import { Entity } from "@techmmunity/symbiosis";

@Entity()
class FooEntity {
	// ...
}

type FooRepository = Repository<FooEntity>

const foo = async () => {
	const connection = new Connection({
		// Connection options
		entities: [...],
		databaseConfig: {
			// Dynamodb connection config
		}
	});

	await connection.connect();

	const repository = connection.getRepository<FooEntity>(Entity);

	repository.save(...)
	repository.find(...)
}

foo();
```

## Warning

DynamoDB has a very different way of modeling data compared to traditional SQL databases. We strongly recommend that you study this before using this database, so that you can take full advantage of its capabilities.

### Recommended Topics

- [DynamoDB Data Modeling](https://codeburst.io/dynamodb-data-modeling-7f11950b25bf)
- [An introduction to DynamoDB data modeling](https://blog.theodo.com/2021/04/introduction-to-dynamo-db-modeling/)
- [Querying child relationships](https://stackoverflow.com/questions/63755975/modelling-parent-child-subchild-relationships-in-dynamodb)
