# Name of this microservice
   
Description of this microservice

# Getting Started
  
## Project Setup

Open terminal and navigate to a folder to install this project:

```
git clone https://github.com/Greenstand/treetracker-repository-name.git

```
Install all necessary dependencies: 

```
npm install

### Database Setup

// TODO - add generic database setup instructions

Here are some resources to get started on local database set up and migration:
* https://postgresapp.com
* pgAdmin and DBeaver are great GUI options to use for navigating your local db 
* https://www.postgresql.org/docs/9.1/app-pgdump.html


TODO: detailed description of database migration

```
db-migrate --env dev up
```

If you have not installed db-migrate globally, you can run:

```
../node_modules/db-migrate/bin/db-migrate --env dev up
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

```
npm run test-unit
```

## Integration test

All the integration tests are located under folder `__tests__`

To run the integration test:

Run tests:

```
npm run test-integration
```

## Database seeding test
In order to efficiently run our integration tests, we rely on automated database seeding/clearing functions to mock database entries. To test these functions, run:

```
npm run test-seedDB
```

## Suggestion about how to run tests when developing

There is a command in the `package.json`:

```
npm run test-watch
```

By running test with this command, the tests would re-run if any code change happened. And with the `bail` argument, tests would stop when it met the first error, it might bring some convenience when developing.

NOTE: There is another command: `test-watch-debug`, it is the same with `test-watch`, except it set log's level to `debug`.

## Postman

Can also use Postman to test the API in a more real environment. Import the API spec from [here](https://github.com/Greenstand/treetracker-wallet-api/blob/master/docs/api/spec/treetracker-token-api.yaml).

To run a local server with some seed data, run command:

```
npm run server-test
```

This command would run a API server locally, and seed some basic data into DB (the same with the data we used in the integration test).



# Contributing

Create your local git branch and rebase it from the shared master branch. Please make sure to rebuild your local database schemas using the migrations (as illustrated in the Database Setup section above) to capture any latest updates/changes.

When you are ready to submit a pull request from your local branch, please rebase your branch off of the shared master branch again to integrate any new updates in the codebase before submitting. Any developers joining the project should feel free to review any outstanding pull requests and assign themselves to any open tickets on the Issues list. 
