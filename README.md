# Name of this microservice

Description of this microservice

# Getting Started

## Project Setup

Open terminal and navigate to a folder to install this project:

```bash
git clone https://github.com/Greenstand/treetracker-repository-name.git

```
Install all necessary dependencies:

```bash
npm install
```
### Database Setup

To run a local db, please install postgres.
Here are some resources to get started on local database set up and migration:
* https://postgresapp.com
* pgAdmin and DBeaver are great GUI options to use for navigating your local db
* https://www.postgresql.org/docs/9.1/app-pgdump.html

We need a user to connect to the database. We can either use the default postgres user, or create a new user. We then need to create a database associated with that user.

To create a new user (role):
```SQL
CREATE ROLE "treetracker" WITH LOGIN CREATEDB CREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1;
```
To set the password:
```SQL
ALTER USER treetracker WITH PASSWORD '<password>';
```
To create a new database:
```SQL
CREATE DATABASE treetracker_db WITH OWNER = treetracker ENCODING = 'UTF8';

CREATE SCHEMA treetracker;
```
Create a `.env` file under the project folder and assign the value for
```
DATABASE_URL="postgresql://username:pwd@db_host:port/treetracker_db?false"
```

To create the necessary tables for your application, run db-migrate below.

```bash
cd datbaase/
db-migrate up --env dev --sql-file --migrations-dir=database/migrations --config=database/database.json
```

If you have not installed db-migrate globally, you can run:

```bash
../node_modules/db-migrate/bin/db-migrate --env dev up --sql-file --migrations-dir=database/migrations --config=database/database.json
```

See here to learn more about db-migrate: https://db-migrate.readthedocs.io/en/latest/

# Architecture of this project

This project use multiple layer structure to build the whole system. Similar with MVC structure:

![layers](/layers.png "layers")


* **Protocol layer**

Wallet API offers RESTFul API interace based on HTTP protocol. We use Express to handle all HTTP requests.

The Express-routers work like the controller role in MVC, they receive the requests and parameters from client, and translate it and dispatch tasks to appropriate business objects. Then receive the result from them, translate to the 'view', the JSON response, to client.

* **Service layer**

Both service layer and model layer are where all the business logic is located. Comparing to the Model , `service` object don't have state (stateless).

Please put business logic code into service object when it is hard to put them into the `Model` object.

Because we didn't use Factory or dependency injection to create object, so service layer also can be used as Factory to create `model` object.

* **Model layer**

The business model, major business logic is here. They are real object, in the perspective of object oriented programming: they have states, they have the method to do stuff.

There are more discussion about this, check below selection.

* **Repository layer**

Repository is responsible for communicate with the real database, this isolation brings flexibility for us, for example, we can consider replace the implementation of the storage infrastructure in the future.

All the SQL statements should be here.


TODO: Add link to WIKI page detailing our architecture rules


# How to test

## Unit test

To run the unit tests:

```bash
npm run test-unit
```

## Integration test

All the integration tests are located under folder `__tests__`

To run the integration test:

Run tests:

```bash
npm run test-integration
```

# How to seed to add data for user testing and development
In order to develop the tool we need some data to work with.  These seeding files are set up to NOT remove data from the tables and only add more data.

- insert growers first using existing stakeholder ids for organization_id, then export the growers table to get their valid ids
- insert captures using the new grower_ids from the exported data, then export the captures data to get their valid ids
- insert trees using the new captures ids from the exported data

To avoid duplicating records, ignore seed files by moving them into the database/seeds/ignore_seed folder otherwise all seed files within database/seeds will run in ascending order

Data for the seeding functions are in the database/seeds/data folder and are named by table and numbered in the order that they were inserted

## Database seeding test
In order to efficiently run our integration tests, we rely on automated database seeding/clearing functions to mock database entries. To test these functions, run:

```bash
npm run test-seedDB
```

## Suggestion about how to run tests when developing

There is a command in the `package.json`:

```bash
npm run test-watch
```

By running test with this command, the tests would re-run if any code change happened. And with the `bail` argument, tests would stop when it met the first error, it might bring some convenience when developing.

NOTE: There is another command: `test-watch-debug`, it is the same with `test-watch`, except it set log's level to `debug`.

## Postman

Can also use Postman to test the API in a more real environment. Import the API spec from [here](https://github.com/Greenstand/treetracker-wallet-api/blob/master/docs/api/spec/treetracker-token-api.yaml).

To run a local server with some seed data, run command:

```bash
npm run server-test
```

This command would run a API server locally, and seed some basic data into DB (the same with the data we used in the integration test).



# Contributing

Create your local git branch and rebase it from the shared master branch. Please make sure to rebuild your local database schemas using the migrations (as illustrated in the Database Setup section above) to capture any latest updates/changes.

When you are ready to submit a pull request from your local branch, please rebase your branch off of the shared master branch again to integrate any new updates in the codebase before submitting. Any developers joining the project should feel free to review any outstanding pull requests and assign themselves to any open tickets on the Issues list.
